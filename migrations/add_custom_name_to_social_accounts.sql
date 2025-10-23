-- Migration pour ajouter le support des noms personnalisés et instances multiples
-- Date: 2024-12-19

-- 1. Ajouter la colonne custom_name à user_social_accounts
ALTER TABLE user_social_accounts 
ADD COLUMN IF NOT EXISTS custom_name VARCHAR(100);

-- 2. Mettre à jour les contraintes pour permettre plusieurs comptes du même réseau
-- Supprimer l'ancienne contrainte unique sur social_network_id
ALTER TABLE user_social_accounts 
DROP CONSTRAINT IF EXISTS user_social_accounts_social_network_id_key;

-- 3. Créer une nouvelle contrainte unique sur (user_id, social_network_id, custom_name)
-- Cela permet d'avoir plusieurs comptes du même réseau avec des noms différents
ALTER TABLE user_social_accounts 
ADD CONSTRAINT user_social_accounts_user_network_name_unique 
UNIQUE (user_id, social_network_id, custom_name);

-- 4. Ajouter une contrainte pour limiter à 5 instances par réseau par utilisateur
-- On va créer une fonction et un trigger pour cela
CREATE OR REPLACE FUNCTION check_social_account_limit()
RETURNS TRIGGER AS $$
DECLARE
    account_count INTEGER;
BEGIN
    -- Compter le nombre de comptes du même réseau pour cet utilisateur
    SELECT COUNT(*) INTO account_count
    FROM user_social_accounts
    WHERE user_id = NEW.user_id 
    AND social_network_id = NEW.social_network_id;
    
    -- Vérifier si on dépasse la limite de 5
    IF account_count >= 5 THEN
        RAISE EXCEPTION 'Limite de 5 comptes par réseau atteinte pour cet utilisateur';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS check_social_account_limit_trigger ON user_social_accounts;
CREATE TRIGGER check_social_account_limit_trigger
    BEFORE INSERT ON user_social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION check_social_account_limit();

-- 5. Mettre à jour les comptes existants avec des noms par défaut
UPDATE user_social_accounts 
SET custom_name = CONCAT(
    (SELECT name FROM social_networks WHERE id = social_network_id),
    ' - Compte principal'
)
WHERE custom_name IS NULL;

-- 6. Ajouter une contrainte NOT NULL sur custom_name
ALTER TABLE user_social_accounts 
ALTER COLUMN custom_name SET NOT NULL;

-- 7. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_social_accounts_user_network 
ON user_social_accounts(user_id, social_network_id);

-- 8. Mettre à jour la fonction RLS si nécessaire
-- (Les politiques existantes devraient continuer à fonctionner)
