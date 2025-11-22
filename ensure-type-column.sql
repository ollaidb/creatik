-- Script pour s'assurer que la colonne type existe dans content_titles
-- Date: 2025-01-28

-- 1. Vérifier si la colonne type existe
SELECT 
  'VERIFICATION COLONNE TYPE' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND column_name = 'type'
AND table_schema = 'public';

-- 2. Ajouter la colonne type si elle n'existe pas
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
    
    RAISE NOTICE 'Colonne type ajoutée à content_titles avec valeur par défaut "title"';
  ELSE
    RAISE NOTICE 'Colonne type existe déjà dans content_titles';
  END IF;
END $$;

-- 3. Mettre à jour les hooks existants pour avoir type = 'hook'
UPDATE public.content_titles 
SET type = 'hook'
WHERE title ILIKE '%hook%' OR title ILIKE '%brsr%' OR title ILIKE '%hbszr%';

-- 4. Vérifier le résultat
SELECT 
  'APRES MISE A JOUR' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC;
