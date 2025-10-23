-- Script pour mettre à jour le système de publication avec les sous-catégories de niveau 2
-- Date: 2025-01-28

-- 1. Ajouter la colonne subcategory_level2_id à la table user_publications si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.user_publications 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Ajouter la colonne subcategory_level2_id à la table content_titles si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Ajouter la colonne subcategory_level2_id à la table challenges si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'challenges' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.challenges 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Ajouter la colonne subcategory_level2_id à la table sources si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sources' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.sources 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Ajouter la colonne subcategory_level2_id à la table exemplary_accounts si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exemplary_accounts' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.exemplary_accounts 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 6. Ajouter la colonne subcategory_level2_id à la table word_blocks si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'word_blocks' 
    AND column_name = 'subcategory_level2_id'
  ) THEN
    ALTER TABLE public.word_blocks 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 7. Mettre à jour les contraintes de contenu pour inclure subcategory_level2
DO $$ 
BEGIN
  -- Supprimer l'ancienne contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_publications_content_type_check'
  ) THEN
    ALTER TABLE public.user_publications DROP CONSTRAINT user_publications_content_type_check;
  END IF;
  
  -- Ajouter la nouvelle contrainte
  ALTER TABLE public.user_publications 
  ADD CONSTRAINT user_publications_content_type_check 
  CHECK (content_type IN ('category', 'subcategory', 'subcategory_level2', 'title', 'challenge', 'source', 'account', 'hooks'));
END $$;

-- 8. Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_publications_subcategory_level2_id 
ON public.user_publications(subcategory_level2_id);

-- 9. Mettre à jour les politiques RLS pour inclure subcategory_level2
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can insert their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;

-- Créer les nouvelles politiques
CREATE POLICY "Users can view their own publications" ON public.user_publications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own publications" ON public.user_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" ON public.user_publications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" ON public.user_publications
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Vérifier la structure mise à jour
SELECT 
  'STRUCTURE MISE À JOUR' as section,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
AND column_name IN ('subcategory_id', 'subcategory_level2_id', 'content_type')
ORDER BY column_name;
