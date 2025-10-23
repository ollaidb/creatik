-- Migration: Create Advanced Notes System
-- Description: Create a hierarchical folder/document system like Apple Notes
-- with support for content creation and account ideas organization

-- 1. Table des dossiers (folders)
CREATE TABLE IF NOT EXISTS public.user_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('content', 'account_ideas')), -- Type de dossier
    parent_folder_id UUID REFERENCES public.user_folders(id) ON DELETE CASCADE, -- Pour les sous-dossiers
    color TEXT DEFAULT '#3B82F6', -- Couleur du dossier
    icon TEXT DEFAULT 'folder', -- Icône du dossier
    sort_order INTEGER DEFAULT 0, -- Ordre d'affichage
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des documents (documents)
CREATE TABLE IF NOT EXISTS public.user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES public.user_folders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('content', 'account_idea')), -- Type de document
    format TEXT DEFAULT 'markdown', -- Format du contenu (markdown, rich_text, plain_text)
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE, -- Épingler en haut
    word_count INTEGER DEFAULT 0, -- Nombre de mots
    reading_time INTEGER DEFAULT 0, -- Temps de lecture estimé (minutes)
    last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des paramètres de réseaux sociaux pour les documents de contenu
CREATE TABLE IF NOT EXISTS public.document_social_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.user_documents(id) ON DELETE CASCADE NOT NULL,
    social_network TEXT NOT NULL, -- 'instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'
    target_audience TEXT, -- Audience cible
    content_goals TEXT[], -- Objectifs du contenu
    hashtags TEXT[], -- Hashtags suggérés
    posting_time_suggestion TIMESTAMP WITH TIME ZONE, -- Heure suggérée de publication
    engagement_strategy TEXT, -- Stratégie d'engagement
    call_to_action TEXT, -- Call-to-action
    visual_requirements TEXT, -- Exigences visuelles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des paramètres de compte pour les documents d'idées de compte
CREATE TABLE IF NOT EXISTS public.document_account_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.user_documents(id) ON DELETE CASCADE NOT NULL,
    account_area TEXT NOT NULL, -- 'bio', 'profile', 'strategy', 'growth', 'engagement'
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    implementation_status TEXT DEFAULT 'idea' CHECK (implementation_status IN ('idea', 'planning', 'in_progress', 'completed', 'on_hold')),
    target_date DATE, -- Date cible d'implémentation
    resources_needed TEXT[], -- Ressources nécessaires
    success_metrics TEXT[], -- Métriques de succès
    notes TEXT, -- Notes supplémentaires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des versions de documents (historique des modifications)
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.user_documents(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    change_summary TEXT, -- Résumé des changements
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des modèles de documents (templates)
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('content', 'account_idea')),
    template_content TEXT NOT NULL,
    social_network TEXT, -- Pour les templates de contenu
    account_area TEXT, -- Pour les templates d'idées de compte
    is_public BOOLEAN DEFAULT FALSE, -- Templates partagés
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_folders_user_id ON public.user_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_folders_type ON public.user_folders(type);
CREATE INDEX IF NOT EXISTS idx_user_folders_parent ON public.user_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_user_folders_sort ON public.user_folders(sort_order);

CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_folder_id ON public.user_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON public.user_documents(type);
CREATE INDEX IF NOT EXISTS idx_user_documents_tags ON public.user_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_documents_favorite ON public.user_documents(is_favorite);
CREATE INDEX IF NOT EXISTS idx_user_documents_pinned ON public.user_documents(is_pinned);
CREATE INDEX IF NOT EXISTS idx_user_documents_archived ON public.user_documents(is_archived);
CREATE INDEX IF NOT EXISTS idx_user_documents_last_edited ON public.user_documents(last_edited_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_social_settings_document_id ON public.document_social_settings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_social_settings_network ON public.document_social_settings(social_network);

CREATE INDEX IF NOT EXISTS idx_document_account_settings_document_id ON public.document_account_settings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_account_settings_area ON public.document_account_settings(account_area);
CREATE INDEX IF NOT EXISTS idx_document_account_settings_status ON public.document_account_settings(implementation_status);

CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_number ON public.document_versions(version_number);

CREATE INDEX IF NOT EXISTS idx_document_templates_user_id ON public.document_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON public.document_templates(type);
CREATE INDEX IF NOT EXISTS idx_document_templates_public ON public.document_templates(is_public);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_edited_at = NOW();
    -- Calculer le nombre de mots
    NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
    -- Calculer le temps de lecture (mots par minute)
    NEW.reading_time = GREATEST(1, (NEW.word_count / 200)::INTEGER);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_document_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER trigger_update_user_folders_updated_at
    BEFORE UPDATE ON public.user_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_user_folders_updated_at();

CREATE TRIGGER trigger_update_user_documents_updated_at
    BEFORE UPDATE ON public.user_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_user_documents_updated_at();

CREATE TRIGGER trigger_update_document_templates_updated_at
    BEFORE UPDATE ON public.document_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_document_templates_updated_at();

-- Fonction pour créer une version de document
CREATE OR REPLACE FUNCTION create_document_version()
RETURNS TRIGGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    -- Obtenir le prochain numéro de version
    SELECT COALESCE(MAX(version_number), 0) + 1 
    INTO next_version
    FROM public.document_versions 
    WHERE document_id = NEW.id;
    
    -- Créer une nouvelle version
    INSERT INTO public.document_versions (document_id, version_number, title, content, change_summary)
    VALUES (NEW.id, next_version, NEW.title, NEW.content, 'Auto-save version');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement des versions
CREATE TRIGGER trigger_create_document_version
    AFTER UPDATE ON public.user_documents
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title)
    EXECUTE FUNCTION create_document_version();

