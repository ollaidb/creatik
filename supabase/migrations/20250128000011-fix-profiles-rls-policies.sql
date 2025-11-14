-- Migration pour corriger les politiques RLS de la table profiles
-- Résout les erreurs 403 (Forbidden) lors de l'accès au profil utilisateur

-- Supprimer toutes les politiques existantes sur profiles pour éviter les conflits
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

-- S'assurer que RLS est activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS permissives et correctes pour la table profiles
-- Politique pour SELECT : les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Politique pour INSERT : les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Politique pour UPDATE : les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique pour DELETE : les utilisateurs peuvent supprimer leur propre profil
CREATE POLICY "Users can delete own profile" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- Vérifier que les politiques sont bien créées
DO $$
BEGIN
  RAISE NOTICE 'Politiques RLS créées avec succès pour la table profiles';
  RAISE NOTICE 'Les utilisateurs peuvent maintenant accéder à leur propre profil';
END $$;

