-- Script pour vérifier la configuration d'authentification

-- 1. Vérifier si la table auth.users existe et contient des utilisateurs
SELECT 
    COUNT(*) as total_users
FROM auth.users;

-- 2. Voir les derniers utilisateurs créés
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Vérifier les identités des utilisateurs
SELECT 
    u.id,
    u.email,
    i.provider,
    i.identity_data
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC 
LIMIT 10; 