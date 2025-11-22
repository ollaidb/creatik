-- ============================================
-- SCRIPT DE VÉRIFICATION
-- Exécutez ce script pour vérifier que tout est bien créé
-- ============================================

-- 1. Vérifier que toutes les tables sont créées
SELECT 
  'Tables créées' as verification,
  COUNT(*) as nombre
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
  table_name LIKE 'content_recommendation%' 
  OR table_name LIKE 'user_engagement%' 
  OR table_name LIKE 'user_recommendation%'
  OR table_name LIKE 'content_suggestions%'
  OR table_name = 'user_social_post_analysis'
);

-- 2. Lister toutes les tables créées
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as nombre_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND (
  table_name LIKE 'content_recommendation%' 
  OR table_name LIKE 'user_engagement%' 
  OR table_name LIKE 'user_recommendation%'
  OR table_name LIKE 'content_suggestions%'
  OR table_name = 'user_social_post_analysis'
)
ORDER BY table_name;

-- 3. Voir les règles insérées
SELECT 
  rule_name,
  rule_type,
  priority,
  weight,
  max_results,
  is_active,
  description
FROM public.content_recommendation_rules 
ORDER BY priority;

-- 4. Compter les règles actives
SELECT 
  COUNT(*) as total_regles,
  COUNT(*) FILTER (WHERE is_active = true) as regles_actives,
  COUNT(*) FILTER (WHERE is_active = false) as regles_inactives
FROM public.content_recommendation_rules;

-- 5. Vérifier les index créés
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND (
  tablename LIKE 'content_recommendation%' 
  OR tablename LIKE 'user_engagement%' 
  OR tablename LIKE 'user_recommendation%'
  OR tablename LIKE 'content_suggestions%'
  OR tablename = 'user_social_post_analysis'
)
ORDER BY tablename, indexname;

-- 6. Vérifier les fonctions créées
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND (
  routine_name LIKE '%recommendation%'
  OR routine_name LIKE '%engagement%'
  OR routine_name = 'update_updated_at_column'
  OR routine_name = 'cleanup_expired_caches'
)
ORDER BY routine_name;

