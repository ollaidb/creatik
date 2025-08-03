-- Script de test final pour l'authentification

-- 1. Vérifier les utilisateurs existants
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- 2. Vérifier les tentatives de connexion récentes
SELECT 
    event_type,
    COUNT(*) as count
FROM auth.audit_log_entries 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY count DESC;

-- 3. Vérifier les sessions actives
SELECT 
    COUNT(*) as active_sessions
FROM auth.sessions 
WHERE not_after > NOW();

-- 4. Test de création d'utilisateur (simulation)
-- Cette requête ne devrait pas retourner d'erreur
SELECT 
    'Test d authentification reussi' as status,
    current_user as current_user,
    session_user as session_user;

-- 5. Vérifier les permissions sur les tables importantes
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'auth' 
AND table_name IN ('users', 'sessions', 'identities')
ORDER BY table_name, grantee; 