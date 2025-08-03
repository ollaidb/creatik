-- Script pour ajouter des titres TikTok spécifiques pour "Analyses politiques"
-- Exécutez ce script dans votre base de données Supabase

-- 1. Vérifier que la sous-catégorie existe
SELECT 'Vérification de la sous-catégorie:' as info;
SELECT id, name, category_id 
FROM subcategories 
WHERE name = 'Analyses politiques';

-- 2. Ajouter des titres TikTok spécifiques pour "Analyses politiques"
INSERT INTO content_titles (title, subcategory_id, platform, created_at) 
SELECT 
  '🎵 TikTok : Décryptage politique en 60 secondes #Politique', 
  id, 
  'tiktok', 
  NOW()
FROM subcategories 
WHERE name = 'Analyses politiques';

INSERT INTO content_titles (title, subcategory_id, platform, created_at) 
SELECT 
  '🔥 TikTok : Les tendances politiques qui font le buzz #Actualités', 
  id, 
  'tiktok', 
  NOW()
FROM subcategories 
WHERE name = 'Analyses politiques';

-- 3. Vérifier que les titres ont été ajoutés
SELECT 'Titres TikTok ajoutés pour Analyses politiques:' as info;
SELECT 
  ct.title,
  ct.platform,
  ct.created_at,
  s.name as subcategory_name,
  c.name as category_name
FROM content_titles ct
JOIN subcategories s ON ct.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
WHERE s.name = 'Analyses politiques' 
  AND ct.platform = 'tiktok'
ORDER BY ct.created_at DESC;

-- 4. Afficher le total des titres par plateforme pour cette sous-catégorie
SELECT 'Résumé des titres par plateforme:' as info;
SELECT 
  ct.platform,
  COUNT(*) as total_titles
FROM content_titles ct
JOIN subcategories s ON ct.subcategory_id = s.id
WHERE s.name = 'Analyses politiques'
GROUP BY ct.platform
ORDER BY ct.platform; 