-- Script pour vérifier les sous-catégories et ajouter les mots manquants
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. VÉRIFIER LES SOUS-CATÉGORIES EXISTANTES
-- ========================================

SELECT '=== SOUS-CATÉGORIES EXISTANTES ===' as section;

-- Lister toutes les sous-catégories avec leurs catégories
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(wb.id) as words_count,
  COUNT(gt.id) as generated_titles_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN word_blocks wb ON s.id = wb.subcategory_id
LEFT JOIN generated_titles gt ON s.id = gt.subcategory_id
GROUP BY s.id, s.name, c.name
ORDER BY c.name, s.name;

-- ========================================
-- 2. VÉRIFIER LES MOTS EXISTANTS PAR PLATEFORME
-- ========================================

SELECT '=== MOTS EXISTANTS PAR PLATEFORME ===' as section;

SELECT 
  platform,
  COUNT(*) as total_blocks,
  COUNT(DISTINCT subcategory_id) as subcategories_count,
  COUNT(DISTINCT category) as categories_count
FROM word_blocks
GROUP BY platform
ORDER BY platform;

-- ========================================
-- 3. AJOUTER DES MOTS POUR TOUTES LES SOUS-CATÉGORIES
-- ========================================

SELECT '=== AJOUT DE MOTS POUR TOUTES LES SOUS-CATÉGORIES ===' as section;

-- Fonction pour ajouter des mots pour une sous-catégorie sur toutes les plateformes
CREATE OR REPLACE FUNCTION add_words_for_subcategory(
    p_subcategory_name TEXT,
    p_subject_words TEXT[],
    p_verb_words TEXT[],
    p_complement_words TEXT[],
    p_twist_words TEXT[]
) RETURNS TABLE (
    platform VARCHAR(50),
    subcategory_name TEXT,
    words_added INTEGER
) AS $$
DECLARE
    v_subcategory_id UUID;
    v_platform VARCHAR(50);
    v_platforms VARCHAR(50)[] := ARRAY['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch'];
    v_words_added INTEGER;
BEGIN
    -- Récupérer l'ID de la sous-catégorie
    SELECT id INTO v_subcategory_id
    FROM subcategories
    WHERE name = p_subcategory_name
    LIMIT 1;
    
    IF v_subcategory_id IS NULL THEN
        RAISE EXCEPTION 'Sous-catégorie "%" non trouvée', p_subcategory_name;
    END IF;
    
    -- Ajouter des mots pour chaque plateforme
    FOREACH v_platform IN ARRAY v_platforms LOOP
        v_words_added := 0;
        
        -- Ajouter les sujets
        INSERT INTO word_blocks (platform, subcategory_id, category, words)
        VALUES (v_platform, v_subcategory_id, 'subject', p_subject_words)
        ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
        
        IF FOUND THEN v_words_added := v_words_added + 1; END IF;
        
        -- Ajouter les verbes
        INSERT INTO word_blocks (platform, subcategory_id, category, words)
        VALUES (v_platform, v_subcategory_id, 'verb', p_verb_words)
        ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
        
        IF FOUND THEN v_words_added := v_words_added + 1; END IF;
        
        -- Ajouter les compléments
        INSERT INTO word_blocks (platform, subcategory_id, category, words)
        VALUES (v_platform, v_subcategory_id, 'complement', p_complement_words)
        ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
        
        IF FOUND THEN v_words_added := v_words_added + 1; END IF;
        
        -- Ajouter les accroches
        INSERT INTO word_blocks (platform, subcategory_id, category, words)
        VALUES (v_platform, v_subcategory_id, 'twist', p_twist_words)
        ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
        
        IF FOUND THEN v_words_added := v_words_added + 1; END IF;
        
        platform := v_platform;
        subcategory_name := p_subcategory_name;
        words_added := v_words_added;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 4. AJOUTER DES MOTS POUR LES SOUS-CATÉGORIES PRINCIPALES
-- ========================================

-- Ajouter des mots pour "Analyses politiques"
SELECT * FROM add_words_for_subcategory(
    'Analyses politiques',
    ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce'],
    ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte'],
    ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages'],
    ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']
);

-- Ajouter des mots pour "Breaking news"
SELECT * FROM add_words_for_subcategory(
    'Breaking news',
    ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce'],
    ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte'],
    ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages'],
    ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']
);

-- Ajouter des mots pour "Manifestations"
SELECT * FROM add_words_for_subcategory(
    'Manifestations',
    ARRAY['Manifestation', 'Protestation', 'Mobilisation', 'Revendication', 'Lutte', 'Resistance', 'Solidarite', 'Justice', 'Droits', 'Liberte'],
    ARRAY['organise', 'participe', 'soutient', 'defend', 'revendique', 'proteste', 'mobilise', 'resiste', 'lutte', 'agit'],
    ARRAY['pour la justice', 'pour les droits', 'pour la liberte', 'ensemble', 'en solidarite', 'pour le changement', 'pour lavenir', 'pour nos enfants', 'pour la democratie', 'pour la paix'],
    ARRAY['ACTIVISME', 'JUSTICE', 'SOLIDARITE', 'RESISTANCE', 'LIBERTE', 'DROITS', 'MOBILISATION', 'LUTTE', 'CHANGEMENT', 'ESPOIR']
);

