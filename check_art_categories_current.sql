-- Script pour vérifier l'état actuel des catégories Art
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la catégorie Art
SELECT 
    id,
    name,
    color,
    description,
    theme_id,
    created_at
FROM categories 
WHERE name = 'Art' OR name LIKE '%Art%' OR name LIKE '%Créativité%'
ORDER BY name;

-- 2. Vérifier les sous-catégories de la catégorie Art
SELECT 
    s.id,
    s.name,
    s.description,
    s.category_id,
    c.name as category_name,
    s.created_at
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Art' OR c.name LIKE '%Art%' OR c.name LIKE '%Créativité%'
ORDER BY s.name;

-- 3. Compter le nombre de sous-catégories par catégorie
SELECT 
    c.name as category_name,
    COUNT(s.id) as subcategory_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
WHERE c.name = 'Art' OR c.name LIKE '%Art%' OR c.name LIKE '%Créativité%'
GROUP BY c.id, c.name
ORDER BY subcategory_count DESC;

-- 4. Vérifier les sous-catégories niveau 2 pour Art
SELECT 
    s2.id,
    s2.name,
    s2.description,
    s.name as parent_subcategory,
    c.name as category_name
FROM subcategories_level2 s2
JOIN subcategories s ON s2.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Art' OR c.name LIKE '%Art%' OR c.name LIKE '%Créativité%'
ORDER BY s.name, s2.name;

-- 5. Vérifier la configuration de hiérarchie pour Art
SELECT 
    c.name as category_name,
    chc.has_level2,
    chc.created_at
FROM category_hierarchy_config chc
JOIN categories c ON chc.category_id = c.id
WHERE c.name = 'Art' OR c.name LIKE '%Art%' OR c.name LIKE '%Créativité%';
