-- Script SQL simplifié pour application directe dans Supabase
-- Copiez-collez ce script dans l'éditeur SQL de Supabase Dashboard

-- 1. Ajouter category_id et subcategory_id à creators
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_creators_category_id ON public.creators(category_id);
CREATE INDEX IF NOT EXISTS idx_creators_subcategory_id ON public.creators(subcategory_id);

-- 3. Contrainte d'unicité pour les créateurs (nom + sous-catégorie)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_creator_name_per_subcategory'
    ) THEN
        ALTER TABLE public.creators 
        ADD CONSTRAINT unique_creator_name_per_subcategory UNIQUE (name, subcategory_id);
    END IF;
END $$;

-- 4. Fonction pour vérifier les doublons de créateurs
CREATE OR REPLACE FUNCTION check_creator_exists(creator_name TEXT, subcat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.creators 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(creator_name)) 
    AND subcategory_id = subcat_id
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction améliorée pour vérifier les titres (avec type et platform)
CREATE OR REPLACE FUNCTION check_title_exists(title_text TEXT, subcat_id UUID, title_type TEXT DEFAULT 'title', title_platform TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.content_titles 
    WHERE LOWER(TRIM(title)) = LOWER(TRIM(title_text)) 
    AND subcategory_id = subcat_id
    AND type = title_type
    AND (title_platform IS NULL OR platform = title_platform)
  );
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
SELECT 'Migration appliquée avec succès! Les colonnes category_id et subcategory_id ont été ajoutées à la table creators.' as message;

