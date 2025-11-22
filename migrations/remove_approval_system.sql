-- Migration pour supprimer le système d'approbation manuelle
-- Les publications seront maintenant automatiques

-- 1. Supprimer les triggers et fonctions liés à l'approbation manuelle
DROP TRIGGER IF EXISTS auto_approve_publications ON user_publications;
DROP FUNCTION IF EXISTS auto_approve_publication();

-- 2. Supprimer les politiques RLS qui nécessitent une approbation
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_publications;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON user_publications;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_publications;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_publications;

-- 3. Recréer les politiques RLS simplifiées (sans approbation)
CREATE POLICY "Enable insert for authenticated users only" ON user_publications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for users based on user_id" ON user_publications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON user_publications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON user_publications
    FOR DELETE USING (auth.uid() = user_id);

-- 4. S'assurer que les tables principales permettent l'insertion directe
-- Categories
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
CREATE POLICY "Enable insert for authenticated users only" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Subcategories
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON subcategories;
CREATE POLICY "Enable insert for authenticated users only" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Content_titles
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON content_titles;
CREATE POLICY "Enable insert for authenticated users only" ON content_titles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Fonction pour publier directement sans passer par user_publications
CREATE OR REPLACE FUNCTION publish_content_directly(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    new_id UUID;
BEGIN
    -- Vérifier les doublons selon le type
    IF p_content_type = 'category' THEN
        IF EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = LOWER(p_title)) THEN
            RETURN json_build_object('success', false, 'error', 'Cette catégorie existe déjà');
        END IF;
    ELSIF p_content_type = 'subcategory' THEN
        IF EXISTS (SELECT 1 FROM subcategories WHERE LOWER(name) = LOWER(p_title) AND category_id = p_category_id) THEN
            RETURN json_build_object('success', false, 'error', 'Cette sous-catégorie existe déjà dans cette catégorie');
        END IF;
    ELSIF p_content_type = 'title' THEN
        IF EXISTS (SELECT 1 FROM content_titles WHERE LOWER(title) = LOWER(p_title) AND subcategory_id = p_subcategory_id) THEN
            RETURN json_build_object('success', false, 'error', 'Ce titre existe déjà dans cette sous-catégorie');
        END IF;
    END IF;

    -- Insérer selon le type
    IF p_content_type = 'category' THEN
        INSERT INTO categories (name, description, color)
        VALUES (p_title, 'Nouvelle catégorie créée par un utilisateur', '#3B82F6')
        RETURNING id INTO new_id;
        
        result := json_build_object(
            'success', true,
            'id', new_id,
            'message', 'Catégorie créée avec succès'
        );
        
    ELSIF p_content_type = 'subcategory' THEN
        INSERT INTO subcategories (name, description, category_id)
        VALUES (p_title, 'Nouvelle sous-catégorie créée par un utilisateur', p_category_id)
        RETURNING id INTO new_id;
        
        result := json_build_object(
            'success', true,
            'id', new_id,
            'message', 'Sous-catégorie créée avec succès'
        );
        
    ELSIF p_content_type = 'title' THEN
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES (p_title, p_subcategory_id, 'title', 'all')
        RETURNING id INTO new_id;
        
        result := json_build_object(
            'success', true,
            'id', new_id,
            'message', 'Titre créé avec succès'
        );
    END IF;

    -- Enregistrer dans user_publications pour l'historique (optionnel)
    IF p_user_id IS NOT NULL THEN
        INSERT INTO user_publications (
            user_id, 
            content_type, 
            title, 
            category_id, 
            subcategory_id, 
            status,
            platform,
            content_format
        ) VALUES (
            p_user_id,
            p_content_type,
            p_title,
            p_category_id,
            p_subcategory_id,
            'approved',
            'all',
            'all'
        );
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_categories_name_lower_unique ON categories(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_subcategories_name_category_lower_unique ON subcategories(LOWER(name), category_id);
CREATE INDEX IF NOT EXISTS idx_content_titles_title_subcategory_lower_unique ON content_titles(LOWER(title), subcategory_id);

-- 7. Fonction pour vérifier rapidement les doublons
CREATE OR REPLACE FUNCTION check_duplicate_content(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    IF p_content_type = 'category' THEN
        RETURN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = LOWER(p_title));
    ELSIF p_content_type = 'subcategory' THEN
        RETURN EXISTS (SELECT 1 FROM subcategories WHERE LOWER(name) = LOWER(p_title) AND category_id = p_category_id);
    ELSIF p_content_type = 'title' THEN
        RETURN EXISTS (SELECT 1 FROM content_titles WHERE LOWER(title) = LOWER(p_title) AND subcategory_id = p_subcategory_id);
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 8. Nettoyer les anciennes données d'approbation si nécessaire
-- (Optionnel - décommentez si vous voulez nettoyer les anciennes publications en attente)
-- DELETE FROM user_publications WHERE status = 'pending' AND created_at < NOW() - INTERVAL '30 days';

-- 9. Mettre à jour les triggers pour maintenir la cohérence
CREATE OR REPLACE FUNCTION update_publication_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à user_publications
DROP TRIGGER IF EXISTS update_user_publications_timestamp ON user_publications;
CREATE TRIGGER update_user_publications_timestamp
    BEFORE UPDATE ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION update_publication_timestamp(); 