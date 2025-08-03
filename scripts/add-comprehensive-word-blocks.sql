-- Script pour ajouter des mots complets dans word_blocks
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. AJOUTER DES MOTS POUR "ACTUALITÉS" - BREAKING NEWS
-- ========================================

-- Sujets pour actualités
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'subject',
  ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']
FROM subcategories s 
WHERE s.name = 'Breaking news'
LIMIT 1;

-- Verbes pour actualités
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'verb',
  ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']
FROM subcategories s 
WHERE s.name = 'Breaking news'
LIMIT 1;

-- Compléments pour actualités
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'complement',
  ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']
FROM subcategories s 
WHERE s.name = 'Breaking news'
LIMIT 1;

-- Accroches pour actualités
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'twist',
  ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']
FROM subcategories s 
WHERE s.name = 'Breaking news'
LIMIT 1;

-- ========================================
-- 2. AJOUTER DES MOTS POUR "ACTIVISME" - MANIFESTATIONS
-- ========================================

-- Sujets pour activisme
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Manifestation', 'Protestation', 'Mobilisation', 'Revendication', 'Lutte', 'Resistance', 'Solidarite', 'Justice', 'Droits', 'Liberte']
FROM subcategories s 
WHERE s.name = 'Manifestations'
LIMIT 1;

-- Verbes pour activisme
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['organise', 'participe', 'soutient', 'defend', 'revendique', 'proteste', 'mobilise', 'resiste', 'lutte', 'agit']
FROM subcategories s 
WHERE s.name = 'Manifestations'
LIMIT 1;

-- Compléments pour activisme
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['pour la justice', 'pour les droits', 'pour la liberte', 'ensemble', 'en solidarite', 'pour le changement', 'pour lavenir', 'pour nos enfants', 'pour la democratie', 'pour la paix']
FROM subcategories s 
WHERE s.name = 'Manifestations'
LIMIT 1;

-- Accroches pour activisme
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['ACTIVISME', 'JUSTICE', 'SOLIDARITE', 'RESISTANCE', 'LIBERTE', 'DROITS', 'MOBILISATION', 'LUTTE', 'CHANGEMENT', 'ESPOIR']
FROM subcategories s 
WHERE s.name = 'Manifestations'
LIMIT 1;

-- ========================================
-- 3. AJOUTER DES MOTS POUR "ANALYSE" - ANALYSES DE MARCHÉ
-- ========================================

-- Sujets pour analyse
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'subject',
  ARRAY['Marche', 'Economie', 'Finance', 'Investissement', 'Tendance', 'Analyse', 'Strategie', 'Performance', 'Croissance', 'Developpement']
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- Verbes pour analyse
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'verb',
  ARRAY['analyse', 'etudie', 'examine', 'evalue', 'compare', 'mesure', 'calcule', 'projette', 'anticipe', 'optimise']
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- Compléments pour analyse
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'complement',
  ARRAY['les tendances', 'les opportunites', 'les risques', 'les perspectives', 'les donnees', 'les indicateurs', 'les performances', 'les strategies', 'les innovations', 'les defis']
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- Accroches pour analyse
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'linkedin',
  s.id,
  'twist',
  ARRAY['ANALYSE', 'STRATEGIE', 'PERFORMANCE', 'TENDANCE', 'OPPORTUNITE', 'INNOVATION', 'EXPERTISE', 'PROFESSIONNEL', 'QUALITE', 'IMPACT']
FROM subcategories s 
WHERE s.name = 'Analyses de marche'
LIMIT 1;

-- ========================================
-- 4. AJOUTER DES MOTS POUR "BEAUTY/STYLE" - FASHION TIPS
-- ========================================

-- Sujets pour fashion
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'subject',
  ARRAY['Style', 'Mode', 'Fashion', 'Look', 'Outfit', 'Accessoires', 'Vetements', 'Tendance', 'Beaute', 'Glamour']
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- Verbes pour fashion
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'verb',
  ARRAY['stylise', 'associe', 'coordonne', 'harmonise', 'contraste', 'accentue', 'souligne', 'met en valeur', 'transforme', 'renouvelle']
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- Compléments pour fashion
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'complement',
  ARRAY['pour sortir', 'pour le travail', 'pour une occasion', 'avec style', 'avec elegance', 'avec audace', 'avec simplicite', 'avec originalite', 'avec classe', 'avec personnalite']
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- Accroches pour fashion
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'instagram',
  s.id,
  'twist',
  ARRAY['STYLE', 'MODE', 'FASHION', 'ELEGANCE', 'GLAMOUR', 'TRENDY', 'CHIC', 'MODERNE', 'AUDACIEUX', 'ORIGINAL']
FROM subcategories s 
WHERE s.name = 'Fashion tips'
LIMIT 1;

-- ========================================
-- 5. AJOUTER DES MOTS POUR "CUISINE" - CUISINE DU MONDE
-- ========================================

-- Sujets pour cuisine du monde
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'subject',
  ARRAY['Cuisine', 'Recette', 'Gastronomie', 'Culinaire', 'Traditionnel', 'International', 'Regional', 'Authentique', 'Gourmet', 'Artisanal']
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- Verbes pour cuisine du monde
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'verb',
  ARRAY['decouvre', 'explore', 'apprend', 'maitrise', 'reproduit', 'adapte', 'innove', 'perfectionne', 'transmet', 'partage']
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- Compléments pour cuisine du monde
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'complement',
  ARRAY['les traditions', 'les techniques', 'les secrets', 'les ingredients', 'les saveurs', 'les cultures', 'les histoires', 'les methodes', 'les astuces', 'les variantes']
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- Accroches pour cuisine du monde
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'youtube',
  s.id,
  'twist',
  ARRAY['GASTRONOMIE', 'TRADITION', 'AUTHENTIQUE', 'INTERNATIONAL', 'CULTUREL', 'SAVEUR', 'TECHNIQUE', 'ARTISANAL', 'GOURMET', 'DECOUVERTE']
FROM subcategories s 
WHERE s.name = 'Cuisine du monde'
LIMIT 1;

-- ========================================
-- 6. VÉRIFICATION DES DONNÉES AJOUTÉES
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
WHERE s.name IN ('Breaking news', 'Manifestations', 'Analyses de marche', 'Fashion tips', 'Cuisine du monde')
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