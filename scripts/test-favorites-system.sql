-- Test du système de favoris
-- Date: 2025-01-27

-- 1. VÉRIFIER LA TABLE USER_FAVORITES
SELECT 
  '=== TABLE USER_FAVORITES ===' as info;

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_favorites'
ORDER BY ordinal_position;

-- 2. VÉRIFIER LES DONNÉES DANS USER_FAVORITES
SELECT 
  '=== DONNÉES USER_FAVORITES ===' as info;

SELECT 
  item_type,
  COUNT(*) as count
FROM user_favorites 
GROUP BY item_type
ORDER BY item_type;

-- 3. VÉRIFIER LES SOUS-CATÉGORIES
SELECT 
  '=== SOUS-CATÉGORIES ===' as info;

SELECT 
  id,
  name,
  category_id,
  created_at
FROM subcategories 
LIMIT 10;

-- 4. VÉRIFIER LES SOUS-SOUS-CATÉGORIES
SELECT 
  '=== SOUS-SOUS-CATÉGORIES ===' as info;

SELECT 
  id,
  name,
  subcategory_id,
  created_at
FROM subcategories_level2 
LIMIT 10;

-- 5. TESTER L'INSERTION D'UN FAVORI SOUS-CATÉGORIE
SELECT 
  '=== TEST INSERTION SOUS-CATÉGORIE ===' as info;

DO $$
DECLARE
  test_user_id UUID;
  test_subcategory_id UUID;
  test_subcategory_level2_id UUID;
BEGIN
  -- Récupérer un utilisateur
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- Récupérer une sous-catégorie
  SELECT id INTO test_subcategory_id FROM subcategories LIMIT 1;
  
  -- Récupérer une sous-sous-catégorie
  SELECT id INTO test_subcategory_level2_id FROM subcategories_level2 LIMIT 1;
  
  IF test_user_id IS NOT NULL AND test_subcategory_id IS NOT NULL THEN
    -- Insérer un favori sous-catégorie
    INSERT INTO user_favorites (user_id, item_id, item_type) 
    VALUES (test_user_id, test_subcategory_id, 'subcategory')
    ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    
    RAISE NOTICE '✅ Favori sous-catégorie ajouté: %', test_subcategory_id;
  END IF;
  
  IF test_user_id IS NOT NULL AND test_subcategory_level2_id IS NOT NULL THEN
    -- Insérer un favori sous-sous-catégorie
    INSERT INTO user_favorites (user_id, item_id, item_type) 
    VALUES (test_user_id, test_subcategory_level2_id, 'subcategory_level2')
    ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    
    RAISE NOTICE '✅ Favori sous-sous-catégorie ajouté: %', test_subcategory_level2_id;
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Erreur: %', SQLERRM;
END $$;

-- 6. VÉRIFIER LES FAVORIS APRÈS TEST
SELECT 
  '=== FAVORIS APRÈS TEST ===' as info;

SELECT 
  item_type,
  COUNT(*) as count
FROM user_favorites 
GROUP BY item_type
ORDER BY item_type;

-- 7. RÉSUMÉ
SELECT 
  'DIAGNOSTIC TERMINÉ' as status,
  'Vérifiez les logs ci-dessus pour identifier les problèmes' as message; 