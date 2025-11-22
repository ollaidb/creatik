-- Migration pour permettre playlist_id NULL dans user_program_settings
-- Cela permet d'avoir des paramètres de programmation pour "Tout" (sans playlist spécifique)

-- Modifier la colonne playlist_id pour permettre NULL
ALTER TABLE user_program_settings 
ALTER COLUMN playlist_id DROP NOT NULL;

-- Ajouter un commentaire pour clarifier l'usage
COMMENT ON COLUMN user_program_settings.playlist_id IS 'ID de la playlist (NULL = toutes les publications du réseau)';
