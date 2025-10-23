-- Migration pour corriger les politiques RLS et permettre la publication automatique
-- Date: 2025-07-23

-- 1. Supprimer les anciennes politiques qui pourraient bloquer
DROP POLICY IF EXISTS "Allow automatic content creation" ON public.categories;
DROP POLICY IF EXISTS "Allow automatic content creation" ON public.subcategories;
DROP POLICY IF EXISTS "Allow automatic content creation" ON public.content_titles;

-- 2. Créer des politiques RLS plus permissives pour la publication automatique
-- Permettre l'insertion de nouvelles catégories
CREATE POLICY "Allow public category creation" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (true);

-- Permettre l'insertion de nouvelles sous-catégories
CREATE POLICY "Allow public subcategory creation" 
  ON public.subcategories 
  FOR INSERT 
  WITH CHECK (true);

-- Permettre l'insertion de nouveaux titres
CREATE POLICY "Allow public title creation" 
  ON public.content_titles 
  FOR INSERT 
  WITH CHECK (true);

-- 3. Permettre la lecture pour vérifier les doublons
CREATE POLICY "Allow public category reading" 
  ON public.categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public subcategory reading" 
  ON public.subcategories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public title reading" 
  ON public.content_titles 
  FOR SELECT 
  USING (true);

-- 4. Permettre la mise à jour si nécessaire
CREATE POLICY "Allow public category update" 
  ON public.categories 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public subcategory update" 
  ON public.subcategories 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public title update" 
  ON public.content_titles 
  FOR UPDATE 
  USING (true); 