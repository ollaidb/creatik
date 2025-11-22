-- Script pour mettre à jour la contrainte CHECK de user_publications
-- pour inclure tous les types de contenu publiables
-- Date: 2025-01-28

-- 1. Supprimer l'ancienne contrainte si elle existe
DO $$ 
BEGIN
  -- Supprimer toutes les contraintes CHECK existantes pour content_type
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_publications_content_type_check'
    AND table_name = 'user_publications'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.user_publications 
    DROP CONSTRAINT user_publications_content_type_check;
    RAISE NOTICE '✅ Ancienne contrainte supprimée';
  END IF;
END $$;

-- 2. Ajouter la nouvelle contrainte avec tous les types de contenu
ALTER TABLE public.user_publications 
ADD CONSTRAINT user_publications_content_type_check 
CHECK (content_type IN (
  'category',
  'subcategory',
  'subcategory_level2',
  'title',
  'hooks',
  'content',
  'creator',
  'account',
  'source',
  'pseudo'
));

-- 3. Vérifier que la colonne subcategory_level2_id existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
    AND column_name = 'subcategory_level2_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.user_publications 
    ADD COLUMN subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE SET NULL;
    RAISE NOTICE '✅ Colonne subcategory_level2_id ajoutée';
  END IF;
END $$;

-- 4. Créer un index pour optimiser les requêtes sur subcategory_level2_id
CREATE INDEX IF NOT EXISTS idx_user_publications_subcategory_level2_id 
ON public.user_publications(subcategory_level2_id);

-- 5. Vérifier que toutes les colonnes nécessaires existent
DO $$ 
BEGIN
  -- Vérifier la colonne url
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_publications' 
    AND column_name = 'url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.user_publications ADD COLUMN url TEXT;
    RAISE NOTICE '✅ Colonne url ajoutée';
  END IF;
END $$;

-- 6. Afficher un message de confirmation
DO $$ 
BEGIN
  RAISE NOTICE '✅ Contrainte CHECK mise à jour avec succès';
  RAISE NOTICE '✅ Types de contenu autorisés: category, subcategory, subcategory_level2, title, hooks, content, creator, account, source, pseudo';
END $$;

