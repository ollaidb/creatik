-- Script pour vérifier les hooks dans content_titles
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

-- 2. Vérifier tous les content_titles
SELECT 
  'TOUS CONTENT_TITLES' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier spécifiquement les hooks
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
ORDER BY created_at DESC;

-- 4. Compter les hooks par plateforme
SELECT 
  'COMPTAGE HOOKS PAR PLATEFORME' as info,
  platform,
  COUNT(*) as count
FROM public.content_titles 
WHERE type = 'hook'
GROUP BY platform
ORDER BY count DESC;
