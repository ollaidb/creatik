-- Script pour s'assurer que content_titles a la bonne structure
-- Date: 2025-01-28

-- 1. Ajouter category_id si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'category_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Ajouter subcategory_id si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'subcategory_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Ajouter subcategory_level2_id si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'subcategory_level2_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Ajouter platform si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'platform'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN platform VARCHAR(50);
  END IF;
END $$;

-- 5. Ajouter type si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_titles' 
    AND column_name = 'type'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.content_titles 
    ADD COLUMN type VARCHAR(50) DEFAULT 'title';
  END IF;
END $$;

-- 6. Vérifier la structure finale
SELECT 
  'STRUCTURE FINALE CONTENT_TITLES' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Message de confirmation
SELECT 'SUCCÈS: Structure de content_titles mise à jour' as result;
