-- Script de debug pour vérifier la configuration d'Activisme
-- Date: 2025-01-28

-- 1. Vérifier la catégorie Activisme
SELECT 
  'CATÉGORIE ACTIVISME' as section,
  c.id,
  c.name,
  c.description,
  c.color,
  c.created_at
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ORDER BY c.created_at DESC;

-- 2. Vérifier la configuration de hiérarchie de la catégorie
SELECT 
  'CONFIGURATION CATÉGORIE' as section,
  c.name as category_name,
  chc.has_level2,
  chc.created_at
FROM public.category_hierarchy_config chc
JOIN public.categories c ON chc.category_id = c.id
WHERE c.name ILIKE '%activisme%';

-- 3. Vérifier les sous-catégories d'Activisme
SELECT 
  'SOUS-CATÉGORIES ACTIVISME' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name;

-- 4. Vérifier la configuration des sous-catégories
SELECT 
  'CONFIGURATION SOUS-CATÉGORIES' as section,
  s.name as subcategory_name,
  shc.has_level2,
  shc.created_at
FROM public.subcategory_hierarchy_config shc
JOIN public.subcategories s ON shc.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name;

-- 5. Vérifier les sous-catégories de niveau 2 existantes
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
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name, sl2.name;
