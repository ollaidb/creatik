-- Script pour vérifier les contraintes de la base de données
-- Ce script va nous aider à identifier pourquoi certains réseaux marchent et d'autres non

-- 1. Vérifier les contraintes de la table content_titles
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'content_titles'::regclass;

-- 2. Vérifier les valeurs actuelles dans content_titles
SELECT 
  platform,
  COUNT(*) as total_titles
FROM content_titles 
GROUP BY platform
ORDER BY platform;

-- 3. Vérifier la structure de la table social_networks
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'social_networks' 
ORDER BY ordinal_position;

-- 4. Vérifier les données dans social_networks
SELECT 
  id,
  name,
  display_name,
  is_active
FROM social_networks 
ORDER BY display_name;

-- 5. Vérifier s'il y a une contrainte CHECK sur platform
SELECT 
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_titles'::regclass 
AND contype = 'c' 
AND conname LIKE '%platform%';

-- 6. Vérifier les valeurs autorisées pour platform (si contrainte CHECK existe)
-- Cette requête nous dira exactement quelles valeurs sont autorisées
SELECT 
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_titles'::regclass 
AND contype = 'c'; 