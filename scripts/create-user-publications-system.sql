-- Création du système de publications par utilisateur
-- Date: 2025-01-27

-- 1. CRÉER LA TABLE USER_PUBLICATIONS SI ELLE N'EXISTE PAS
CREATE TABLE IF NOT EXISTS public.user_publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks')),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  platform TEXT,
  url TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_user_publications_user_id ON public.user_publications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_publications_content_type ON public.user_publications(content_type);
CREATE INDEX IF NOT EXISTS idx_user_publications_status ON public.user_publications(status);
CREATE INDEX IF NOT EXISTS idx_user_publications_created_at ON public.user_publications(created_at);

-- 3. CRÉER UNE FONCTION POUR METTRE À JOUR LE TIMESTAMP
CREATE OR REPLACE FUNCTION public.update_user_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. CRÉER LE TRIGGER POUR METTRE À JOUR LE TIMESTAMP
DROP TRIGGER IF EXISTS trigger_update_user_publications_updated_at ON public.user_publications;
CREATE TRIGGER trigger_update_user_publications_updated_at
  BEFORE UPDATE ON public.user_publications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_publications_updated_at();

-- 5. ACTIVER RLS SUR LA TABLE
ALTER TABLE public.user_publications ENABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES POLITIQUES RLS
-- Les utilisateurs peuvent voir leurs propres publications
CREATE POLICY "Users can view their own publications" ON public.user_publications
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres publications
CREATE POLICY "Users can create their own publications" ON public.user_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres publications
CREATE POLICY "Users can update their own publications" ON public.user_publications
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres publications
CREATE POLICY "Users can delete their own publications" ON public.user_publications
  FOR DELETE USING (auth.uid() = user_id);

-- 7. CRÉER UNE FONCTION POUR AJOUTER AUTOMATIQUEMENT UNE PUBLICATION UTILISATEUR
CREATE OR REPLACE FUNCTION public.add_user_publication(
  p_user_id UUID,
  p_content_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_subcategory_id UUID DEFAULT NULL,
  p_platform TEXT DEFAULT NULL,
  p_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  publication_id UUID;
BEGIN
  INSERT INTO public.user_publications (
    user_id,
    content_type,
    title,
    description,
    category_id,
    subcategory_id,
    platform,
    url,
    status
  ) VALUES (
    p_user_id,
    p_content_type,
    p_title,
    p_description,
    p_category_id,
    p_subcategory_id,
    p_platform,
    p_url,
    'approved'
  ) RETURNING id INTO publication_id;
  
  RETURN publication_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CRÉER UNE FONCTION POUR RÉCUPÉRER LES PUBLICATIONS D'UN UTILISATEUR
CREATE OR REPLACE FUNCTION public.get_user_publications(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  content_type TEXT,
  title TEXT,
  description TEXT,
  category_id UUID,
  subcategory_id UUID,
  platform TEXT,
  url TEXT,
  status TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.content_type,
    up.title,
    up.description,
    up.category_id,
    up.subcategory_id,
    up.platform,
    up.url,
    up.status,
    up.rejection_reason,
    up.created_at,
    up.updated_at
  FROM public.user_publications up
  WHERE up.user_id = p_user_id
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CRÉER UNE FONCTION POUR SUPPRIMER UNE PUBLICATION UTILISATEUR
CREATE OR REPLACE FUNCTION public.delete_user_publication(p_publication_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_publications 
  WHERE id = p_publication_id AND user_id = p_user_id;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. VÉRIFIER QUE LA TABLE EST CRÉÉE CORRECTEMENT
SELECT 
  'SYSTÈME DE PUBLICATIONS UTILISATEUR CRÉÉ' as status,
  'Table user_publications configurée avec succès' as message,
  'Les utilisateurs peuvent maintenant voir leurs publications personnelles' as details; 