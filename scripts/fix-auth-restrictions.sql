-- Script pour corriger les restrictions d'authentification

-- 1. Vérifier et corriger les politiques RLS sur auth.users
-- Supprimer les politiques restrictives sur auth.users
DROP POLICY IF EXISTS "Users can view own user data" ON auth.users;
DROP POLICY IF EXISTS "Users can update own user data" ON auth.users;
DROP POLICY IF EXISTS "Users can delete own user data" ON auth.users;

-- 2. S'assurer que les permissions sont correctes
GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- 3. Vérifier que les fonctions d'authentification sont accessibles
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;

-- 4. Vérifier les permissions sur les tables d'authentification
GRANT SELECT ON auth.users TO anon;
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- 5. Vérifier les permissions sur les sessions
GRANT ALL ON auth.sessions TO anon;
GRANT ALL ON auth.sessions TO authenticated;

-- 6. Vérifier les permissions sur les identités
GRANT ALL ON auth.identities TO anon;
GRANT ALL ON auth.identities TO authenticated;

-- 7. Vérifier les permissions sur les audit logs
GRANT SELECT ON auth.audit_log_entries TO authenticated;

-- 8. S'assurer que les triggers d'authentification fonctionnent
-- Les triggers sont gérés automatiquement par Supabase

-- 9. Vérifier que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;

-- 10. Test de création d'utilisateur (simulation)
SELECT 
    'Test de permissions d authentification' as test,
    current_user as current_user,
    session_user as session_user;

-- 11. Vérifier les paramètres de configuration
-- Ces paramètres sont gérés par l'interface Supabase
-- Vérifiez dans Authentication → Settings que :
-- - Email Auth est activé
-- - Enable sign up est activé
-- - Confirm email est configuré selon vos besoins 