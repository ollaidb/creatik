-- Test d'insertion de publication
-- Date: 2025-01-27

-- 1. VÉRIFIER L'ÉTAT ACTUEL
SELECT '=== ÉTAT ACTUEL ===' as info;

SELECT 
  COUNT(*) as total_publications,
  COUNT(DISTINCT user_id) as utilisateurs_uniques
FROM user_publications;

-- 2. TESTER L'INSERTION DIRECTE
DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
  error_message TEXT;
BEGIN
  -- Récupérer le premier utilisateur disponible
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE NOTICE '❌ Aucun utilisateur trouvé dans auth.users';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Utilisateur de test: %', test_user_id;
  
  -- Test d'insertion simple
  BEGIN
    INSERT INTO user_publications (
      user_id,
      content_type,
      title,
      description,
      status
    ) VALUES (
      test_user_id,
      'title',
      'Test publication - ' || NOW(),
      'Description de test',
      'approved'
    ) RETURNING id INTO test_publication_id;
    
    RAISE NOTICE '✅ Publication de test créée avec ID: %', test_publication_id;
    
    -- Vérifier l'insertion
    IF EXISTS (SELECT 1 FROM user_publications WHERE id = test_publication_id) THEN
      RAISE NOTICE '✅ Publication trouvée dans la base de données';
      
      -- Afficher les détails
      SELECT 
        id,
        user_id,
        content_type,
        title,
        status,
        created_at
      FROM user_publications 
      WHERE id = test_publication_id;
      
    ELSE
      RAISE NOTICE '❌ Publication non trouvée après insertion';
    END IF;
    
    -- Nettoyer
    DELETE FROM user_publications WHERE id = test_publication_id;
    RAISE NOTICE 'Publication de test supprimée';
    
  EXCEPTION WHEN OTHERS THEN
    error_message := SQLERRM;
    RAISE NOTICE '❌ Erreur lors de l''insertion: %', error_message;
  END;
END $$;

-- 3. VÉRIFIER LES POLITIQUES RLS
SELECT '=== POLITIQUES RLS ===' as info;

SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_publications';

-- 4. TESTER L'ACCÈS AVEC AUTH.UID()
SELECT '=== TEST AUTH.UID() ===' as info;

-- Simuler un utilisateur connecté
SET LOCAL ROLE authenticated;

-- Tester la fonction auth.uid()
SELECT 
  'auth.uid() disponible' as test,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN '✅ auth.uid() fonctionne'
    ELSE '❌ auth.uid() ne fonctionne pas'
  END as result;

-- 5. VÉRIFIER LES CONTRAINTES
SELECT '=== CONTRAINTES ===' as info;

SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'user_publications';

-- 6. VÉRIFIER LES TRIGGERS
SELECT '=== TRIGGERS ===' as info;

SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'user_publications';

-- 7. TESTER LA FONCTION ADD_USER_PUBLICATION
SELECT '=== TEST FONCTION ADD_USER_PUBLICATION ===' as info;

DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
BEGIN
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Tester la fonction
    SELECT add_user_publication(
      test_user_id,
      'title',
      'Test via fonction - ' || NOW(),
      'Description test',
      NULL,
      NULL,
      'tiktok',
      NULL
    ) INTO test_publication_id;
    
    RAISE NOTICE '✅ Publication créée via fonction avec ID: %', test_publication_id;
    
    -- Nettoyer
    DELETE FROM user_publications WHERE id = test_publication_id;
    RAISE NOTICE 'Publication de test supprimée';
  END IF;
END $$;

-- 8. RÉSUMÉ FINAL
SELECT '=== RÉSUMÉ ===' as info;

SELECT 
  'Tests terminés' as status,
  'Vérifiez les messages NOTICE ci-dessus pour les résultats' as instruction; 