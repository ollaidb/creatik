-- Migration pour désactiver temporairement RLS et permettre les publications

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

-- 2. Désactiver RLS temporairement sur les tables principales
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles DISABLE ROW LEVEL SECURITY;

-- 3. Vérifier que RLS est désactivé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('categories', 'subcategories', 'content_titles')
AND schemaname = 'public';

-- 4. Créer une fonction de test pour vérifier que l'insertion fonctionne
CREATE OR REPLACE FUNCTION test_direct_insert()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Tester l'insertion dans content_titles
    BEGIN
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES ('Test Title', (SELECT id FROM subcategories LIMIT 1), 'title', 'all');
        
        result := json_build_object(
            'success', true,
            'message', 'Direct insert test successful'
        );
        
        -- Nettoyer le test
        DELETE FROM content_titles WHERE title = 'Test Title';
        
    EXCEPTION
        WHEN OTHERS THEN
            result := json_build_object(
                'success', false,
                'error', 'Direct insert test failed: ' || SQLERRM
            );
    END;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql; 