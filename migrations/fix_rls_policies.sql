-- Migration pour corriger les politiques RLS et permettre la publication directe

-- 1. Supprimer toutes les politiques RLS existantes sur les tables principales
-- Categories
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable select for all users" ON categories;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;

-- Subcategories
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subcategories;
DROP POLICY IF EXISTS "Enable select for all users" ON subcategories;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON subcategories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subcategories;

-- Content titles
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON content_titles;
DROP POLICY IF EXISTS "Enable select for all users" ON content_titles;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON content_titles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON content_titles;

-- 2. Créer des politiques RLS simples et permissives
-- Categories - Permettre tout pour les utilisateurs authentifiés
CREATE POLICY "Enable all for authenticated users" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Subcategories - Permettre tout pour les utilisateurs authentifiés
CREATE POLICY "Enable all for authenticated users" ON subcategories
    FOR ALL USING (auth.role() = 'authenticated');

-- Content titles - Permettre tout pour les utilisateurs authentifiés
CREATE POLICY "Enable all for authenticated users" ON content_titles
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. S'assurer que RLS est activé sur les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles ENABLE ROW LEVEL SECURITY;

-- 4. Créer une fonction de test pour vérifier les permissions
CREATE OR REPLACE FUNCTION test_insert_permissions()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Tester l'insertion dans categories
    BEGIN
        INSERT INTO categories (name, description, color)
        VALUES ('Test Category', 'Test Description', '#FF0000');
        
        result := json_build_object(
            'success', true,
            'message', 'Permissions test successful'
        );
        
        -- Nettoyer le test
        DELETE FROM categories WHERE name = 'Test Category';
        
    EXCEPTION
        WHEN OTHERS THEN
            result := json_build_object(
                'success', false,
                'error', 'Permission test failed: ' || SQLERRM
            );
    END;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql; 