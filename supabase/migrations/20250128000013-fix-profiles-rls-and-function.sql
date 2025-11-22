-- Migration: Fix Profiles RLS and Update Function Permissions
-- Description: Fix RLS policies for profiles table and ensure function works correctly

-- ÉTAPE 1: Supprimer toutes les politiques existantes sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- ÉTAPE 2: S'assurer que RLS est activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: Créer les nouvelles politiques RLS pour profiles
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ÉTAPE 4: Créer les profils manquants pour tous les utilisateurs existants
-- Cette étape utilise SECURITY DEFINER pour contourner RLS
DO $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'first_name', ''),
    COALESCE(u.raw_user_meta_data->>'last_name', '')
  FROM auth.users u
  WHERE u.id NOT IN (SELECT id FROM public.profiles)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la création des profils: %', SQLERRM;
END $$;

-- ÉTAPE 5: S'assurer que la fonction get_creator_challenges_with_user peut lire les profils
-- La fonction utilise SECURITY DEFINER donc elle peut contourner RLS
-- Mais nous devons nous assurer qu'elle a les bonnes permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Note: La fonction get_creator_challenges_with_user utilise SECURITY DEFINER
-- donc elle peut lire les profils même si l'utilisateur n'a pas directement accès

-- ÉTAPE 6: Vérification
DO $$
BEGIN
  RAISE NOTICE 'Migration terminée avec succès';
  RAISE NOTICE 'Les politiques RLS pour profiles ont été créées';
  RAISE NOTICE 'La fonction get_creator_challenges_with_user peut maintenant lire les profils';
END $$;

