-- Script SQL pour mettre à jour la table user_preferences avec les nouveaux champs de personnalisation
-- Ce script ajoute les colonnes nécessaires pour la personnalisation avancée de la section "Pour toi"

-- ============================================
-- 1. VÉRIFIER SI LA TABLE EXISTE
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_preferences'
    ) THEN
        RAISE EXCEPTION 'La table user_preferences n''existe pas. Veuillez d''abord exécuter la migration initiale.';
    END IF;
END $$;

-- ============================================
-- 2. AJOUTER LES NOUVELLES COLONNES
-- ============================================

-- Catégorie préférée du créateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS preferred_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Sous-catégorie préférée du créateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS preferred_subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Sous-catégorie niveau 2 préférée (si applicable)
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS preferred_subcategory_level2_id UUID REFERENCES public.subcategories_level2(id) ON DELETE SET NULL;

-- IDs des titres qui ressemblent au style du créateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS similar_titles_ids UUID[] DEFAULT '{}';

-- IDs des créateurs vers lesquels l'utilisateur aspire
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS inspiring_creators_ids UUID[] DEFAULT '{}';

-- IDs des réseaux sociaux préférés de l'utilisateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS preferred_networks_ids UUID[] DEFAULT '{}';

-- IDs des thèmes préférés de l'utilisateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS preferred_themes_ids UUID[] DEFAULT '{}';

-- Objectif final du créateur
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS final_goal TEXT[];

-- Valeurs du créateur (tableau de valeurs)
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS values TEXT[] DEFAULT '{}';

-- Raison de création de contenu
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS creation_reason TEXT;

-- Type de créateur (influenceur, créateur de contenu, entreprise, etc.)
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS creator_type TEXT;

-- ============================================
-- 3. CRÉER DES INDEX POUR OPTIMISER LES PERFORMANCES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_preferences_category_id 
ON public.user_preferences(preferred_category_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_subcategory_id 
ON public.user_preferences(preferred_subcategory_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_subcategory_level2_id 
ON public.user_preferences(preferred_subcategory_level2_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_creator_type 
ON public.user_preferences(creator_type);

-- Index pour les réseaux et thèmes (utilisant GIN pour les tableaux)
CREATE INDEX IF NOT EXISTS idx_user_preferences_networks_ids 
ON public.user_preferences USING GIN(preferred_networks_ids);

CREATE INDEX IF NOT EXISTS idx_user_preferences_themes_ids 
ON public.user_preferences USING GIN(preferred_themes_ids);

-- ============================================
-- 4. COMMENTAIRES SUR LES COLONNES
-- ============================================

COMMENT ON COLUMN public.user_preferences.preferred_category_id IS 'Catégorie principale choisie par le créateur pour personnaliser la section "Pour toi"';
COMMENT ON COLUMN public.user_preferences.preferred_subcategory_id IS 'Sous-catégorie choisie par le créateur pour personnaliser la section "Pour toi"';
COMMENT ON COLUMN public.user_preferences.preferred_subcategory_level2_id IS 'Sous-catégorie niveau 2 choisie par le créateur (si applicable)';
COMMENT ON COLUMN public.user_preferences.similar_titles_ids IS 'IDs des titres qui ressemblent au style du créateur';
COMMENT ON COLUMN public.user_preferences.inspiring_creators_ids IS 'IDs des créateurs vers lesquels l''utilisateur aspire';
COMMENT ON COLUMN public.user_preferences.preferred_networks_ids IS 'IDs des réseaux sociaux préférés de l''utilisateur pour personnaliser les recommandations';
COMMENT ON COLUMN public.user_preferences.preferred_themes_ids IS 'IDs des thèmes préférés de l''utilisateur pour personnaliser les recommandations';
COMMENT ON COLUMN public.user_preferences.final_goal IS 'Objectifs finaux du créateur (tableau)';
COMMENT ON COLUMN public.user_preferences.values IS 'Valeurs importantes pour le créateur';
COMMENT ON COLUMN public.user_preferences.creator_type IS 'Type de créateur : influenceur, créateur de contenu, entreprise, etc.';

-- ============================================
-- 5. VÉRIFICATION DE LA STRUCTURE FINALE
-- ============================================

DO $$
DECLARE
    column_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_preferences';
    
    RAISE NOTICE '✅ Table user_preferences mise à jour avec succès. Nombre total de colonnes: %', column_count;
    RAISE NOTICE '✅ Les nouvelles colonnes de personnalisation ont été ajoutées.';
END $$;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

