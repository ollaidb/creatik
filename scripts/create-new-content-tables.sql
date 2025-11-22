-- Script pour créer les nouvelles tables de contenu
-- Blogs, Articles, Mots-clés, Exemples (Twitter), Idées (Instagram)

-- 1. Table content_blogs
CREATE TABLE IF NOT EXISTS content_blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'blog',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table content_articles
CREATE TABLE IF NOT EXISTS content_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'article',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table content_mots_cles
CREATE TABLE IF NOT EXISTS content_mots_cles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'blog',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table content_exemples (pour Twitter)
CREATE TABLE IF NOT EXISTS content_exemples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'twitter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table content_idees (pour Instagram)
CREATE TABLE IF NOT EXISTS content_idees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  platform VARCHAR(50) DEFAULT 'instagram',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_content_blogs_category ON content_blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_content_blogs_subcategory ON content_blogs(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_blogs_platform ON content_blogs(platform);

CREATE INDEX IF NOT EXISTS idx_content_articles_category ON content_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_content_articles_subcategory ON content_articles(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_articles_platform ON content_articles(platform);

CREATE INDEX IF NOT EXISTS idx_content_mots_cles_category ON content_mots_cles(category_id);
CREATE INDEX IF NOT EXISTS idx_content_mots_cles_subcategory ON content_mots_cles(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_mots_cles_platform ON content_mots_cles(platform);

CREATE INDEX IF NOT EXISTS idx_content_exemples_category ON content_exemples(category_id);
CREATE INDEX IF NOT EXISTS idx_content_exemples_subcategory ON content_exemples(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_exemples_platform ON content_exemples(platform);

CREATE INDEX IF NOT EXISTS idx_content_idees_category ON content_idees(category_id);
CREATE INDEX IF NOT EXISTS idx_content_idees_subcategory ON content_idees(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_idees_platform ON content_idees(platform);

-- 7. Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_blogs_updated_at
    BEFORE UPDATE ON content_blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER trigger_update_content_articles_updated_at
    BEFORE UPDATE ON content_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER trigger_update_content_mots_cles_updated_at
    BEFORE UPDATE ON content_mots_cles
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER trigger_update_content_exemples_updated_at
    BEFORE UPDATE ON content_exemples
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER trigger_update_content_idees_updated_at
    BEFORE UPDATE ON content_idees
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- 8. RLS Policies
ALTER TABLE content_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_mots_cles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_exemples ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_idees ENABLE ROW LEVEL SECURITY;

-- Politiques pour content_blogs
CREATE POLICY "Users can view blogs" ON content_blogs FOR SELECT USING (true);
CREATE POLICY "Users can insert blogs" ON content_blogs FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own blogs" ON content_blogs FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own blogs" ON content_blogs FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_articles
CREATE POLICY "Users can view articles" ON content_articles FOR SELECT USING (true);
CREATE POLICY "Users can insert articles" ON content_articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own articles" ON content_articles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own articles" ON content_articles FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_mots_cles
CREATE POLICY "Users can view mots_cles" ON content_mots_cles FOR SELECT USING (true);
CREATE POLICY "Users can insert mots_cles" ON content_mots_cles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own mots_cles" ON content_mots_cles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own mots_cles" ON content_mots_cles FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_exemples
CREATE POLICY "Users can view exemples" ON content_exemples FOR SELECT USING (true);
CREATE POLICY "Users can insert exemples" ON content_exemples FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own exemples" ON content_exemples FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own exemples" ON content_exemples FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_idees
CREATE POLICY "Users can view idees" ON content_idees FOR SELECT USING (true);
CREATE POLICY "Users can insert idees" ON content_idees FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own idees" ON content_idees FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own idees" ON content_idees FOR DELETE USING (auth.uid() = author_id);

-- 9. Insérer quelques données de test
INSERT INTO content_blogs (title, content, category_id, subcategory_id) VALUES
('Comment créer un blog réussi', 'Guide complet pour créer un blog qui génère du trafic', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Blogging' LIMIT 1));

INSERT INTO content_articles (title, content, category_id, subcategory_id) VALUES
('Les tendances du moment', 'Analyse des tendances actuelles dans le monde', 
 (SELECT id FROM categories WHERE name = 'Actualités' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Tendances' LIMIT 1));

INSERT INTO content_mots_cles (title, content, category_id, subcategory_id) VALUES
('Mots-clés SEO', 'Liste des mots-clés les plus recherchés', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'SEO' LIMIT 1));

INSERT INTO content_exemples (title, content, category_id, subcategory_id) VALUES
('Exemple de tweet viral', 'Comment créer un tweet qui devient viral', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Twitter' LIMIT 1));

INSERT INTO content_idees (title, content, category_id, subcategory_id) VALUES
('Idée de post Instagram', 'Idées créatives pour vos posts Instagram', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Instagram' LIMIT 1));

-- 10. Vérifier que les tables ont été créées
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('content_blogs', 'content_articles', 'content_mots_cles', 'content_exemples', 'content_idees')
ORDER BY table_name; 