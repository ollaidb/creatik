-- Diagnostic spécifique pour la publication de catégories
-- Date: 2025-01-27

-- 1. VÉRIFIER LA STRUCTURE DE LA TABLE CATEGORIES
SELECT 
  '=== STRUCTURE TABLE CATEGORIES ===' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'categories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VÉRIFIER LES CONTRAINTES
SELECT 
  '=== CONTRAINTES CATEGORIES ===' as info;

SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'categories';

-- 3. VÉRIFIER LES CONTRAINTES DE VALIDATION
SELECT 
  '=== CONTRAINTES DE VALIDATION ===' as info;

SELECT 
  cc.constraint_name,
  cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'categories';

-- 4. VÉRIFIER LES POLITIQUES RLS
SELECT 
  '=== POLITIQUES RLS CATEGORIES ===' as info;

SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'categories';

-- 5. TESTER L'INSERTION SIMPLE
SELECT 
  '=== TEST INSERTION SIMPLE ===' as info;

DO $$
DECLARE
  test_id UUID;
  error_message TEXT;
BEGIN
  BEGIN
    INSERT INTO categories (name, description, color) 
    VALUES ('Test catégorie', 'Description test', 'primary')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Insertion simple réussie avec ID: %', test_id;
    
    -- Nettoyer
    DELETE FROM categories WHERE id = test_id;
    RAISE NOTICE 'Test supprimé';
    
  EXCEPTION WHEN OTHERS THEN
    error_message := SQLERRM;
    RAISE NOTICE '❌ Erreur insertion simple: %', error_message;
  END;
END $$;

-- 6. TESTER AVEC DIFFÉRENTES COULEURS
SELECT 
  '=== TEST COULEURS ===' as info;

DO $$
DECLARE
  test_colors TEXT[] := ARRAY['primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow'];
  test_color TEXT;
  test_id UUID;
  error_message TEXT;
BEGIN
  FOREACH test_color IN ARRAY test_colors
  LOOP
    BEGIN
      INSERT INTO categories (name, description, color) 
      VALUES ('Test ' || test_color, 'Test', test_color)
      RETURNING id INTO test_id;
      
      RAISE NOTICE '✅ Couleur "%" fonctionne', test_color;
      
      -- Nettoyer
      DELETE FROM categories WHERE id = test_id;
      
    EXCEPTION WHEN OTHERS THEN
      error_message := SQLERRM;
      RAISE NOTICE '❌ Couleur "%" échoue: %', test_color, error_message;
    END;
  END LOOP;
END $$;

-- 7. VÉRIFIER LES DERNIÈRES CATÉGORIES CRÉÉES
SELECT 
  '=== DERNIÈRES CATÉGORIES ===' as info;

SELECT 
  id,
  name,
  description,
  color,
  created_at
FROM categories 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. VÉRIFIER LES ERREURS RÉCENTES
SELECT 
  '=== VÉRIFICATION ERREURS ===' as info,
  'Consultez les logs Supabase pour voir les erreurs récentes' as instruction;

-- 9. TESTER L'INSERTION AVEC TOUS LES CHAMPS
SELECT 
  '=== TEST INSERTION COMPLÈTE ===' as info;

DO $$
DECLARE
  test_id UUID;
  error_message TEXT;
BEGIN
  BEGIN
    INSERT INTO categories (
      name, 
      description, 
      color,
      created_at,
      updated_at
    ) VALUES (
      'Test complet',
      'Description complète',
      'primary',
      NOW(),
      NOW()
    ) RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Insertion complète réussie avec ID: %', test_id;
    
    -- Nettoyer
    DELETE FROM categories WHERE id = test_id;
    RAISE NOTICE 'Test supprimé';
    
  EXCEPTION WHEN OTHERS THEN
    error_message := SQLERRM;
    RAISE NOTICE '❌ Erreur insertion complète: %', error_message;
  END;
END $$;

-- 10. RÉSUMÉ DU DIAGNOSTIC
SELECT 
  'DIAGNOSTIC TERMINÉ' as status,
  'Vérifiez les résultats ci-dessus pour identifier le problème' as message; 