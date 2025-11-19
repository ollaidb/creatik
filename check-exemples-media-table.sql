-- Script pour vérifier la structure de la table content_exemples_media
-- Exécutez ce script dans Supabase SQL Editor pour diagnostiquer les problèmes

-- 1. Vérifier si la table existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_exemples_media')
    THEN '✅ La table content_exemples_media existe'
    ELSE '❌ La table content_exemples_media n''existe pas'
  END as table_status;

-- 2. Vérifier les colonnes de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'content_exemples_media'
ORDER BY ordinal_position;

-- 3. Vérifier les contraintes
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'content_exemples_media'::regclass;

-- 4. Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'content_exemples_media';

-- 5. Vérifier si RLS est activé
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'content_exemples_media';

-- 6. Vérifier les données existantes
SELECT 
  COUNT(*) as total_exemples,
  COUNT(CASE WHEN media_url IS NOT NULL THEN 1 END) as avec_url,
  COUNT(CASE WHEN media_data IS NOT NULL THEN 1 END) as avec_data,
  COUNT(CASE WHEN media_url IS NULL AND media_data IS NULL THEN 1 END) as sans_source
FROM content_exemples_media;

