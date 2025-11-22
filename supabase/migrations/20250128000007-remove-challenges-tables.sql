-- Migration: Remove challenges tables
-- Description: Remove all challenge-related tables as they are no longer needed
-- ⚠️ ATTENTION: Cette migration supprimera définitivement toutes les données des défis !

-- Supprimer les triggers d'abord
DROP TRIGGER IF EXISTS trigger_update_user_challenge_stats ON public.user_challenges;
DROP TRIGGER IF EXISTS trigger_update_user_challenges_updated_at ON public.user_challenges;

-- Supprimer les fonctions liées aux défis
DROP FUNCTION IF EXISTS update_user_challenge_stats() CASCADE;
DROP FUNCTION IF EXISTS update_leaderboard() CASCADE;

-- Supprimer les politiques RLS d'abord
DROP POLICY IF EXISTS "Users can view their own challenges" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON public.user_challenges;

DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON public.challenges;
DROP POLICY IF EXISTS "Challenges can be created by admins" ON public.challenges;
DROP POLICY IF EXISTS "Challenges can be updated by admins" ON public.challenges;
DROP POLICY IF EXISTS "Challenges can be deleted by admins" ON public.challenges;

DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_challenge_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_challenge_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_challenge_stats;

DROP POLICY IF EXISTS "Users can view their own rewards" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can insert their own rewards" ON public.user_rewards;

DROP POLICY IF EXISTS "Leaderboard is viewable by everyone" ON public.challenge_leaderboard;
DROP POLICY IF EXISTS "Users can insert their own leaderboard entry" ON public.challenge_leaderboard;
DROP POLICY IF EXISTS "Users can update their own leaderboard entry" ON public.challenge_leaderboard;

-- Supprimer les tables dans l'ordre des dépendances (CASCADE pour supprimer automatiquement les dépendances)
-- D'abord les tables qui dépendent des autres
DROP TABLE IF EXISTS public.user_challenges CASCADE;
DROP TABLE IF EXISTS public.user_challenge_stats CASCADE;
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.challenge_leaderboard CASCADE;

-- Ensuite les tables principales
DROP TABLE IF EXISTS public.challenges CASCADE;

-- Supprimer aussi les tables personnalisées de défis si elles existent
DROP TABLE IF EXISTS public.user_custom_challenges_completed CASCADE;
DROP TABLE IF EXISTS public.user_custom_challenges CASCADE;
DROP TABLE IF EXISTS public.user_program_settings CASCADE;

-- Vérifier que les tables ont été supprimées
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'challenges') THEN
        RAISE NOTICE 'Table challenges supprimée avec succès';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_challenges') THEN
        RAISE NOTICE 'Table user_challenges supprimée avec succès';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_challenge_stats') THEN
        RAISE NOTICE 'Table user_challenge_stats supprimée avec succès';
    END IF;
END $$;

