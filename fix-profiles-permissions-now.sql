-- Script URGENT pour corriger les erreurs 403 sur la table profiles
-- Copiez-collez ce script dans Supabase SQL Editor et exécutez-le IMMÉDIATEMENT
-- Ce script corrige les permissions RLS et permet à l'application de fonctionner

-- ÉTAPE 1: Supprimer toutes les politiques existantes pour éviter les conflits
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

-- ÉTAPE 3: Créer les nouvelles politiques RLS (noms simples et clairs)
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
-- Utilise une fonction SECURITY DEFINER pour contourner RLS temporairement
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
END;
$$;

-- Exécuter la fonction pour créer les profils manquants
SELECT public.create_missing_profiles();

-- Nettoyer la fonction temporaire (optionnel)
DROP FUNCTION IF EXISTS public.create_missing_profiles();

-- ÉTAPE 5: Vérification - Afficher le nombre de politiques créées
SELECT 
  'Politiques RLS créées:' as info,
  COUNT(*) as count
FROM pg_policies
WHERE tablename = 'profiles';

-- Afficher le nombre de profils
SELECT 
  'Profils dans la table:' as info,
  COUNT(*) as count
FROM public.profiles;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Script exécuté avec succès!';
  RAISE NOTICE '✅ Les politiques RLS pour profiles ont été corrigées';
  RAISE NOTICE '✅ Les profils manquants ont été créés';
  RAISE NOTICE '✅ L''application devrait maintenant fonctionner correctement';
END $$;

