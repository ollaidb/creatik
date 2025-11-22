-- Migration pour corriger les RLS policies et assurer que les publications apparaissent dans les bonnes pages

-- 1. Corriger les RLS policies pour permettre l'insertion dans content_titles
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON content_titles;
DROP POLICY IF EXISTS "Enable select for all users" ON content_titles;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON content_titles;

CREATE POLICY "Enable insert for authenticated users only" ON content_titles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users" ON content_titles
    FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON content_titles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. Corriger les RLS policies pour categories
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable select for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;

CREATE POLICY "Enable insert for authenticated users only" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Corriger les RLS policies pour subcategories
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON subcategories;
DROP POLICY IF EXISTS "Enable select for all users" ON subcategories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON subcategories;

CREATE POLICY "Enable insert for authenticated users only" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users" ON subcategories
    FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON subcategories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. S'assurer que les RLS policies pour user_publications sont correctes
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_publications;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON user_publications;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_publications;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_publications;

CREATE POLICY "Enable insert for authenticated users only" ON user_publications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for users based on user_id" ON user_publications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON user_publications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON user_publications
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Ajouter des index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_content_titles_title ON content_titles(title);
CREATE INDEX IF NOT EXISTS idx_content_titles_subcategory_id ON content_titles(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_subcategories_name ON subcategories(name);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);

-- 6. S'assurer que les contraintes de clés étrangères sont correctes
-- Vérifier que content_titles.subcategory_id référence subcategories.id
-- Vérifier que subcategories.category_id référence categories.id

-- 7. Ajouter des triggers pour maintenir la cohérence des données
-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables pertinentes
DROP TRIGGER IF EXISTS update_content_titles_updated_at ON content_titles;
CREATE TRIGGER update_content_titles_updated_at
    BEFORE UPDATE ON content_titles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subcategories_updated_at ON subcategories;
CREATE TRIGGER update_subcategories_updated_at
    BEFORE UPDATE ON subcategories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Fonction pour vérifier les doublons
CREATE OR REPLACE FUNCTION check_content_duplicate(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    IF p_content_type = 'category' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM categories
        WHERE LOWER(name) = LOWER(p_title);
    ELSIF p_content_type = 'subcategory' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM subcategories
        WHERE LOWER(name) = LOWER(p_title)
        AND category_id = p_category_id;
    ELSIF p_content_type = 'title' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM content_titles
        WHERE LOWER(title) = LOWER(p_title)
        AND subcategory_id = p_subcategory_id;
    END IF;
    
    RETURN duplicate_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 9. Vues pour faciliter l'affichage des publications dans les pages
CREATE OR REPLACE VIEW content_with_metadata AS
SELECT 
    ct.id,
    ct.title,
    ct.type,
    ct.platform,
    ct.created_at,
    ct.updated_at,
    s.id as subcategory_id,
    s.name as subcategory_name,
    s.description as subcategory_description,
    c.id as category_id,
    c.name as category_name,
    c.color as category_color
FROM content_titles ct
JOIN subcategories s ON ct.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id;

-- 10. Fonction pour obtenir les publications d'un utilisateur avec métadonnées
CREATE OR REPLACE FUNCTION get_user_publications_with_metadata(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    content_type TEXT,
    title TEXT,
    category_name TEXT,
    subcategory_name TEXT,
    status TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.content_type,
        up.title,
        c.name as category_name,
        s.name as subcategory_name,
        up.status,
        up.created_at
    FROM user_publications up
    LEFT JOIN categories c ON up.category_id = c.id
    LEFT JOIN subcategories s ON up.subcategory_id = s.id
    WHERE up.user_id = p_user_id
    ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. Index pour améliorer les performances des requêtes de recherche
CREATE INDEX IF NOT EXISTS idx_content_titles_title_lower ON content_titles(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_categories_name_lower ON categories(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_subcategories_name_lower ON subcategories(LOWER(name));

-- 12. Fonction pour rechercher du contenu
CREATE OR REPLACE FUNCTION search_content(p_search_term TEXT)
RETURNS TABLE (
    content_type TEXT,
    id UUID,
    title TEXT,
    category_name TEXT,
    subcategory_name TEXT,
    relevance INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Rechercher dans les titres
    SELECT 
        'title'::TEXT as content_type,
        ct.id,
        ct.title,
        c.name as category_name,
        s.name as subcategory_name,
        CASE 
            WHEN LOWER(ct.title) = LOWER(p_search_term) THEN 100
            WHEN LOWER(ct.title) LIKE LOWER(p_search_term) || '%' THEN 80
            WHEN LOWER(ct.title) LIKE '%' || LOWER(p_search_term) || '%' THEN 60
            ELSE 40
        END as relevance
    FROM content_titles ct
    JOIN subcategories s ON ct.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE LOWER(ct.title) LIKE '%' || LOWER(p_search_term) || '%'
    
    UNION ALL
    
    -- Rechercher dans les catégories
    SELECT 
        'category'::TEXT as content_type,
        c.id,
        c.name as title,
        c.name as category_name,
        NULL::TEXT as subcategory_name,
        CASE 
            WHEN LOWER(c.name) = LOWER(p_search_term) THEN 100
            WHEN LOWER(c.name) LIKE LOWER(p_search_term) || '%' THEN 80
            WHEN LOWER(c.name) LIKE '%' || LOWER(p_search_term) || '%' THEN 60
            ELSE 40
        END as relevance
    FROM categories c
    WHERE LOWER(c.name) LIKE '%' || LOWER(p_search_term) || '%'
    
    UNION ALL
    
    -- Rechercher dans les sous-catégories
    SELECT 
        'subcategory'::TEXT as content_type,
        s.id,
        s.name as title,
        c.name as category_name,
        s.name as subcategory_name,
        CASE 
            WHEN LOWER(s.name) = LOWER(p_search_term) THEN 100
            WHEN LOWER(s.name) LIKE LOWER(p_search_term) || '%' THEN 80
            WHEN LOWER(s.name) LIKE '%' || LOWER(p_search_term) || '%' THEN 60
            ELSE 40
        END as relevance
    FROM subcategories s
    JOIN categories c ON s.category_id = c.id
    WHERE LOWER(s.name) LIKE '%' || LOWER(p_search_term) || '%'
    
    ORDER BY relevance DESC, title;
END;
$$ LANGUAGE plpgsql; 