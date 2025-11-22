-- Script pour identifier et corriger le problème avec la sous-catégorie spécifique
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. IDENTIFIER LA SOUS-CATÉGORIE PROBLÉMATIQUE
-- ========================================

SELECT '=== IDENTIFICATION DE LA SOUS-CATÉGORIE ===' as section;

-- Identifier la sous-catégorie avec l'UUID problématique
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(wb.id) as words_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN word_blocks wb ON s.id = wb.subcategory_id
WHERE s.id = 'abe41855-23bd-4cbf-9a50-c526e42e4ec9'
GROUP BY s.id, s.name, c.name;

-- ========================================
-- 2. VÉRIFIER LES MOTS EXISTANTS POUR CETTE SOUS-CATÉGORIE
-- ========================================

SELECT '=== MOTS EXISTANTS POUR CETTE SOUS-CATÉGORIE ===' as section;

SELECT 
  platform,
  category,
  array_length(words, 1) as words_count,
  words
FROM word_blocks
WHERE subcategory_id = 'abe41855-23bd-4cbf-9a50-c526e42e4ec9'
ORDER BY platform, category;

-- ========================================
-- 3. AJOUTER DES MOTS POUR CETTE SOUS-CATÉGORIE SPÉCIFIQUE
-- ========================================

SELECT '=== AJOUT DE MOTS POUR CETTE SOUS-CATÉGORIE ===' as section;

-- Ajouter des mots pour toutes les plateformes pour cette sous-catégorie
INSERT INTO word_blocks (platform, subcategory_id, category, words) VALUES
-- TikTok
('tiktok', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('tiktok', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('tiktok', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('tiktok', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- Instagram
('instagram', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('instagram', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('instagram', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('instagram', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- YouTube
('youtube', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('youtube', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('youtube', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('youtube', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- LinkedIn
('linkedin', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('linkedin', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('linkedin', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('linkedin', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- Twitter
('twitter', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('twitter', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('twitter', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('twitter', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- Facebook
('facebook', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('facebook', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('facebook', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('facebook', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL']),

-- Twitch
('twitch', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'subject', ARRAY['Actualite', 'News', 'Evenement', 'Crise', 'Accident', 'Election', 'Scandale', 'Revelation', 'Decision', 'Annonce']),
('twitch', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'verb', ARRAY['revele', 'annonce', 'confirme', 'denonce', 'expose', 'decouvre', 'publie', 'partage', 'informe', 'alerte']),
('twitch', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'complement', ARRAY['en direct', 'en exclusivite', 'en temps reel', 'les coulisses', 'les details', 'les consequences', 'les reactions', 'les commentaires', 'les analyses', 'les temoignages']),
('twitch', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 'twist', ARRAY['BREAKING', 'URGENT', 'EXCLUSIF', 'CHOC', 'SURPRISE', 'REVELATION', 'SCANDALE', 'BOMBE', 'EXPLOSIF', 'SENSATIONNEL'])
ON CONFLICT (platform, subcategory_id, category) DO NOTHING;

-- ========================================
-- 4. VÉRIFIER QUE LES MOTS ONT ÉTÉ AJOUTÉS
-- ========================================

SELECT '=== VÉRIFICATION DES MOTS AJOUTÉS ===' as section;

SELECT 
  platform,
  category,
  array_length(words, 1) as words_count
FROM word_blocks
WHERE subcategory_id = 'abe41855-23bd-4cbf-9a50-c526e42e4ec9'
ORDER BY platform, category;

-- ========================================
-- 5. TESTER LA GÉNÉRATION DE TITRES
-- ========================================

SELECT '=== TEST DE GÉNÉRATION ===' as section;

-- Tester la génération pour TikTok
SELECT generate_and_save_titles('tiktok', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 5) as titres_generes_tiktok;

-- Tester la génération pour Instagram
SELECT generate_and_save_titles('instagram', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 5) as titres_generes_instagram;

-- Tester la génération pour LinkedIn
SELECT generate_and_save_titles('linkedin', 'abe41855-23bd-4cbf-9a50-c526e42e4ec9', 5) as titres_generes_linkedin;

-- ========================================
-- 6. VÉRIFIER LES TITRES GÉNÉRÉS
-- ========================================

SELECT '=== TITRES GÉNÉRÉS ===' as section;

SELECT 
  gt.title,
  gt.platform,
  s.name as subcategory_name,
  gt.generation_date
FROM generated_titles gt
JOIN subcategories s ON gt.subcategory_id = s.id
WHERE gt.subcategory_id = 'abe41855-23bd-4cbf-9a50-c526e42e4ec9'
ORDER BY gt.generation_date DESC
LIMIT 10;

-- ========================================
-- 7. SOLUTION GÉNÉRALE POUR TOUTES LES SOUS-CATÉGORIES
-- ========================================

SELECT '=== SOLUTION GÉNÉRALE ===' as section;

-- Identifier toutes les sous-catégories sans mots
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE NOT EXISTS (
  SELECT 1 FROM word_blocks wb WHERE wb.subcategory_id = s.id
)
ORDER BY c.name, s.name;

-- Ajouter des mots génériques pour toutes les sous-catégories manquantes
INSERT INTO word_blocks (platform, subcategory_id, category, words)
SELECT 
  platform,
  s.id as subcategory_id,
  category,
  CASE 
    WHEN category = 'subject' THEN ARRAY['Sujet', 'Theme', 'Contenu', 'Idee', 'Concept', 'Projet', 'Creation', 'Innovation', 'Decouverte', 'Experience']
    WHEN category = 'verb' THEN ARRAY['cree', 'developpe', 'explore', 'decouvre', 'partage', 'presente', 'analyse', 'etudie', 'examine', 'evalue']
    WHEN category = 'complement' THEN ARRAY['avec passion', 'avec expertise', 'avec originalite', 'avec style', 'avec audace', 'avec simplicite', 'avec elegance', 'avec creativite', 'avec innovation', 'avec excellence']
    WHEN category = 'twist' THEN ARRAY['DECOUVERTE', 'INNOVATION', 'CREATIVITE', 'EXCELLENCE', 'PASSION', 'EXPERTISE', 'ORIGINALITE', 'STYLE', 'AUDACE', 'SIMPLICITE']
  END as words
FROM (
  SELECT DISTINCT s.id, s.name, c.name as category_name
  FROM subcategories s
  JOIN categories c ON s.category_id = c.id
  WHERE NOT EXISTS (
    SELECT 1 FROM word_blocks wb WHERE wb.subcategory_id = s.id
  )
) s
CROSS JOIN (
  SELECT unnest(ARRAY['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch']) as platform
) p
CROSS JOIN (
  SELECT unnest(ARRAY['subject', 'verb', 'complement', 'twist']) as category
) cat
ON CONFLICT (platform, subcategory_id, category) DO NOTHING;

-- ========================================
-- 8. VÉRIFICATION FINALE
-- ========================================

SELECT '=== VÉRIFICATION FINALE ===' as section;

-- Compter les mots par plateforme
SELECT 
  platform,
  COUNT(*) as total_blocks,
  COUNT(DISTINCT subcategory_id) as subcategories_count
FROM word_blocks
GROUP BY platform
ORDER BY platform;

-- Vérifier qu'il n'y a plus de sous-catégories sans mots
SELECT 
  'Sous-catégories sans mots:' as info,
  COUNT(*) as count
FROM subcategories s
WHERE NOT EXISTS (
  SELECT 1 FROM word_blocks wb WHERE wb.subcategory_id = s.id
); 