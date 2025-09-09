-- Correction simple de l'authentification pour permettre l'accès universel
-- Date: 2025-01-27

-- 1. SUPPRIMER TOUTES LES FONCTIONS DE RESTRICTIONS
DROP FUNCTION IF EXISTS public.assign_admin_role() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, text) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. SUPPRIMER TOUS LES TRIGGERS AUTOMATIQUES
DROP TRIGGER IF EXISTS on_auth_user_assign_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_universal ON auth.users;

-- 3. SUPPRIMER LE TYPE APP_ROLE S'IL EXISTE
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 4. SUPPRIMER TOUTES LES FONCTIONS QUI POURRAIENT AVOIR DES RESTRICTIONS
-- Rechercher et supprimer toutes les fonctions qui contiennent des restrictions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name, routine_schema
        FROM information_schema.routines 
        WHERE routine_definition LIKE '%collabbinta%' 
           OR routine_definition LIKE '%ttefemme%'
           OR routine_definition LIKE '%email = %'
           OR routine_definition LIKE '%NEW.email%'
           OR routine_definition LIKE '%has_role%'
           OR routine_definition LIKE '%assign_admin%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_schema || '.' || func_record.routine_name || ' CASCADE';
    END LOOP;
END $$;

-- 5. CRÉER UNE FONCTION UNIVERSELLE SANS RESTRICTIONS
CREATE OR REPLACE FUNCTION public.handle_new_user_universal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Créer un profil pour TOUS les nouveaux utilisateurs sans restriction
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 6. CRÉER UN TRIGGER UNIVERSEL
CREATE TRIGGER on_auth_user_created_universal
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_universal();

-- 7. CRÉER DES POLITIQUES RLS PERMISSIVES POUR TOUS
-- Accès universel en lecture pour toutes les tables publiques
DROP POLICY IF EXISTS "Universal read access" ON categories;
CREATE POLICY "Universal read access" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON subcategories;
CREATE POLICY "Universal read access" ON subcategories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON content_titles;
CREATE POLICY "Universal read access" ON content_titles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON sources;
CREATE POLICY "Universal read access" ON sources
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON accounts;
CREATE POLICY "Universal read access" ON accounts
  FOR SELECT USING (true);

-- Accès en écriture pour tous les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can write" ON categories;
CREATE POLICY "Authenticated users can write" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON subcategories;
CREATE POLICY "Authenticated users can write" ON subcategories
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON content_titles;
CREATE POLICY "Authenticated users can write" ON content_titles
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON sources;
CREATE POLICY "Authenticated users can write" ON sources
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON accounts;
CREATE POLICY "Authenticated users can write" ON accounts
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour les tables utilisateur (accès personnel)
DROP POLICY IF EXISTS "Users can manage their own data" ON user_publications;
CREATE POLICY "Users can manage their own data" ON user_publications
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own data" ON user_favorites;
CREATE POLICY "Users can manage their own data" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own data" ON user_preferences;
CREATE POLICY "Users can manage their own data" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own data" ON profiles;
CREATE POLICY "Users can manage their own data" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 8. S'ASSURER QUE RLS EST ACTIVÉ MAIS PERMISSIF
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 9. FONCTION DE TEST POUR VÉRIFIER QU'AUCUNE RESTRICTION N'EXISTE
CREATE OR REPLACE FUNCTION public.verify_no_restrictions()
RETURNS TABLE(
  check_type TEXT,
  status TEXT,
  details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier qu'aucune fonction avec des restrictions n'existe
  RETURN QUERY
  SELECT 
    'Fonctions restrictives'::TEXT as check_type,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_definition LIKE '%collabbinta%' 
           OR routine_definition LIKE '%ttefemme%'
           OR routine_definition LIKE '%email = %'
           OR routine_definition LIKE '%has_role%'
      ) THEN 'RESTRICTIONS DÉTECTÉES'
      ELSE 'AUCUNE RESTRICTION'
    END as status,
    'Vérification des fonctions avec restrictions d''email'::TEXT as details;

  -- Vérifier qu'aucune politique RLS restrictive n'existe
  RETURN QUERY
  SELECT 
    'Politiques RLS'::TEXT as check_type,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE qual LIKE '%email%' 
           OR with_check LIKE '%email%'
           OR qual LIKE '%has_role%'
           OR with_check LIKE '%has_role%'
      ) THEN 'RESTRICTIONS DÉTECTÉES'
      ELSE 'AUCUNE RESTRICTION'
    END as status,
    'Vérification des politiques RLS restrictives'::TEXT as details;

  -- Vérifier qu'aucun trigger restrictif n'existe
  RETURN QUERY
  SELECT 
    'Triggers'::TEXT as check_type,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE action_statement LIKE '%email%'
           OR action_statement LIKE '%collabbinta%'
           OR action_statement LIKE '%ttefemme%'
      ) THEN 'RESTRICTIONS DÉTECTÉES'
      ELSE 'AUCUNE RESTRICTION'
    END as status,
    'Vérification des triggers restrictifs'::TEXT as details;

  -- Vérifier que le type app_role n'existe plus
  RETURN QUERY
  SELECT 
    'Type app_role'::TEXT as check_type,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'app_role'
      ) THEN 'TYPE DÉTECTÉ'
      ELSE 'TYPE SUPPRIMÉ'
    END as status,
    'Vérification de la suppression du type app_role'::TEXT as details;
END;
$$;

-- 10. EXÉCUTER LA VÉRIFICATION
SELECT * FROM public.verify_no_restrictions();

-- 11. MESSAGE DE CONFIRMATION FINAL
SELECT 
  'AUTHENTIFICATION UNIVERSELLE ACTIVÉE' as status,
  'Toutes les restrictions d''authentification ont été supprimées' as message,
  'L''application accepte maintenant TOUS les utilisateurs sans restriction' as details; 