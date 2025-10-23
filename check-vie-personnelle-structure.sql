-- Script pour vérifier la structure de la catégorie "Vie personnelle"
-- Date: 2025-01-28

-- 1. Vérifier la catégorie "Vie personnelle"
SELECT 
  'CATÉGORIE VIE PERSONNELLE' as section,
  c.id,
  c.name,
  c.description,
  c.color,
  c.created_at
FROM public.categories c
WHERE c.name ILIKE '%vie personnelle%'
ORDER BY c.created_at DESC;

-- 2. Vérifier la configuration de hiérarchie
SELECT 
  'CONFIGURATION HIÉRARCHIE' as section,
  c.name as category_name,
  chc.has_level2,
  chc.created_at
FROM public.category_hierarchy_config chc
JOIN public.categories c ON chc.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%';

-- 3. Vérifier les sous-catégories de niveau 1
SELECT 
  'SOUS-CATÉGORIES NIVEAU 1' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
ORDER BY s.name;

-- 4. Vérifier les sous-catégories de niveau 2
SELECT 
  'SOUS-CATÉGORIES NIVEAU 2' as section,
  sl2.id,
  sl2.name as level2_name,
  sl2.description,
  s.name as level1_name,
  c.name as category_name,
  sl2.created_at
FROM public.subcategories_level2 sl2
JOIN public.subcategories s ON sl2.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
ORDER BY s.name, sl2.name;

-- 5. Statistiques par sous-catégorie
SELECT 
  'STATISTIQUES PAR SOUS-CATÉGORIE' as section,
  s.name as subcategory_name,
  COUNT(sl2.id) as nombre_level2,
  CASE 
    WHEN COUNT(sl2.id) > 0 THEN '✅ A des sous-catégories niveau 2'
    ELSE '❌ Pas de sous-catégories niveau 2'
  END as status
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON s.id = sl2.subcategory_id
WHERE c.name ILIKE '%vie personnelle%'
GROUP BY s.id, s.name
ORDER BY s.name;

-- 6. Vérifier la structure complète
SELECT 
  'STRUCTURE COMPLÈTE' as section,
  c.name as category_name,
  COUNT(DISTINCT s.id) as nombre_sous_categories_niveau1,
  COUNT(DISTINCT sl2.id) as nombre_sous_categories_niveau2,
  chc.has_level2 as configuration_level2
FROM public.categories c
LEFT JOIN public.subcategories s ON c.id = s.category_id
LEFT JOIN public.subcategories_level2 sl2 ON s.id = sl2.subcategory_id
LEFT JOIN public.category_hierarchy_config chc ON c.id = chc.category_id
WHERE c.name ILIKE '%vie personnelle%'
GROUP BY c.id, c.name, chc.has_level2;
