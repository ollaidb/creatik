-- Migration: Ajouter category_id et subcategory_id à la table creators
-- Description: Permet de lier les créateurs aux catégories et sous-catégories

-- 1. Ajouter les colonnes category_id et subcategory_id
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_creators_category_id ON public.creators(category_id);
CREATE INDEX IF NOT EXISTS idx_creators_subcategory_id ON public.creators(subcategory_id);

-- 3. Commentaire sur les colonnes
COMMENT ON COLUMN public.creators.category_id IS 'Référence à la catégorie du créateur';
COMMENT ON COLUMN public.creators.subcategory_id IS 'Référence à la sous-catégorie du créateur';

