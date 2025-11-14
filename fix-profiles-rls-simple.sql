-- Script SIMPLE et DIRECT pour corriger les erreurs 403 sur la table profiles
-- Copiez-collez ce script dans Supabase SQL Editor et exécutez-le

-- ÉTAPE 1: Supprimer toutes les politiques existantes
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

-- ÉTAPE 2: S'assurer que RLS est activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: Créer les nouvelles politiques (noms simples)
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
INSERT INTO public.profiles (id, email, first_name, last_name)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', '')
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ÉTAPE 5: Vérifier que tout fonctionne
SELECT 
  'Politiques créées:' as info,
  COUNT(*) as count
FROM pg_policies
WHERE tablename = 'profiles';

SELECT 
  'Profils créés:' as info,
  COUNT(*) as count
FROM public.profiles;

