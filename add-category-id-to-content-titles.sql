-- Script pour ajouter category_id à content_titles
-- Date: 2025-01-28

-- 1. Ajouter la colonne category_id si elle n'existe pas
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
    
    RAISE NOTICE 'Colonne category_id ajoutée à content_titles';
  ELSE
    RAISE NOTICE 'Colonne category_id existe déjà dans content_titles';
  END IF;
END $$;

-- 2. Vérifier la structure mise à jour
SELECT 
  'STRUCTURE MISE À JOUR' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Message de confirmation
SELECT 'SUCCÈS: Colonne category_id ajoutée à content_titles' as result;
