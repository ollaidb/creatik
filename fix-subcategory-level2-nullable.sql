-- Script pour rendre subcategory_level2_id nullable dans toutes les tables
-- Date: 2025-01-28

-- 1. Rendre subcategory_level2_id nullable dans content_titles
ALTER TABLE public.content_titles 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 2. Rendre subcategory_level2_id nullable dans challenges
ALTER TABLE public.challenges 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 3. Rendre subcategory_level2_id nullable dans sources
ALTER TABLE public.sources 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 4. Rendre subcategory_level2_id nullable dans exemplary_accounts
ALTER TABLE public.exemplary_accounts 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 5. Rendre subcategory_level2_id nullable dans word_blocks
ALTER TABLE public.word_blocks 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 6. Rendre subcategory_level2_id nullable dans user_publications
ALTER TABLE public.user_publications 
ALTER COLUMN subcategory_level2_id DROP NOT NULL;

-- 7. Vérifier que les colonnes sont maintenant nullable
SELECT 
  'COLONNES RENDUES NULLABLE' as section,
  table_name,
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns 
WHERE column_name = 'subcategory_level2_id'
AND table_schema = 'public'
ORDER BY table_name;

-- 8. Afficher un message de confirmation
SELECT 'SUCCÈS: Toutes les colonnes subcategory_level2_id sont maintenant nullable' as message;
