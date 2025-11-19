-- Table pour stocker les exemples avec médias (images et vidéos)
-- Support pour sous-catégories niveau 1 et niveau 2
-- Max 5 images et 5 vidéos par sous-catégorie

CREATE TABLE IF NOT EXISTS content_exemples_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  subcategory_level2_id UUID REFERENCES subcategories_level2(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  creator_name TEXT,
  creator_url TEXT,
  platform VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Contrainte pour s'assurer qu'on a soit subcategory_id soit subcategory_level2_id
  CONSTRAINT check_subcategory CHECK (
    (subcategory_id IS NOT NULL AND subcategory_level2_id IS NULL) OR
    (subcategory_id IS NULL AND subcategory_level2_id IS NOT NULL)
  )
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_exemples_media_subcategory ON content_exemples_media(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_exemples_media_subcategory_level2 ON content_exemples_media(subcategory_level2_id);
CREATE INDEX IF NOT EXISTS idx_exemples_media_type ON content_exemples_media(media_type);
CREATE INDEX IF NOT EXISTS idx_exemples_media_platform ON content_exemples_media(platform);
CREATE INDEX IF NOT EXISTS idx_exemples_media_order ON content_exemples_media(order_index);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_exemples_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_exemples_media_updated_at ON content_exemples_media;
CREATE TRIGGER trigger_update_exemples_media_updated_at
  BEFORE UPDATE ON content_exemples_media
  FOR EACH ROW
  EXECUTE FUNCTION update_exemples_media_updated_at();

-- Fonction pour limiter le nombre d'images et vidéos par sous-catégorie
CREATE OR REPLACE FUNCTION check_exemples_media_limit()
RETURNS TRIGGER AS $$
DECLARE
  image_count INTEGER;
  video_count INTEGER;
  target_subcategory_id UUID;
BEGIN
  -- Déterminer quelle sous-catégorie utiliser
  target_subcategory_id := COALESCE(NEW.subcategory_id, NEW.subcategory_level2_id);
  
  -- Compter les images pour cette sous-catégorie
  SELECT COUNT(*) INTO image_count
  FROM content_exemples_media
  WHERE media_type = 'image'
    AND (
      (subcategory_id = target_subcategory_id AND NEW.subcategory_id IS NOT NULL) OR
      (subcategory_level2_id = target_subcategory_id AND NEW.subcategory_level2_id IS NOT NULL)
    )
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
  
  -- Compter les vidéos pour cette sous-catégorie
  SELECT COUNT(*) INTO video_count
  FROM content_exemples_media
  WHERE media_type = 'video'
    AND (
      (subcategory_id = target_subcategory_id AND NEW.subcategory_id IS NOT NULL) OR
      (subcategory_level2_id = target_subcategory_id AND NEW.subcategory_level2_id IS NOT NULL)
    )
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
  
  -- Vérifier les limites
  IF NEW.media_type = 'image' AND image_count >= 5 THEN
    RAISE EXCEPTION 'Limite de 5 images atteinte pour cette sous-catégorie';
  END IF;
  
  IF NEW.media_type = 'video' AND video_count >= 5 THEN
    RAISE EXCEPTION 'Limite de 5 vidéos atteinte pour cette sous-catégorie';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_exemples_media_limit ON content_exemples_media;
CREATE TRIGGER trigger_check_exemples_media_limit
  BEFORE INSERT OR UPDATE ON content_exemples_media
  FOR EACH ROW
  EXECUTE FUNCTION check_exemples_media_limit();

-- Activer RLS (Row Level Security)
ALTER TABLE content_exemples_media ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "Anyone can view exemples media" ON content_exemples_media;
CREATE POLICY "Anyone can view exemples media" 
  ON content_exemples_media 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert exemples media" ON content_exemples_media;
CREATE POLICY "Authenticated users can insert exemples media" 
  ON content_exemples_media 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update exemples media" ON content_exemples_media;
CREATE POLICY "Authenticated users can update exemples media" 
  ON content_exemples_media 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete exemples media" ON content_exemples_media;
CREATE POLICY "Authenticated users can delete exemples media" 
  ON content_exemples_media 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Commentaires
COMMENT ON TABLE content_exemples_media IS 'Table pour stocker les exemples de contenu avec médias (images et vidéos) pour chaque sous-catégorie';
COMMENT ON COLUMN content_exemples_media.media_type IS 'Type de média: image ou video';
COMMENT ON COLUMN content_exemples_media.order_index IS 'Ordre d''affichage des exemples';
COMMENT ON COLUMN content_exemples_media.subcategory_id IS 'ID de la sous-catégorie niveau 1 (si applicable)';
COMMENT ON COLUMN content_exemples_media.subcategory_level2_id IS 'ID de la sous-catégorie niveau 2 (si applicable)';

