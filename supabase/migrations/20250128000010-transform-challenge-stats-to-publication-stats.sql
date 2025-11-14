-- Migration: Transformer user_challenge_stats en user_publication_stats
-- Description: Adapte la table de statistiques pour suivre les publications au lieu des défis
-- ⚠️ ATTENTION: Cette migration transforme les données existantes

-- ============================================================================
-- ÉTAPE 1 : Créer la nouvelle table user_publication_stats
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_publication_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
    total_publications INTEGER NOT NULL DEFAULT 0,
    completed_publications INTEGER NOT NULL DEFAULT 0, -- Publications publiées (status = 'published')
    pending_publications INTEGER NOT NULL DEFAULT 0, -- Publications en brouillon (status = 'draft')
    scheduled_publications INTEGER NOT NULL DEFAULT 0, -- Publications programmées (status = 'scheduled')
    current_streak INTEGER NOT NULL DEFAULT 0, -- Série de jours consécutifs avec publications
    best_streak INTEGER NOT NULL DEFAULT 0, -- Meilleure série
    total_days_participated INTEGER NOT NULL DEFAULT 0,
    program_duration TEXT NOT NULL DEFAULT '3months', -- 1month, 2months, 3months, 6months, 1year
    contents_per_day INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, social_account_id)
);

-- ============================================================================
-- ÉTAPE 2 : Migrer les données existantes si user_challenge_stats existe
-- ============================================================================

DO $$
DECLARE
    challenge_stats_exists BOOLEAN;
BEGIN
    -- Vérifier si la table user_challenge_stats existe
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_challenge_stats'
    ) INTO challenge_stats_exists;
    
    IF challenge_stats_exists THEN
        -- Migrer les données : transformer completed_challenges en completed_publications
        -- On récupère les statistiques de défis et on les convertit en statistiques de publications
        -- En associant avec les publications réelles pour chaque utilisateur/réseau
        
        INSERT INTO public.user_publication_stats (
            user_id,
            social_account_id,
            total_publications,
            completed_publications,
            pending_publications,
            scheduled_publications,
            current_streak,
            best_streak,
            total_days_participated,
            program_duration,
            contents_per_day,
            created_at,
            updated_at
        )
        SELECT DISTINCT
            up.user_id,
            up.social_account_id,
            COUNT(*) FILTER (WHERE up.status IN ('published', 'draft', 'scheduled', 'archived')) as total_publications,
            COUNT(*) FILTER (WHERE up.status = 'published') as completed_publications,
            COUNT(*) FILTER (WHERE up.status = 'draft') as pending_publications,
            COUNT(*) FILTER (WHERE up.status = 'scheduled') as scheduled_publications,
            COALESCE(ucs.current_streak, 0) as current_streak,
            COALESCE(ucs.best_streak, 0) as best_streak,
            COALESCE(ucs.total_days_participated, 0) as total_days_participated,
            COALESCE(ucs.program_duration, '3months') as program_duration,
            1 as contents_per_day, -- Valeur par défaut
            COALESCE(ucs.created_at, NOW()) as created_at,
            NOW() as updated_at
        FROM public.user_social_posts up
        LEFT JOIN public.user_challenge_stats ucs ON ucs.user_id = up.user_id
        WHERE up.user_id IS NOT NULL
        GROUP BY up.user_id, up.social_account_id, ucs.current_streak, ucs.best_streak, 
                 ucs.total_days_participated, ucs.program_duration, ucs.created_at
        ON CONFLICT (user_id, social_account_id) DO NOTHING;
        
        RAISE NOTICE 'Données migrées de user_challenge_stats vers user_publication_stats';
    ELSE
        RAISE NOTICE 'Table user_challenge_stats n''existe pas, pas de migration nécessaire';
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 3 : Créer les index pour améliorer les performances
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_publication_stats_user_id 
ON public.user_publication_stats(user_id);

CREATE INDEX IF NOT EXISTS idx_user_publication_stats_social_account_id 
ON public.user_publication_stats(social_account_id);

CREATE INDEX IF NOT EXISTS idx_user_publication_stats_user_social 
ON public.user_publication_stats(user_id, social_account_id);

-- ============================================================================
-- ÉTAPE 4 : Activer RLS et créer les politiques
-- ============================================================================

