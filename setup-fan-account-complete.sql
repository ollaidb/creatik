-- Script pour configurer la catégorie "Fan account" avec niveau 2
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- VÉRIFICATION DE LA CATÉGORIE FAN ACCOUNT
-- ========================================

-- Vérifier que la catégorie "Fan account" existe
DO $$
DECLARE
    fan_account_category_id UUID;
BEGIN
    SELECT id INTO fan_account_category_id 
    FROM public.categories 
    WHERE LOWER(name) LIKE '%fan account%' 
    LIMIT 1;
    
    IF fan_account_category_id IS NULL THEN
        RAISE EXCEPTION 'La catégorie "Fan account" n''existe pas.';
    END IF;
END $$;

-- Afficher la catégorie Fan account
SELECT 
    '=== CATÉGORIE FAN ACCOUNT ===' as info,
    c.id,
    c.name,
    c.color,
    c.description
FROM public.categories c
WHERE LOWER(c.name) LIKE '%fan account%';

-- ========================================
-- ACTIVATION DU NIVEAU 2
-- ========================================

-- Activer le niveau 2 pour la catégorie Fan account
INSERT INTO public.category_hierarchy_config (category_id, has_level2, created_at, updated_at) 
SELECT 
    id,
    true,
    now(),
    now()
FROM public.categories 
WHERE LOWER(name) LIKE '%fan account%'
ON CONFLICT (category_id) DO UPDATE SET 
    has_level2 = true,
    updated_at = now();

SELECT '✅ Niveau 2 activé pour Fan account' as info;

-- ========================================
-- AJOUT DES SOUS-CATÉGORIES NIVEAU 1
-- ========================================

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Célébrités', 'Comptes de fans de célébrités', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Divertissement', 'Comptes de fans de contenus de divertissement', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Musique', 'Comptes de fans d''artistes musicaux', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Cinéma', 'Comptes de fans de films et acteurs', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Séries TV', 'Comptes de fans de séries télévisées', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Sports', 'Comptes de fans de sportifs et équipes', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Gaming', 'Comptes de fans de jeux vidéo et streamers', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Influenceurs', 'Comptes de fans d''influenceurs', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Livres', 'Comptes de fans d''auteurs et livres', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now()),
    ('Manga/Anime', 'Comptes de fans de mangas et animés', (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE LOWER(name) = LOWER(v.name) 
    AND category_id = v.category_id
);

-- ========================================
-- AJOUT DES SOUS-CATÉGORIES NIVEAU 2
-- ========================================

-- Pour "Célébrités"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Célébrités' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Beyoncé', 'Fan account de Beyoncé'),
    ('Taylor Swift', 'Fan account de Taylor Swift'),
    ('Ariana Grande', 'Fan account d''Ariana Grande'),
    ('Justin Bieber', 'Fan account de Justin Bieber'),
    ('Selena Gomez', 'Fan account de Selena Gomez'),
    ('Drake', 'Fan account de Drake'),
    ('The Weeknd', 'Fan account de The Weeknd'),
    ('Billie Eilish', 'Fan account de Billie Eilish'),
    ('Dua Lipa', 'Fan account de Dua Lipa'),
    ('Ed Sheeran', 'Fan account d''Ed Sheeran'),
    ('Rihanna', 'Fan account de Rihanna'),
    ('Bruno Mars', 'Fan account de Bruno Mars'),
    ('Adele', 'Fan account d''Adele'),
    ('Harry Styles', 'Fan account de Harry Styles'),
    ('Shawn Mendes', 'Fan account de Shawn Mendes')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Célébrités'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Divertissement"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Divertissement' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Netflix', 'Fan account de Netflix'),
    ('Disney+', 'Fan account de Disney+'),
    ('Amazon Prime', 'Fan account d''Amazon Prime'),
    ('HBO', 'Fan account de HBO'),
    ('Disney', 'Fan account de Disney'),
    ('Marvel', 'Fan account de Marvel'),
    ('DC Comics', 'Fan account de DC Comics'),
    ('Star Wars', 'Fan account de Star Wars'),
    ('Harry Potter', 'Fan account de Harry Potter'),
    ('Game of Thrones', 'Fan account de Game of Thrones')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Divertissement'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Musique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Musique' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Pop', 'Fan account de musique Pop'),
    ('Rock', 'Fan account de musique Rock'),
    ('Rap', 'Fan account de Rap'),
    ('Hip-Hop', 'Fan account de Hip-Hop'),
    ('R&B', 'Fan account de R&B'),
    ('Jazz', 'Fan account de Jazz'),
    ('Classique', 'Fan account de musique classique'),
    ('Électronique', 'Fan account de musique électronique'),
    ('Country', 'Fan account de Country'),
    ('Reggae', 'Fan account de Reggae'),
    ('Metal', 'Fan account de Metal'),
    ('Punk', 'Fan account de Punk')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Musique'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Cinéma"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Cinéma' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Marvel Cinematic Universe', 'Fan account du MCU'),
    ('DC Extended Universe', 'Fan account du DCEU'),
    ('Star Wars', 'Fan account de Star Wars'),
    ('Harry Potter', 'Fan account de Harry Potter'),
    ('James Bond', 'Fan account de James Bond'),
    ('Fast & Furious', 'Fan account de Fast & Furious'),
    ('Mission Impossible', 'Fan account de Mission Impossible'),
    ('Pirates des Caraïbes', 'Fan account de Pirates des Caraïbes'),
    ('Transformers', 'Fan account de Transformers'),
    ('Jurassic Park', 'Fan account de Jurassic Park')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Cinéma'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Séries TV"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Séries TV' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Game of Thrones', 'Fan account de Game of Thrones'),
    ('Breaking Bad', 'Fan account de Breaking Bad'),
    ('Stranger Things', 'Fan account de Stranger Things'),
    ('The Crown', 'Fan account de The Crown'),
    ('The Office', 'Fan account de The Office'),
    ('Friends', 'Fan account de Friends'),
    ('The Walking Dead', 'Fan account de The Walking Dead'),
    ('Grey''s Anatomy', 'Fan account de Grey''s Anatomy'),
    ('House of Cards', 'Fan account de House of Cards'),
    ('The Witcher', 'Fan account de The Witcher'),
    ('Squid Game', 'Fan account de Squid Game')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Séries TV'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Sports"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Sports' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Football', 'Fan account de Football'),
    ('Basketball', 'Fan account de Basketball'),
    ('Tennis', 'Fan account de Tennis'),
    ('Football américain', 'Fan account de Football américain'),
    ('Baseball', 'Fan account de Baseball'),
    ('Hockey', 'Fan account de Hockey'),
    ('Golf', 'Fan account de Golf'),
    ('Formule 1', 'Fan account de Formule 1'),
    ('UFC', 'Fan account d''UFC'),
    ('Boxe', 'Fan account de Boxe')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Sports'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Gaming"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Gaming' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Fortnite', 'Fan account de Fortnite'),
    ('Minecraft', 'Fan account de Minecraft'),
    ('Call of Duty', 'Fan account de Call of Duty'),
    ('FIFA', 'Fan account de FIFA'),
    ('GTA', 'Fan account de GTA'),
    ('Among Us', 'Fan account d''Among Us'),
    ('Valorant', 'Fan account de Valorant'),
    ('League of Legends', 'Fan account de League of Legends'),
    ('Apex Legends', 'Fan account d''Apex Legends'),
    ('Pokémon', 'Fan account de Pokémon'),
    ('Zelda', 'Fan account de Zelda'),
    ('Mario', 'Fan account de Mario'),
    ('Sonic', 'Fan account de Sonic')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Gaming'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Influenceurs"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Influenceurs' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Beauté', 'Fan account d''influenceurs beauté'),
    ('Mode', 'Fan account d''influenceurs mode'),
    ('Lifestyle', 'Fan account d''influenceurs lifestyle'),
    ('Tech', 'Fan account d''influenceurs tech'),
    ('Gaming', 'Fan account d''influenceurs gaming'),
    ('Food', 'Fan account d''influenceurs food'),
    ('Travel', 'Fan account d''influenceurs travel'),
    ('Fitness', 'Fan account d''influenceurs fitness'),
    ('Comedy', 'Fan account d''influenceurs comedy'),
    ('Education', 'Fan account d''influenceurs éducation')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Influenceurs'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Livres"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Livres' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Fantasy', 'Fan account de livres Fantasy'),
    ('Science-Fiction', 'Fan account de livres Science-Fiction'),
    ('Romance', 'Fan account de livres Romance'),
    ('Thriller', 'Fan account de livres Thriller'),
    ('Mystère', 'Fan account de livres Mystère'),
    ('Horreur', 'Fan account de livres Horreur'),
    ('Biographie', 'Fan account de biographies'),
    ('Histoire', 'Fan account de livres d''histoire'),
    ('Philosophie', 'Fan account de livres de philosophie'),
    ('Poésie', 'Fan account de poésie')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Livres'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- Pour "Manga/Anime"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at)
