-- Script de correction complète de la base de données
-- Date: 2024-12-19

-- 1. Supprimer les contraintes problématiques
ALTER TABLE user_social_accounts 
DROP CONSTRAINT IF EXISTS user_social_accounts_platform_key;

ALTER TABLE user_social_accounts 
DROP CONSTRAINT IF EXISTS user_social_accounts_user_platform_name_unique;

-- 2. Ajouter la colonne custom_name si elle n'existe pas
ALTER TABLE user_social_accounts 
ADD COLUMN IF NOT EXISTS custom_name VARCHAR(100);

-- 3. Mettre à jour les comptes existants avec des noms par défaut
UPDATE user_social_accounts 
SET custom_name = CONCAT(platform, ' - Compte principal')
WHERE custom_name IS NULL OR custom_name = '';

-- 4. Ajouter la contrainte NOT NULL sur custom_name
ALTER TABLE user_social_accounts 
ALTER COLUMN custom_name SET NOT NULL;

-- 5. Créer une nouvelle contrainte unique sur (user_id, platform, custom_name)
ALTER TABLE user_social_accounts 
ADD CONSTRAINT user_social_accounts_user_platform_name_unique 
UNIQUE (user_id, platform, custom_name);

-- 6. Supprimer et recréer la fonction de vérification de limite
DROP FUNCTION IF EXISTS check_social_account_limit();

CREATE OR REPLACE FUNCTION check_social_account_limit()
RETURNS TRIGGER AS $$
DECLARE
    account_count INTEGER;
BEGIN
    -- Compter le nombre de comptes du même réseau pour cet utilisateur
    SELECT COUNT(*) INTO account_count
    FROM user_social_accounts
    WHERE user_id = NEW.user_id 
    AND platform = NEW.platform;
    
    -- Vérifier si on dépasse la limite de 5
    IF account_count >= 5 THEN
        RAISE EXCEPTION 'Limite de 5 comptes par réseau atteinte pour cet utilisateur';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Supprimer et recréer le trigger
DROP TRIGGER IF EXISTS check_social_account_limit_trigger ON user_social_accounts;
CREATE TRIGGER check_social_account_limit_trigger
    BEFORE INSERT ON user_social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION check_social_account_limit();

-- 8. Créer les index nécessaires
CREATE INDEX IF NOT EXISTS idx_user_social_accounts_user_platform 
ON user_social_accounts(user_id, platform);

CREATE INDEX IF NOT EXISTS idx_user_social_accounts_custom_name 
ON user_social_accounts(custom_name);

-- 9. Vérifier que les tables existent et ont la bonne structure
DO $$
BEGIN
    -- Vérifier user_social_accounts
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_social_accounts'
    ) THEN
        RAISE EXCEPTION 'Table user_social_accounts n''existe pas';
    END IF;
    
    -- Vérifier user_content_playlists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_content_playlists'
    ) THEN
        RAISE EXCEPTION 'Table user_content_playlists n''existe pas';
    END IF;
    
    RAISE NOTICE 'Toutes les tables existent';
END $$;

-- 10. Afficher la structure finale
SELECT 'Structure de user_social_accounts:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_social_accounts' 
ORDER BY ordinal_position;
