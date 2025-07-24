-- Migration pour automatiser l'insertion du contenu quand une publication est approuvée

-- 1. Fonction pour insérer automatiquement le contenu approuvé
CREATE OR REPLACE FUNCTION auto_insert_approved_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Seulement si le statut passe à 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        
        -- Insérer selon le type de contenu
        IF NEW.content_type = 'category' THEN
            -- Insérer dans categories
            INSERT INTO categories (name, description, color)
            VALUES (NEW.title, 'Catégorie approuvée', '#3B82F6')
            ON CONFLICT (name) DO NOTHING;
            
        ELSIF NEW.content_type = 'subcategory' THEN
            -- Insérer dans subcategories
            INSERT INTO subcategories (name, description, category_id)
            VALUES (NEW.title, 'Sous-catégorie approuvée', NEW.category_id)
            ON CONFLICT (name, category_id) DO NOTHING;
            
        ELSIF NEW.content_type = 'title' THEN
            -- Insérer dans content_titles
            INSERT INTO content_titles (title, subcategory_id, type, platform)
            VALUES (NEW.title, NEW.subcategory_id, 'title', 'all')
            ON CONFLICT (title, subcategory_id) DO NOTHING;
            
        END IF;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Créer le trigger qui s'active quand une publication est mise à jour
DROP TRIGGER IF EXISTS auto_insert_approved_content_trigger ON user_publications;
CREATE TRIGGER auto_insert_approved_content_trigger
    AFTER UPDATE ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION auto_insert_approved_content();

-- 3. Créer le trigger qui s'active quand une publication est insérée avec statut 'approved'
DROP TRIGGER IF EXISTS auto_insert_approved_content_insert_trigger ON user_publications;
CREATE TRIGGER auto_insert_approved_content_insert_trigger
    AFTER INSERT ON user_publications
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION auto_insert_approved_content();

-- 4. Fonction pour approuver une publication
CREATE OR REPLACE FUNCTION approve_publication(p_publication_id UUID)
RETURNS JSON AS $$
DECLARE
    publication_record user_publications%ROWTYPE;
    result JSON;
BEGIN
    -- Récupérer la publication
    SELECT * INTO publication_record
    FROM user_publications
    WHERE id = p_publication_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Publication non trouvée');
    END IF;
    
    -- Mettre à jour le statut à 'approved'
    UPDATE user_publications
    SET status = 'approved', updated_at = NOW()
    WHERE id = p_publication_id;
    
    -- Le trigger s'occupera d'insérer le contenu automatiquement
    
    RETURN json_build_object(
        'success', true,
        'message', 'Publication approuvée et contenu ajouté avec succès',
        'content_type', publication_record.content_type,
        'title', publication_record.title
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction pour rejeter une publication
CREATE OR REPLACE FUNCTION reject_publication(p_publication_id UUID, p_reason TEXT DEFAULT 'Rejeté par l''administrateur')
RETURNS JSON AS $$
BEGIN
    UPDATE user_publications
    SET status = 'rejected', 
        rejection_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_publication_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Publication non trouvée');
    END IF;
    
    RETURN json_build_object('success', true, 'message', 'Publication rejetée');
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction pour obtenir toutes les publications en attente
CREATE OR REPLACE FUNCTION get_pending_publications()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content_type TEXT,
    title TEXT,
    category_name TEXT,
    subcategory_name TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    user_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.user_id,
        up.content_type,
        up.title,
        c.name as category_name,
        s.name as subcategory_name,
        up.status,
        up.created_at,
        p.email as user_email
    FROM user_publications up
    LEFT JOIN categories c ON up.category_id = c.id
    LEFT JOIN subcategories s ON up.subcategory_id = s.id
    LEFT JOIN profiles p ON up.user_id = p.id
    WHERE up.status = 'pending'
    ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. S'assurer que les contraintes de clés étrangères sont correctes
-- Vérifier que user_publications.category_id référence categories.id
-- Vérifier que user_publications.subcategory_id référence subcategories.id

-- 8. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_publications_status ON user_publications(status);
CREATE INDEX IF NOT EXISTS idx_user_publications_content_type ON user_publications(content_type);
CREATE INDEX IF NOT EXISTS idx_user_publications_created_at ON user_publications(created_at);

-- 9. Politique RLS pour permettre aux admins de voir toutes les publications
DROP POLICY IF EXISTS "Enable select for admins" ON user_publications;
CREATE POLICY "Enable select for admins" ON user_publications
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            auth.uid() = user_id OR 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

-- 10. Politique RLS pour permettre aux admins de mettre à jour les publications
DROP POLICY IF EXISTS "Enable update for admins" ON user_publications;
CREATE POLICY "Enable update for admins" ON user_publications
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND (
            auth.uid() = user_id OR 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    ); 