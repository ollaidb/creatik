-- Script de correction complète du système de publication
-- Date: 2025-01-28

-- 1. CORRECTION : Contrainte de couleur pour les catégories
ALTER TABLE public.categories 
DROP CONSTRAINT IF EXISTS categories_color_check;

ALTER TABLE public.categories 
ADD CONSTRAINT categories_color_check 
CHECK (color IN (
  'primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 
  'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 
  'rose', 'slate', 'zinc', 'neutral', 'stone', 'fuchsia', 'sky', 'mint'
));

-- 2. CORRECTION : Contrainte de type de contenu pour user_publications
ALTER TABLE public.user_publications 
DROP CONSTRAINT IF EXISTS user_publications_content_type_check;

ALTER TABLE public.user_publications 
ADD CONSTRAINT user_publications_content_type_check 
CHECK (content_type IN ('category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks'));

-- 3. CORRECTION : S'assurer que la colonne url existe
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

-- 4. CORRECTION : Recréer les politiques RLS pour user_publications
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;

CREATE POLICY "Users can view their own publications" ON public.user_publications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own publications" ON public.user_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" ON public.user_publications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" ON public.user_publications
  FOR DELETE USING (auth.uid() = user_id);

-- 5. CORRECTION : S'assurer que les tables nécessaires existent
CREATE TABLE IF NOT EXISTS public.content_titles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  platform TEXT,
  type TEXT DEFAULT 'title' CHECK (type IN ('title', 'hook')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Challenge',
  points INTEGER DEFAULT 50,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_days INTEGER DEFAULT 1,
  is_daily BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exemplary_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  account_url TEXT,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TEST : Tester la publication d'une catégorie
DO $$
DECLARE
  test_user_id UUID;
  test_category_id UUID;
  test_publication_id UUID;
BEGIN
  -- Récupérer un utilisateur existant pour le test
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Test 1: Créer une catégorie
    BEGIN
      INSERT INTO public.categories (name, description, color) 
      VALUES ('Test Category', 'Test Description', 'rose')
      RETURNING id INTO test_category_id;
      
      RAISE NOTICE '✅ Test création catégorie : SUCCÈS (ID: %)', test_category_id;
      
      -- Test 2: Ajouter dans user_publications
      INSERT INTO public.user_publications (
        user_id, content_type, title, description, category_id, status
      ) VALUES (
        test_user_id, 'category', 'Test Category', 'Test Description', test_category_id, 'approved'
      ) RETURNING id INTO test_publication_id;
      
      RAISE NOTICE '✅ Test user_publications : SUCCÈS (ID: %)', test_publication_id;
      
      -- Nettoyage
      DELETE FROM public.user_publications WHERE id = test_publication_id;
      DELETE FROM public.categories WHERE id = test_category_id;
      
      RAISE NOTICE '✅ Tests terminés et données nettoyées';
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Erreur lors des tests : %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE '⚠️ Aucun utilisateur trouvé pour les tests';
  END IF;
END $$;

-- 7. VÉRIFICATION FINALE
SELECT 
  'CORRECTION TERMINÉE' as status,
  'Système de publication prêt à utiliser' as message;
