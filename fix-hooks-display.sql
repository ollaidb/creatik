-- Script pour corriger l'affichage des hooks
-- Date: 2025-01-28

-- 1. Vérifier d'abord l'état actuel
SELECT 
  'ÉTAT ACTUEL - HOOKS DANS CONTENT_TITLES' as info,
  COUNT(*) as total_hooks,
  COUNT(CASE WHEN platform = 'youtube' THEN 1 END) as youtube_hooks,
  COUNT(CASE WHEN platform != 'youtube' THEN 1 END) as other_hooks
FROM public.content_titles 
WHERE type = 'hook';

-- 2. Mettre à jour les hooks qui n'ont pas de category_id ou subcategory_id
-- Récupérer les IDs des catégories et sous-catégories
WITH category_mapping AS (
  SELECT 
    c.id as category_id,
    c.name as category_name,
    s.id as subcategory_id,
    s.name as subcategory_name
  FROM public.categories c
  LEFT JOIN public.subcategories s ON s.category_id = c.id
  WHERE c.name IN ('Accessibilité', 'YouTube', 'Vie personnelle', 'Activisme')
),
hook_updates AS (
  SELECT 
    ct.id,
    ct.title,
    ct.platform,
    cm.category_id,
    cm.subcategory_id
  FROM public.content_titles ct
  CROSS JOIN category_mapping cm
  WHERE ct.type = 'hook'
  AND (ct.category_id IS NULL OR ct.subcategory_id IS NULL)
  AND (
    (ct.platform = 'youtube' AND cm.category_name = 'YouTube') OR
    (ct.platform != 'youtube' AND cm.category_name = 'Accessibilité')
  )
)
-- Mettre à jour les hooks avec les bons IDs
UPDATE public.content_titles 
SET 
  category_id = hu.category_id,
  subcategory_id = hu.subcategory_id
FROM hook_updates hu
WHERE content_titles.id = hu.id;

-- 3. Vérifier le résultat
SELECT 
  'APRÈS CORRECTION' as info,
  COUNT(*) as total_hooks,
  COUNT(CASE WHEN platform = 'youtube' THEN 1 END) as youtube_hooks,
  COUNT(CASE WHEN platform != 'youtube' THEN 1 END) as other_hooks,
  COUNT(CASE WHEN category_id IS NOT NULL THEN 1 END) as hooks_with_category,
  COUNT(CASE WHEN subcategory_id IS NOT NULL THEN 1 END) as hooks_with_subcategory
FROM public.content_titles 
WHERE type = 'hook';

-- 4. Afficher les hooks corrigés
SELECT 
  'HOOKS CORRIGÉS' as info,
  id,
  title,
  platform,
  category_id,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC
LIMIT 10;
