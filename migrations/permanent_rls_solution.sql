-- Solution permanente avec RLS activé et politiques de sécurité appropriées

-- 1. Réactiver RLS sur les tables principales
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les anciennes politiques pour éviter les conflits
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

-- 3. Créer des politiques RLS permanentes et sécurisées

-- Categories - Permettre la lecture à tous, l'écriture aux utilisateurs authentifiés
CREATE POLICY "categories_select_policy" ON categories
    FOR SELECT USING (true);

CREATE POLICY "categories_insert_policy" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "categories_update_policy" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Subcategories - Permettre la lecture à tous, l'écriture aux utilisateurs authentifiés
CREATE POLICY "subcategories_select_policy" ON subcategories
    FOR SELECT USING (true);

CREATE POLICY "subcategories_insert_policy" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "subcategories_update_policy" ON subcategories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Content titles - Permettre la lecture à tous, l'écriture aux utilisateurs authentifiés
CREATE POLICY "content_titles_select_policy" ON content_titles
    FOR SELECT USING (true);

CREATE POLICY "content_titles_insert_policy" ON content_titles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "content_titles_update_policy" ON content_titles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Créer une fonction de test pour vérifier que les politiques fonctionnent
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS JSON AS $$
DECLARE
    result JSON;
    test_category_id UUID;
    test_subcategory_id UUID;
BEGIN
    -- Tester l'insertion dans categories
    BEGIN
        INSERT INTO categories (name, description, color)
        VALUES ('Test Category RLS', 'Test Description RLS', '#FF0000')
        RETURNING id INTO test_category_id;
        
        -- Tester l'insertion dans subcategories
        INSERT INTO subcategories (name, description, category_id)
        VALUES ('Test Subcategory RLS', 'Test Description RLS', test_category_id)
        RETURNING id INTO test_subcategory_id;
        
        -- Tester l'insertion dans content_titles
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES ('Test Title RLS', test_subcategory_id, 'title', 'all');
        
        result := json_build_object(
            'success', true,
            'message', 'RLS policies test successful - all operations allowed'
        );
        
        -- Nettoyer les tests
        DELETE FROM content_titles WHERE title = 'Test Title RLS';
        DELETE FROM subcategories WHERE name = 'Test Subcategory RLS';
        DELETE FROM categories WHERE name = 'Test Category RLS';
        
    EXCEPTION
        WHEN OTHERS THEN
            result := json_build_object(
                'success', false,
                'error', 'RLS policies test failed: ' || SQLERRM
            );
    END;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Vérifier que les politiques sont créées correctement
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('categories', 'subcategories', 'content_titles')
AND schemaname = 'public'
ORDER BY tablename, policyname; 