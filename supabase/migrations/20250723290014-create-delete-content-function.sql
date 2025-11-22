-- Fonction pour supprimer logiquement le contenu
CREATE OR REPLACE FUNCTION delete_user_content(
    p_content_type TEXT,
    p_content_id UUID,
    p_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    content_record RECORD;
    result JSON;
BEGIN
    -- Récupérer les informations du contenu selon le type
    IF p_content_type = 'category' THEN
        SELECT id, name as title, description, color, NULL as category_id, NULL as subcategory_id
        INTO content_record
        FROM categories
        WHERE id = p_content_id;
        
    ELSIF p_content_type = 'subcategory' THEN
        SELECT s.id, s.name as title, s.description, NULL as color, s.category_id, NULL as subcategory_id
        INTO content_record
        FROM subcategories s
        WHERE s.id = p_content_id;
        
    ELSIF p_content_type = 'title' THEN
        SELECT ct.id, ct.title, NULL as description, NULL as color, NULL as category_id, ct.subcategory_id
        INTO content_record
        FROM content_titles ct
        WHERE ct.id = p_content_id;
        
    ELSIF p_content_type = 'challenge' THEN
        SELECT c.id, c.title, c.description, NULL as color, NULL as category_id, NULL as subcategory_id
        INTO content_record
        FROM challenges c
        WHERE c.id = p_content_id;
        
    ELSE
        RAISE EXCEPTION 'Type de contenu invalide: %', p_content_type;
    END IF;
    
    -- Vérifier que le contenu existe
    IF content_record.id IS NULL THEN
        RAISE EXCEPTION 'Contenu non trouvé';
    END IF;
    
    -- Sauvegarder dans deleted_content
    INSERT INTO deleted_content (
        original_id,
        content_type,
        title,
        description,
        category_id,
        subcategory_id,
        user_id,
        metadata
    ) VALUES (
        content_record.id,
        p_content_type,
        content_record.title,
        content_record.description,
        content_record.category_id,
        content_record.subcategory_id,
        p_user_id,
        CASE 
            WHEN p_content_type = 'category' THEN jsonb_build_object('color', content_record.color)
            WHEN p_content_type = 'challenge' THEN jsonb_build_object('points', 50, 'difficulty', 'medium')
            ELSE '{}'::jsonb
        END
    );
    
    -- Supprimer le contenu de la table principale
    IF p_content_type = 'category' THEN
        DELETE FROM categories WHERE id = p_content_id;
    ELSIF p_content_type = 'subcategory' THEN
        DELETE FROM subcategories WHERE id = p_content_id;
    ELSIF p_content_type = 'title' THEN
        DELETE FROM content_titles WHERE id = p_content_id;
    ELSIF p_content_type = 'challenge' THEN
        DELETE FROM challenges WHERE id = p_content_id;
    END IF;
    
    result := json_build_object(
        'success', true,
        'message', 'Contenu supprimé avec succès',
        'deleted_id', content_record.id
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'success', false,
            'message', 'Erreur lors de la suppression: ' || SQLERRM
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql; 