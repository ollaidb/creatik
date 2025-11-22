-- Migration complète pour toutes les modifications
-- Date: 2025-01-XX
-- Description: Ajoute les colonnes nécessaires pour le système de publication multiple et de filtrage des créateurs

-- ============================================
-- 1. Ajouter category_id et subcategory_id à la table creators
-- ============================================
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_creators_category_id ON public.creators(category_id);
CREATE INDEX IF NOT EXISTS idx_creators_subcategory_id ON public.creators(subcategory_id);

-- Commentaires sur les colonnes
COMMENT ON COLUMN public.creators.category_id IS 'Référence à la catégorie du créateur pour le filtrage dans la page des titres';
COMMENT ON COLUMN public.creators.subcategory_id IS 'Référence à la sous-catégorie du créateur pour le filtrage dans la page des titres';

-- ============================================
-- 2. S'assurer que les contraintes d'unicité existent pour éviter les doublons
-- ============================================

-- Contrainte d'unicité pour les catégories (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_category_name'
    ) THEN
        ALTER TABLE public.categories 
        ADD CONSTRAINT unique_category_name UNIQUE (name);
    END IF;
END $$;

-- Contrainte d'unicité pour les sous-catégories par catégorie (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_subcategory_name_per_category'
    ) THEN
        ALTER TABLE public.subcategories 
        ADD CONSTRAINT unique_subcategory_name_per_category UNIQUE (name, category_id);
    END IF;
END $$;

-- Contrainte d'unicité pour les sous-catégories niveau 2 par sous-catégorie parent (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_subcategory_level2_name_per_subcategory'
    ) THEN
        ALTER TABLE public.subcategories_level2 
        ADD CONSTRAINT unique_subcategory_level2_name_per_subcategory UNIQUE (name, subcategory_id);
    END IF;
END $$;

-- Contrainte d'unicité pour les titres par sous-catégorie (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_title_per_subcategory'
    ) THEN
        ALTER TABLE public.content_titles 
        ADD CONSTRAINT unique_title_per_subcategory UNIQUE (title, subcategory_id, type, platform);
    END IF;
END $$;

-- Contrainte d'unicité pour les créateurs par sous-catégorie (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_creator_name_per_subcategory'
    ) THEN
        ALTER TABLE public.creators 
        ADD CONSTRAINT unique_creator_name_per_subcategory UNIQUE (name, subcategory_id);
    END IF;
END $$;

-- ============================================
-- 3. Fonctions pour vérifier les doublons (améliorées)
-- ============================================

-- Fonction pour vérifier si une catégorie existe déjà
CREATE OR REPLACE FUNCTION check_category_exists(category_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.categories WHERE LOWER(TRIM(name)) = LOWER(TRIM(category_name)));
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si une sous-catégorie existe déjà
CREATE OR REPLACE FUNCTION check_subcategory_exists(subcategory_name TEXT, cat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.subcategories 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(subcategory_name)) 
    AND category_id = cat_id
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si une sous-catégorie niveau 2 existe déjà
CREATE OR REPLACE FUNCTION check_subcategory_level2_exists(subcategory_level2_name TEXT, subcat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.subcategories_level2 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(subcategory_level2_name)) 
    AND subcategory_id = subcat_id
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si un titre existe déjà
CREATE OR REPLACE FUNCTION check_title_exists(title_text TEXT, subcat_id UUID, title_type TEXT DEFAULT 'title', title_platform TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.content_titles 
    WHERE LOWER(TRIM(title)) = LOWER(TRIM(title_text)) 
    AND subcategory_id = subcat_id
    AND type = title_type
    AND (title_platform IS NULL OR platform = title_platform)
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si un créateur existe déjà
CREATE OR REPLACE FUNCTION check_creator_exists(creator_name TEXT, subcat_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.creators 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(creator_name)) 
    AND subcategory_id = subcat_id
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si une source existe déjà
CREATE OR REPLACE FUNCTION check_source_exists(source_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.sources 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(source_name))
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Index supplémentaires pour améliorer les performances de recherche
-- ============================================

-- Index pour les recherches de titres par sous-catégorie et type
CREATE INDEX IF NOT EXISTS idx_content_titles_subcategory_type ON public.content_titles(subcategory_id, type);
CREATE INDEX IF NOT EXISTS idx_content_titles_platform ON public.content_titles(platform);

-- Index pour les recherches de créateurs par sous-catégorie
CREATE INDEX IF NOT EXISTS idx_creators_subcategory_id_name ON public.creators(subcategory_id, name);

-- Index pour les recherches de sources
CREATE INDEX IF NOT EXISTS idx_sources_name ON public.sources(name);

-- ============================================
-- 5. Vérification et nettoyage des données existantes (optionnel)
-- ============================================

-- Mettre à jour les créateurs existants qui n'ont pas de category_id/subcategory_id
-- (si vous avez des données existantes à migrer)
-- UPDATE public.creators 
-- SET category_id = (SELECT category_id FROM public.subcategories WHERE id = creators.subcategory_id)
-- WHERE subcategory_id IS NOT NULL AND category_id IS NULL;

-- ============================================
-- 6. Permissions RLS (si nécessaire)
-- ============================================

-- S'assurer que les utilisateurs peuvent lire les créateurs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creators' 
        AND policyname = 'Creators are viewable by everyone'
    ) THEN
        CREATE POLICY "Creators are viewable by everyone" ON public.creators
        FOR SELECT USING (true);
    END IF;
END $$;

-- S'assurer que les utilisateurs authentifiés peuvent insérer des créateurs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creators' 
        AND policyname = 'Creators are insertable by authenticated users'
    ) THEN
        CREATE POLICY "Creators are insertable by authenticated users" ON public.creators
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

-- Message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE 'Migration complète appliquée avec succès!';
    RAISE NOTICE 'Colonnes category_id et subcategory_id ajoutées à la table creators';
    RAISE NOTICE 'Contraintes d''unicité vérifiées et créées si nécessaire';
    RAISE NOTICE 'Fonctions de vérification des doublons créées/mises à jour';
    RAISE NOTICE 'Index de performance créés';
END $$;

