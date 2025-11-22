-- Ajouter un champ order à la table user_social_accounts pour sauvegarder l'ordre
ALTER TABLE user_social_accounts 
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Mettre à jour les comptes existants avec un ordre basé sur created_at
UPDATE user_social_accounts 
SET "order" = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as row_number
  FROM user_social_accounts
) subquery
WHERE user_social_accounts.id = subquery.id;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_social_accounts_user_order 
ON user_social_accounts(user_id, "order");

-- Rendre le champ order NOT NULL après avoir mis à jour les données
ALTER TABLE user_social_accounts 
ALTER COLUMN "order" SET NOT NULL;
