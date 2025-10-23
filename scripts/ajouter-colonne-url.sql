-- Ajouter la colonne url manquante à user_publications
-- Date: 2025-01-27

-- 1. VÉRIFIER LA STRUCTURE ACTUELLE
SELECT 
  '=== STRUCTURE ACTUELLE ===' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_publications' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. AJOUTER LA COLONNE URL SI ELLE N'EXISTE PAS
DO $$
BEGIN
  -- Vérifier si la colonne url existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
      AND column_name = 'url' 
      AND table_schema = 'public'
  ) THEN
    -- Ajouter la colonne url
    ALTER TABLE public.user_publications 
    ADD COLUMN url TEXT;
    
    RAISE NOTICE '✅ Colonne url ajoutée à la table user_publications';
  ELSE
    RAISE NOTICE 'ℹ️ La colonne url existe déjà';
  END IF;
END $$;

-- 3. VÉRIFIER LA NOUVELLE STRUCTURE
SELECT 
  '=== NOUVELLE STRUCTURE ===' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_publications' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. VÉRIFIER QUE L'INSERTION FONCTIONNE MAINTENANT
SELECT 
  '=== TEST D''INSERTION ===' as info;

DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
BEGIN
  -- Récupérer le premier utilisateur disponible
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Tester l'insertion avec tous les champs
    INSERT INTO user_publications (
      user_id,
      content_type,
      title,
      description,
      category_id,
      subcategory_id,
      platform,
      url,
      status
    ) VALUES (
      test_user_id,
      'title',
      'Test avec URL - ' || NOW(),
      'Description de test',
      NULL,
      NULL,
      'tiktok',
      'https://example.com',
      'approved'
    ) RETURNING id INTO test_publication_id;
    
    RAISE NOTICE '✅ Publication de test créée avec URL: %', test_publication_id;
    
    -- Nettoyer
    DELETE FROM user_publications WHERE id = test_publication_id;
    RAISE NOTICE 'Publication de test supprimée';
  ELSE
    RAISE NOTICE '❌ Aucun utilisateur trouvé pour le test';
  END IF;
END $$;

-- 5. RÉSUMÉ FINAL
SELECT 
  'COLONNE URL AJOUTÉE' as status,
  'La table user_publications est maintenant complète' as message; 