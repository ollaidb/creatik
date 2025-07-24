-- Migration pour corriger la syntaxe des politiques RLS

-- 1. Supprimer toutes les politiques RLS existantes
-- Categories
DROP POLICY IF EXISTS "Enable all for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable select for all users" ON categories;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON categories;

-- Subcategories
DROP POLICY IF EXISTS "Enable all for authenticated users" ON subcategories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subcategories;
DROP POLICY IF EXISTS "Enable select for all users" ON subcategories;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON subcategories;

-- Content titles
DROP POLICY IF EXISTS "Enable all for authenticated users" ON content_titles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON content_titles;
DROP POLICY IF EXISTS "Enable select for all users" ON content_titles;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON content_titles;

-- 2. Créer des politiques RLS correctes avec les bonnes clauses
-- Categories - Politiques séparées pour SELECT et INSERT
CREATE POLICY "Enable select for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Subcategories - Politiques séparées pour SELECT et INSERT
CREATE POLICY "Enable select for all users" ON subcategories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Content titles - Politiques séparées pour SELECT et INSERT
CREATE POLICY "Enable select for all users" ON content_titles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON content_titles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. S'assurer que RLS est activé sur les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles ENABLE ROW LEVEL SECURITY;

-- 4. Vérifier que les politiques sont créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('categories', 'subcategories', 'content_titles'); 