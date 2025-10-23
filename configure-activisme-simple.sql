-- Configuration simple pour activer les sous-catégories de niveau 2 pour "Activisme"
-- Date: 2025-01-28

-- 1. Configurer la catégorie "Activisme" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
SELECT c.id, true
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 2. Créer la table subcategory_hierarchy_config si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.subcategory_hierarchy_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  has_level2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter la contrainte unique si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subcategory_hierarchy_config_subcategory_id_key'
  ) THEN
    ALTER TABLE public.subcategory_hierarchy_config ADD CONSTRAINT subcategory_hierarchy_config_subcategory_id_key UNIQUE (subcategory_id);
  END IF;
END $$;

-- 3. Configurer les sous-catégories spécifiques pour avoir le niveau 2
-- Droits des femmes
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- Climat
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- Politique nationale
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- Justice économique
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;
