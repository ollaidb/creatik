-- Script pour vérifier et corriger les hooks dans content_titles
-- Date: 2025-01-28

-- 1. Vérifier les hooks existants
SELECT 
  'HOOKS EXISTANTS' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC;

-- 2. Vérifier la sous-catégorie "c hv"
SELECT 
  'SOUS-CATEGORIE C HV' as info,
  id,
  name,
  category_id
FROM public.subcategories 
WHERE name ILIKE '%c hv%' OR name ILIKE '%chv%';

-- 3. Vérifier les catégories
SELECT 
  'CATEGORIES' as info,
  id,
  name
FROM public.categories 
ORDER BY name;

-- 4. Mettre à jour les hooks qui n'ont pas de subcategory_id
UPDATE public.content_titles 
SET subcategory_id = 'b32d2909-040b-42ef-8e37-7142f5be14fe'
WHERE type = 'hook' 
AND subcategory_id IS NULL;

-- 5. Mettre à jour les hooks qui n'ont pas de platform
UPDATE public.content_titles 
SET platform = 'youtube'
WHERE type = 'hook' 
AND (platform IS NULL OR platform = '');

-- 6. Vérifier le résultat
SELECT 
  'HOOKS APRES CORRECTION' as info,
  id,
  title,
  type,
  platform,
  subcategory_id,
  created_at
FROM public.content_titles 
WHERE type = 'hook'
ORDER BY created_at DESC;

-- 7. Compter les hooks pour cette sous-catégorie
SELECT 
  'COMPTAGE HOOKS POUR SOUS-CATEGORIE' as info,
  COUNT(*) as total_hooks
FROM public.content_titles 
WHERE type = 'hook' 
AND subcategory_id = 'b32d2909-040b-42ef-8e37-7142f5be14fe';
