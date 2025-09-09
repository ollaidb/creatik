-- Ajouter un champ order à la table user_content_playlists pour sauvegarder l'ordre
ALTER TABLE user_content_playlists 
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Mettre à jour les playlists existantes avec un ordre basé sur created_at
UPDATE user_content_playlists 
SET "order" = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as row_number
  FROM user_content_playlists
) subquery
WHERE user_content_playlists.id = subquery.id;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_content_playlists_user_order 
ON user_content_playlists(user_id, "order");

-- Rendre le champ order NOT NULL après avoir mis à jour les données
ALTER TABLE user_content_playlists 
ALTER COLUMN "order" SET NOT NULL;