-- Ajouter des mots pour "Analyses de marche"
SELECT * FROM add_words_for_subcategory(
    'Analyses de marche',
    ARRAY['Marche', 'Economie', 'Finance', 'Investissement', 'Tendance', 'Analyse', 'Strategie', 'Performance', 'Croissance', 'Developpement'],
    ARRAY['analyse', 'etudie', 'examine', 'evalue', 'compare', 'mesure', 'calcule', 'projette', 'anticipe', 'optimise'],
    ARRAY['les tendances', 'les opportunites', 'les risques', 'les perspectives', 'les donnees', 'les indicateurs', 'les performances', 'les strategies', 'les innovations', 'les defis'],
    ARRAY['ANALYSE', 'STRATEGIE', 'PERFORMANCE', 'TENDANCE', 'OPPORTUNITE', 'INNOVATION', 'EXPERTISE', 'PROFESSIONNEL', 'QUALITE', 'IMPACT']
);

-- Ajouter des mots pour "Fashion tips"
SELECT * FROM add_words_for_subcategory(
    'Fashion tips',
    ARRAY['Style', 'Mode', 'Fashion', 'Look', 'Outfit', 'Accessoires', 'Vetements', 'Tendance', 'Beaute', 'Glamour'],
    ARRAY['stylise', 'associe', 'coordonne', 'harmonise', 'contraste', 'accentue', 'souligne', 'met en valeur', 'transforme', 'renouvelle'],
    ARRAY['pour sortir', 'pour le travail', 'pour une occasion', 'avec style', 'avec elegance', 'avec audace', 'avec simplicite', 'avec originalite', 'avec classe', 'avec personnalite'],
    ARRAY['STYLE', 'MODE', 'FASHION', 'ELEGANCE', 'GLAMOUR', 'TRENDY', 'CHIC', 'MODERNE', 'AUDACIEUX', 'ORIGINAL']
);

-- Ajouter des mots pour "Cuisine du monde"
SELECT * FROM add_words_for_subcategory(
    'Cuisine du monde',
    ARRAY['Cuisine', 'Recette', 'Gastronomie', 'Culinaire', 'Traditionnel', 'International', 'Regional', 'Authentique', 'Gourmet', 'Artisanal'],
    ARRAY['decouvre', 'explore', 'apprend', 'maitrise', 'reproduit', 'adapte', 'innove', 'perfectionne', 'transmet', 'partage'],
    ARRAY['les traditions', 'les techniques', 'les secrets', 'les ingredients', 'les saveurs', 'les cultures', 'les histoires', 'les methodes', 'les astuces', 'les variantes'],
    ARRAY['GASTRONOMIE', 'TRADITION', 'AUTHENTIQUE', 'INTERNATIONAL', 'CULTUREL', 'SAVEUR', 'TECHNIQUE', 'ARTISANAL', 'GOURMET', 'DECOUVERTE']
);

-- Ajouter des mots pour "Confiance en soi"
SELECT * FROM add_words_for_subcategory(
    'Confiance en soi',
    ARRAY['Confiance', 'Estime', 'Personnalite', 'Charisme', 'Leadership', 'Presence', 'Impact', 'Influence', 'Autorite', 'Credibilite'],
    ARRAY['developpe', 'renforce', 'ameliore', 'cultive', 'construit', 'nourrit', 'stimule', 'encourage', 'inspire', 'guide'],
    ARRAY['votre presence', 'votre impact', 'votre influence', 'votre autorite', 'votre credibilite', 'votre charisme', 'votre leadership', 'votre personnalite', 'votre estime', 'votre potentiel'],
    ARRAY['CONFIANCE', 'LEADERSHIP', 'IMPACT', 'INFLUENCE', 'AUTORITE', 'CHARISME', 'PRESENCE', 'CREDIBILITE', 'ESTIME', 'POTENTIEL']
);

-- Ajouter des mots pour "Histoires personnelles"
SELECT * FROM add_words_for_subcategory(
    'Histoires personnelles',
    ARRAY['Histoire', 'Experience', 'Aventure', 'Voyage', 'Rencontre', 'Moment', 'Souvenir', 'Memoire', 'Episode', 'Chapitre'],
    ARRAY['raconte', 'partage', 'decouvre', 'vit', 'experimente', 'apprend', 'grandit', 'evolue', 'transforme', 'inspire'],
    ARRAY['qui a change ma vie', 'qui m a marque', 'qui m a appris', 'qui m a fait grandir', 'qui m a inspire', 'qui m a surpris', 'qui m a touche', 'qui m a fait reflechir', 'qui m a fait rire', 'qui m a fait pleurer'],
    ARRAY['HISTOIRE', 'EXPERIENCE', 'AVENTURE', 'INSPIRATION', 'EMOTION', 'SURPRISE', 'DECOUVERTE', 'APPRENTISSAGE', 'TRANSFORMATION', 'MOMENT']
);

