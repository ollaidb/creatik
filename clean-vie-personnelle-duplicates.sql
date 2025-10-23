-- Script pour nettoyer les doublons dans la catégorie "Vie personnelle"
-- Date: 2025-01-28

-- 1. Vérifier d'abord les doublons existants
SELECT 
  'DOUBLONS SOUS-CATÉGORIES NIVEAU 1' as section,
  s.name,
  COUNT(*) as count
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
GROUP BY s.name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. Vérifier les doublons dans les sous-catégories de niveau 2
SELECT 
  'DOUBLONS SOUS-CATÉGORIES NIVEAU 2' as section,
  sl2.name,
  s.name as parent_name,
  COUNT(*) as count
FROM public.subcategories_level2 sl2
JOIN public.subcategories s ON sl2.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
GROUP BY sl2.name, s.name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 3. Supprimer les doublons dans les sous-catégories de niveau 2
-- Garder seulement le premier enregistrement de chaque doublon
DELETE FROM public.subcategories_level2 
WHERE id IN (
  SELECT sl2_id FROM (
    SELECT sl2.id as sl2_id, 
           ROW_NUMBER() OVER (PARTITION BY sl2.subcategory_id, sl2.name ORDER BY sl2.created_at) as rn
    FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    JOIN public.categories c ON s.category_id = c.id
    WHERE c.name ILIKE '%vie personnelle%'
  ) t
  WHERE rn > 1
);

-- 4. Supprimer les doublons dans les sous-catégories de niveau 1
-- Garder seulement le premier enregistrement de chaque doublon
DELETE FROM public.subcategories 
WHERE id IN (
  SELECT s_id FROM (
    SELECT s.id as s_id, 
           ROW_NUMBER() OVER (PARTITION BY s.category_id, s.name ORDER BY s.created_at) as rn
    FROM public.subcategories s
    JOIN public.categories c ON s.category_id = c.id
    WHERE c.name ILIKE '%vie personnelle%'
  ) t
  WHERE rn > 1
);

-- 5. Vérifier le résultat après nettoyage
SELECT 
  'RÉSULTAT APRÈS NETTOYAGE - SOUS-CATÉGORIES NIVEAU 1' as section,
  s.id,
  s.name,
  s.description,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
ORDER BY s.name;

-- 6. Vérifier le résultat après nettoyage pour le niveau 2
SELECT 
  'RÉSULTAT APRÈS NETTOYAGE - SOUS-CATÉGORIES NIVEAU 2' as section,
  sl2.id,
  sl2.name,
  s.name as parent_name,
  sl2.created_at
FROM public.subcategories_level2 sl2
JOIN public.subcategories s ON sl2.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%vie personnelle%'
ORDER BY s.name, sl2.name;
