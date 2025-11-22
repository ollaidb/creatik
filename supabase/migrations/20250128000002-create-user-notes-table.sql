-- Migration: Create User Notes Table
-- Description: Create a comprehensive notes system for users to organize their creative ideas

-- Créer la table des notes utilisateur
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    color TEXT DEFAULT '#3B82F6',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_category ON public.user_notes(category);
CREATE INDEX IF NOT EXISTS idx_user_notes_tags ON public.user_notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_notes_favorite ON public.user_notes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_user_notes_archived ON public.user_notes(is_archived);
CREATE INDEX IF NOT EXISTS idx_user_notes_updated_at ON public.user_notes(updated_at DESC);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_user_notes_updated_at
    BEFORE UPDATE ON public.user_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_user_notes_updated_at();

-- Créer une fonction de recherche full-text pour les notes
CREATE OR REPLACE FUNCTION search_user_notes(
    search_query TEXT,
    user_uuid UUID,
    category_filter TEXT DEFAULT NULL,
    tags_filter TEXT[] DEFAULT NULL,
    show_archived BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[],
    color TEXT,
    is_favorite BOOLEAN,
    is_archived BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        un.id,
        un.title,
        un.content,
        un.category,
        un.tags,
        un.color,
        un.is_favorite,
        un.is_archived,
        un.created_at,
        un.updated_at,
        CASE 
            WHEN un.title ILIKE '%' || search_query || '%' THEN 3.0
            WHEN un.content ILIKE '%' || search_query || '%' THEN 2.0
            WHEN EXISTS(SELECT 1 FROM unnest(un.tags) tag WHERE tag ILIKE '%' || search_query || '%') THEN 1.5
            ELSE 0.5
        END as relevance
    FROM public.user_notes un
    WHERE un.user_id = user_uuid
        AND (category_filter IS NULL OR un.category = category_filter)
        AND (tags_filter IS NULL OR un.tags && tags_filter)
        AND (show_archived IS NULL OR un.is_archived = show_archived)
        AND (
            un.title ILIKE '%' || search_query || '%' OR
            un.content ILIKE '%' || search_query || '%' OR
            EXISTS(SELECT 1 FROM unnest(un.tags) tag WHERE tag ILIKE '%' || search_query || '%')
        )
    ORDER BY relevance DESC, un.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour obtenir les statistiques des notes d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_notes_stats(user_uuid UUID)
RETURNS TABLE(
    total_count BIGINT,
    favorites_count BIGINT,
    archived_count BIGINT,
    active_count BIGINT,
    categories_count BIGINT,
    tags_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_count,
        COUNT(*) FILTER (WHERE is_favorite)::BIGINT as favorites_count,
        COUNT(*) FILTER (WHERE is_archived)::BIGINT as archived_count,
        COUNT(*) FILTER (WHERE NOT is_archived)::BIGINT as active_count,
        COUNT(DISTINCT category)::BIGINT as categories_count,
        COUNT(DISTINCT unnest(tags))::BIGINT as tags_count
    FROM public.user_notes
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour obtenir les tags les plus utilisés d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_top_tags(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    tag TEXT,
    usage_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tag,
        COUNT(*)::BIGINT as usage_count
    FROM public.user_notes,
         unnest(tags) tag
    WHERE user_id = user_uuid
        AND NOT is_archived
    GROUP BY tag
    ORDER BY usage_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour obtenir les catégories les plus utilisées d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_top_categories(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    category TEXT,
    usage_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        category,
        COUNT(*)::BIGINT as usage_count
    FROM public.user_notes
    WHERE user_id = user_uuid
        AND NOT is_archived
    GROUP BY category
    ORDER BY usage_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS (Row Level Security)
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
-- Politique pour permettre aux utilisateurs de voir uniquement leurs propres notes
CREATE POLICY "Users can view their own notes" ON public.user_notes
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres notes
CREATE POLICY "Users can create their own notes" ON public.user_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres notes
CREATE POLICY "Users can update their own notes" ON public.user_notes
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres notes
CREATE POLICY "Users can delete their own notes" ON public.user_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Insérer des données d'exemple pour les utilisateurs connectés (optionnel)
-- Cette section peut être commentée en production
/*
INSERT INTO public.user_notes (user_id, title, content, category, tags, color, is_favorite)
SELECT 
    au.id,
    'Bienvenue dans vos notes !' as title,
    'Cette est votre première note. Utilisez-la pour organiser vos idées créatives, vos inspirations et vos plans de contenu.' as content,
    'Général' as category,
    ARRAY['bienvenue', 'première-note', 'aide'] as tags,
    '#3B82F6' as color,
    true as is_favorite
FROM auth.users au
WHERE au.id = auth.uid()
LIMIT 1;
*/

-- Commentaires sur la table
COMMENT ON TABLE public.user_notes IS 'Table pour stocker les notes personnelles des utilisateurs';
COMMENT ON COLUMN public.user_notes.id IS 'Identifiant unique de la note';
COMMENT ON COLUMN public.user_notes.user_id IS 'Identifiant de l''utilisateur propriétaire de la note';
COMMENT ON COLUMN public.user_notes.title IS 'Titre de la note';
COMMENT ON COLUMN public.user_notes.content IS 'Contenu principal de la note';
COMMENT ON COLUMN public.user_notes.category IS 'Catégorie de la note (ex: Général, Content Ideas, Inspiration)';
COMMENT ON COLUMN public.user_notes.tags IS 'Tableau de tags pour organiser et rechercher les notes';
COMMENT ON COLUMN public.user_notes.color IS 'Couleur d''identification de la note (format hex)';
COMMENT ON COLUMN public.user_notes.is_favorite IS 'Indique si la note est marquée comme favorite';
COMMENT ON COLUMN public.user_notes.is_archived IS 'Indique si la note est archivée';
COMMENT ON COLUMN public.user_notes.created_at IS 'Date et heure de création de la note';
COMMENT ON COLUMN public.user_notes.updated_at IS 'Date et heure de dernière modification de la note';

-- Vérifier que la table a été créée correctement
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_notes') THEN
        RAISE NOTICE 'Table user_notes créée avec succès';
        RAISE NOTICE 'Index et triggers configurés';
        RAISE NOTICE 'RLS activé avec politiques de sécurité';
        RAISE NOTICE 'Fonctions utilitaires créées';
    ELSE
        RAISE EXCEPTION 'Erreur lors de la création de la table user_notes';
    END IF;
END $$;