-- Ajouter des mots pour "Life hacks"
SELECT * FROM add_words_for_subcategory(
    'Life hacks',
    ARRAY['Astuce', 'Truc', 'Hack', 'Conseil', 'Solution', 'Methode', 'Technique', 'Routine', 'Organisation', 'Optimisation'],
    ARRAY['decouvre', 'apprend', 'utilise', 'applique', 'teste', 'adopte', 'integre', 'optimise', 'simplifie', 'ameliore'],
    ARRAY['pour simplifier', 'pour economiser', 'pour gagner du temps', 'pour etre plus efficace', 'pour mieux organiser', 'pour optimiser', 'pour ameliorer', 'pour faciliter', 'pour accelerer', 'pour reussir'],
    ARRAY['ASTUCE', 'HACK', 'TRUC', 'CONSEIL', 'SOLUTION', 'METHODE', 'TECHNIQUE', 'OPTIMISATION', 'SIMPLIFICATION', 'EFFICACITE']
);

-- Ajouter des mots pour "Makeup tutorials"
SELECT * FROM add_words_for_subcategory(
    'Makeup tutorials',
    ARRAY['Makeup', 'Maquillage', 'Beaute', 'Look', 'Style', 'Tendance', 'Technique', 'Produit', 'Pinceau', 'Palette'],
    ARRAY['applique', 'cree', 'realise', 'invente', 'adapte', 'transforme', 'ameliore', 'perfectionne', 'stylise', 'harmonise'],
    ARRAY['en 5 minutes', 'facilement', 'avec style', 'comme un pro', 'pour sortir', 'pour le travail', 'pour une occasion', 'tendance', 'moderne', 'classique'],
    ARRAY['BEAUTE', 'MAKEUP', 'STYLE', 'TENDANCE', 'GLAMOUR', 'ELEGANCE', 'MODERNE', 'CLASSIQUE', 'AUDACIEUX', 'ORIGINAL']
);

-- Ajouter des mots pour "Recettes rapides"
SELECT * FROM add_words_for_subcategory(
    'Recettes rapides',
    ARRAY['Recette', 'Cuisine', 'Plat', 'Ingredient', 'Preparation', 'Cuisson', 'Assaisonnement', 'Presentation', 'Garniture', 'Accompagnement'],
    ARRAY['prepare', 'cuisine', 'realise', 'cree', 'invente', 'adapte', 'ameliore', 'perfectionne', 'decore', 'presente'],
    ARRAY['en 15 minutes', 'facilement', 'avec style', 'comme un chef', 'pour impressionner', 'en famille', 'pour les enfants', 'healthy', 'gourmet', 'traditionnel'],
    ARRAY['RECETTE', 'CUISINE', 'CHEF', 'GOURMET', 'TRADITIONNEL', 'MODERNE', 'FACILE', 'RAPIDE', 'DELICIEUX', 'SIMPLE']
);

-- ========================================
-- 5. VÉRIFICATION FINALE
-- ========================================

SELECT '=== VÉRIFICATION FINALE ===' as section;

-- Compter le total de mots ajoutés
SELECT 
  platform,
  COUNT(*) as total_blocks,
  COUNT(DISTINCT subcategory_id) as subcategories_count
FROM word_blocks
GROUP BY platform
ORDER BY platform;

-- Vérifier que toutes les sous-catégories ont des mots
SELECT 
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(wb.id) as words_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN word_blocks wb ON s.id = wb.subcategory_id
GROUP BY s.id, s.name, c.name
HAVING COUNT(wb.id) = 0
ORDER BY c.name, s.name;

-- ========================================
-- 6. GÉNÉRER DES TITRES DE TEST
-- ========================================

SELECT '=== GÉNÉRATION DE TITRES DE TEST ===' as section;

-- Générer des titres pour quelques sous-catégories populaires
SELECT generate_and_save_titles('tiktok', s.id, 5) as titres_generes_tiktok
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

SELECT generate_and_save_titles('instagram', s.id, 5) as titres_generes_instagram
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

SELECT generate_and_save_titles('linkedin', s.id, 5) as titres_generes_linkedin
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- Vérifier les titres générés
SELECT 
  gt.title,
  gt.platform,
  s.name as subcategory_name,
  gt.generation_date
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
ORDER BY gt.generation_date DESC
LIMIT 10; 