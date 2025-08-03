-- Script pour supprimer toutes les restrictions d'authentification

-- 1. Supprimer toutes les politiques RLS sur auth.users qui pourraient bloquer
DROP POLICY IF EXISTS "Users can view own user data." ON auth.users;
DROP POLICY IF EXISTS "Users can update own user data." ON auth.users;
DROP POLICY IF EXISTS "Users can insert own user data." ON auth.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON auth.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON auth.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON auth.users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON auth.users;

-- 2. Réactiver toutes les permissions de base
GRANT ALL ON auth.users TO anon;
GRANT ALL ON auth.users TO authenticated;
GRANT ALL ON auth.sessions TO anon;
GRANT ALL ON auth.sessions TO authenticated;
GRANT ALL ON auth.identities TO anon;
GRANT ALL ON auth.identities TO authenticated;

-- 3. S'assurer que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;

-- 4. S'assurer que les fonctions sont accessibles
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;

-- 5. Vérifier qu'il n'y a pas de contraintes spéciales
-- (Les contraintes de base ne peuvent pas être supprimées, mais on peut vérifier)

-- 6. S'assurer que le schéma auth est accessible
GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- 7. Test de permissions complètes
SELECT 
    'Toutes les restrictions supprimees' as status,
    'Permissions maximales accordees' as permissions,
    current_user as current_user;

-- 8. Vérifier l'état final
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users; 