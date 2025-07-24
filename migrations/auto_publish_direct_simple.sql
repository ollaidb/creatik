-- Migration pour publier directement le contenu sans approbation admin (version simplifiée)

-- 1. Fonction pour insérer automatiquement le contenu dès sa publication
CREATE OR REPLACE FUNCTION auto_insert_published_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer selon le type de contenu dès la création
    IF NEW.content_type = 'category' THEN
        -- Insérer dans categories
        INSERT INTO categories (name, description, color)
        VALUES (NEW.title, 'Catégorie publiée', '#3B82F6')
        ON CONFLICT (name) DO NOTHING;
        
    ELSIF NEW.content_type = 'subcategory' THEN
        -- Insérer dans subcategories
        INSERT INTO subcategories (name, description, category_id)
        VALUES (NEW.title, 'Sous-catégorie publiée', NEW.category_id)
        ON CONFLICT (name, category_id) DO NOTHING;
        
    ELSIF NEW.content_type = 'title' THEN
        -- Insérer dans content_titles
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES (NEW.title, NEW.subcategory_id, 'title', 'all')
        ON CONFLICT (title, subcategory_id) DO NOTHING;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Créer le trigger qui s'active quand une publication est insérée
DROP TRIGGER IF EXISTS auto_insert_published_content_trigger ON user_publications;
CREATE TRIGGER auto_insert_published_content_trigger
    AFTER INSERT ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION auto_insert_published_content();

-- 3. Traiter les publications existantes qui ne sont pas encore dans les tables principales
-- Insérer automatiquement le contenu des publications existantes
INSERT INTO categories (name, description, color)
SELECT DISTINCT title, 'Catégorie publiée', '#3B82F6'
FROM user_publications 
WHERE content_type = 'category' 
  AND status IN ('pending', 'approved')
  AND title NOT IN (SELECT name FROM categories);

INSERT INTO subcategories (name, description, category_id)
SELECT DISTINCT up.title, 'Sous-catégorie publiée', up.category_id
FROM user_publications up
WHERE up.content_type = 'subcategory' 
  AND up.status IN ('pending', 'approved')
  AND up.category_id IS NOT NULL
  AND (up.title, up.category_id) NOT IN (SELECT name, category_id FROM subcategories);

INSERT INTO content_titles (title, subcategory_id, type, platform)
SELECT DISTINCT up.title, up.subcategory_id, 'title', 'all'
FROM user_publications up
WHERE up.content_type = 'title' 
  AND up.status IN ('pending', 'approved')
  AND up.subcategory_id IS NOT NULL
  AND (up.title, up.subcategory_id) NOT IN (SELECT title, subcategory_id FROM content_titles);

-- 4. Mettre à jour le statut des publications existantes à 'approved'
UPDATE user_publications 
SET status = 'approved', updated_at = NOW()
WHERE status = 'pending';

-- 5. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_publications_status ON user_publications(status);
CREATE INDEX IF NOT EXISTS idx_user_publications_content_type ON user_publications(content_type);
CREATE INDEX IF NOT EXISTS idx_user_publications_created_at ON user_publications(created_at);

-- 6. Politique RLS simple pour permettre aux utilisateurs de voir leurs publications
DROP POLICY IF EXISTS "Enable select for users" ON user_publications;
CREATE POLICY "Enable select for users" ON user_publications
    FOR SELECT USING (
        auth.role() = 'authenticated' AND auth.uid() = user_id
    );

-- 7. Politique RLS pour permettre aux utilisateurs d'insérer leurs publications
DROP POLICY IF EXISTS "Enable insert for users" ON user_publications;
CREATE POLICY "Enable insert for users" ON user_publications
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND auth.uid() = user_id
    ); 