-- Script pour ajouter des sous-catégories à la catégorie "Cosplay"
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- VÉRIFICATION DE LA CATÉGORIE COSPLAY
-- ========================================

-- Vérifier que la catégorie "Cosplay" existe, sinon la créer
DO $$
DECLARE
    cosplay_category_id UUID;
BEGIN
    SELECT id INTO cosplay_category_id 
    FROM public.categories 
    WHERE LOWER(name) = 'cosplay' 
    LIMIT 1;
    
    IF cosplay_category_id IS NULL THEN
        -- Créer la catégorie Cosplay si elle n'existe pas
        INSERT INTO public.categories (name, color, description, theme_id)
        SELECT 
            'Cosplay',
            'purple',
            'Contenu sur le cosplay et les déguisements de personnages',
            COALESCE(
                (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1),
                (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
                (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
            )
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = 'cosplay');
    END IF;
END $$;

-- Afficher la catégorie Cosplay
SELECT 
    '=== CATÉGORIE COSPLAY ===' as info,
    c.id,
    c.name,
    c.color,
    c.description
FROM public.categories c
WHERE LOWER(c.name) = 'cosplay';

-- Afficher les sous-catégories existantes pour Cosplay
SELECT 
    '=== SOUS-CATÉGORIES EXISTANTES ===' as info,
    s.id,
    s.name as subcategory_name,
    s.description,
    s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE LOWER(c.name) = 'cosplay'
ORDER BY s.name;

-- ========================================
-- AJOUT DES SOUS-CATÉGORIES NIVEAU 1
-- ========================================
-- Liste complète des sous-catégories pour la catégorie "Cosplay"

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    -- Par type de média
    ('Manga', 'Cosplay de personnages de mangas', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Anime', 'Cosplay de personnages d''animés', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Jeux vidéo', 'Cosplay de personnages de jeux vidéo', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Films', 'Cosplay de personnages de films', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Séries TV', 'Cosplay de personnages de séries télévisées', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Comics', 'Cosplay de personnages de comics', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('BD', 'Cosplay de personnages de bandes dessinées', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Livres', 'Cosplay de personnages de livres et romans', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Webtoon', 'Cosplay de personnages de webtoons', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Manhwa', 'Cosplay de personnages de manhwas coréens', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    
    -- Par franchise/univers populaire
    ('Marvel', 'Cosplay de personnages Marvel', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('DC Comics', 'Cosplay de personnages DC Comics', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Star Wars', 'Cosplay de personnages de Star Wars', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Disney', 'Cosplay de personnages Disney', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Harry Potter', 'Cosplay de personnages de Harry Potter', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Final Fantasy', 'Cosplay de personnages de Final Fantasy', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Zelda', 'Cosplay de personnages de The Legend of Zelda', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Pokémon', 'Cosplay de personnages de Pokémon', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    
    -- Par genre/univers
    ('Fantasy', 'Cosplay dans l''univers fantasy', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Sci-Fi', 'Cosplay dans l''univers science-fiction', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Horreur', 'Cosplay de personnages d''horreur', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Super-héros', 'Cosplay de super-héros', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Super-vilains', 'Cosplay de super-vilains', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Steampunk', 'Cosplay style steampunk', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Cyberpunk', 'Cosplay style cyberpunk', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Médiéval', 'Cosplay style médiéval', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Historique', 'Cosplay de personnages historiques', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now()),
    ('Mythologie', 'Cosplay de personnages mythologiques', (SELECT id FROM public.categories WHERE name = 'Cosplay' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE LOWER(name) = LOWER(v.name) 
    AND category_id = v.category_id
);

-- ========================================
-- VÉRIFICATION APRÈS AJOUT
-- ========================================

-- Afficher toutes les sous-catégories de Cosplay après insertion
SELECT 
    '=== SOUS-CATÉGORIES APRÈS AJOUT ===' as info,
    s.id,
    s.name as subcategory_name,
    s.description,
    s.created_at,
    COUNT(sl2.id) as level2_count
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) = 'cosplay'
GROUP BY s.id, s.name, s.description, s.created_at
ORDER BY s.name;

-- ========================================
-- RÉSUMÉ FINAL
-- ========================================

SELECT 
    '=== RÉSUMÉ ===' as info,
    COUNT(s.id) as total_subcategories,
    COUNT(sl2.id) as total_level2_subcategories
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) = 'cosplay';

