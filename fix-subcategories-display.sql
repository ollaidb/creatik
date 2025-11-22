-- Script de correction pour l'affichage des sous-catégories
-- Date: 2025-01-28

-- 1. DIAGNOSTIC : Vérifier la structure de la table subcategories
SELECT 
  'DIAGNOSTIC STRUCTURE SUBCATEGORIES' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'subcategories' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. DIAGNOSTIC : Vérifier les contraintes de la table subcategories
SELECT 
  'DIAGNOSTIC CONTRAINTES SUBCATEGORIES' as section,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'subcategories' 
  AND tc.table_schema = 'public';

-- 3. DIAGNOSTIC : Vérifier les politiques RLS sur subcategories
SELECT 
  'DIAGNOSTIC POLITIQUES RLS SUBCATEGORIES' as section,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subcategories';

-- 4. DIAGNOSTIC : Vérifier les sous-catégories existantes
SELECT 
  'DIAGNOSTIC SOUS-CATÉGORIES EXISTANTES' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  s.category_id,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
LEFT JOIN public.categories c ON s.category_id = c.id
ORDER BY s.created_at DESC
LIMIT 10;

-- 5. DIAGNOSTIC : Vérifier les publications de sous-catégories récentes
SELECT 
  'DIAGNOSTIC PUBLICATIONS SOUS-CATÉGORIES' as section,
  up.id as publication_id,
  up.title as publication_title,
  up.content_type,
  up.category_id,
  up.subcategory_id,
  up.created_at as publication_created_at,
  s.id as subcategory_id_in_table,
  s.name as subcategory_name_in_table,
  s.created_at as subcategory_created_at
FROM public.user_publications up
LEFT JOIN public.subcategories s ON up.subcategory_id = s.id
WHERE up.content_type = 'subcategory' 
  AND up.created_at >= NOW() - INTERVAL '1 day'
ORDER BY up.created_at DESC;

-- 6. CORRECTION : S'assurer que la table subcategories existe avec la bonne structure
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CORRECTION : Ajouter les colonnes manquantes si elles n'existent pas
DO $$
BEGIN
  -- Ajouter la colonne description si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subcategories' 
      AND column_name = 'description' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.subcategories ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Colonne description ajoutée à la table subcategories';
  END IF;
  
  -- Ajouter la colonne updated_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subcategories' 
      AND column_name = 'updated_at' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.subcategories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE '✅ Colonne updated_at ajoutée à la table subcategories';
  END IF;
END $$;

-- 8. CORRECTION : Créer un trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_subcategories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER trigger_update_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subcategories_updated_at();

-- 9. CORRECTION : Activer RLS sur la table subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- 10. CORRECTION : Supprimer les anciennes politiques et en créer de nouvelles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subcategories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.subcategories;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.subcategories;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.subcategories;
DROP POLICY IF EXISTS "subcategories_select_policy" ON public.subcategories;
DROP POLICY IF EXISTS "subcategories_insert_policy" ON public.subcategories;
DROP POLICY IF EXISTS "subcategories_update_policy" ON public.subcategories;
DROP POLICY IF EXISTS "subcategories_delete_policy" ON public.subcategories;

-- 11. CORRECTION : Créer les politiques RLS pour subcategories
CREATE POLICY "subcategories_select_policy" ON public.subcategories
  FOR SELECT USING (true);

CREATE POLICY "subcategories_insert_policy" ON public.subcategories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "subcategories_update_policy" ON public.subcategories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "subcategories_delete_policy" ON public.subcategories
  FOR DELETE USING (auth.role() = 'authenticated');

-- 12. CORRECTION : Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_name ON public.subcategories(name);
CREATE INDEX IF NOT EXISTS idx_subcategories_created_at ON public.subcategories(created_at);

-- 13. TEST : Tester l'insertion d'une sous-catégorie
DO $$
DECLARE
  test_category_id UUID;
  test_subcategory_id UUID;
  test_publication_id UUID;
  test_user_id UUID;
BEGIN
  -- Récupérer une catégorie existante pour le test
  SELECT id INTO test_category_id FROM public.categories LIMIT 1;
  
  -- Récupérer un utilisateur existant pour le test
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_category_id IS NOT NULL AND test_user_id IS NOT NULL THEN
    -- Test 1: Créer une sous-catégorie
    BEGIN
      INSERT INTO public.subcategories (name, description, category_id) 
      VALUES ('Test Subcategory', 'Test Description', test_category_id)
      RETURNING id INTO test_subcategory_id;
      
      RAISE NOTICE '✅ Test création sous-catégorie : SUCCÈS (ID: %)', test_subcategory_id;
      
      -- Test 2: Ajouter dans user_publications
      INSERT INTO public.user_publications (
        user_id, content_type, title, description, category_id, subcategory_id, status
      ) VALUES (
        test_user_id, 'subcategory', 'Test Subcategory', 'Test Description', test_category_id, test_subcategory_id, 'approved'
      ) RETURNING id INTO test_publication_id;
      
      RAISE NOTICE '✅ Test user_publications : SUCCÈS (ID: %)', test_publication_id;
      
      -- Nettoyage
      DELETE FROM public.user_publications WHERE id = test_publication_id;
      DELETE FROM public.subcategories WHERE id = test_subcategory_id;
      
      RAISE NOTICE '✅ Tests terminés et données nettoyées';
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Erreur lors des tests : %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE '⚠️ Aucune catégorie ou utilisateur trouvé pour les tests';
  END IF;
END $$;

-- 14. VÉRIFICATION FINALE : Lister les sous-catégories récentes
SELECT 
  'VÉRIFICATION FINALE' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
LEFT JOIN public.categories c ON s.category_id = c.id
WHERE s.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY s.created_at DESC;

-- 15. VÉRIFICATION FINALE : Correspondance avec user_publications
SELECT 
  'CORRESPONDANCE FINALE' as section,
  up.id as publication_id,
  up.title as publication_title,
  up.content_type,
  s.id as subcategory_id,
  s.name as subcategory_name,
  c.name as category_name,
  CASE 
    WHEN s.id IS NOT NULL THEN '✅ Correspondance trouvée'
    ELSE '❌ Pas de correspondance'
  END as status
FROM public.user_publications up
LEFT JOIN public.subcategories s ON up.subcategory_id = s.id
LEFT JOIN public.categories c ON s.category_id = c.id
WHERE up.content_type = 'subcategory' 
  AND up.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY up.created_at DESC;
