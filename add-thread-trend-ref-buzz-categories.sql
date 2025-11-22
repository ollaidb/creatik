-- Script pour ajouter les nouvelles catégories : Thread, Trend, Ref, Buzz
-- Date: 2025-01-28

-- ========================================
-- AJOUT DES NOUVELLES CATÉGORIES
-- ========================================

-- Thread : Contenu en thread sur Twitter/X
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Thread',
    'blue',
    'Contenu en thread sur Twitter/X, publications multiples liées',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Médias' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = 'thread'
);

-- Trend : Tendances actuelles
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Trend',
    'orange',
    'Tendances actuelles et sujets populaires du moment',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Tendances' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = 'trend'
);

-- Ref : Références et sources d'inspiration
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Ref',
    'green',
    'Références, sources d''inspiration et contenus de référence',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Éduquer' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Inspirer' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = 'ref'
);

-- Buzz : Actualités et buzz médiatique
INSERT INTO categories (name, color, description, theme_id)
SELECT 
    'Buzz',
    'red',
    'Actualités, buzz médiatique et sujets qui font le buzz',
    COALESCE(
        (SELECT id FROM themes WHERE name = 'Tendances' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Divertir' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Engager' LIMIT 1),
        (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
    )
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = 'buzz'
);

-- ========================================
-- VÉRIFICATION DES CATÉGORIES AJOUTÉES
-- ========================================

-- Afficher les catégories ajoutées
SELECT 
    c.id,
    c.name,
    c.color,
    c.description,
    t.name as theme_name,
    c.created_at
FROM categories c
LEFT JOIN themes t ON c.theme_id = t.id
WHERE LOWER(c.name) IN ('thread', 'trend', 'ref', 'buzz')
ORDER BY c.name;

-- Afficher le nombre total de catégories
SELECT COUNT(*) as total_categories FROM categories;

-- Vérifier si les catégories existent maintenant
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'thread') 
        THEN '✅ Thread ajouté' 
        ELSE '❌ Thread manquant' 
    END as thread_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'trend') 
        THEN '✅ Trend ajouté' 
        ELSE '❌ Trend manquant' 
    END as trend_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'ref') 
        THEN '✅ Ref ajouté' 
        ELSE '❌ Ref manquant' 
    END as ref_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'buzz') 
        THEN '✅ Buzz ajouté' 
        ELSE '❌ Buzz manquant' 
    END as buzz_status;

