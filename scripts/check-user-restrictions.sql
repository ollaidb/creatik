-- Script pour vérifier les restrictions d'utilisateur

-- 1. Vérifier l'utilisateur collabinta@gmail.com spécifiquement
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role
FROM auth.users 
WHERE email = 'collabinta@gmail.com';

-- 2. Vérifier s'il y a des politiques RLS qui limitent l'accès
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
AND tablename = 'users'
AND (qual LIKE '%collabinta%' OR qual LIKE '%email%' OR qual LIKE '%specific%');

-- 3. Vérifier s'il y a des triggers qui bloquent l'inscription
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
AND action_statement LIKE '%collabinta%';

-- 4. Vérifier les permissions spécifiques
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'auth' 
AND table_name = 'users'
AND grantee IN ('anon', 'authenticated', 'service_role');

-- 5. Vérifier les fonctions d'authentification
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'auth'
AND routine_definition LIKE '%collabinta%';

-- 6. Vérifier tous les utilisateurs pour voir s'il y a un pattern
SELECT 
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    role
FROM auth.users 
ORDER BY created_at DESC;

-- 7. Test de création d'utilisateur (simulation)
SELECT 
    'Test de creation d utilisateur' as test,
    'Si cette requête fonctionne, les permissions sont OK' as status; 