-- Créer un bucket pour stocker les exemples média (images et vidéos)
-- Exécutez ce script dans Supabase SQL Editor

-- Créer le bucket si il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exemples-media',
  'exemples-media',
  true,
  104857600, -- 100 MB max par fichier
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre à tous de voir les exemples média
DROP POLICY IF EXISTS "Exemples media are publicly accessible" ON storage.objects;
CREATE POLICY "Exemples media are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exemples-media');

-- Politique pour permettre aux utilisateurs connectés d'uploader des exemples
DROP POLICY IF EXISTS "Users can upload exemples media" ON storage.objects;
CREATE POLICY "Users can upload exemples media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exemples-media' AND auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de modifier leurs exemples
DROP POLICY IF EXISTS "Users can update their exemples media" ON storage.objects;
CREATE POLICY "Users can update their exemples media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'exemples-media' AND auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de supprimer leurs exemples
DROP POLICY IF EXISTS "Users can delete their exemples media" ON storage.objects;
CREATE POLICY "Users can delete their exemples media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'exemples-media' AND auth.role() = 'authenticated');

