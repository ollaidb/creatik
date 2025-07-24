-- Migration pour corriger la fonction trigger (supprimer les ON CONFLICT)

-- 1. Fonction pour insérer automatiquement le contenu dès sa publication (sans ON CONFLICT)
CREATE OR REPLACE FUNCTION auto_insert_published_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer selon le type de contenu dès la création
    IF NEW.content_type = 'category' THEN
        -- Insérer dans categories
        INSERT INTO categories (name, description, color)
        VALUES (NEW.title, 'Catégorie publiée', '#3B82F6');
        
    ELSIF NEW.content_type = 'subcategory' THEN
        -- Insérer dans subcategories
        INSERT INTO subcategories (name, description, category_id)
        VALUES (NEW.title, 'Sous-catégorie publiée', NEW.category_id);
        
    ELSIF NEW.content_type = 'title' THEN
        -- Insérer dans content_titles
        INSERT INTO content_titles (title, subcategory_id, type, platform)
        VALUES (NEW.title, NEW.subcategory_id, 'title', 'all');
        
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Ignorer les erreurs de contrainte unique (doublons)
        RETURN NEW;
    WHEN OTHERS THEN
        -- Ignorer les autres erreurs
        RETURN NEW;
END;
$$ LANGUAGE plpgsql; 