-- Script pour vérifier les restrictions d'authentification

-- 1. Vérifier les utilisateurs existants
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Vérifier les politiques RLS sur auth.users
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

-- 3. Vérifier les tentatives de connexion récentes
SELECT 
    id,
    user_id,
    ip_address,
    user_agent,
    created_at,
    event_type
FROM auth.audit_log_entries 
ORDER BY created_at DESC 
LIMIT 20;

-- 4. Vérifier les sessions actives
SELECT 
    id,
    user_id,
    created_at,
    not_after
FROM auth.sessions 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Vérifier les identités des utilisateurs
SELECT 
    u.id,
    u.email,
    i.provider,
    i.identity_data
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC;

-- 6. Vérifier les paramètres d'authentification
SELECT 
    name,
    value
FROM auth.config 
WHERE name LIKE '%signup%' OR name LIKE '%email%' OR name LIKE '%confirm%'; 