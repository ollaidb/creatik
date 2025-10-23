-- Suppression complète de toutes les restrictions d'authentification (VERSION CORRIGÉE)
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

-- 3. SUPPRIMER TOUTES LES TABLES DE RÔLES ET RESTRICTIONS
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 4. SUPPRIMER TOUTES LES POLITIQUES RLS RESTRICTIVES
-- Politiques qui utilisent has_role
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage title_templates" ON public.title_templates;
DROP POLICY IF EXISTS "Admins can manage title_variables" ON public.title_variables;
DROP POLICY IF EXISTS "Admins can manage generated_titles" ON public.generated_titles;
DROP POLICY IF EXISTS "Admins can manage search_suggestions" ON public.search_suggestions;
DROP POLICY IF EXISTS "Admins can manage generation_prompts" ON public.generation_prompts;
DROP POLICY IF EXISTS "Admins can view ai_generation_history" ON public.ai_generation_history;

-- Politiques avec restrictions d'email
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- 5. SUPPRIMER TOUTES LES FONCTIONS QUI POURRAIENT AVOIR DES RESTRICTIONS
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

-- 6. CRÉER UNE FONCTION UNIVERSELLE SANS RESTRICTIONS
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

-- 7. CRÉER UN TRIGGER UNIVERSEL
CREATE TRIGGER on_auth_user_created_universal
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_universal();

-- 8. CRÉER DES POLITIQUES RLS PERMISSIVES POUR TOUS
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

DROP POLICY IF EXISTS "Universal read access" ON title_templates;
CREATE POLICY "Universal read access" ON title_templates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON title_variables;
CREATE POLICY "Universal read access" ON title_variables
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON generated_titles;
CREATE POLICY "Universal read access" ON generated_titles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON search_suggestions;
CREATE POLICY "Universal read access" ON search_suggestions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON generation_prompts;
CREATE POLICY "Universal read access" ON generation_prompts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Universal read access" ON ai_generation_history;
CREATE POLICY "Universal read access" ON ai_generation_history
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

DROP POLICY IF EXISTS "Authenticated users can write" ON title_templates;
CREATE POLICY "Authenticated users can write" ON title_templates
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON title_variables;
CREATE POLICY "Authenticated users can write" ON title_variables
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON generated_titles;
CREATE POLICY "Authenticated users can write" ON generated_titles
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON search_suggestions;
CREATE POLICY "Authenticated users can write" ON search_suggestions
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON generation_prompts;
CREATE POLICY "Authenticated users can write" ON generation_prompts
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write" ON ai_generation_history;
CREATE POLICY "Authenticated users can write" ON ai_generation_history
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

-- 9. S'ASSURER QUE RLS EST ACTIVÉ MAIS PERMISSIF
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_history ENABLE ROW LEVEL SECURITY;

-- 10. FONCTION DE TEST POUR VÉRIFIER QU'AUCUNE RESTRICTION N'EXISTE
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

  -- Vérifier que les tables de rôles n'existent plus
  RETURN QUERY
  SELECT 
    'Tables de rôles'::TEXT as check_type,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_roles'
           OR table_name LIKE '%role%'
      ) THEN 'TABLES DÉTECTÉES'
      ELSE 'TABLES SUPPRIMÉES'
    END as status,
    'Vérification de la suppression des tables de rôles'::TEXT as details;
END;
$$;

-- 11. EXÉCUTER LA VÉRIFICATION
SELECT * FROM public.verify_no_restrictions();

-- 12. MESSAGE DE CONFIRMATION FINAL
SELECT 
  'SUPPRESSION COMPLÈTE TERMINÉE' as status,
  'Toutes les restrictions d''authentification ont été supprimées' as message,
  'L''application accepte maintenant TOUS les utilisateurs sans restriction' as details; 