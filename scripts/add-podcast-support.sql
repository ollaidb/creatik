-- Script pour ajouter le support des podcasts
-- Créer la table content_podcasts et configurer tout le nécessaire

-- 1. Table content_podcasts
CREATE TABLE IF NOT EXISTS content_podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'podcast',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_content_podcasts_category ON content_podcasts(category_id);
CREATE INDEX IF NOT EXISTS idx_content_podcasts_subcategory ON content_podcasts(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_podcasts_platform ON content_podcasts(platform);
CREATE INDEX IF NOT EXISTS idx_content_podcasts_author ON content_podcasts(author_id);

-- 3. Trigger pour updated_at
CREATE TRIGGER trigger_update_content_podcasts_updated_at
    BEFORE UPDATE ON content_podcasts
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- 4. RLS Policies
ALTER TABLE content_podcasts ENABLE ROW LEVEL SECURITY;

-- Politiques pour content_podcasts
DROP POLICY IF EXISTS "Users can view podcasts" ON content_podcasts;
DROP POLICY IF EXISTS "Users can insert podcasts" ON content_podcasts;
DROP POLICY IF EXISTS "Users can update their own podcasts" ON content_podcasts;
DROP POLICY IF EXISTS "Users can delete their own podcasts" ON content_podcasts;

CREATE POLICY "Users can view podcasts" ON content_podcasts FOR SELECT USING (true);
CREATE POLICY "Users can insert podcasts" ON content_podcasts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own podcasts" ON content_podcasts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own podcasts" ON content_podcasts FOR DELETE USING (auth.uid() = author_id);

-- 5. Insérer quelques données de test
INSERT INTO content_podcasts (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Comment créer un podcast réussi', 'Guide complet pour créer un podcast qui génère de l\'audience', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Podcasting' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO content_podcasts (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Les tendances du podcasting', 'Analyse des tendances actuelles dans le monde du podcasting', 
 (SELECT id FROM categories WHERE name = 'Actualités' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Tendances' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 6. Vérifier que la table a été créée
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_podcasts'
ORDER BY ordinal_position; 