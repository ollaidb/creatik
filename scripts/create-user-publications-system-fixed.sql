-- Création du système de publications par utilisateur (Version corrigée)
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

-- 2. AJOUTER LA COLONNE URL SI ELLE N'EXISTE PAS (pour les tables existantes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
      AND column_name = 'url' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.user_publications ADD COLUMN url TEXT;
    RAISE NOTICE '✅ Colonne url ajoutée à la table user_publications';
  END IF;
END $$;

-- 3. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_user_publications_user_id ON public.user_publications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_publications_content_type ON public.user_publications(content_type);
CREATE INDEX IF NOT EXISTS idx_user_publications_status ON public.user_publications(status);
CREATE INDEX IF NOT EXISTS idx_user_publications_created_at ON public.user_publications(created_at);

-- 4. CRÉER UNE FONCTION POUR METTRE À JOUR LE TIMESTAMP
CREATE OR REPLACE FUNCTION public.update_user_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CRÉER LE TRIGGER POUR METTRE À JOUR LE TIMESTAMP
DROP TRIGGER IF EXISTS trigger_update_user_publications_updated_at ON public.user_publications;
CREATE TRIGGER trigger_update_user_publications_updated_at
  BEFORE UPDATE ON public.user_publications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_publications_updated_at();

-- 6. ACTIVER RLS SUR LA TABLE
ALTER TABLE public.user_publications ENABLE ROW LEVEL SECURITY;

-- 7. SUPPRIMER LES POLITIQUES RLS EXISTANTES AVANT DE LES RECRÉER
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.user_publications;

-- 8. CRÉER LES POLITIQUES RLS
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

-- 9. CRÉER UNE FONCTION POUR AJOUTER AUTOMATIQUEMENT UNE PUBLICATION UTILISATEUR
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

-- 10. CRÉER UNE FONCTION POUR RÉCUPÉRER LES PUBLICATIONS D'UN UTILISATEUR
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

-- 11. CRÉER UNE FONCTION POUR SUPPRIMER UNE PUBLICATION UTILISATEUR
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

-- 12. TESTER L'INSERTION AVEC TOUS LES CHAMPS
SELECT '=== TEST D''INSERTION COMPLÈTE ===' as info;

DO $$
DECLARE
  test_user_id UUID;
  test_publication_id UUID;
BEGIN
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    INSERT INTO user_publications (
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
      test_user_id,
      'title',
      'Test complet - ' || NOW(),
      'Description de test',
      NULL,
      NULL,
      'tiktok',
      'https://example.com',
      'approved'
    ) RETURNING id INTO test_publication_id;
    
    RAISE NOTICE '✅ Test d''insertion réussi avec ID: %', test_publication_id;
    
    -- Nettoyer
    DELETE FROM user_publications WHERE id = test_publication_id;
    RAISE NOTICE 'Publication de test supprimée';
  END IF;
END $$;

-- 13. VÉRIFIER QUE LA TABLE EST CRÉÉE CORRECTEMENT
SELECT 
  'SYSTÈME DE PUBLICATIONS UTILISATEUR CRÉÉ' as status,
  'Table user_publications configurée avec succès' as message,
  'Les utilisateurs peuvent maintenant voir leurs publications personnelles' as details;

-- 14. AFFICHER LES POLITIQUES CRÉÉES
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_publications'; 