ALTER TABLE public.user_publication_stats ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres statistiques
DROP POLICY IF EXISTS "Users can view their own publication stats" ON public.user_publication_stats;
CREATE POLICY "Users can view their own publication stats" 
ON public.user_publication_stats
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent insérer leurs propres statistiques
DROP POLICY IF EXISTS "Users can insert their own publication stats" ON public.user_publication_stats;
CREATE POLICY "Users can insert their own publication stats" 
ON public.user_publication_stats
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres statistiques
DROP POLICY IF EXISTS "Users can update their own publication stats" ON public.user_publication_stats;
CREATE POLICY "Users can update their own publication stats" 
ON public.user_publication_stats
FOR UPDATE 
USING (auth.uid() = user_id);

-- ============================================================================
-- ÉTAPE 5 : Créer une fonction pour mettre à jour automatiquement les statistiques
-- ============================================================================

CREATE OR REPLACE FUNCTION update_user_publication_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour ou créer les statistiques lorsque le statut d'une publication change
    INSERT INTO public.user_publication_stats (
        user_id,
        social_account_id,
        total_publications,
        completed_publications,
        pending_publications,
        scheduled_publications,
        updated_at
    )
    SELECT 
        NEW.user_id,
        NEW.social_account_id,
        COUNT(*) FILTER (WHERE status IN ('published', 'draft', 'scheduled', 'archived')),
        COUNT(*) FILTER (WHERE status = 'published'),
        COUNT(*) FILTER (WHERE status = 'draft'),
        COUNT(*) FILTER (WHERE status = 'scheduled'),
        NOW()
    FROM public.user_social_posts
    WHERE user_id = NEW.user_id 
    AND social_account_id = NEW.social_account_id
    ON CONFLICT (user_id, social_account_id) DO UPDATE SET
        total_publications = EXCLUDED.total_publications,
        completed_publications = EXCLUDED.completed_publications,
        pending_publications = EXCLUDED.pending_publications,
        scheduled_publications = EXCLUDED.scheduled_publications,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ÉTAPE 6 : Créer un trigger pour mettre à jour automatiquement les statistiques
-- ============================================================================

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS trigger_update_user_publication_stats ON public.user_social_posts;

-- Créer le trigger
CREATE TRIGGER trigger_update_user_publication_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.user_social_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_publication_stats();

-- ============================================================================
-- ÉTAPE 7 : Initialiser les statistiques pour les publications existantes
-- ============================================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Pour chaque combinaison user_id/social_account_id, initialiser les stats
    FOR rec IN 
        SELECT DISTINCT user_id, social_account_id
        FROM public.user_social_posts
        WHERE user_id IS NOT NULL AND social_account_id IS NOT NULL
    LOOP
        -- Calculer les statistiques actuelles
        INSERT INTO public.user_publication_stats (
            user_id,
            social_account_id,
            total_publications,
            completed_publications,
            pending_publications,
            scheduled_publications,
            contents_per_day,
            program_duration,
            updated_at
        )
        SELECT 
            rec.user_id,
            rec.social_account_id,
            COUNT(*) FILTER (WHERE status IN ('published', 'draft', 'scheduled', 'archived')),
            COUNT(*) FILTER (WHERE status = 'published'),
            COUNT(*) FILTER (WHERE status = 'draft'),
            COUNT(*) FILTER (WHERE status = 'scheduled'),
            1, -- Valeur par défaut
            '3months', -- Valeur par défaut
            NOW()
        FROM public.user_social_posts
        WHERE user_id = rec.user_id 
        AND social_account_id = rec.social_account_id
        ON CONFLICT (user_id, social_account_id) DO UPDATE SET
            total_publications = EXCLUDED.total_publications,
            completed_publications = EXCLUDED.completed_publications,
            pending_publications = EXCLUDED.pending_publications,
            scheduled_publications = EXCLUDED.scheduled_publications,
            updated_at = NOW();
    END LOOP;
    
    RAISE NOTICE 'Statistiques initialisées pour les publications existantes';
END $$;

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
-- 
-- NOTE : La table user_challenge_stats n'est PAS supprimée automatiquement
-- Elle peut être supprimée manuellement si vous êtes sûr de ne plus en avoir besoin
-- avec la migration 20250128000007-remove-challenges-tables.sql
-- ============================================================================

