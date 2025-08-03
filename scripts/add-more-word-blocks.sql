-- Script pour ajouter des mots pour d'autres sous-catégories
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. AJOUTER DES MOTS POUR "CUISINE" SUR INSTAGRAM
-- ========================================

-- Sujets pour cuisine
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Recette', 'Cuisine', 'Chef', 'Restaurant', 'Ingredients', 'Plat', 'Dessert', 'Apero', 'Diner', 'Dejeuner']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Verbes pour cuisine
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['prepare', 'cuisine', 'realise', 'cree', 'invente', 'adapte', 'ameliore', 'perfectionne', 'decore', 'presente']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Compléments pour cuisine
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['en 5 minutes', 'facilement', 'avec style', 'comme un pro', 'pour impressionner', 'en famille', 'pour les enfants', 'healthy', 'gourmet', 'traditionnel']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- Accroches pour cuisine
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['RECETTE', 'CUISINE', 'CHEF', 'GOURMET', 'TRADITIONNEL', 'MODERNE', 'FACILE', 'RAPIDE', 'DELICIEUX', 'SIMPLE']
FROM subcategories s 
WHERE s.name = 'Recettes rapides'
LIMIT 1;

-- ========================================
-- 2. AJOUTER DES MOTS POUR "DEVELOPPEMENT PERSONNEL" SUR LINKEDIN
-- ========================================

-- Sujets pour développement personnel
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'subject',
  ARRAY['Carriere', 'Leadership', 'Management', 'Entrepreneuriat', 'Motivation', 'Confiance', 'Reussite', 'Objectifs', 'Performance', 'Excellence']
FROM subcategories s 
WHERE s.name = 'Motivation'
LIMIT 1;

-- Verbes pour développement personnel
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'verb',
  ARRAY['developpe', 'ameliore', 'optimise', 'maximise', 'accentue', 'renforce', 'stimule', 'encourage', 'inspire', 'guide']
FROM subcategories s 
WHERE s.name = 'Motivation'
LIMIT 1;

-- Compléments pour développement personnel
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'complement',
  ARRAY['votre carriere', 'vos competences', 'votre leadership', 'votre performance', 'votre reussite', 'vos objectifs', 'votre potentiel', 'votre impact', 'votre influence', 'votre croissance']
FROM subcategories s 
WHERE s.name = 'Motivation'
LIMIT 1;

-- Accroches pour développement personnel
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'twist',
  ARRAY['STRATEGIE', 'LEADERSHIP', 'EXCELLENCE', 'PERFORMANCE', 'REUSSITE', 'INNOVATION', 'EXPERTISE', 'PROFESSIONNEL', 'QUALITE', 'IMPACT']
FROM subcategories s 
WHERE s.name = 'Motivation'
LIMIT 1;

-- ========================================
-- 3. AJOUTER DES MOTS POUR "BEAUTY/STYLE" SUR INSTAGRAM
-- ========================================

-- Sujets pour beauty/style
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Makeup', 'Style', 'Mode', 'Beaute', 'Tendance', 'Look', 'Outfit', 'Accessoires', 'Coiffure', 'Maquillage']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Verbes pour beauty/style
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['applique', 'cree', 'realise', 'invente', 'adapte', 'transforme', 'ameliore', 'perfectionne', 'stylise', 'harmonise']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Compléments pour beauty/style
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['en 5 minutes', 'facilement', 'avec style', 'comme un pro', 'pour sortir', 'pour le travail', 'pour une occasion', 'tendance', 'moderne', 'classique']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- Accroches pour beauty/style
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['BEAUTE', 'STYLE', 'MODE', 'TRENDY', 'FASHION', 'GLAMOUR', 'ELEGANT', 'MODERNE', 'CLASSIQUE', 'TENDANCE']
FROM subcategories s 
WHERE s.name = 'Makeup tutorials'
LIMIT 1;

-- ========================================
-- 4. VÉRIFICATION DES DONNÉES AJOUTÉES
-- ========================================

-- Vérifier toutes les données ajoutées
SELECT 
  'Resume des donnees ajoutees:' as info,
  platform,
  subcategory_name,
  category,
  array_length(words, 1) as words_count
FROM word_blocks wb
JOIN subcategories s ON wb.subcategory_id = s.id
WHERE s.name IN ('Recettes rapides', 'Motivation', 'Makeup tutorials')
ORDER BY platform, subcategory_name, category;

-- Compter le total par plateforme
SELECT 
  platform,
  COUNT(*) as total_blocks,
  SUM(array_length(words, 1)) as total_words
FROM word_blocks
GROUP BY platform
ORDER BY platform; 