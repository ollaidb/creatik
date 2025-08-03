-- Script de création de la table word_blocks pour la génération de titres
-- Exécutez ce script dans votre base de données Supabase

-- ========================================
-- 1. CRÉATION DE LA TABLE WORD_BLOCKS
-- ========================================

-- Créer la table word_blocks si elle n'existe pas
CREATE TABLE IF NOT EXISTS word_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  subcategory_id UUID REFERENCES subcategories(id),
  category VARCHAR(50) NOT NULL CHECK (category IN ('subject', 'verb', 'complement', 'twist')),
  words TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CRÉATION DES INDEX POUR LES PERFORMANCES
-- ========================================

-- Index pour optimiser les requêtes par plateforme
CREATE INDEX IF NOT EXISTS idx_word_blocks_platform ON word_blocks(platform);

-- Index pour optimiser les requêtes par sous-catégorie
CREATE INDEX IF NOT EXISTS idx_word_blocks_subcategory ON word_blocks(subcategory_id);

-- Index pour optimiser les requêtes par catégorie de mot
CREATE INDEX IF NOT EXISTS idx_word_blocks_category ON word_blocks(category);

-- Index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_word_blocks_platform_subcategory ON word_blocks(platform, subcategory_id);

-- ========================================
-- 3. VÉRIFICATION DE LA CRÉATION
-- ========================================

-- Vérifier que la table a été créée
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'word_blocks') 
    THEN '✅ Table word_blocks créée avec succès'
    ELSE '❌ Erreur lors de la création de word_blocks'
  END as status;

-- Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'word_blocks'
ORDER BY ordinal_position;

-- Vérifier les index créés
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'word_blocks';

-- ========================================
-- 4. EXEMPLE DE DONNÉES DE TEST
-- ========================================

-- Insérer des données de test pour "Analyses politiques" sur TikTok
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'subject',
  ARRAY['Politique', 'Gouvernement', 'Élections', 'Partis', 'Députés', 'Ministres', 'Président', 'Assemblée', 'Sénat', 'Municipales']
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'verb',
  ARRAY['analyse', 'décrypte', 'explique', 'révèle', 'dévoile', 'expose', 'critique', 'défend', 'soutient', 'condamne']
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'complement',
  ARRAY['en 60 secondes', 'en direct', 'en coulisses', 'les coulisses', 'les secrets', 'les scandales', 'les révélations', 'les tendances', 'l''actualité', 'le débat']
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

INSERT INTO word_blocks (platform, subcategory_id, category, words) 
SELECT 
  'tiktok',
  s.id,
  'twist',
  ARRAY['🔥', '⚡', '💥', '🎯', '📊', '🔍', '💡', '🚨', '🎪', '🌟']
FROM subcategories s 
WHERE s.name = 'Analyses politiques'
LIMIT 1;

-- ========================================
-- 5. VÉRIFICATION DES DONNÉES INSÉRÉES
-- ========================================

-- Vérifier les données insérées
SELECT 
  'Données de test insérées:' as info,
  platform,
  category,
  array_length(words, 1) as words_count,
  words
FROM word_blocks 
WHERE subcategory_id IN (SELECT id FROM subcategories WHERE name = 'Analyses politiques')
ORDER BY category;

-- Compter le total des mots par catégorie
SELECT 
  category,
  COUNT(*) as blocks_count,
  SUM(array_length(words, 1)) as total_words
FROM word_blocks 
WHERE subcategory_id IN (SELECT id FROM subcategories WHERE name = 'Analyses politiques')
GROUP BY category
ORDER BY category; 