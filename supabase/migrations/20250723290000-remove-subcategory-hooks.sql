-- Supprimer la table subcategory_hooks pour désactiver la génération automatique de hooks
DROP TABLE IF EXISTS public.subcategory_hooks;

-- Supprimer aussi les politiques RLS associées si elles existent
DROP POLICY IF EXISTS "Public read access for subcategory_hooks" ON public.subcategory_hooks;
DROP POLICY IF EXISTS "Public insert access for subcategory_hooks" ON public.subcategory_hooks;
DROP POLICY IF EXISTS "Public update access for subcategory_hooks" ON public.subcategory_hooks;
DROP POLICY IF EXISTS "Public delete access for subcategory_hooks" ON public.subcategory_hooks; 