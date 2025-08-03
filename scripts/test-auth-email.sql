-- Script pour tester l'authentification par email

-- 1. Vérifier si l'utilisateur collabbinta@gmail.com existe
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'collabbinta@gmail.com';

-- 2. Vérifier les tentatives de connexion récentes
SELECT 
    id,
    user_id,
    ip_address,
    user_agent,
    created_at
FROM auth.audit_log_entries 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'collabbinta@gmail.com'
)
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Vérifier les sessions actives
SELECT 
    id,
    user_id,
    created_at,
    not_after
FROM auth.sessions 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'collabbinta@gmail.com'
)
ORDER BY created_at DESC 
LIMIT 5; 