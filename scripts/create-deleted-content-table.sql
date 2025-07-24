-- Script pour créer la table deleted_content dans Supabase
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
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Créer les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_deleted_content_user_id ON public.deleted_content(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_content_deleted_at ON public.deleted_content(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deleted_content_content_type ON public.deleted_content(content_type);

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

-- Politique pour permettre aux admins de voir tous les éléments supprimés
CREATE POLICY "Admins can view all deleted content" ON public.deleted_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Politique pour permettre aux admins de supprimer tous les éléments supprimés
CREATE POLICY "Admins can delete all deleted content" ON public.deleted_content
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Fonction pour nettoyer automatiquement les éléments supprimés après 30 jours
CREATE OR REPLACE FUNCTION cleanup_deleted_content()
RETURNS void AS $$
BEGIN
    DELETE FROM public.deleted_content 
    WHERE deleted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql; 