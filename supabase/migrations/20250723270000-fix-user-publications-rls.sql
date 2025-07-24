-- Migration pour corriger les politiques RLS de user_publications
-- Date: 2025-07-23

-- 1. S'assurer que la table user_publications existe
CREATE TABLE IF NOT EXISTS public.user_publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'content', 'content_title', 'inspiring_content')),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  platform TEXT,
  content_format TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Activer RLS sur user_publications
ALTER TABLE public.user_publications ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques qui pourraient bloquer
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Admins can view all publications" ON public.user_publications;
DROP POLICY IF EXISTS "Admins can update all publications" ON public.user_publications;

-- 4. Créer les politiques RLS pour user_publications
-- Les utilisateurs peuvent voir leurs propres publications
CREATE POLICY "Users can view their own publications" 
  ON public.user_publications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres publications
CREATE POLICY "Users can create their own publications" 
  ON public.user_publications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres publications
CREATE POLICY "Users can update their own publications" 
  ON public.user_publications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres publications
CREATE POLICY "Users can delete their own publications" 
  ON public.user_publications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Les admins peuvent voir toutes les publications
CREATE POLICY "Admins can view all publications"
  ON public.user_publications
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent modifier toutes les publications
CREATE POLICY "Admins can update all publications"
  ON public.user_publications
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_publications'; 