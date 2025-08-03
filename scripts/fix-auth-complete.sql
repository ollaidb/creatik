-- Script complet pour corriger l'authentification

-- 1. Créer la table user_roles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer un index sur user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 3. Créer un trigger pour updated_at
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER trigger_update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_roles_updated_at();

-- 4. Donner les permissions sur la table user_roles
GRANT ALL ON public.user_roles TO anon;
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 5. Créer une politique RLS pour user_roles
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
CREATE POLICY "Users can insert own role" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own role" ON public.user_roles;
CREATE POLICY "Users can update own role" ON public.user_roles
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 7. Supprimer toutes les politiques RLS restrictives sur auth.users
DROP POLICY IF EXISTS "Users can view own user data." ON auth.users;
DROP POLICY IF EXISTS "Users can update own user data." ON auth.users;
DROP POLICY IF EXISTS "Users can insert own user data." ON auth.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON auth.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON auth.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON auth.users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON auth.users;

-- 8. Donner toutes les permissions sur auth.users
GRANT ALL ON auth.users TO anon;
GRANT ALL ON auth.users TO authenticated;
GRANT ALL ON auth.sessions TO anon;
GRANT ALL ON auth.sessions TO authenticated;
GRANT ALL ON auth.identities TO anon;
GRANT ALL ON auth.identities TO authenticated;

-- 9. S'assurer que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;

-- 10. S'assurer que les fonctions sont accessibles
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;

-- 11. Ajouter un rôle par défaut pour les utilisateurs existants
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;

-- 12. Test final
SELECT 
    'Correction d authentification terminee' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users; 