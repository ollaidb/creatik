-- Création du système de commentaires pour les challenges
-- Migration: 20250128000004-create-challenge-comments-system.sql

-- Table des commentaires sur les challenges
CREATE TABLE IF NOT EXISTS public.challenge_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.challenge_comments(id) ON DELETE CASCADE,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des likes sur les commentaires
CREATE TABLE IF NOT EXISTS public.challenge_comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.challenge_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_challenge_comments_challenge_id ON public.challenge_comments(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_comments_user_id ON public.challenge_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_comments_parent_id ON public.challenge_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_challenge_comments_created_at ON public.challenge_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_comment_likes_comment_id ON public.challenge_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_challenge_comment_likes_user_id ON public.challenge_comment_likes(user_id);

-- RLS Policies pour challenge_comments
ALTER TABLE public.challenge_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenge comments are viewable by everyone" ON public.challenge_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments on challenges" ON public.challenge_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.challenge_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.challenge_comments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies pour challenge_comment_likes
ALTER TABLE public.challenge_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comment likes are viewable by everyone" ON public.challenge_comment_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can like/unlike comments" ON public.challenge_comment_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON public.challenge_comment_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement le compteur de likes
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Incrémenter le compteur de likes
        UPDATE public.challenge_comments 
        SET likes_count = likes_count + 1, updated_at = NOW()
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Décrémenter le compteur de likes
        UPDATE public.challenge_comments 
        SET likes_count = likes_count - 1, updated_at = NOW()
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le compteur de likes
CREATE TRIGGER trigger_update_comment_likes_count
    AFTER INSERT OR DELETE ON public.challenge_comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_likes_count();

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_challenge_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_challenge_comments_updated_at
    BEFORE UPDATE ON public.challenge_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_comments_updated_at();

-- Insérer quelques commentaires de test pour le challenge existant
-- (optionnel, pour tester le système)
-- INSERT INTO public.challenge_comments (challenge_id, user_id, content) VALUES
-- ('71f05181-4b65-4e06-ab92-da84b788a10c', 'user-uuid-here', 'Super challenge ! Je vais essayer de le relever.'),
-- ('71f05181-4b65-4e06-ab92-da84b788a10c', 'user-uuid-here', 'Excellente idée, j''adore ce concept !');
