-- Système de publication directe dans les tables principales

-- 1. Supprimer la table user_publications et ses triggers
DROP TRIGGER IF EXISTS auto_insert_published_content_trigger ON user_publications;
DROP TRIGGER IF EXISTS auto_insert_approved_content_trigger ON user_publications;
DROP TRIGGER IF EXISTS auto_insert_approved_content_insert_trigger ON user_publications;
DROP FUNCTION IF EXISTS auto_insert_published_content();
DROP FUNCTION IF EXISTS auto_insert_approved_content();
DROP FUNCTION IF EXISTS approve_publication(UUID);
DROP FUNCTION IF EXISTS reject_publication(UUID, TEXT);
DROP FUNCTION IF EXISTS get_pending_publications();

-- 2. Supprimer la table user_publications
DROP TABLE IF EXISTS user_publications;

-- 3. Fonction pour insérer directement dans les tables principales
CREATE OR REPLACE FUNCTION insert_content_direct(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Insérer selon le type de contenu
    IF p_content_type = 'category' THEN
        -- Insérer dans categories
        INSERT INTO categories (name, description, color)
        VALUES (p_title, 'Catégorie publiée', '#3B82F6');
        
        result := json_build_object(
            'success', true,
            'message', 'Catégorie publiée avec succès',
            'content_type', 'category',
            'title', p_title
        );
        
    ELSIF p_content_type = 'subcategory' THEN
        -- Insérer dans subcategories
        INSERT INTO subcategories (name, description, category_id)
        VALUES (p_title, 'Sous-catégorie publiée', p_category_id);
        
        result := json_build_object(
            'success', true,
            'message', 'Sous-catégorie publiée avec succès',
            'content_type', 'subcategory',
            'title', p_title
        );
        
    ELSIF p_content_type = 'title' THEN
        -- Insérer dans content_titles
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES (p_title, p_subcategory_id, 'title', 'all');
        
        result := json_build_object(
            'success', true,
            'message', 'Titre publié avec succès',
            'content_type', 'title',
            'title', p_title
        );
        
    ELSE
        result := json_build_object(
            'success', false,
            'error', 'Type de contenu invalide'
        );
    END IF;
    
    RETURN result;
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Ce contenu existe déjà'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Erreur lors de la publication: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- 4. Politique RLS pour permettre aux utilisateurs d'insérer du contenu
-- Categories
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
CREATE POLICY "Enable insert for authenticated users" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Subcategories
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subcategories;
CREATE POLICY "Enable insert for authenticated users" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Content titles
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON content_titles;
CREATE POLICY "Enable insert for authenticated users" ON content_titles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Politique RLS pour permettre aux utilisateurs de voir le contenu
-- Categories
DROP POLICY IF EXISTS "Enable select for all users" ON categories;
CREATE POLICY "Enable select for all users" ON categories
    FOR SELECT USING (true);

-- Subcategories
DROP POLICY IF EXISTS "Enable select for all users" ON subcategories;
CREATE POLICY "Enable select for all users" ON subcategories
    FOR SELECT USING (true);

-- Content titles
DROP POLICY IF EXISTS "Enable select for all users" ON content_titles;
CREATE POLICY "Enable select for all users" ON content_titles
    FOR SELECT USING (true); 