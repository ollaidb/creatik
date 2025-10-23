-- Script simple pour diagnostiquer le problème des hooks
-- Date: 2025-01-28

-- 1. Vérifier la structure de content_titles
SELECT 
  'STRUCTURE CONTENT_TITLES' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les hooks dans content_titles
SELECT 
  'HOOKS DANS CONTENT_TITLES' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier les réseaux sociaux
SELECT 
  'RESEAUX SOCIAUX' as info,
  id,
  name,
  display_name
FROM public.social_networks
ORDER BY name;

-- 4. Vérifier les catégories
SELECT 
  'CATEGORIES' as info,
  id,
  name
FROM public.categories
ORDER BY name;

-- 5. Vérifier les sous-catégories
SELECT 
  'SOUS-CATEGORIES' as info,
  id,
  name,
  category_id
FROM public.subcategories
ORDER BY category_id, name;
