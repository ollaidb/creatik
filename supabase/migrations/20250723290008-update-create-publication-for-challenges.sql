-- Mettre à jour la fonction create_publication_with_check pour supporter les challenges
CREATE OR REPLACE FUNCTION create_publication_with_check(
    p_user_id UUID,
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    publication_id UUID;
    result JSON;
BEGIN
    -- Créer la publication en attente
    INSERT INTO pending_publications (
        user_id, content_type, title, category_id, subcategory_id, description
    ) VALUES (
        p_user_id, p_content_type, p_title, p_category_id, p_subcategory_id, p_description
    ) RETURNING id INTO publication_id;
    
    result := json_build_object(
        'success', true,
        'publication_id', publication_id,
        'message', 'Publication créée avec succès'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql; 