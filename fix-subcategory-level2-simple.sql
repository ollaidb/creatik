-- Script simple pour rendre subcategory_level2_id nullable
-- Date: 2025-01-28

-- 1. Vérifier l'état actuel
SELECT 
  'ÉTAT ACTUEL' as info,
  table_name,
  column_name,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'subcategory_level2_id'
AND table_schema = 'public'
ORDER BY table_name;

-- 2. Rendre nullable dans content_titles
ALTER TABLE public.content_titles 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 3. Rendre nullable dans challenges  
ALTER TABLE public.challenges 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 4. Rendre nullable dans sources
ALTER TABLE public.sources 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 5. Rendre nullable dans exemplary_accounts
ALTER TABLE public.exemplary_accounts 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 6. Rendre nullable dans word_blocks
ALTER TABLE public.word_blocks 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 7. Rendre nullable dans user_publications
ALTER TABLE public.user_publications 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 8. Vérifier l'état final
SELECT 
  'ÉTAT FINAL' as info,
  table_name,
  column_name,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'subcategory_level2_id'
AND table_schema = 'public'
ORDER BY table_name;

-- 9. Message de confirmation
SELECT 'SUCCÈS: Toutes les colonnes subcategory_level2_id sont maintenant nullable' as result;
