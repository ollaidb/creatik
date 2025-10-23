-- Script pour diagnostiquer le problème des hooks
-- Date: 2025-01-28

-- 1. Vérifier la structure de la table content_titles
SELECT 
  'STRUCTURE CONTENT_TITLES' as section,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les hooks dans content_titles
SELECT 
  'HOOKS DANS CONTENT_TITLES' as section,
  id,
  title,
  type,
  platform,
  subcategory_id,
  subcategory_level2_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier les réseaux sociaux disponibles
SELECT 
  'RESEAUX SOCIAUX' as section,
  id,
  name,
  display_name
FROM public.social_networks
ORDER BY name;

-- 4. Vérifier les hooks dans la table hooks
SELECT 
  'HOOKS DANS TABLE HOOKS' as section,
  id,
  title,
  category_id,
  subcategory_id,
  social_network_id,
  created_at
FROM public.hooks
ORDER BY created_at DESC
LIMIT 10;

-- 5. Vérifier les catégories et sous-catégories
SELECT 
  'CATEGORIES' as section,
  c.id as category_id,
  c.name as category_name,
  s.id as subcategory_id,
  s.name as subcategory_name
FROM public.categories c
LEFT JOIN public.subcategories s ON s.category_id = c.id
WHERE c.name IN ('Accessibilité', 'YouTube')
ORDER BY c.name, s.name;
