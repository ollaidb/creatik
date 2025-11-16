-- Script de vérification complète de la table user_notes
-- Copiez-collez ce script dans Supabase SQL Editor pour voir l'état actuel

-- 1. Vérifier si la table existe
SELECT 
  'Table user_notes existe?' as verification,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_notes'
    ) THEN '✅ OUI'
    ELSE '❌ NON'
  END as status;

-- 2. Lister TOUTES les colonnes de la table user_notes
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_notes'
ORDER BY ordinal_position;

-- 3. Vérifier si RLS est activé
SELECT 
  'RLS activé?' as verification,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'user_notes'
      AND rowsecurity = true
    ) THEN '✅ OUI'
    ELSE '❌ NON'
  END as status;

-- 4. Lister toutes les politiques RLS
SELECT 
  policyname as "Nom de la politique",
  cmd as "Type d'opération",
  qual as "Condition USING",
  with_check as "Condition WITH CHECK"
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'user_notes'
ORDER BY policyname;

-- 5. Vérifier spécifiquement les colonnes is_pinned et order_index
SELECT 
  'Colonne is_pinned existe?' as verification,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'user_notes' 
      AND column_name = 'is_pinned'
    ) THEN '✅ OUI'
    ELSE '❌ NON - À AJOUTER'
  END as status
UNION ALL
SELECT 
  'Colonne order_index existe?' as verification,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'user_notes' 
      AND column_name = 'order_index'
    ) THEN '✅ OUI'
    ELSE '❌ NON - À AJOUTER'
  END as status;

