-- Script pour compléter les tables de contenu existantes
-- Ajouter les éléments manquants : indexes, triggers, RLS, etc.

-- 1. Ajouter les colonnes manquantes
ALTER TABLE content_blogs ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'blog';
ALTER TABLE content_blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE content_articles ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'article';
ALTER TABLE content_articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE content_exemples ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'twitter';
ALTER TABLE content_exemples ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE content_idees ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'instagram';
ALTER TABLE content_idees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Ajouter les contraintes de clés étrangères
ALTER TABLE content_blogs 
ADD CONSTRAINT IF NOT EXISTS fk_content_blogs_author 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE content_blogs 
ADD CONSTRAINT IF NOT EXISTS fk_content_blogs_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE content_blogs 
ADD CONSTRAINT IF NOT EXISTS fk_content_blogs_subcategory 
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;

ALTER TABLE content_articles 
ADD CONSTRAINT IF NOT EXISTS fk_content_articles_author 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE content_articles 
ADD CONSTRAINT IF NOT EXISTS fk_content_articles_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE content_articles 
ADD CONSTRAINT IF NOT EXISTS fk_content_articles_subcategory 
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;

ALTER TABLE content_exemples 
ADD CONSTRAINT IF NOT EXISTS fk_content_exemples_author 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE content_exemples 
ADD CONSTRAINT IF NOT EXISTS fk_content_exemples_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE content_exemples 
ADD CONSTRAINT IF NOT EXISTS fk_content_exemples_subcategory 
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;

ALTER TABLE content_idees 
ADD CONSTRAINT IF NOT EXISTS fk_content_idees_author 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE content_idees 
ADD CONSTRAINT IF NOT EXISTS fk_content_idees_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE content_idees 
ADD CONSTRAINT IF NOT EXISTS fk_content_idees_subcategory 
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;

-- 3. Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_content_blogs_category ON content_blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_content_blogs_subcategory ON content_blogs(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_blogs_platform ON content_blogs(platform);
CREATE INDEX IF NOT EXISTS idx_content_blogs_author ON content_blogs(author_id);

CREATE INDEX IF NOT EXISTS idx_content_articles_category ON content_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_content_articles_subcategory ON content_articles(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_articles_platform ON content_articles(platform);
CREATE INDEX IF NOT EXISTS idx_content_articles_author ON content_articles(author_id);

CREATE INDEX IF NOT EXISTS idx_content_exemples_category ON content_exemples(category_id);
CREATE INDEX IF NOT EXISTS idx_content_exemples_subcategory ON content_exemples(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_exemples_platform ON content_exemples(platform);
CREATE INDEX IF NOT EXISTS idx_content_exemples_author ON content_exemples(author_id);

CREATE INDEX IF NOT EXISTS idx_content_idees_category ON content_idees(category_id);
CREATE INDEX IF NOT EXISTS idx_content_idees_subcategory ON content_idees(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_content_idees_platform ON content_idees(platform);
CREATE INDEX IF NOT EXISTS idx_content_idees_author ON content_idees(author_id);

-- 4. Triggers pour updated_at
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

CREATE TRIGGER trigger_update_content_exemples_updated_at
    BEFORE UPDATE ON content_exemples
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER trigger_update_content_idees_updated_at
    BEFORE UPDATE ON content_idees
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- 5. RLS Policies
ALTER TABLE content_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_exemples ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_idees ENABLE ROW LEVEL SECURITY;

-- Politiques pour content_blogs
DROP POLICY IF EXISTS "Users can view blogs" ON content_blogs;
DROP POLICY IF EXISTS "Users can insert blogs" ON content_blogs;
DROP POLICY IF EXISTS "Users can update their own blogs" ON content_blogs;
DROP POLICY IF EXISTS "Users can delete their own blogs" ON content_blogs;

CREATE POLICY "Users can view blogs" ON content_blogs FOR SELECT USING (true);
CREATE POLICY "Users can insert blogs" ON content_blogs FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own blogs" ON content_blogs FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own blogs" ON content_blogs FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_articles
DROP POLICY IF EXISTS "Users can view articles" ON content_articles;
DROP POLICY IF EXISTS "Users can insert articles" ON content_articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON content_articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON content_articles;

CREATE POLICY "Users can view articles" ON content_articles FOR SELECT USING (true);
CREATE POLICY "Users can insert articles" ON content_articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own articles" ON content_articles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own articles" ON content_articles FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_exemples
DROP POLICY IF EXISTS "Users can view exemples" ON content_exemples;
DROP POLICY IF EXISTS "Users can insert exemples" ON content_exemples;
DROP POLICY IF EXISTS "Users can update their own exemples" ON content_exemples;
DROP POLICY IF EXISTS "Users can delete their own exemples" ON content_exemples;

CREATE POLICY "Users can view exemples" ON content_exemples FOR SELECT USING (true);
CREATE POLICY "Users can insert exemples" ON content_exemples FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own exemples" ON content_exemples FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own exemples" ON content_exemples FOR DELETE USING (auth.uid() = author_id);

-- Politiques pour content_idees
DROP POLICY IF EXISTS "Users can view idees" ON content_idees;
DROP POLICY IF EXISTS "Users can insert idees" ON content_idees;
DROP POLICY IF EXISTS "Users can update their own idees" ON content_idees;
DROP POLICY IF EXISTS "Users can delete their own idees" ON content_idees;

CREATE POLICY "Users can view idees" ON content_idees FOR SELECT USING (true);
CREATE POLICY "Users can insert idees" ON content_idees FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own idees" ON content_idees FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own idees" ON content_idees FOR DELETE USING (auth.uid() = author_id);

-- 6. Insérer quelques données de test
INSERT INTO content_blogs (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Comment créer un blog réussi', 'Guide complet pour créer un blog qui génère du trafic', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Blogging' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO content_articles (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Les tendances du moment', 'Analyse des tendances actuelles dans le monde', 
 (SELECT id FROM categories WHERE name = 'Actualités' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Tendances' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO content_exemples (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Exemple de tweet viral', 'Comment créer un tweet qui devient viral', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Twitter' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO content_idees (id, title, content, category_id, subcategory_id) VALUES
(gen_random_uuid(), 'Idée de post Instagram', 'Idées créatives pour vos posts Instagram', 
 (SELECT id FROM categories WHERE name = 'Conseil' LIMIT 1),
 (SELECT id FROM subcategories WHERE name = 'Instagram' LIMIT 1))
ON CONFLICT DO NOTHING;

-- 7. Vérifier que les tables sont complètes
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('content_blogs', 'content_articles', 'content_exemples', 'content_idees')
ORDER BY table_name, ordinal_position; 