-- Script pour vérifier les contraintes actuelles sur subcategory_level2_id
-- Date: 2025-01-28

-- 1. Vérifier les contraintes NOT NULL sur subcategory_level2_id
SELECT 
  'CONTRAINTES NOT NULL' as section,
  c.table_name,
  c.column_name,
  c.is_nullable,
  c.data_type
FROM information_schema.columns c
WHERE c.column_name = 'subcategory_level2_id'
AND c.table_schema = 'public'
ORDER BY c.table_name;

-- 2. Vérifier les contraintes de clé étrangère
SELECT 
  'CONTRAINTES FOREIGN KEY' as section,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND kcu.column_name = 'subcategory_level2_id'
AND tc.table_schema = 'public';

-- 3. Vérifier les contraintes de contenu
SELECT 
  'CONTRAINTES DE CONTENU' as section,
  cc.constraint_name,
  cc.table_name,
  cc.check_clause
FROM information_schema.check_constraints cc
WHERE cc.constraint_name LIKE '%content_type%'
AND cc.table_schema = 'public';
