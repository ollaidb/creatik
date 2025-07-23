
-- Mettre à jour la table profiles pour supporter les avatars
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Créer la table user_publications si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'content')),
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

-- Enable RLS sur user_publications si pas déjà fait
ALTER TABLE public.user_publications ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;

-- Créer les politiques RLS pour user_publications
CREATE POLICY "Users can view their own publications" 
  ON public.user_publications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own publications" 
  ON public.user_publications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" 
  ON public.user_publications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" 
  ON public.user_publications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Créer un bucket pour les avatars si il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre à tous de voir les avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Politique pour permettre aux utilisateurs connectés d'uploader des avatars
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de modifier leur avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Politique pour permettre aux utilisateurs de supprimer leur avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
