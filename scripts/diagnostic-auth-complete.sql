-- Diagnostic complet de l'authentification
-- Date: 2025-01-27

-- 1. Vérifier les utilisateurs existants
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Vérifier les tentatives de connexion récentes
SELECT 
  id,
  user_id,
  ip_address,
  user_agent,
  created_at,
  event_type
FROM auth.audit_log_entries 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;

-- 3. Vérifier les politiques RLS sur auth.users (s'il y en a)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'auth';

-- 4. Vérifier les triggers sur auth.users
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- 5. Vérifier les fonctions qui pourraient restreindre l'accès
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_definition LIKE '%collabbinta%' 
   OR routine_definition LIKE '%email%'
   OR routine_definition LIKE '%auth%';

-- 6. Vérifier les politiques RLS sur les tables publiques
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%auth%' OR with_check LIKE '%auth%')
ORDER BY tablename, policyname;

-- 7. Vérifier les configurations d'authentification
SELECT 
  key,
  value
FROM auth.config 
WHERE key IN ('enable_signup', 'enable_confirmations', 'enable_email_change_confirmations');

-- 8. Vérifier les sessions actives
SELECT 
  id,
  user_id,
  created_at,
  not_after
FROM auth.sessions 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 9. Vérifier les identités OAuth
SELECT 
  id,
  user_id,
  identity_data,
  provider,
  created_at
FROM auth.identities 
ORDER BY created_at DESC;

-- 10. Vérifier les logs d'erreur récents
SELECT 
  id,
  user_id,
  ip_address,
  user_agent,
  created_at,
  event_type,
  error_message
FROM auth.audit_log_entries 
WHERE event_type LIKE '%error%' 
   OR event_type LIKE '%failure%'
   OR error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- 11. Vérifier les restrictions par email dans les fonctions
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_definition LIKE '%NEW.email%' 
   OR routine_definition LIKE '%email = %'
   OR routine_definition LIKE '%collabbinta%'
   OR routine_definition LIKE '%ttefemme%';

-- 12. Vérifier les politiques RLS qui pourraient bloquer l'accès
SELECT 
  schemaname,
  tablename,
  policyname,
  qual,
  with_check
FROM pg_policies 
WHERE qual LIKE '%auth.uid()%' 
   OR with_check LIKE '%auth.uid()%'
   OR qual LIKE '%auth.role()%'
   OR with_check LIKE '%auth.role()%';

-- 13. Test de création d'un nouvel utilisateur (simulation)
-- Cette requête simule ce qui se passe lors de l'inscription
SELECT 
  'Test d\'inscription' as test_type,
  'Vérification des politiques RLS' as description,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'auth' 
        AND tablename = 'users'
    ) THEN 'Politiques RLS détectées sur auth.users'
    ELSE 'Aucune politique RLS sur auth.users'
  END as result;

-- 14. Vérifier les triggers qui pourraient affecter l'authentification
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE action_statement LIKE '%email%'
   OR action_statement LIKE '%collabbinta%'
   OR action_statement LIKE '%ttefemme%'
   OR action_statement LIKE '%auth%';

-- 15. Résumé des problèmes potentiels
SELECT 
  'DIAGNOSTIC COMPLET' as diagnostic_type,
  'Vérification des restrictions d\'authentification' as description,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_definition LIKE '%collabbinta%' 
         OR routine_definition LIKE '%ttefemme%'
    ) THEN 'RESTRICTIONS DÉTECTÉES: Fonctions avec restrictions d\'email'
    ELSE 'AUCUNE RESTRICTION DÉTECTÉE dans les fonctions'
  END as restriction_status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE qual LIKE '%email%' 
         OR with_check LIKE '%email%'
    ) THEN 'RESTRICTIONS DÉTECTÉES: Politiques RLS avec restrictions d\'email'
    ELSE 'AUCUNE RESTRICTION DÉTECTÉE dans les politiques RLS'
  END as rls_status; 