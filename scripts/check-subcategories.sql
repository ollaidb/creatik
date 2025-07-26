-- Script pour vérifier les sous-catégories existantes
-- Exécutez ce script dans votre base de données Supabase

-- Lister toutes les sous-catégories existantes
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name
FROM subcategories s
JOIN categories c ON s.category_id = c.id
ORDER BY c.name, s.name;

-- Compter le nombre de sous-catégories par catégorie
SELECT 
  c.name as category_name,
  COUNT(s.id) as subcategory_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
GROUP BY c.id, c.name
ORDER BY c.name; 