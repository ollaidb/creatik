-- Script pour vérifier les politiques RLS qui pourraient bloquer l'inscription

-- 1. Vérifier les politiques RLS sur auth.users
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

-- 2. Vérifier les politiques RLS sur les tables publiques
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
ORDER BY tablename, policyname;

-- 3. Vérifier si RLS est activé sur les tables importantes
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_publications', 'content_titles', 'exemplary_accounts');

-- 4. Vérifier les permissions sur auth.users
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'users' 
AND table_schema = 'auth'; 