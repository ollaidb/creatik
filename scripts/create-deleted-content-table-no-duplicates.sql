-- Script SQL pour créer la table deleted_content SANS DOUBLONS
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Créer la table deleted_content pour la corbeille
CREATE TABLE IF NOT EXISTS public.deleted_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'challenge')),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID,
    subcategory_id UUID,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(original_id, content_type, user_id)
);

-- Créer les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_deleted_content_user_id ON public.deleted_content(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_content_deleted_at ON public.deleted_content(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deleted_content_content_type ON public.deleted_content(content_type);
CREATE INDEX IF NOT EXISTS idx_deleted_content_original_id ON public.deleted_content(original_id);

-- Activer RLS (Row Level Security)
ALTER TABLE public.deleted_content ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres éléments supprimés
CREATE POLICY "Users can view their own deleted content" ON public.deleted_content
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer leurs propres éléments supprimés
CREATE POLICY "Users can insert their own deleted content" ON public.deleted_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres éléments supprimés
CREATE POLICY "Users can delete their own deleted content" ON public.deleted_content
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour nettoyer automatiquement les éléments supprimés après 30 jours
CREATE OR REPLACE FUNCTION cleanup_deleted_content()
RETURNS void AS $$
BEGIN
    DELETE FROM public.deleted_content 
    WHERE deleted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour insérer sans doublons (INSERT ... ON CONFLICT)
CREATE OR REPLACE FUNCTION insert_deleted_content_safe(
    p_original_id UUID,
    p_content_type TEXT,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_user_id UUID,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    INSERT INTO public.deleted_content (
        original_id,
        content_type,
        title,
        description,
        category_id,
        subcategory_id,
        user_id,
        metadata
    ) VALUES (
        p_original_id,
        p_content_type,
        p_title,
        p_description,
        p_category_id,
        p_subcategory_id,
        p_user_id,
        p_metadata
    )
    ON CONFLICT (original_id, content_type, user_id) 
    DO UPDATE SET
        deleted_at = NOW(),
        metadata = p_metadata
    RETURNING id INTO result;
    
    RETURN jsonb_build_object('success', true, 'id', result);
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql; 