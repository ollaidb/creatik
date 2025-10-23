-- Script de vérification des publications et de leur affichage
-- Date: 2025-01-28

-- 1. VÉRIFICATION : Contenu dans la table categories (nouvelles catégories publiées)
SELECT 
  'CATÉGORIES PUBLIÉES' as section,
  id,
  name,
  description,
  color,
  created_at,
  'Apparaît dans /categories' as display_location
FROM public.categories 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 2. VÉRIFICATION : Contenu dans la table user_publications (publications utilisateur)
SELECT 
  'PUBLICATIONS UTILISATEUR' as section,
  id,
  user_id,
  content_type,
  title,
  description,
  category_id,
  subcategory_id,
  platform,
  url,
  status,
  created_at,
  'Apparaît dans /profile/publications' as display_location
FROM public.user_publications 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 3. VÉRIFICATION : Sous-catégories publiées récemment
SELECT 
  'SOUS-CATÉGORIES PUBLIÉES' as section,
  id,
  name,
  description,
  category_id,
  created_at,
  'Apparaît dans /category/{id}/subcategories' as display_location
FROM public.subcategories 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 4. VÉRIFICATION : Titres de contenu publiés récemment
SELECT 
  'TITRES DE CONTENU' as section,
  id,
  title,
  subcategory_id,
  platform,
  type,
  created_at,
  'Apparaît dans les sous-catégories' as display_location
FROM public.content_titles 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 5. VÉRIFICATION : Challenges publiés récemment
SELECT 
  'CHALLENGES PUBLIÉS' as section,
  id,
  title,
  description,
  category,
  points,
  difficulty,
  created_at,
  'Apparaît dans /challenges' as display_location
FROM public.challenges 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 6. VÉRIFICATION : Sources publiées récemment
SELECT 
  'SOURCES PUBLIÉES' as section,
  id,
  name,
  description,
  url,
  created_at,
  'Apparaît dans les sources' as display_location
FROM public.sources 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 7. VÉRIFICATION : Comptes exemplaires publiés récemment
SELECT 
  'COMPTES EXEMPLAIRES' as section,
  id,
  account_name,
  description,
  platform,
  account_url,
  subcategory_id,
  created_at,
  'Apparaît dans les comptes exemplaires' as display_location
FROM public.exemplary_accounts 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 8. STATISTIQUES GÉNÉRALES
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total catégories' as metric,
  COUNT(*) as count
FROM public.categories
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total sous-catégories' as metric,
  COUNT(*) as count
FROM public.subcategories
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total titres de contenu' as metric,
  COUNT(*) as count
FROM public.content_titles
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total challenges' as metric,
  COUNT(*) as count
FROM public.challenges
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total sources' as metric,
  COUNT(*) as count
FROM public.sources
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total comptes exemplaires' as metric,
  COUNT(*) as count
FROM public.exemplary_accounts
UNION ALL
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total publications utilisateur' as metric,
  COUNT(*) as count
FROM public.user_publications;

-- 9. VÉRIFICATION : Politiques RLS actives
SELECT 
  'POLITIQUES RLS' as section,
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('categories', 'subcategories', 'content_titles', 'challenges', 'sources', 'exemplary_accounts', 'user_publications')
ORDER BY tablename, policyname;

-- 10. VÉRIFICATION FINALE
SELECT 
  'VÉRIFICATION TERMINÉE' as status,
  'Vérifiez les résultats ci-dessus pour confirmer que vos publications apparaissent' as message;
