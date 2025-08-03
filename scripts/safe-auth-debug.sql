-- Script de diagnostic sûr pour l'authentification

-- 1. Vérifier les utilisateurs existants
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- 2. Vérifier les utilisateurs récents
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Vérifier les sessions actives
SELECT 
    COUNT(*) as active_sessions
FROM auth.sessions 
WHERE not_after > NOW();

-- 4. Vérifier les permissions sur les tables importantes
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'auth' 
AND table_name IN ('users', 'sessions', 'identities')
ORDER BY table_name, grantee;

-- 5. Vérifier les politiques RLS sur auth.users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'auth' 
AND tablename = 'users';

-- 6. Test simple
SELECT 
    'Diagnostic d authentification termine' as status,
    current_user as current_user,
    session_user as session_user; 