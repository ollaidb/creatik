-- Script pour insérer un hook de test
-- Date: 2025-01-28

-- 1. Vérifier la structure de content_titles
SELECT 
  'STRUCTURE CONTENT_TITLES' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Insérer un hook de test
INSERT INTO public.content_titles (
  title,
  type,
  platform,
  subcategory_id,
  created_at,
  updated_at
) VALUES (
  'Hook de test pour YouTube',
  'hook',
  'youtube',
  'b32d2909-040b-42ef-8e37-7142f5be14fe',
  NOW(),
  NOW()
);

-- 3. Vérifier l'insertion
SELECT 
  'HOOK DE TEST INSERE' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC;

-- 4. Compter tous les hooks
SELECT 
  'TOTAL HOOKS' as info,
  COUNT(*) as count
FROM public.content_titles 
WHERE type = 'hook';