-- Fonction de recherche avancée
CREATE OR REPLACE FUNCTION search_documents(
    search_query TEXT,
    user_uuid UUID,
    document_type TEXT DEFAULT NULL,
    folder_id_filter UUID DEFAULT NULL,
    tags_filter TEXT[] DEFAULT NULL,
    show_archived BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    content TEXT,
    type TEXT,
    folder_name TEXT,
    tags TEXT[],
    is_favorite BOOLEAN,
    is_pinned BOOLEAN,
    word_count INTEGER,
    reading_time INTEGER,
    last_edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.content,
        d.type,
        f.name as folder_name,
        d.tags,
        d.is_favorite,
        d.is_pinned,
        d.word_count,
        d.reading_time,
        d.last_edited_at,
        d.created_at,
        ts_rank(
            to_tsvector('french', d.title || ' ' || d.content),
            plainto_tsquery('french', search_query)
        ) as rank
    FROM public.user_documents d
    LEFT JOIN public.user_folders f ON d.folder_id = f.id
    WHERE d.user_id = user_uuid
        AND (search_query IS NULL OR to_tsvector('french', d.title || ' ' || d.content) @@ plainto_tsquery('french', search_query))
        AND (document_type IS NULL OR d.type = document_type)
        AND (folder_id_filter IS NULL OR d.folder_id = folder_id_filter)
        AND (tags_filter IS NULL OR d.tags && tags_filter)
        AND (show_archived OR NOT d.is_archived)
    ORDER BY 
        d.is_pinned DESC,
        rank DESC,
        d.last_edited_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS (Row Level Security)
ALTER TABLE public.user_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_social_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_account_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_folders
CREATE POLICY "Users can view their own folders" ON public.user_folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" ON public.user_folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON public.user_folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON public.user_folders
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour user_documents
CREATE POLICY "Users can view their own documents" ON public.user_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" ON public.user_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON public.user_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.user_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour document_social_settings
CREATE POLICY "Users can view their own document social settings" ON public.document_social_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_social_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own document social settings" ON public.document_social_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_social_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own document social settings" ON public.document_social_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_social_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own document social settings" ON public.document_social_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_social_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

-- Politiques RLS pour document_account_settings
CREATE POLICY "Users can view their own document account settings" ON public.document_account_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_account_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own document account settings" ON public.document_account_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_account_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own document account settings" ON public.document_account_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_account_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own document account settings" ON public.document_account_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_account_settings.document_id 
            AND d.user_id = auth.uid()
        )
    );

-- Politiques RLS pour document_versions
CREATE POLICY "Users can view their own document versions" ON public.document_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_documents d 
            WHERE d.id = document_versions.document_id 
            AND d.user_id = auth.uid()
        )
    );

-- Politiques RLS pour document_templates
CREATE POLICY "Users can view their own templates and public templates" ON public.document_templates
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own templates" ON public.document_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON public.document_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON public.document_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Insérer des dossiers par défaut pour les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION create_default_folders_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Créer les dossiers par défaut pour le contenu
    INSERT INTO public.user_folders (user_id, name, description, type, color, icon, sort_order)
    VALUES 
        (NEW.id, 'Mes Articles', 'Articles et posts pour vos réseaux sociaux', 'content', '#3B82F6', 'file-text', 1),
        (NEW.id, 'Idées Instagram', 'Contenu spécifique pour Instagram', 'content', '#E4405F', 'instagram', 2),
        (NEW.id, 'Idées TikTok', 'Contenu spécifique pour TikTok', 'content', '#000000', 'video', 3),
        (NEW.id, 'Idées Twitter', 'Contenu spécifique pour Twitter/X', 'content', '#1DA1F2', 'twitter', 4),
        (NEW.id, 'Idées LinkedIn', 'Contenu professionnel pour LinkedIn', 'content', '#0077B5', 'linkedin', 5);
    
    -- Créer les dossiers par défaut pour les idées de compte
    INSERT INTO public.user_folders (user_id, name, description, type, color, icon, sort_order)
    VALUES 
        (NEW.id, 'Stratégie de Compte', 'Idées pour optimiser votre stratégie', 'account_ideas', '#10B981', 'target', 1),
        (NEW.id, 'Optimisation Bio', 'Améliorer votre bio et profil', 'account_ideas', '#F59E0B', 'user', 2),
        (NEW.id, 'Croissance', 'Stratégies pour développer votre audience', 'account_ideas', '#8B5CF6', 'trending-up', 3),
        (NEW.id, 'Engagement', 'Techniques pour améliorer l''engagement', 'account_ideas', '#EF4444', 'heart', 4);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer les dossiers par défaut
CREATE TRIGGER trigger_create_default_folders
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_folders_for_new_user();

-- Commentaires sur les tables
COMMENT ON TABLE public.user_folders IS 'Dossiers pour organiser les documents des utilisateurs';
COMMENT ON TABLE public.user_documents IS 'Documents de contenu et idées de compte des utilisateurs';
COMMENT ON TABLE public.document_social_settings IS 'Paramètres de réseaux sociaux pour les documents de contenu';
COMMENT ON TABLE public.document_account_settings IS 'Paramètres de compte pour les documents d''idées de compte';
COMMENT ON TABLE public.document_versions IS 'Historique des versions des documents';
COMMENT ON TABLE public.document_templates IS 'Modèles de documents réutilisables';
