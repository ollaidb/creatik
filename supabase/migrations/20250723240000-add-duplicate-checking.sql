-- Migration pour ajouter la vérification automatique des doublons
-- Date: 2025-07-23

-- 1. Ajouter des contraintes d'unicité
ALTER TABLE public.categories 
ADD CONSTRAINT unique_category_name UNIQUE (name);

ALTER TABLE public.subcategories 
ADD CONSTRAINT unique_subcategory_name_per_category UNIQUE (name, category_id);

ALTER TABLE public.content_titles 
ADD CONSTRAINT unique_title_per_subcategory UNIQUE (title, subcategory_id);

-- 2. Fonction pour vérifier si une catégorie existe déjà
CREATE OR REPLACE FUNCTION check_category_exists(category_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.categories WHERE LOWER(name) = LOWER(category_name));
END;
$$ LANGUAGE plpgsql;

-- 3. Fonction pour vérifier si une sous-catégorie existe déjà
CREATE OR REPLACE FUNCTION check_subcategory_exists(subcategory_name TEXT, cat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.subcategories 
    WHERE LOWER(name) = LOWER(subcategory_name) 
    AND category_id = cat_id
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Fonction pour vérifier si un titre existe déjà
CREATE OR REPLACE FUNCTION check_title_exists(title_text TEXT, subcat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.content_titles 
    WHERE LOWER(title) = LOWER(title_text) 
    AND subcategory_id = subcat_id
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction pour traiter automatiquement les publications
CREATE OR REPLACE FUNCTION process_publication(
  p_content_type TEXT,
  p_title TEXT,
  p_category_id UUID DEFAULT NULL,
  p_subcategory_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  category_exists BOOLEAN;
  subcategory_exists BOOLEAN;
  title_exists BOOLEAN;
  new_category_id UUID;
  new_subcategory_id UUID;
BEGIN
  -- Initialiser le résultat
  result := '{"success": false, "message": "", "action": ""}'::JSON;
  
  -- Traitement selon le type de contenu
  CASE p_content_type
    WHEN 'category' THEN
      -- Vérifier si la catégorie existe déjà
      category_exists := check_category_exists(p_title);
      
      IF category_exists THEN
        result := json_build_object(
          'success', false,
          'message', 'Cette catégorie existe déjà',
          'action', 'rejected'
        );
      ELSE
        -- Créer la nouvelle catégorie
        INSERT INTO public.categories (name, color, description)
        VALUES (p_title, 'primary', 'Nouvelle catégorie ajoutée par la communauté')
        RETURNING id INTO new_category_id;
        
        result := json_build_object(
          'success', true,
          'message', 'Catégorie créée avec succès',
          'action', 'created',
          'category_id', new_category_id
        );
      END IF;
      
    WHEN 'subcategory' THEN
      -- Vérifier si la catégorie parent existe
      IF p_category_id IS NULL THEN
        result := json_build_object(
          'success', false,
          'message', 'ID de catégorie requis',
          'action', 'rejected'
        );
        RETURN result;
      END IF;
      
      -- Vérifier si la sous-catégorie existe déjà
      subcategory_exists := check_subcategory_exists(p_title, p_category_id);
      
      IF subcategory_exists THEN
        result := json_build_object(
          'success', false,
          'message', 'Cette sous-catégorie existe déjà dans cette catégorie',
          'action', 'rejected'
        );
      ELSE
        -- Créer la nouvelle sous-catégorie
        INSERT INTO public.subcategories (name, description, category_id)
        VALUES (p_title, 'Nouvelle sous-catégorie ajoutée par la communauté', p_category_id)
        RETURNING id INTO new_subcategory_id;
        
        result := json_build_object(
          'success', true,
          'message', 'Sous-catégorie créée avec succès',
          'action', 'created',
          'subcategory_id', new_subcategory_id
        );
      END IF;
      
    WHEN 'title' THEN
      -- Vérifier si la sous-catégorie parent existe
      IF p_subcategory_id IS NULL THEN
        result := json_build_object(
          'success', false,
          'message', 'ID de sous-catégorie requis',
          'action', 'rejected'
        );
        RETURN result;
      END IF;
      
      -- Vérifier si le titre existe déjà
      title_exists := check_title_exists(p_title, p_subcategory_id);
      
      IF title_exists THEN
        result := json_build_object(
          'success', false,
          'message', 'Ce titre existe déjà dans cette sous-catégorie',
          'action', 'rejected'
        );
      ELSE
        -- Créer le nouveau titre
        INSERT INTO public.content_titles (title, subcategory_id, type, platform)
        VALUES (p_title, p_subcategory_id, 'title', 'all');
        
        result := json_build_object(
          'success', true,
          'message', 'Titre créé avec succès',
          'action', 'created'
        );
      END IF;
      
    ELSE
      result := json_build_object(
        'success', false,
        'message', 'Type de contenu non reconnu',
        'action', 'rejected'
      );
  END CASE;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer une Edge Function pour traiter les publications
-- (Cette fonction sera créée dans le dossier supabase/functions/)

-- 7. Politiques RLS pour permettre l'insertion automatique
CREATE POLICY "Allow automatic content creation" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow automatic content creation" 
  ON public.subcategories 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow automatic content creation" 
  ON public.content_titles 
  FOR INSERT 
  WITH CHECK (true); 