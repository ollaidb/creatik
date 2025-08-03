-- Script pour diagnostiquer l'erreur 500 lors de l'inscription

-- 1. Vérifier les logs d'erreur récents
SELECT 
    id,
    ip_address,
    user_agent,
    created_at,
    event_type,
    instance_id
FROM auth.audit_log_entries 
WHERE event_type IN ('signup', 'signup_attempt')
AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 2. Vérifier les utilisateurs et leurs statuts
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'confirmed'
        ELSE 'unconfirmed'
    END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Vérifier les politiques RLS qui pourraient bloquer l'inscription
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'auth' 
AND tablename = 'users';

-- 4. Vérifier les permissions sur les tables d'authentification
SELECT 
    table_name,
    privilege_type,
    grantee,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'auth' 
AND table_name IN ('users', 'sessions', 'identities', 'audit_log_entries')
ORDER BY table_name, grantee;

-- 5. Vérifier les contraintes sur auth.users
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_schema = 'auth' 
AND table_name = 'users';

-- 6. Vérifier les triggers sur auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'; 