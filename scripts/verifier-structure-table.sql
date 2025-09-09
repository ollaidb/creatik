-- Vérification de la structure de la table user_publications
-- Date: 2025-01-27

-- 1. VÉRIFIER SI LA TABLE EXISTE
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_publications' AND table_schema = 'public')
    THEN '✅ Table user_publications existe'
    ELSE '❌ Table user_publications n''existe pas'
  END as status;

-- 2. STRUCTURE COMPLÈTE DE LA TABLE
SELECT 
  '=== STRUCTURE DE LA TABLE USER_PUBLICATIONS ===' as info;

SELECT 
  column_name as "Nom du champ",
  data_type as "Type de données",
  is_nullable as "Peut être NULL",
  column_default as "Valeur par défaut",
  character_maximum_length as "Longueur max",
  numeric_precision as "Précision",
  numeric_scale as "Échelle"
FROM information_schema.columns 
WHERE table_name = 'user_publications' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. CONTRAINTES DE LA TABLE
SELECT 
  '=== CONTRAINTES ===' as info;

SELECT 
  constraint_name as "Nom de la contrainte",
  constraint_type as "Type",
  table_name as "Table"
FROM information_schema.table_constraints 
WHERE table_name = 'user_publications';

-- 4. CONTRAINTES DE VALIDATION (CHECK)
SELECT 
  '=== CONTRAINTES DE VALIDATION ===' as info;

SELECT 
  cc.constraint_name,
  cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'user_publications';

-- 5. CLÉS ÉTRANGÈRES
SELECT 
  '=== CLÉS ÉTRANGÈRES ===' as info;

SELECT 
  kcu.column_name as "Colonne",
  ccu.table_name as "Table référencée",
  ccu.column_name as "Colonne référencée",
  rc.delete_rule as "Règle de suppression",
  rc.update_rule as "Règle de mise à jour"
FROM information_schema.key_column_usage kcu
JOIN information_schema.referential_constraints rc ON kcu.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu ON rc.unique_constraint_name = ccu.constraint_name
WHERE kcu.table_name = 'user_publications';

-- 6. INDEX
SELECT 
  '=== INDEX ===' as info;

SELECT 
  indexname as "Nom de l'index",
  indexdef as "Définition"
FROM pg_indexes 
WHERE tablename = 'user_publications';

-- 7. EXEMPLE DE DONNÉES (si la table contient des données)
SELECT 
  '=== EXEMPLE DE DONNÉES ===' as info;

SELECT 
  id,
  user_id,
  content_type,
  title,
  description,
  category_id,
  subcategory_id,
  platform,
  url,
  status,
  rejection_reason,
  created_at,
  updated_at
FROM user_publications 
LIMIT 3;

-- 8. RÉSUMÉ DES CHAMPS
SELECT 
  '=== RÉSUMÉ DES CHAMPS ===' as info;

SELECT 
  column_name as "Champ",
  CASE 
    WHEN is_nullable = 'YES' THEN 'Oui'
    ELSE 'Non'
  END as "Obligatoire",
  data_type as "Type",
  CASE 
    WHEN column_default IS NOT NULL THEN column_default
    ELSE 'Aucune'
  END as "Valeur par défaut"
FROM information_schema.columns 
WHERE table_name = 'user_publications' AND table_schema = 'public'
ORDER BY ordinal_position; 