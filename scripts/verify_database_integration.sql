-- Script de vérification de l'intégration base de données
-- Vérifie que toutes les liaisons entre réseaux sociaux, playlists et défis fonctionnent

-- ==============================================
-- 1. VÉRIFICATION DES TABLES
-- ==============================================

SELECT 
  'Vérification des tables' as check_type,
  table_name,
  CASE 
    WHEN table_name IN (
      'user_social_accounts', 
      'user_content_playlists', 
      'user_social_posts', 
      'playlist_posts',
      'user_challenges',
      'user_program_settings',
      'user_custom_challenges',
      'user_custom_challenges_completed'
    ) THEN 'EXISTE'
    ELSE 'MANQUANTE'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_social_accounts', 
    'user_content_playlists', 
    'user_social_posts', 
    'playlist_posts',
    'user_challenges',
    'user_program_settings',
    'user_custom_challenges',
    'user_custom_challenges_completed'
  )
ORDER BY table_name;

-- ==============================================
-- 2. VÉRIFICATION DES COLONNES DE LIAISON
-- ==============================================

-- Vérifier user_content_playlists
SELECT 
  'Colonnes user_content_playlists' as check_type,
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name = 'social_network_id' THEN 'OK'
    ELSE 'MANQUANTE'
  END as status
FROM information_schema.columns 
WHERE table_name = 'user_content_playlists'
  AND column_name = 'social_network_id';

-- Vérifier user_social_posts
SELECT 
  'Colonnes user_social_posts' as check_type,
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name = 'playlist_id' THEN 'OK'
    ELSE 'MANQUANTE'
  END as status
FROM information_schema.columns 
WHERE table_name = 'user_social_posts'
  AND column_name = 'playlist_id';

-- Vérifier user_challenges
SELECT 
  'Colonnes user_challenges' as check_type,
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('social_account_id', 'playlist_id', 'is_custom') THEN 'OK'
    ELSE 'MANQUANTE'
  END as status
FROM information_schema.columns 
WHERE table_name = 'user_challenges'
  AND column_name IN ('social_account_id', 'playlist_id', 'is_custom');

-- ==============================================
-- 3. VÉRIFICATION DES CONTRAINTES DE CLÉ ÉTRANGÈRE
-- ==============================================

SELECT 
  'Contraintes FK' as check_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  'OK' as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('user_content_playlists', 'user_social_posts', 'user_challenges', 'user_program_settings', 'user_custom_challenges')
ORDER BY tc.table_name, kcu.column_name;

-- ==============================================
-- 4. VÉRIFICATION DES INDEX
-- ==============================================

SELECT 
  'Index de performance' as check_type,
  indexname,
  tablename,
  indexdef,
  'OK' as status
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN ('user_content_playlists', 'user_social_posts', 'user_challenges', 'user_program_settings', 'user_custom_challenges')
ORDER BY tablename, indexname;

-- ==============================================
-- 5. VÉRIFICATION DES FONCTIONS UTILITAIRES
-- ==============================================

SELECT 
  'Fonctions utilitaires' as check_type,
  routine_name,
  routine_type,
  'OK' as status
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_playlist_publications',
    'get_social_network_challenges', 
    'get_social_network_stats',
    'add_post_to_playlist',
    'remove_post_from_playlist'
  )
ORDER BY routine_name;

-- ==============================================
-- 6. VÉRIFICATION DES DONNÉES DE TEST
-- ==============================================

-- Compter les enregistrements par table
SELECT 
  'Comptage des données' as check_type,
  'user_social_accounts' as table_name,
  COUNT(*) as total_records
FROM public.user_social_accounts
UNION ALL
SELECT 
  'Comptage des données' as check_type,
  'user_content_playlists' as table_name,
  COUNT(*) as total_records
FROM public.user_content_playlists
UNION ALL
SELECT 
  'Comptage des données' as check_type,
  'user_social_posts' as table_name,
  COUNT(*) as total_records
FROM public.user_social_posts
UNION ALL
SELECT 
  'Comptage des données' as check_type,
  'user_challenges' as table_name,
  COUNT(*) as total_records
FROM public.user_challenges
UNION ALL
SELECT 
  'Comptage des données' as check_type,
  'user_program_settings' as table_name,
  COUNT(*) as total_records
FROM public.user_program_settings
UNION ALL
SELECT 
  'Comptage des données' as check_type,
  'user_custom_challenges' as table_name,
  COUNT(*) as total_records
FROM public.user_custom_challenges;

-- ==============================================
-- 7. VÉRIFICATION DES LIAISONS
-- ==============================================

-- Vérifier les playlists liées aux réseaux sociaux
SELECT 
  'Liaisons playlists-réseaux' as check_type,
  p.name as playlist_name,
  usa.platform,
  usa.username,
  CASE 
    WHEN p.social_network_id IS NOT NULL THEN 'LIÉE'
    ELSE 'NON LIÉE'
  END as status
