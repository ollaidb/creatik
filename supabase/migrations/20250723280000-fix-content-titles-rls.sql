-- Migration pour corriger les politiques RLS de content_titles
-- Date: 2025-07-23

-- 1. Supprimer toutes les anciennes politiques qui bloquent
DROP POLICY IF EXISTS "Allow public title creation" ON public.content_titles;
DROP POLICY IF EXISTS "Allow public title reading" ON public.content_titles;
DROP POLICY IF EXISTS "Allow public title update" ON public.content_titles;
DROP POLICY IF EXISTS "Allow automatic content creation" ON public.content_titles;

-- 2. S'assurer que RLS est activé
ALTER TABLE public.content_titles ENABLE ROW LEVEL SECURITY;

-- 3. Créer des politiques RLS très permissives pour permettre la publication directe
-- Permettre l'insertion de nouveaux titres pour tous les utilisateurs
CREATE POLICY "Allow public title creation" 
  ON public.content_titles 
  FOR INSERT 
  WITH CHECK (true);

-- Permettre la lecture de tous les titres
CREATE POLICY "Allow public title reading" 
  ON public.content_titles 
  FOR SELECT 
  USING (true);

-- Permettre la mise à jour des titres
CREATE POLICY "Allow public title update" 
  ON public.content_titles 
  FOR UPDATE 
  USING (true);

-- 4. Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'content_titles'; 