-- Script pour ajouter des mots pour d'autres catégories populaires
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. AJOUTER DES MOTS POUR "DÉVELOPPEMENT PERSONNEL" - CONFIANCE EN SOI
-- ========================================

-- Sujets pour confiance en soi
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'subject',
  ARRAY['Confiance', 'Estime', 'Personnalite', 'Charisme', 'Leadership', 'Presence', 'Impact', 'Influence', 'Autorite', 'Credibilite']
FROM subcategories s 
WHERE s.name = 'Confiance en soi'
LIMIT 1;

-- Verbes pour confiance en soi
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'verb',
  ARRAY['developpe', 'renforce', 'ameliore', 'cultive', 'construit', 'nourrit', 'stimule', 'encourage', 'inspire', 'guide']
FROM subcategories s 
WHERE s.name = 'Confiance en soi'
LIMIT 1;

-- Compléments pour confiance en soi
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'complement',
  ARRAY['votre presence', 'votre impact', 'votre influence', 'votre autorite', 'votre credibilite', 'votre charisme', 'votre leadership', 'votre personnalite', 'votre estime', 'votre potentiel']
FROM subcategories s 
WHERE s.name = 'Confiance en soi'
LIMIT 1;

-- Accroches pour confiance en soi
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'twist',
  ARRAY['CONFIANCE', 'LEADERSHIP', 'IMPACT', 'INFLUENCE', 'AUTORITE', 'CHARISME', 'PRESENCE', 'CREDIBILITE', 'ESTIME', 'POTENTIEL']
FROM subcategories s 
WHERE s.name = 'Confiance en soi'
LIMIT 1;

-- ========================================
-- 2. AJOUTER DES MOTS POUR "ANECDOTE" - HISTOIRES PERSONNELLES
-- ========================================

-- Sujets pour histoires personnelles
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Histoire', 'Experience', 'Aventure', 'Voyage', 'Rencontre', 'Moment', 'Souvenir', 'Memoire', 'Episode', 'Chapitre']
FROM subcategories s 
WHERE s.name = 'Histoires personnelles'
LIMIT 1;

-- Verbes pour histoires personnelles
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['raconte', 'partage', 'decouvre', 'vit', 'experimente', 'apprend', 'grandit', 'evolue', 'transforme', 'inspire']
FROM subcategories s 
WHERE s.name = 'Histoires personnelles'
LIMIT 1;

-- Compléments pour histoires personnelles
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['qui a change ma vie', 'qui m a marque', 'qui m a appris', 'qui m a fait grandir', 'qui m a inspire', 'qui m a surpris', 'qui m a touche', 'qui m a fait reflechir', 'qui m a fait rire', 'qui m a fait pleurer']
FROM subcategories s 
WHERE s.name = 'Histoires personnelles'
LIMIT 1;

-- Accroches pour histoires personnelles
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['HISTOIRE', 'EXPERIENCE', 'AVENTURE', 'INSPIRATION', 'EMOTION', 'SURPRISE', 'DECOUVERTE', 'APPRENTISSAGE', 'TRANSFORMATION', 'MOMENT']
FROM subcategories s 
WHERE s.name = 'Histoires personnelles'
LIMIT 1;

-- ========================================
-- 3. AJOUTER DES MOTS POUR "ASTUCE" - LIFE HACKS
-- ========================================

-- Sujets pour life hacks
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'subject',
  ARRAY['Astuce', 'Truc', 'Hack', 'Conseil', 'Solution', 'Methode', 'Technique', 'Routine', 'Organisation', 'Optimisation']
FROM subcategories s 
WHERE s.name = 'Life hacks'
LIMIT 1;

-- Verbes pour life hacks
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'verb',
  ARRAY['decouvre', 'apprend', 'utilise', 'applique', 'teste', 'adopte', 'integre', 'optimise', 'simplifie', 'ameliore']
FROM subcategories s 
WHERE s.name = 'Life hacks'
LIMIT 1;

