-- Migration pour ajouter le support du stockage direct des médias en base de données
-- Exécutez ce script dans Supabase SQL Editor

-- Ajouter la colonne media_data pour stocker les fichiers en base64
ALTER TABLE content_exemples_media 
ADD COLUMN IF NOT EXISTS media_data TEXT;

-- Ajouter la colonne thumbnail_data pour stocker les miniatures en base64
ALTER TABLE content_exemples_media 
ADD COLUMN IF NOT EXISTS thumbnail_data TEXT;

-- Ajouter la colonne media_mime_type pour stocker le type MIME du fichier
ALTER TABLE content_exemples_media 
ADD COLUMN IF NOT EXISTS media_mime_type VARCHAR(100);

-- Modifier media_url pour qu'il soit optionnel (peut être NULL si on utilise media_data)
ALTER TABLE content_exemples_media 
ALTER COLUMN media_url DROP NOT NULL;

-- Ajouter une contrainte pour s'assurer qu'on a soit media_url soit media_data
-- Note: Cette contrainte peut échouer si des enregistrements existent déjà avec media_url NULL
-- Dans ce cas, vous pouvez d'abord mettre à jour les enregistrements existants ou supprimer cette contrainte
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_media_source'
  ) THEN
    ALTER TABLE content_exemples_media 
    ADD CONSTRAINT check_media_source CHECK (
      (media_url IS NOT NULL) OR (media_data IS NOT NULL)
    );
  END IF;
END $$;

-- Commentaires
COMMENT ON COLUMN content_exemples_media.media_data IS 'Données du média encodées en base64 (alternative à media_url)';
COMMENT ON COLUMN content_exemples_media.thumbnail_data IS 'Données de la miniature encodées en base64 (alternative à thumbnail_url)';
COMMENT ON COLUMN content_exemples_media.media_mime_type IS 'Type MIME du fichier (ex: image/jpeg, video/mp4)';

