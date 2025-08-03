-- Script pour générer et sauvegarder des titres pour toutes les plateformes
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. GÉNÉRER DES TITRES POUR TOUTES LES SOUS-CATÉGORIES
-- ========================================

-- Fonction pour générer des titres pour une sous-catégorie sur toutes les plateformes
CREATE OR REPLACE FUNCTION generate_titles_for_subcategory(
    p_subcategory_name TEXT,
    p_titles_per_platform INTEGER DEFAULT 20
) RETURNS TABLE (
    platform VARCHAR(50),
    subcategory_name TEXT,
    titles_generated INTEGER
) AS $$
DECLARE
    v_subcategory_id UUID;
    v_platform VARCHAR(50);
    v_titles_generated INTEGER;
    v_platforms VARCHAR(50)[] := ARRAY['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch'];
BEGIN
    -- Récupérer l'ID de la sous-catégorie
    SELECT id INTO v_subcategory_id
    FROM subcategories
    WHERE name = p_subcategory_name
    LIMIT 1;
    
    IF v_subcategory_id IS NULL THEN
        RAISE EXCEPTION 'Sous-catégorie "%" non trouvée', p_subcategory_name;
    END IF;
    
    -- Générer des titres pour chaque plateforme
    FOREACH v_platform IN ARRAY v_platforms LOOP
        -- Vérifier qu'on a des mots pour cette plateforme
        IF EXISTS (
            SELECT 1 FROM word_blocks 
            WHERE platform = v_platform 
            AND subcategory_id = v_subcategory_id
        ) THEN
            -- Générer les titres
            SELECT generate_and_save_titles(v_platform, v_subcategory_id, p_titles_per_platform) 
            INTO v_titles_generated;
            
            platform := v_platform;
            subcategory_name := p_subcategory_name;
            titles_generated := v_titles_generated;
            RETURN NEXT;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 2. GÉNÉRER DES TITRES POUR LES SOUS-CATÉGORIES PRINCIPALES
-- ========================================

-- Générer des titres pour "Analyses politiques" (TikTok)
SELECT generate_and_save_titles('tiktok', s.id, 25) as titres_generes_tiktok
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

-- Générer des titres pour "Breaking news" (TikTok)
SELECT generate_and_save_titles('tiktok', s.id, 25) as titres_generes_tiktok
FROM subcategories s 
WHERE s.name = 'Breaking news'
LIMIT 1;

-- Générer des titres pour "Manifestations" (Instagram)
SELECT generate_and_save_titles('instagram', s.id, 25) as titres_generes_instagram
FROM subcategories s 
WHERE s.name = 'Manifestations'
LIMIT 1;

-- Générer des titres pour "Analyses de marché" (LinkedIn)
SELECT generate_and_save_titles('linkedin', s.id, 25) as titres_generes_linkedin
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- Générer des titres pour "Fashion tips" (Instagram)
SELECT generate_and_save_titles('instagram', s.id, 25) as titres_generes_instagram
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- Générer des titres pour "Cuisine du monde" (YouTube)
SELECT generate_and_save_titles('youtube', s.id, 25) as titres_generes_youtube
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- Générer des titres pour "Confiance en soi" (LinkedIn)
SELECT generate_and_save_titles('linkedin', s.id, 25) as titres_generes_linkedin
FROM subcategories s 
WHERE s.name = 'Confiance en soi'
LIMIT 1;

-- Générer des titres pour "Histoires personnelles" (Instagram)
SELECT generate_and_save_titles('instagram', s.id, 25) as titres_generes_instagram
FROM subcategories s 
WHERE s.name = 'Histoires personnelles'
LIMIT 1;

-- Générer des titres pour "Life hacks" (TikTok)
SELECT generate_and_save_titles('tiktok', s.id, 25) as titres_generes_tiktok
FROM subcategories s 
WHERE s.name = 'Life hacks'
LIMIT 1;

-- Générer des titres pour "Makeup tutorials" (Instagram)
SELECT generate_and_save_titles('instagram', s.id, 25) as titres_generes_instagram
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Générer des titres pour "Recettes rapides" (YouTube)
SELECT generate_and_save_titles('youtube', s.id, 25) as titres_generes_youtube
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- ========================================
-- 3. GÉNÉRER DES TITRES POUR TOUTES LES PLATEFORMES
-- ========================================

-- Générer des titres pour toutes les plateformes pour chaque sous-catégorie
SELECT * FROM generate_titles_for_subcategory('Analyses politiques', 15);
SELECT * FROM generate_titles_for_subcategory('Breaking news', 15);
SELECT * FROM generate_titles_for_subcategory('Manifestations', 15);
SELECT * FROM generate_titles_for_subcategory('Analyses de marche', 15);
SELECT * FROM generate_titles_for_subcategory('Fashion tips', 15);
SELECT * FROM generate_titles_for_subcategory('Cuisine du monde', 15);
SELECT * FROM generate_titles_for_subcategory('Confiance en soi', 15);
SELECT * FROM generate_titles_for_subcategory('Histoires personnelles', 15);
SELECT * FROM generate_titles_for_subcategory('Life hacks', 15);
SELECT * FROM generate_titles_for_subcategory('Makeup tutorials', 15);
SELECT * FROM generate_titles_for_subcategory('Recettes rapides', 15);

-- ========================================
-- 4. VÉRIFICATION DES TITRES GÉNÉRÉS
-- ========================================

-- Compter le total de titres générés par plateforme
SELECT 
  platform,
  COUNT(*) as total_titres,
  COUNT(DISTINCT subcategory_id) as sous_categories
FROM generated_titles
GROUP BY platform
ORDER BY platform;

-- Compter le total de titres générés par sous-catégorie
SELECT 
  s.name as sous_categorie,
  COUNT(*) as total_titres,
  COUNT(DISTINCT gt.platform) as plateformes
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
GROUP BY s.name
ORDER BY s.name;

-- Voir quelques exemples de titres générés
SELECT 
  gt.title,
  gt.platform,
  s.name as sous_categorie,
  gt.generation_date
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
ORDER BY gt.generation_date DESC
LIMIT 20;

-- Vérifier la répartition par plateforme et sous-catégorie
SELECT 
  gt.platform,
  s.name as sous_categorie,
  COUNT(*) as nombre_titres
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
GROUP BY gt.platform, s.name
ORDER BY gt.platform, s.name;

-- ========================================
-- 5. STATISTIQUES FINALES
-- ========================================

SELECT 
  'Résumé de la génération de titres:' as info,
  COUNT(*) as total_titres_generes,
  COUNT(DISTINCT platform) as plateformes_couvertes,
  COUNT(DISTINCT subcategory_id) as sous_categories_couvertes,
  MIN(generation_date) as premiere_generation,
  MAX(generation_date) as derniere_generation
FROM generated_titles; 