SELECT 
    name,
    description,
    (SELECT id FROM public.subcategories WHERE name = 'Manga/Anime' AND category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1) LIMIT 1),
    now(),
    now()
FROM (VALUES
    ('Naruto', 'Fan account de Naruto'),
    ('One Piece', 'Fan account de One Piece'),
    ('Dragon Ball', 'Fan account de Dragon Ball'),
    ('Attack on Titan', 'Fan account d''Attack on Titan'),
    ('Demon Slayer', 'Fan account de Demon Slayer'),
    ('My Hero Academia', 'Fan account de My Hero Academia'),
    ('Death Note', 'Fan account de Death Note'),
    ('Fullmetal Alchemist', 'Fan account de Fullmetal Alchemist'),
    ('Tokyo Ghoul', 'Fan account de Tokyo Ghoul'),
    ('Jujutsu Kaisen', 'Fan account de Jujutsu Kaisen')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories_level2 sl2
    JOIN public.subcategories s ON sl2.subcategory_id = s.id
    WHERE LOWER(sl2.name) = LOWER(v.name)
    AND s.name = 'Manga/Anime'
    AND s.category_id = (SELECT id FROM public.categories WHERE LOWER(name) LIKE '%fan account%' LIMIT 1)
);

-- ========================================
-- VÉRIFICATION APRÈS AJOUT
-- ========================================

-- Afficher toutes les sous-catégories niveau 1
SELECT 
    '=== SOUS-CATÉGORIES NIVEAU 1 ===' as info,
    s.id,
    s.name as subcategory_name,
    s.description,
    COUNT(sl2.id) as level2_count
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) LIKE '%fan account%'
GROUP BY s.id, s.name, s.description
ORDER BY s.name;

-- Afficher un résumé des sous-catégories niveau 2
SELECT 
    '=== SOUS-CATÉGORIES NIVEAU 2 (échantillon) ===' as info,
    s.name as level1_name,
    sl2.name as level2_name,
    sl2.description
FROM public.subcategories_level2 sl2
JOIN public.subcategories s ON sl2.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE LOWER(c.name) LIKE '%fan account%'
ORDER BY s.name, sl2.name
LIMIT 20;

-- ========================================
-- RÉSUMÉ FINAL
-- ========================================

SELECT 
    '=== RÉSUMÉ ===' as info,
    COUNT(DISTINCT s.id) as total_level1_subcategories,
    COUNT(sl2.id) as total_level2_subcategories
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) LIKE '%fan account%';