-- Compléments pour life hacks
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'complement',
  ARRAY['pour simplifier', 'pour economiser', 'pour gagner du temps', 'pour etre plus efficace', 'pour mieux organiser', 'pour optimiser', 'pour ameliorer', 'pour faciliter', 'pour accelerer', 'pour reussir']
FROM subcategories s 
WHERE s.name = 'Life hacks'
LIMIT 1;

-- Accroches pour life hacks
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'twist',
  ARRAY['ASTUCE', 'HACK', 'TRUC', 'CONSEIL', 'SOLUTION', 'METHODE', 'TECHNIQUE', 'OPTIMISATION', 'SIMPLIFICATION', 'EFFICACITE']
FROM subcategories s 
WHERE s.name = 'Life hacks'
LIMIT 1;

-- ========================================
-- 4. AJOUTER DES MOTS POUR "BEAUTY/STYLE" - MAKEUP TUTORIALS
-- ========================================

-- Sujets pour makeup
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Makeup', 'Maquillage', 'Beaute', 'Look', 'Style', 'Tendance', 'Technique', 'Produit', 'Pinceau', 'Palette']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Verbes pour makeup
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['applique', 'cree', 'realise', 'invente', 'adapte', 'transforme', 'ameliore', 'perfectionne', 'stylise', 'harmonise']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Compléments pour makeup
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['en 5 minutes', 'facilement', 'avec style', 'comme un pro', 'pour sortir', 'pour le travail', 'pour une occasion', 'tendance', 'moderne', 'classique']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Accroches pour makeup
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['BEAUTE', 'MAKEUP', 'STYLE', 'TENDANCE', 'GLAMOUR', 'ELEGANCE', 'MODERNE', 'CLASSIQUE', 'AUDACIEUX', 'ORIGINAL']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- ========================================
-- 5. AJOUTER DES MOTS POUR "CUISINE" - RECETTES RAPIDES
-- ========================================

-- Sujets pour recettes rapides
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'subject',
  ARRAY['Recette', 'Cuisine', 'Plat', 'Ingredient', 'Preparation', 'Cuisson', 'Assaisonnement', 'Presentation', 'Garniture', 'Accompagnement']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Verbes pour recettes rapides
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'verb',
  ARRAY['prepare', 'cuisine', 'realise', 'cree', 'invente', 'adapte', 'ameliore', 'perfectionne', 'decore', 'presente']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Compléments pour recettes rapides
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'complement',
  ARRAY['en 15 minutes', 'facilement', 'avec style', 'comme un chef', 'pour impressionner', 'en famille', 'pour les enfants', 'healthy', 'gourmet', 'traditionnel']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Accroches pour recettes rapides
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'twist',
  ARRAY['RECETTE', 'CUISINE', 'CHEF', 'GOURMET', 'TRADITIONNEL', 'MODERNE', 'FACILE', 'RAPIDE', 'DELICIEUX', 'SIMPLE']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- ========================================
-- 6. VÉRIFICATION FINALE
-- ========================================

-- Vérifier toutes les données ajoutées
SELECT 
  'Resume final des donnees:' as info,
  platform,
  subcategory_name,
  category,
  array_length(words, 1) as words_count
FROM word_blocks wb
JOIN subcategories s ON wb.subcategory_id = s.id
WHERE s.name IN ('Confiance en soi', 'Histoires personnelles', 'Life hacks', 'Makeup tutorials', 'Recettes rapides')
ORDER BY platform, subcategory_name, category;

-- Compter le total par plateforme
SELECT 
  platform,
  COUNT(*) as total_blocks,
  SUM(array_length(words, 1)) as total_words
FROM word_blocks
GROUP BY platform
ORDER BY platform;

-- Compter le total par sous-catégorie
SELECT 
  s.name as subcategory_name,
  COUNT(*) as total_blocks,
  SUM(array_length(wb.words, 1)) as total_words
FROM word_blocks wb
JOIN subcategories s ON wb.subcategory_id = s.id
GROUP BY s.name
ORDER BY s.name; 