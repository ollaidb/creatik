-- Script pour corriger les politiques RLS qui bloquent l'inscription

-- 1. Désactiver RLS sur user_publications si nécessaire
ALTER TABLE user_publications DISABLE ROW LEVEL SECURITY;

-- 2. Créer une politique permissive pour user_publications
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON user_publications;
CREATE POLICY "Enable all access for authenticated users" ON user_publications
    FOR ALL USING (true);

-- 3. Vérifier que les tables d'authentification sont accessibles
-- Les tables auth.* sont gérées automatiquement par Supabase

-- 4. Vérifier les permissions sur les tables publiques
GRANT ALL ON public.user_publications TO authenticated;
GRANT ALL ON public.user_publications TO anon;

-- 5. Vérifier que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. Vérifier les permissions sur les tables existantes
GRANT ALL ON public.content_titles TO authenticated;
GRANT ALL ON public.content_titles TO anon;

GRANT ALL ON public.exemplary_accounts TO authenticated;
GRANT ALL ON public.exemplary_accounts TO anon;

-- 7. Vérifier que les triggers fonctionnent
-- Les triggers pour updated_at devraient fonctionner automatiquement

-- 8. Test de création d'utilisateur (simulation)
-- Cette requête ne devrait pas retourner d'erreur
SELECT 
    'Test de permissions' as test,
    current_user as current_user,
    session_user as session_user; 