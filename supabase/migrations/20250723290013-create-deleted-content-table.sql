-- Créer une table pour stocker les éléments supprimés par les utilisateurs
CREATE TABLE IF NOT EXISTS public.deleted_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_id UUID NOT NULL,
    content_type TEXT NOT NULL, -- 'category', 'subcategory', 'title', 'challenge'
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID,
    subcategory_id UUID,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- Pour stocker les données supplémentaires (couleur, points, etc.)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_deleted_content_user_id ON public.deleted_content(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_content_type ON public.deleted_content(content_type);
CREATE INDEX IF NOT EXISTS idx_deleted_content_original_id ON public.deleted_content(original_id);

-- RLS Policies pour deleted_content
ALTER TABLE public.deleted_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deleted content" ON public.deleted_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deleted content" ON public.deleted_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deleted content" ON public.deleted_content
    FOR SELECT USING (auth.role() = 'admin'); 