-- Script pour ajouter la catégorie : Événement
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- AJOUT DE LA CATÉGORIE ÉVÉNEMENT
-- ========================================

-- Événement : Événements, actualités événementielles et occasions spéciales
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Événement',
    'purple',
    'Événements, actualités événementielles et occasions spéciales',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tendances' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'événement' OR LOWER(name) = 'evenement');

-- ========================================
-- VÉRIFICATION
-- ========================================

-- Afficher la catégorie ajoutée
SELECT 
    c.id,
    c.name,
    c.color,
    c.description,
    t.name as theme_name,
    c.created_at
FROM categories c
LEFT JOIN themes t ON c.theme_id = t.id
WHERE LOWER(c.name) IN ('événement', 'evenement')
ORDER BY c.name;

-- Vérifier si la catégorie existe maintenant
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) IN ('événement', 'evenement')) 
        THEN '✅ Événement ajouté' 
        ELSE '❌ Événement manquant' 
    END as event_status;

