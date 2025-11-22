-- Ajouter les colonnes nécessaires pour les challenges publics
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id);

-- Créer la table pour les likes de challenges
CREATE TABLE IF NOT EXISTS public.challenge_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Index pour les likes
CREATE INDEX IF NOT EXISTS idx_challenge_likes_user_id ON public.challenge_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_likes_challenge_id ON public.challenge_likes(challenge_id);

-- RLS Policies pour challenge_likes
ALTER TABLE public.challenge_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all challenge likes" ON public.challenge_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own challenge likes" ON public.challenge_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenge likes" ON public.challenge_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement le compteur de likes
CREATE OR REPLACE FUNCTION update_challenge_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.challenges 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.challenge_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.challenges 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.challenge_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le compteur de likes
CREATE TRIGGER trigger_update_challenge_likes_count
    AFTER INSERT OR DELETE ON public.challenge_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_likes_count();

-- Mettre à jour les défis existants pour avoir un created_by
UPDATE public.challenges 
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;

-- Insérer quelques challenges publics de test
INSERT INTO public.challenges (title, description, category, points, difficulty, is_daily, created_by, likes_count) VALUES
('Créer un titre viral sur "Mode"', 'Proposez un titre qui pourrait devenir viral dans la catégorie Mode', 'Titre', 50, 'medium', false, (SELECT id FROM auth.users LIMIT 1), 3),
('Proposer une sous-catégorie "Recettes rapides"', 'Créez une sous-catégorie pour les recettes de cuisine rapides', 'Sous-catégorie', 75, 'medium', false, (SELECT id FROM auth.users LIMIT 1), 5),
('Créer 3 titres pour "Fitness"', 'Générez 3 titres motivants pour la catégorie Fitness', 'Titre', 60, 'easy', false, (SELECT id FROM auth.users LIMIT 1), 2),
('Proposer une catégorie "DIY"', 'Créez une nouvelle catégorie pour les projets DIY', 'Catégorie', 100, 'hard', false, (SELECT id FROM auth.users LIMIT 1), 8); 