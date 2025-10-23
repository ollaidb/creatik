-- Migration pour nettoyer les doublons
-- Date: 2025-07-23

-- 1. Supprimer les doublons dans les sous-catégories
-- Garder seulement la première occurrence de chaque nom de sous-catégorie par catégorie
DELETE FROM public.subcategories 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY name, category_id 
             ORDER BY created_at
           ) as rn
    FROM public.subcategories
  ) t
  WHERE t.rn > 1
);

-- 2. Supprimer les doublons dans les titres de contenu
-- Garder seulement la première occurrence de chaque titre par sous-catégorie
DELETE FROM public.content_titles 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY title, subcategory_id 
             ORDER BY created_at
           ) as rn
    FROM public.content_titles
  ) t
  WHERE t.rn > 1
);

-- 3. Vérifier le résultat
-- Compter le nombre de sous-catégories par catégorie
SELECT 
  c.name as category_name,
  COUNT(s.id) as subcategory_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
GROUP BY c.id, c.name
HAVING COUNT(s.id) > 0
ORDER BY subcategory_count DESC; 