-- Script pour générer automatiquement des titres pour toutes les sous-catégories
-- Exécutez ce script dans Supabase SQL Editor pour avoir des titres prêts à l'affichage

-- ========================================
-- 1. GÉNÉRER DES TITRES POUR TOUTES LES SOUS-CATÉGORIES
-- ========================================

SELECT '=== GÉNÉRATION AUTOMATIQUE DE TITRES ===' as section;

-- Fonction pour générer des titres pour toutes les sous-catégories
CREATE OR REPLACE FUNCTION generate_titles_for_all_subcategories(
    p_titles_per_platform INTEGER DEFAULT 15
) RETURNS TABLE (
    subcategory_name TEXT,
    platform VARCHAR(50),
    titles_generated INTEGER
) AS $$
DECLARE
    v_subcategory RECORD;
    v_platform VARCHAR(50);
    v_platforms VARCHAR(50)[] := ARRAY['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch'];
    v_titles_generated INTEGER;
BEGIN
    -- Parcourir toutes les sous-catégories
    FOR v_subcategory IN 
        SELECT s.id, s.name, c.name as category_name
        FROM subcategories s
        JOIN categories c ON s.category_id = c.id
        ORDER BY c.name, s.name
    LOOP
        -- Générer des titres pour chaque plateforme
        FOREACH v_platform IN ARRAY v_platforms LOOP
            -- Vérifier qu'on a des mots pour cette plateforme
            IF EXISTS (
                SELECT 1 FROM word_blocks 
                WHERE platform = v_platform 
                AND subcategory_id = v_subcategory.id
            ) THEN
                -- Générer les titres
                SELECT generate_and_save_titles(v_platform, v_subcategory.id, p_titles_per_platform) 
                INTO v_titles_generated;
                
                subcategory_name := v_subcategory.name;
                platform := v_platform;
                titles_generated := v_titles_generated;
                RETURN NEXT;
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 2. GÉNÉRER DES TITRES POUR TOUTES LES SOUS-CATÉGORIES
-- ========================================

-- Générer 15 titres par plateforme pour toutes les sous-catégories
SELECT * FROM generate_titles_for_all_subcategories(15);

-- ========================================
-- 3. GÉNÉRER DES TITRES SPÉCIFIQUES POUR LES SOUS-CATÉGORIES POPULAIRES
-- ========================================

SELECT '=== GÉNÉRATION POUR SOUS-CATÉGORIES POPULAIRES ===' as section;

-- Analyser les sous-catégories existantes
SELECT 
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(wb.id) as words_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN word_blocks wb ON s.id = wb.subcategory_id
GROUP BY s.id, s.name, c.name
ORDER BY c.name, s.name;

-- Générer des titres pour les sous-catégories principales
-- TikTok
SELECT generate_and_save_titles('tiktok', s.id, 20) as titres_tiktok
FROM subcategories s 
WHERE s.name IN ('Analyses politiques', 'Breaking news', 'Life hacks')
LIMIT 3;

-- Instagram
SELECT generate_and_save_titles('instagram', s.id, 20) as titres_instagram
FROM subcategories s 
WHERE s.name IN ('Fashion tips', 'Makeup tutorials', 'Histoires personnelles', 'Manifestations')
LIMIT 4;

-- YouTube
SELECT generate_and_save_titles('youtube', s.id, 20) as titres_youtube
FROM subcategories s 
WHERE s.name IN ('Cuisine du monde', 'Recettes rapides')
LIMIT 2;

-- LinkedIn
SELECT generate_and_save_titles('linkedin', s.id, 20) as titres_linkedin
FROM subcategories s 
WHERE s.name IN ('Analyses de marche', 'Confiance en soi')
LIMIT 2;

-- ========================================
-- 4. VÉRIFIER LES TITRES GÉNÉRÉS
-- ========================================

SELECT '=== VÉRIFICATION DES TITRES GÉNÉRÉS ===' as section;

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
  c.name as categorie,
  COUNT(*) as total_titres,
  COUNT(DISTINCT gt.platform) as plateformes
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
GROUP BY s.id, s.name, c.name
ORDER BY c.name, s.name;

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

-- ========================================
-- 5. STATISTIQUES FINALES
-- ========================================

SELECT '=== STATISTIQUES FINALES ===' as section;

SELECT 
  'Résumé de la génération automatique:' as info,
  COUNT(*) as total_titres_generes,
  COUNT(DISTINCT platform) as plateformes_couvertes,
  COUNT(DISTINCT subcategory_id) as sous_categories_couvertes,
  MIN(generation_date) as premiere_generation,
  MAX(generation_date) as derniere_generation
FROM generated_titles;

-- Répartition par plateforme et sous-catégorie
SELECT 
  gt.platform,
  s.name as sous_categorie,
  COUNT(*) as nombre_titres
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
GROUP BY gt.platform, s.name
ORDER BY gt.platform, s.name;

-- ========================================
-- 6. VÉRIFIER QU'IL Y A ASSEZ DE TITRES
-- ========================================

SELECT '=== VÉRIFICATION DE LA COUVERTURE ===' as section;

-- Vérifier les sous-catégories avec peu de titres
SELECT 
  s.name as sous_categorie,
  c.name as categorie,
  COUNT(gt.id) as titres_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN generated_titles gt ON s.id = gt.subcategory_id
GROUP BY s.id, s.name, c.name
HAVING COUNT(gt.id) < 50
ORDER BY titres_count ASC;

-- ========================================
-- 7. GÉNÉRER PLUS DE TITRES SI NÉCESSAIRE
-- ========================================

SELECT '=== GÉNÉRATION COMPLÉMENTAIRE ===' as section;

-- Générer plus de titres pour les sous-catégories populaires
-- TikTok - Analyses politiques
SELECT generate_and_save_titles('tiktok', s.id, 10) as titres_supplementaires
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

-- Instagram - Fashion tips
SELECT generate_and_save_titles('instagram', s.id, 10) as titres_supplementaires
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- LinkedIn - Analyses de marché
SELECT generate_and_save_titles('linkedin', s.id, 10) as titres_supplementaires
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- YouTube - Cuisine du monde
SELECT generate_and_save_titles('youtube', s.id, 10) as titres_supplementaires
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- ========================================
-- 8. RÉSUMÉ FINAL
-- ========================================

SELECT '=== RÉSUMÉ FINAL ===' as section;

-- Total final
SELECT 
  'Titres générés automatiquement:' as info,
  COUNT(*) as total_titres,
  COUNT(DISTINCT platform) as plateformes,
  COUNT(DISTINCT subcategory_id) as sous_categories
FROM generated_titles;

-- Top 10 des titres les plus récents
SELECT 
  'Top 10 des titres les plus récents:' as info,
  gt.title,
  gt.platform,
  s.name as sous_categorie
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
ORDER BY gt.generation_date DESC
LIMIT 10; 