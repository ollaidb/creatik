-- Mettre à jour la fonction check_for_duplicates pour gérer les challenges
CREATE OR REPLACE FUNCTION check_for_duplicates(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    duplicate_count INTEGER := 0;
BEGIN
    -- Vérifier selon le type de contenu
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
        
    ELSIF p_content_type = 'challenge' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM challenges
        WHERE LOWER(title) = LOWER(p_title);
        
    END IF;
    
    RETURN duplicate_count > 0;
END;
$$ LANGUAGE plpgsql; 