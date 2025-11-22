-- Création de la table des défis
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 50,
    difficulty TEXT NOT NULL DEFAULT 'medium', -- easy, medium, hard
    duration_days INTEGER NOT NULL DEFAULT 1,
    is_daily BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des défis utilisateur
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active', -- active, completed, failed
    completed_at TIMESTAMP WITH TIME ZONE,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Création de la table des statistiques utilisateur
CREATE TABLE IF NOT EXISTS public.user_challenge_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER NOT NULL DEFAULT 0,
    completed_challenges INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    total_days_participated INTEGER NOT NULL DEFAULT 0,
    program_duration TEXT NOT NULL DEFAULT '3months', -- 1month, 2months, 3months, 6months, 1year
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des récompenses
CREATE TABLE IF NOT EXISTS public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL, -- badge, achievement, milestone
    reward_name TEXT NOT NULL,
    reward_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des classements
CREATE TABLE IF NOT EXISTS public.challenge_leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER NOT NULL DEFAULT 0,
    rank_position INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON public.user_challenges(status);
CREATE INDEX IF NOT EXISTS idx_user_challenge_stats_user_id ON public.user_challenge_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_leaderboard_points ON public.challenge_leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_is_active ON public.challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_challenges_is_daily ON public.challenges(is_daily);

-- RLS Policies pour challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone" ON public.challenges
    FOR SELECT USING (true);

CREATE POLICY "Challenges can be created by admins" ON public.challenges
    FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Challenges can be updated by admins" ON public.challenges
    FOR UPDATE USING (auth.role() = 'admin');

-- RLS Policies pour user_challenges
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges" ON public.user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" ON public.user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON public.user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies pour user_challenge_stats
ALTER TABLE public.user_challenge_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" ON public.user_challenge_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON public.user_challenge_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_challenge_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies pour user_rewards
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards" ON public.user_rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" ON public.user_rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies pour challenge_leaderboard
ALTER TABLE public.challenge_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is viewable by everyone" ON public.challenge_leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own leaderboard entry" ON public.challenge_leaderboard
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entry" ON public.challenge_leaderboard
    FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement les statistiques
CREATE OR REPLACE FUNCTION update_user_challenge_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour ou créer les statistiques utilisateur
    INSERT INTO public.user_challenge_stats (user_id, total_points, completed_challenges, current_streak, best_streak)
    VALUES (
        NEW.user_id,
        COALESCE((SELECT SUM(points_earned) FROM public.user_challenges WHERE user_id = NEW.user_id AND status = 'completed'), 0),
        COALESCE((SELECT COUNT(*) FROM public.user_challenges WHERE user_id = NEW.user_id AND status = 'completed'), 0),
        0, -- current_streak sera calculé séparément
        0  -- best_streak sera calculé séparément
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        completed_challenges = EXCLUDED.completed_challenges,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement les statistiques
CREATE TRIGGER trigger_update_user_challenge_stats
    AFTER INSERT OR UPDATE ON public.user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_user_challenge_stats();

-- Fonction pour calculer le classement
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
    -- Mettre à jour le classement
    WITH ranked_users AS (
        SELECT 
            user_id,
            total_points,
            ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank_position
        FROM public.user_challenge_stats
    )
    INSERT INTO public.challenge_leaderboard (user_id, total_points, rank_position, last_updated)
    SELECT user_id, total_points, rank_position, NOW()
    FROM ranked_users
    ON CONFLICT (user_id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        rank_position = EXCLUDED.rank_position,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insérer quelques défis de base
INSERT INTO public.challenges (title, description, category, points, difficulty, is_daily) VALUES
('Créer un titre viral sur "Astuces de vie"', 'Proposez un titre qui pourrait devenir viral dans la catégorie Astuces de vie', 'Titre', 50, 'medium', true),
('Proposer une nouvelle sous-catégorie', 'Créez une sous-catégorie innovante pour enrichir notre bibliothèque', 'Sous-catégorie', 75, 'hard', false),
('Créer 5 titres pour "Motivation"', 'Générez 5 titres inspirants pour la catégorie Motivation', 'Titre', 100, 'medium', false),
('Créer un titre viral sur "Business"', 'Proposez un titre qui pourrait devenir viral dans la catégorie Business', 'Titre', 50, 'medium', true),
('Proposer une catégorie innovante', 'Créez une nouvelle catégorie qui pourrait intéresser la communauté', 'Catégorie', 150, 'hard', false),
('Créer 10 titres pour "Santé"', 'Générez 10 titres sur le thème de la santé et du bien-être', 'Titre', 200, 'hard', false); 