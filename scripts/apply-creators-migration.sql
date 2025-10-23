-- Script pour appliquer les migrations des créateurs
-- Exécuter ce script dans Supabase ou votre base de données

-- 1. Appliquer la migration des tables
\i supabase/migrations/20250128000000-create-creators-system.sql

-- 2. Appliquer les données de test
\i supabase/migrations/20250128000001-insert-creators-data.sql

-- 3. Vérifier que les tables ont été créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('creators', 'creator_social_networks', 'creator_challenges')
ORDER BY table_name;

-- 4. Vérifier que les données ont été insérées
SELECT COUNT(*) as creators_count FROM creators;
SELECT COUNT(*) as social_networks_count FROM creator_social_networks;
SELECT COUNT(*) as challenges_count FROM creator_challenges;

-- 5. Vérifier un créateur avec ses réseaux sociaux
SELECT 
  c.name,
  c.display_name,
  c.category,
  c.subcategory,
  csn.username,
  sn.display_name as network_name,
  sn.color_theme
FROM creators c
LEFT JOIN creator_social_networks csn ON c.id = csn.creator_id
LEFT JOIN social_networks sn ON csn.social_network_id = sn.id
WHERE c.id = '550e8400-e29b-41d4-a716-446655440101';
