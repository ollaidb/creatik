-- Script de vérification du système de génération de titres par mots
-- Exécutez ce script dans votre base de données Supabase

-- ========================================
-- 1. VÉRIFICATION DES TABLES EXISTANTES
-- ========================================

SELECT '=== VÉRIFICATION DES TABLES ===' as section;

-- Vérifier si la table word_blocks existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'word_blocks') 
    THEN '✅ Table word_blocks existe'
    ELSE '❌ Table word_blocks manquante'
  END as status;

-- Vérifier si la table content_titles existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_titles') 
    THEN '✅ Table content_titles existe'
    ELSE '❌ Table content_titles manquante'
  END as status;

-- Vérifier si la table subcategories existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcategories') 
    THEN '✅ Table subcategories existe'
    ELSE '❌ Table subcategories manquante'
  END as status;

-- ========================================
-- 2. VÉRIFICATION DE LA STRUCTURE DES TABLES
-- ========================================

SELECT '=== STRUCTURE DES TABLES ===' as section;

-- Structure de word_blocks (si elle existe)
SELECT 
  'word_blocks' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'word_blocks'
ORDER BY ordinal_position;

-- Structure de content_titles
SELECT 
  'content_titles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
ORDER BY ordinal_position;

-- ========================================
-- 3. VÉRIFICATION DES DONNÉES EXISTANTES
-- ========================================

SELECT '=== DONNÉES EXISTANTES ===' as section;

-- Compter les mots dans word_blocks
SELECT 
  'word_blocks' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT platform) as platforms_count,
  COUNT(DISTINCT subcategory_id) as subcategories_count
FROM word_blocks;

-- Compter les titres dans content_titles
SELECT 
  'content_titles' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT platform) as platforms_count,
  COUNT(DISTINCT subcategory_id) as subcategories_count
FROM content_titles;

-- ========================================
-- 4. VÉRIFICATION DES PLATEFORMES SUPPORTÉES
-- ========================================

SELECT '=== PLATEFORMES SUPPORTÉES ===' as section;

-- Plateformes dans word_blocks
SELECT 
  'word_blocks' as source,
  platform,
  COUNT(*) as word_count
FROM word_blocks 
GROUP BY platform 
ORDER BY platform;

-- Plateformes dans content_titles
SELECT 
  'content_titles' as source,
  platform,
  COUNT(*) as title_count
FROM content_titles 
GROUP BY platform 
ORDER BY platform;

-- ========================================
-- 5. VÉRIFICATION DES CATÉGORIES ET SOUS-CATÉGORIES
-- ========================================

SELECT '=== CATÉGORIES ET SOUS-CATÉGORIES ===' as section;

-- Liste des catégories
SELECT 
  c.id,
  c.name as category_name,
  COUNT(s.id) as subcategories_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- Sous-catégories avec leurs catégories
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(ct.id) as titles_count,
  COUNT(wb.id) as words_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN content_titles ct ON s.id = ct.subcategory_id
LEFT JOIN word_blocks wb ON s.id = wb.subcategory_id
GROUP BY s.id, s.name, c.name
ORDER BY c.name, s.name;

-- ========================================
-- 6. VÉRIFICATION DES INDEX
-- ========================================

SELECT '=== INDEX DE PERFORMANCE ===' as section;

-- Index sur content_titles
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename = 'content_titles';

-- Index sur word_blocks
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename = 'word_blocks';

-- ========================================
-- 7. RECOMMANDATIONS
-- ========================================

SELECT '=== RECOMMANDATIONS ===' as section;

-- Vérifier si word_blocks a des données
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM word_blocks) = 0 
    THEN '⚠️  Table word_blocks vide - Ajouter des mots pour la génération'
    ELSE '✅ Table word_blocks contient des données'
  END as recommendation;

-- Vérifier la couverture des plateformes
SELECT 
  CASE 
    WHEN (SELECT COUNT(DISTINCT platform) FROM word_blocks) < 7 
    THEN '⚠️  Plateformes manquantes dans word_blocks - Ajouter plus de plateformes'
    ELSE '✅ Bonne couverture des plateformes'
  END as recommendation;

-- Vérifier la couverture des sous-catégories
SELECT 
  CASE 
    WHEN (SELECT COUNT(DISTINCT subcategory_id) FROM word_blocks) < 10 
    THEN '⚠️  Sous-catégories manquantes dans word_blocks - Ajouter plus de sous-catégories'
    ELSE '✅ Bonne couverture des sous-catégories'
  END as recommendation;

-- ========================================
-- 8. SCRIPT DE CRÉATION SI MANQUANT
-- ========================================

SELECT '=== SCRIPT DE CRÉATION SI MANQUANT ===' as section;

-- Si word_blocks n'existe pas, voici le script de création :
SELECT 
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'word_blocks') 
    THEN '-- Script de création de word_blocks :
CREATE TABLE word_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  subcategory_id UUID REFERENCES subcategories(id),
  category VARCHAR(50) NOT NULL, -- ''subject'', ''verb'', ''complement'', ''twist''
  words TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_word_blocks_platform ON word_blocks(platform);
CREATE INDEX idx_word_blocks_subcategory ON word_blocks(subcategory_id);
CREATE INDEX idx_word_blocks_category ON word_blocks(category);'
    ELSE '✅ Table word_blocks existe déjà'
  END as creation_script; 