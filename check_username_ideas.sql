-- Script de diagnostic pour vérifier l'état de la table username_ideas

-- 1. Vérifier si la table existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'username_ideas') 
    THEN '✅ Table username_ideas existe'
    ELSE '❌ Table username_ideas n''existe pas'
  END as status_table;

-- 2. Vérifier la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'username_ideas'
ORDER BY ordinal_position;

-- 3. Compter le nombre de pseudos
SELECT 
  COUNT(*) as total_pseudos,
  COUNT(DISTINCT social_network_id) as nombre_reseaux
FROM username_ideas;

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
WHERE tablename = 'username_ideas';

-- 5. Afficher quelques exemples de pseudos
SELECT 
  ui.id,
  ui.pseudo,
  ui.social_network_id,
  ui.user_id,
  sn.display_name as reseau,
  ui.created_at
FROM username_ideas ui
LEFT JOIN social_networks sn ON ui.social_network_id = sn.id
ORDER BY ui.created_at DESC
LIMIT 10;

-- 6. Vérifier les réseaux sociaux disponibles
SELECT 
  id,
  name,
  display_name,
  is_active
FROM social_networks
WHERE is_active = true
ORDER BY display_name;

