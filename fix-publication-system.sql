-- Script de correction du système de publication
-- Date: 2025-01-28

-- 1. DIAGNOSTIC : Vérifier l'état actuel de la table user_publications
SELECT 
  'DIAGNOSTIC TABLE USER_PUBLICATIONS' as step,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. DIAGNOSTIC : Vérifier les contraintes de la table
SELECT 
  'DIAGNOSTIC CONTRAINTES' as step,
  constraint_name,
  constraint_type,
  check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'user_publications' 
  AND tc.table_schema = 'public';

-- 3. DIAGNOSTIC : Vérifier les politiques RLS
SELECT 
  'DIAGNOSTIC POLITIQUES RLS' as step,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_publications';

-- 4. CORRECTION : Supprimer l'ancienne contrainte et en créer une nouvelle
ALTER TABLE public.user_publications 
DROP CONSTRAINT IF EXISTS user_publications_content_type_check;

-- 5. CORRECTION : Ajouter la nouvelle contrainte avec tous les types supportés
ALTER TABLE public.user_publications 
ADD CONSTRAINT user_publications_content_type_check 
CHECK (content_type IN ('category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks'));

-- 6. CORRECTION : S'assurer que la colonne url existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
      AND column_name = 'url' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.user_publications ADD COLUMN url TEXT;
    RAISE NOTICE '✅ Colonne url ajoutée à la table user_publications';
  END IF;
END $$;

-- 7. CORRECTION : Recréer les politiques RLS pour être sûr
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;

-- 8. CORRECTION : Créer les politiques RLS
CREATE POLICY "Users can view their own publications" ON public.user_publications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own publications" ON public.user_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" ON public.user_publications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" ON public.user_publications
  FOR DELETE USING (auth.uid() = user_id);

-- 9. TEST : Insérer une publication de test
DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
BEGIN
  -- Récupérer un utilisateur existant pour le test
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Insérer une publication de test
    INSERT INTO public.user_publications (
      user_id,
      content_type,
      title,
      description,
      status
    ) VALUES (
      test_user_id,
      'title',
      'Test de publication',
      'Ceci est un test',
      'approved'
    ) RETURNING id INTO test_publication_id;
    
    RAISE NOTICE '✅ Test de publication réussi. ID: %', test_publication_id;
    
    -- Supprimer la publication de test
    DELETE FROM public.user_publications WHERE id = test_publication_id;
    RAISE NOTICE '✅ Publication de test supprimée';
  ELSE
    RAISE NOTICE '⚠️ Aucun utilisateur trouvé pour le test';
  END IF;
END $$;

-- 10. VÉRIFICATION FINALE
SELECT 
  'VÉRIFICATION FINALE' as step,
  'Table user_publications corrigée et prête' as status;