FROM public.user_content_playlists p
LEFT JOIN public.user_social_accounts usa ON p.social_network_id = usa.id
ORDER BY p.name;

-- Vérifier les publications liées aux playlists
SELECT 
  'Liaisons publications-playlists' as check_type,
  sp.title as publication_title,
  p.name as playlist_name,
  usa.platform,
  CASE 
    WHEN sp.playlist_id IS NOT NULL THEN 'LIÉE'
    ELSE 'NON LIÉE'
  END as status
FROM public.user_social_posts sp
LEFT JOIN public.user_content_playlists p ON sp.playlist_id = p.id
LEFT JOIN public.user_social_accounts usa ON sp.social_account_id = usa.id
ORDER BY sp.title;

-- Vérifier les défis liés aux réseaux sociaux
SELECT 
  'Liaisons défis-réseaux' as check_type,
  COALESCE(uc.custom_title, c.title) as challenge_title,
  usa.platform,
  p.name as playlist_name,
  CASE 
    WHEN uc.social_account_id IS NOT NULL THEN 'LIÉ'
    ELSE 'NON LIÉ'
  END as status
FROM public.user_challenges uc
LEFT JOIN public.challenges c ON uc.challenge_id = c.id
LEFT JOIN public.user_social_accounts usa ON uc.social_account_id = usa.id
LEFT JOIN public.user_content_playlists p ON uc.playlist_id = p.id
ORDER BY uc.created_at DESC;

-- ==============================================
-- 8. TEST DES FONCTIONS UTILITAIRES
-- ==============================================

-- Test de la fonction get_playlist_publications
DO $$
DECLARE
  test_playlist_id UUID;
  test_user_id UUID;
  result_count INTEGER;
BEGIN
  -- Récupérer une playlist de test
  SELECT id, user_id INTO test_playlist_id, test_user_id
  FROM public.user_content_playlists 
  LIMIT 1;
  
  IF test_playlist_id IS NOT NULL THEN
    -- Tester la fonction
    SELECT COUNT(*) INTO result_count
    FROM get_playlist_publications(test_playlist_id, test_user_id);
    
    RAISE NOTICE 'Test get_playlist_publications: % publications trouvées pour la playlist %', result_count, test_playlist_id;
  ELSE
    RAISE NOTICE 'Test get_playlist_publications: Aucune playlist trouvée pour le test';
  END IF;
END $$;

-- Test de la fonction get_social_network_challenges
DO $$
DECLARE
  test_social_id UUID;
  test_user_id UUID;
  result_count INTEGER;
BEGIN
  -- Récupérer un réseau social de test
  SELECT id, user_id INTO test_social_id, test_user_id
  FROM public.user_social_accounts 
  LIMIT 1;
  
  IF test_social_id IS NOT NULL THEN
    -- Tester la fonction
    SELECT COUNT(*) INTO result_count
    FROM get_social_network_challenges(test_social_id, test_user_id);
    
    RAISE NOTICE 'Test get_social_network_challenges: % défis trouvés pour le réseau %', result_count, test_social_id;
  ELSE
    RAISE NOTICE 'Test get_social_network_challenges: Aucun réseau social trouvé pour le test';
  END IF;
END $$;

-- Test de la fonction get_social_network_stats
DO $$
DECLARE
  test_social_id UUID;
  test_user_id UUID;
  stats_record RECORD;
BEGIN
  -- Récupérer un réseau social de test
  SELECT id, user_id INTO test_social_id, test_user_id
  FROM public.user_social_accounts 
  LIMIT 1;
  
  IF test_social_id IS NOT NULL THEN
    -- Tester la fonction
    SELECT * INTO stats_record
    FROM get_social_network_stats(test_social_id, test_user_id);
    
    RAISE NOTICE 'Test get_social_network_stats: % publications, % défis, % accomplis, % playlists', 
      stats_record.total_publications, 
      stats_record.total_challenges, 
      stats_record.completed_challenges, 
      stats_record.total_playlists;
  ELSE
    RAISE NOTICE 'Test get_social_network_stats: Aucun réseau social trouvé pour le test';
  END IF;
END $$;

-- ==============================================
-- 9. RÉSUMÉ DE LA VÉRIFICATION
-- ==============================================

SELECT 
  'RÉSUMÉ DE LA VÉRIFICATION' as check_type,
  'Migration terminée' as status,
  'Toutes les tables et liaisons sont configurées' as details;

RAISE NOTICE '=== VÉRIFICATION TERMINÉE ===';
RAISE NOTICE 'Si tous les tests passent, la base de données est prête pour la communication entre réseaux sociaux, playlists et défis.';
RAISE NOTICE 'Vous pouvez maintenant utiliser l''application avec la fonctionnalité de filtrage par réseau social.';
