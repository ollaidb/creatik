-- Créer la table corbeille pour les publications supprimées
CREATE TABLE IF NOT EXISTS public.trash (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    original_publication_id UUID,
    publication_type TEXT NOT NULL, -- 'category', 'subcategory', 'title'
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID,
    subcategory_id UUID,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    will_be_deleted_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_trash_user_id ON public.trash(user_id);
CREATE INDEX IF NOT EXISTS idx_trash_deleted_at ON public.trash(deleted_at);
CREATE INDEX IF NOT EXISTS idx_trash_will_be_deleted_at ON public.trash(will_be_deleted_at);

-- Politique RLS pour la table corbeille
ALTER TABLE public.trash ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres éléments dans la corbeille
CREATE POLICY "Users can view their own trash" ON public.trash
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer dans leur corbeille
CREATE POLICY "Users can insert into their own trash" ON public.trash
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer de leur corbeille
CREATE POLICY "Users can delete from their own trash" ON public.trash
    FOR DELETE USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de restaurer (mettre à jour) leur corbeille
CREATE POLICY "Users can update their own trash" ON public.trash
    FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour nettoyer automatiquement la corbeille après 30 jours
CREATE OR REPLACE FUNCTION cleanup_trash()
RETURNS void AS $$
BEGIN
    DELETE FROM public.trash 
    WHERE will_be_deleted_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Créer un job pour nettoyer la corbeille automatiquement (optionnel)
-- Cette fonction peut être appelée par un cron job ou un trigger 