-- Script SQL pour empêcher les doublons dans les tables principales
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Ajouter une contrainte d'unicité sur le nom des catégories
ALTER TABLE public.categories 
ADD CONSTRAINT unique_category_name UNIQUE (name);

-- 2. Ajouter une contrainte d'unicité sur le nom des sous-catégories
ALTER TABLE public.subcategories 
ADD CONSTRAINT unique_subcategory_name UNIQUE (name);

-- 3. Ajouter une contrainte d'unicité sur le titre du contenu
ALTER TABLE public.content_titles 
ADD CONSTRAINT unique_content_title UNIQUE (title);

-- 4. Ajouter une contrainte d'unicité sur le nom des défis
ALTER TABLE public.challenges 
ADD CONSTRAINT unique_challenge_title UNIQUE (title);

-- 5. Créer une fonction pour vérifier les doublons avant insertion
CREATE OR REPLACE FUNCTION check_duplicate_content(
    p_content_type TEXT,
    p_name TEXT,
    p_title TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    exists_count INTEGER;
    result JSONB;
BEGIN
    CASE p_content_type
        WHEN 'category' THEN
            SELECT COUNT(*) INTO exists_count 
            FROM public.categories 
            WHERE LOWER(name) = LOWER(p_name);
            
        WHEN 'subcategory' THEN
            SELECT COUNT(*) INTO exists_count 
            FROM public.subcategories 
            WHERE LOWER(name) = LOWER(p_name);
            
        WHEN 'title' THEN
            SELECT COUNT(*) INTO exists_count 
            FROM public.content_titles 
            WHERE LOWER(title) = LOWER(p_title);
            
        WHEN 'challenge' THEN
            SELECT COUNT(*) INTO exists_count 
            FROM public.challenges 
            WHERE LOWER(title) = LOWER(p_title);
            
        ELSE
            RETURN jsonb_build_object('success', false, 'error', 'Type de contenu non supporté');
    END CASE;
    
    IF exists_count > 0 THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Ce contenu existe déjà',
            'content_type', p_content_type,
            'name', p_name,
            'title', p_title
        );
    ELSE
        RETURN jsonb_build_object('success', true);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer une fonction pour insérer avec vérification de doublons
CREATE OR REPLACE FUNCTION insert_content_with_duplicate_check(
    p_content_type TEXT,
    p_name TEXT,
    p_title TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    duplicate_check JSONB;
    new_id UUID;
    result JSONB;
BEGIN
    -- Vérifier les doublons
    SELECT check_duplicate_content(p_content_type, p_name, p_title) INTO duplicate_check;
    
    IF NOT (duplicate_check->>'success')::boolean THEN
        RETURN duplicate_check;
    END IF;
    
    -- Insérer le contenu selon le type
    CASE p_content_type
        WHEN 'category' THEN
            INSERT INTO public.categories (name, description, color)
            VALUES (p_name, p_description, p_color)
            RETURNING id INTO new_id;
            
        WHEN 'subcategory' THEN
            INSERT INTO public.subcategories (name, description, category_id)
            VALUES (p_name, p_description, p_category_id)
            RETURNING id INTO new_id;
            
        WHEN 'title' THEN
            INSERT INTO public.content_titles (title, description, subcategory_id)
            VALUES (p_title, p_description, p_subcategory_id)
            RETURNING id INTO new_id;
            
        WHEN 'challenge' THEN
            INSERT INTO public.challenges (title, description, created_by)
            VALUES (p_title, p_description, p_user_id)
            RETURNING id INTO new_id;
            
        ELSE
            RETURN jsonb_build_object('success', false, 'error', 'Type de contenu non supporté');
    END CASE;
    
    RETURN jsonb_build_object('success', true, 'id', new_id);
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 7. Créer des triggers pour empêcher les doublons via l'interface normale
CREATE OR REPLACE FUNCTION prevent_duplicate_categories()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.categories WHERE LOWER(name) = LOWER(NEW.name) AND id != NEW.id) THEN
        RAISE EXCEPTION 'Une catégorie avec ce nom existe déjà';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_categories
    BEFORE INSERT OR UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_categories();

CREATE OR REPLACE FUNCTION prevent_duplicate_subcategories()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.subcategories WHERE LOWER(name) = LOWER(NEW.name) AND id != NEW.id) THEN
        RAISE EXCEPTION 'Une sous-catégorie avec ce nom existe déjà';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_subcategories
    BEFORE INSERT OR UPDATE ON public.subcategories
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_subcategories();

CREATE OR REPLACE FUNCTION prevent_duplicate_titles()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.content_titles WHERE LOWER(title) = LOWER(NEW.title) AND id != NEW.id) THEN
        RAISE EXCEPTION 'Un titre avec ce nom existe déjà';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_titles
    BEFORE INSERT OR UPDATE ON public.content_titles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_titles();

CREATE OR REPLACE FUNCTION prevent_duplicate_challenges()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.challenges WHERE LOWER(title) = LOWER(NEW.title) AND id != NEW.id) THEN
        RAISE EXCEPTION 'Un défi avec ce titre existe déjà';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_challenges
    BEFORE INSERT OR UPDATE ON public.challenges
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_challenges(); 