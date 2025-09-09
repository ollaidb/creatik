-- Script de diagnostic pour les sous-catégories niveau 2
-- À exécuter dans le SQL Editor de votre dashboard Supabase

-- 1. Vérifier si la table existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'subcategories_level2';

-- 2. Si la table existe, vérifier sa structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'subcategories_level2'
ORDER BY ordinal_position;

-- 3. Compter le nombre d'enregistrements
SELECT COUNT(*) as total_records
FROM subcategories_level2;

-- 4. Voir quelques exemples d'enregistrements
SELECT 
  id,
  name,
  description,
  subcategory_id,
  created_at,
  updated_at
FROM subcategories_level2 
LIMIT 5;

-- 5. Vérifier les sous-catégories niveau 1 disponibles
SELECT 
  s.id,
  s.name,
  s.category_id,
  c.name as category_name
FROM subcategories s
JOIN categories c ON s.category_id = c.id
ORDER BY c.name, s.name
LIMIT 10;

-- 6. Vérifier la configuration de la hiérarchie
SELECT 
  chc.category_id,
  c.name as category_name,
  chc.has_level2
FROM category_hierarchy_config chc
JOIN categories c ON chc.category_id = c.id;

-- 7. Vérifier les permissions RLS
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
WHERE tablename = 'subcategories_level2';
