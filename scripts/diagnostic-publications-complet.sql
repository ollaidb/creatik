-- Diagnostic complet du système de publications
-- Date: 2025-01-27

-- 1. VÉRIFIER SI LA TABLE USER_PUBLICATIONS EXISTE
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_publications' AND table_schema = 'public')
    THEN '✅ Table user_publications existe'
    ELSE '❌ Table user_publications n''existe pas'
  END as status;

-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_publications' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LES POLITIQUES RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_publications';

-- 4. VÉRIFIER SI RLS EST ACTIVÉ
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_publications';

-- 5. COMPTER LE NOMBRE TOTAL DE PUBLICATIONS
SELECT 
  COUNT(*) as total_publications,
  COUNT(DISTINCT user_id) as nombre_utilisateurs
FROM user_publications;

-- 6. VÉRIFIER LES PUBLICATIONS PAR TYPE
SELECT 
  content_type,
  COUNT(*) as nombre,
  COUNT(DISTINCT user_id) as utilisateurs_uniques
FROM user_publications 
GROUP BY content_type
ORDER BY nombre DESC;

-- 7. VÉRIFIER LES PUBLICATIONS RÉCENTES (30 derniers jours)
SELECT 
  id,
  user_id,
  content_type,
  title,
  status,
  created_at
FROM user_publications 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 10;

-- 8. VÉRIFIER LES UTILISATEURS QUI ONT PUBLIÉ
SELECT 
  user_id,
  COUNT(*) as nombre_publications,
  MAX(created_at) as derniere_publication
FROM user_publications 
GROUP BY user_id
ORDER BY nombre_publications DESC;

-- 9. VÉRIFIER LES FONCTIONS SQL
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%user_publication%'
ORDER BY routine_name;

-- 10. VÉRIFIER LES TRIGGERS
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'user_publications';

-- 11. TESTER L'INSERTION D'UNE PUBLICATION DE TEST
DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
BEGIN
  -- Récupérer le premier utilisateur disponible
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Insérer une publication de test
    INSERT INTO user_publications (
      user_id,
      content_type,
      title,
      description,
      status
    ) VALUES (
      test_user_id,
      'title',
      'Publication de test - ' || NOW(),
      'Description de test',
      'approved'
    ) RETURNING id INTO test_publication_id;
    
    RAISE NOTICE 'Publication de test créée avec ID: %', test_publication_id;
    
    -- Vérifier que la publication existe
    IF EXISTS (SELECT 1 FROM user_publications WHERE id = test_publication_id) THEN
      RAISE NOTICE '✅ Publication de test trouvée dans la base de données';
    ELSE
      RAISE NOTICE '❌ Publication de test non trouvée dans la base de données';
    END IF;
    
    -- Supprimer la publication de test
    DELETE FROM user_publications WHERE id = test_publication_id;
    RAISE NOTICE 'Publication de test supprimée';
  ELSE
    RAISE NOTICE '❌ Aucun utilisateur trouvé pour le test';
  END IF;
END $$;

-- 12. VÉRIFIER LES ERREURS RÉCENTES
SELECT 
  'Vérification des erreurs récentes' as info,
  'Consultez les logs Supabase pour voir les erreurs d''insertion' as instruction;

-- 13. RÉSUMÉ DU DIAGNOSTIC
SELECT 
  'DIAGNOSTIC TERMINÉ' as status,
  'Vérifiez les résultats ci-dessus pour identifier les problèmes' as message; 