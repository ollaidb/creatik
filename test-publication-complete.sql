-- Script de test pour vérifier que les publications apparaissent dans toutes les tables
-- Date: 2025-01-28

-- 1. VÉRIFICATION : Publications récentes dans user_publications
SELECT 
  'PUBLICATIONS UTILISATEUR RÉCENTES' as section,
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
  created_at
FROM public.user_publications 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 2. VÉRIFICATION : Catégories récentes
SELECT 
  'CATÉGORIES RÉCENTES' as section,
  id,
  name,
  description,
  color,
  created_at
FROM public.categories 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 3. VÉRIFICATION : Sous-catégories récentes
SELECT 
  'SOUS-CATÉGORIES RÉCENTES' as section,
  id,
  name,
  description,
  category_id,
  created_at
FROM public.subcategories 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 4. VÉRIFICATION : Titres de contenu récents
SELECT 
  'TITRES DE CONTENU RÉCENTS' as section,
  id,
  title,
  subcategory_id,
  platform,
  type,
  created_at
FROM public.content_titles 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 5. VÉRIFICATION : Challenges récents
SELECT 
  'CHALLENGES RÉCENTS' as section,
  id,
  title,
  description,
  category,
  points,
  difficulty,
  created_at
FROM public.challenges 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 6. VÉRIFICATION : Sources récentes
SELECT 
  'SOURCES RÉCENTES' as section,
  id,
  name,
  description,
  url,
  created_at
FROM public.sources 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 7. VÉRIFICATION : Comptes exemplaires récents
SELECT 
  'COMPTES EXEMPLAIRES RÉCENTS' as section,
  id,
  account_name,
  description,
  platform,
  account_url,
  subcategory_id,
  created_at
FROM public.exemplary_accounts 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 8. VÉRIFICATION : Correspondance entre user_publications et tables spécifiques
SELECT 
  'CORRESPONDANCE CATÉGORIES' as section,
  up.id as publication_id,
  up.title as publication_title,
  up.content_type,
  c.id as category_id,
  c.name as category_name,
  c.color as category_color,
  CASE 
    WHEN c.id IS NOT NULL THEN '✅ Correspondance trouvée'
    ELSE '❌ Pas de correspondance'
  END as status
FROM public.user_publications up
LEFT JOIN public.categories c ON up.category_id = c.id
WHERE up.content_type = 'category' 
  AND up.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY up.created_at DESC;

-- 9. VÉRIFICATION : Correspondance pour les sous-catégories
SELECT 
  'CORRESPONDANCE SOUS-CATÉGORIES' as section,
  up.id as publication_id,
  up.title as publication_title,
  up.content_type,
  sc.id as subcategory_id,
  sc.name as subcategory_name,
  c.name as parent_category_name,
  CASE 
    WHEN sc.id IS NOT NULL THEN '✅ Correspondance trouvée'
    ELSE '❌ Pas de correspondance'
  END as status
FROM public.user_publications up
LEFT JOIN public.subcategories sc ON up.subcategory_id = sc.id
LEFT JOIN public.categories c ON sc.category_id = c.id
WHERE up.content_type = 'subcategory' 
  AND up.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY up.created_at DESC;

-- 10. VÉRIFICATION : Correspondance pour les titres
SELECT 
  'CORRESPONDANCE TITRES' as section,
  up.id as publication_id,
  up.title as publication_title,
  up.content_type,
  ct.id as title_id,
  ct.title as content_title,
  ct.platform,
  ct.type,
  CASE 
    WHEN ct.id IS NOT NULL THEN '✅ Correspondance trouvée'
    ELSE '❌ Pas de correspondance'
  END as status
FROM public.user_publications up
LEFT JOIN public.content_titles ct ON up.subcategory_id = ct.subcategory_id 
  AND up.title = ct.title
  AND up.platform = ct.platform
WHERE up.content_type IN ('title', 'hooks') 
  AND up.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY up.created_at DESC;

-- 11. STATISTIQUES GÉNÉRALES
SELECT 
  'STATISTIQUES GÉNÉRALES' as section,
  'Total publications utilisateur' as metric,
  COUNT(*) as count
FROM public.user_publications
UNION ALL
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
FROM public.exemplary_accounts;

-- 12. VÉRIFICATION FINALE
SELECT 
  'VÉRIFICATION TERMINÉE' as status,
  'Vérifiez les correspondances ci-dessus pour confirmer que vos publications apparaissent dans toutes les tables' as message;
