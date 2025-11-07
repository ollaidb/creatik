-- Script pour ajouter la catégorie : Contexte / Lieux / Situations
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- OPTIONS DE NOMS POUR LA CATÉGORIE
-- ========================================
-- Choisissez l'une de ces options :
-- 1. "Contexte" - Simple et clair
-- 2. "Lieux" - Direct pour les lieux géographiques
-- 3. "Situations" - Plus large, inclut contexte + lieu
-- 4. "Contexte & Lieux" - Explicite mais plus long
-- 5. "Environnement" - Professionnel

-- ========================================
-- AJOUT DE LA CATÉGORIE (OPTION 1 : CONTEXTE)
-- ========================================

-- Contexte : Idées de contenu selon le lieu et la situation
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Contexte',
    'indigo',
    'Idées de contenu selon le lieu et la situation (resto, travail, transports, etc.)',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'contexte');

-- ========================================
-- ALTERNATIVE : Si vous préférez "Lieux"
-- ========================================

-- Décommentez cette section si vous préférez le nom "Lieux"
/*
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Lieux',
    'indigo',
    'Idées de contenu selon le lieu (resto, travail, transports, etc.)',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'lieux');
*/

-- ========================================
-- ALTERNATIVE : Si vous préférez "Situations"
-- ========================================

-- Décommentez cette section si vous préférez le nom "Situations"
/*
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Situations',
    'indigo',
    'Idées de contenu selon la situation et le lieu (resto, travail, transports, etc.)',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'situations');
*/

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
WHERE LOWER(c.name) IN ('contexte', 'lieux', 'situations')
ORDER BY c.name;

