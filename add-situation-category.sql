-- Script pour ajouter la catégorie : Situation
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- AJOUT DE LA CATÉGORIE SITUATION
-- ========================================

-- Situation : Idées de contenu selon la situation et le lieu (resto, travail, transports, etc.)
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Situation',
    'indigo',
    'Idées de contenu selon la situation et le lieu (resto, travail, transports, etc.)',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'situation');

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
WHERE LOWER(c.name) = 'situation';

-- Vérifier si la catégorie existe maintenant
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'situation') 
        THEN '✅ Situation ajouté' 
        ELSE '❌ Situation manquant' 
    END as situation_status;

