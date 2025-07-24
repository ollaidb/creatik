-- Fonction pour ajouter un élément à la corbeille
CREATE OR REPLACE FUNCTION add_to_trash(
  p_user_id UUID,
  p_original_publication_id UUID,
  p_publication_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_subcategory_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.trash (
    user_id,
    original_publication_id,
    publication_type,
    title,
    description,
    category_id,
    subcategory_id,
    metadata,
    deleted_at,
    will_be_deleted_at
  ) VALUES (
    p_user_id,
    p_original_publication_id,
    p_publication_type,
    p_title,
    p_description,
    p_category_id,
    p_subcategory_id,
    p_metadata,
    NOW(),
    NOW() + INTERVAL '30 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour restaurer un élément de la corbeille
CREATE OR REPLACE FUNCTION restore_from_trash(p_trash_id UUID)
RETURNS void AS $$
DECLARE
  v_trash_item RECORD;
BEGIN
  -- Récupérer l'élément de la corbeille
  SELECT * INTO v_trash_item FROM public.trash WHERE id = p_trash_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Élément non trouvé dans la corbeille';
  END IF;
  
  -- Restaurer selon le type
  CASE v_trash_item.publication_type
    WHEN 'category' THEN
      INSERT INTO public.categories (
        id, name, description, color, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.description,
        COALESCE(v_trash_item.metadata->>'color', 'primary'),
        NOW(),
        NOW()
      );
      
    WHEN 'subcategory' THEN
      INSERT INTO public.subcategories (
        id, name, description, category_id, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.description,
        v_trash_item.category_id,
        NOW(),
        NOW()
      );
      
    WHEN 'title' THEN
      INSERT INTO public.content_titles (
        id, title, subcategory_id, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.subcategory_id,
        NOW(),
        NOW()
      );
      
    ELSE
      RAISE EXCEPTION 'Type de publication non supporté: %', v_trash_item.publication_type;
  END CASE;
  
  -- Supprimer de la corbeille
  DELETE FROM public.trash WHERE id = p_trash_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 