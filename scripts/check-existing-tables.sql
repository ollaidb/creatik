-- Script pour vérifier les tables existantes dans votre base de données
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Lister toutes les tables existantes
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Vérifier spécifiquement les tables de titres
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_titles') 
    THEN '✅ Table content_titles existe'
    ELSE '❌ Table content_titles manquante'
  END as status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'word_blocks') 
    THEN '✅ Table word_blocks existe'
    ELSE '❌ Table word_blocks manquante'
  END as status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'title_templates') 
    THEN '✅ Table title_templates existe'
    ELSE '❌ Table title_templates manquante'
  END as status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'title_variables') 
    THEN '✅ Table title_variables existe'
    ELSE '❌ Table title_variables manquante'
  END as status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generated_titles') 
    THEN '✅ Table generated_titles existe'
    ELSE '❌ Table generated_titles manquante'
  END as status;

-- 3. Vérifier la structure de content_titles si elle existe
SELECT 
  'content_titles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
ORDER BY ordinal_position; 