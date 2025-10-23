-- Script pour vérifier la structure de content_titles
-- Date: 2025-01-28

-- 1. Vérifier si la colonne type existe
SELECT 
  'COLONNE TYPE EXISTE' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND column_name = 'type'
AND table_schema = 'public';

-- 2. Vérifier toutes les colonnes de content_titles
SELECT 
  'TOUTES LES COLONNES' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Vérifier les données dans content_titles
SELECT 
  'DONNEES CONTENT_TITLES' as info,
  id,
  title,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
ORDER BY created_at DESC
LIMIT 10;

-- 4. Si la colonne type n'existe pas, l'ajouter
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
    
    RAISE NOTICE 'Colonne type ajoutée à content_titles';
  ELSE
    RAISE NOTICE 'Colonne type existe déjà dans content_titles';
  END IF;
END $$;
