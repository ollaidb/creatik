-- Script pour supprimer le système de rôles
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Supprimer les politiques RLS qui utilisent has_role
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.title_templates;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.title_variables;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.generated_titles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.search_suggestions;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.generation_prompts;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.ai_generation_history;

-- 2. Supprimer le trigger qui assigne automatiquement les rôles
DROP TRIGGER IF EXISTS on_auth_user_assign_role ON auth.users;

-- 3. Supprimer la fonction qui assigne les rôles
DROP FUNCTION IF EXISTS public.assign_admin_role();

-- 4. Supprimer la fonction has_role
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role);

-- 5. Supprimer la table user_roles
DROP TABLE IF EXISTS public.user_roles;

-- 6. Supprimer le type app_role
DROP TYPE IF EXISTS public.app_role;

-- 7. Créer de nouvelles politiques RLS pour permettre l'accès à tous les utilisateurs authentifiés
-- Pour title_templates
CREATE POLICY "Authenticated users can access title_templates"
  ON public.title_templates FOR ALL
  USING (auth.role() = 'authenticated');

-- Pour title_variables  
CREATE POLICY "Authenticated users can access title_variables"
  ON public.title_variables FOR ALL
  USING (auth.role() = 'authenticated');

-- Pour generated_titles
CREATE POLICY "Authenticated users can access generated_titles"
  ON public.generated_titles FOR ALL
  USING (auth.role() = 'authenticated');

-- Pour search_suggestions
CREATE POLICY "Authenticated users can access search_suggestions"
  ON public.search_suggestions FOR ALL
  USING (auth.role() = 'authenticated');

-- Pour generation_prompts
CREATE POLICY "Authenticated users can access generation_prompts"
  ON public.generation_prompts FOR ALL
  USING (auth.role() = 'authenticated');

-- Pour ai_generation_history
CREATE POLICY "Authenticated users can access ai_generation_history"
  ON public.ai_generation_history FOR ALL
  USING (auth.role() = 'authenticated');

-- Vérification que tout a été supprimé
SELECT 'Système de rôles supprimé avec succès' as status; 