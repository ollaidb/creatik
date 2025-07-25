import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  duration_days: number;
  is_daily: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'failed';
  completed_at?: string;
  points_earned: number;
  created_at: string;
  updated_at: string;
  challenge?: Challenge;
}
interface UserChallengeStats {
  id: string;
  user_id: string;
  total_points: number;
  completed_challenges: number;
  current_streak: number;
  best_streak: number;
  total_days_participated: number;
  program_duration: string;
  created_at: string;
  updated_at: string;
}
interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  rank_position: number;
  last_updated: string;
  created_at: string;
}
export const useChallenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [stats, setStats] = useState<UserChallengeStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Charger tous les défis disponibles
  const loadChallenges = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChallenges((data as Challenge[]) || []);
    } catch (err) {
      console.error('Erreur lors du chargement des défis:', err);
      setError('Impossible de charger les défis');
    }
  };
  // Charger les défis de l'utilisateur
  const loadUserChallenges = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase as any)
        .from('user_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserChallenges((data as UserChallenge[]) || []);
    } catch (err) {
      console.error('Erreur lors du chargement des défis utilisateur:', err);
      setError('Impossible de charger vos défis');
    }
  };
  // Charger les statistiques de l'utilisateur
  const loadUserStats = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase as any)
        .from('user_challenge_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      setStats(data as UserChallengeStats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };
  // Charger le classement
  const loadLeaderboard = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('challenge_leaderboard')
        .select('*')
        .order('rank_position', { ascending: true })
        .limit(50);
      if (error) throw error;
      setLeaderboard((data as LeaderboardEntry[]) || []);
    } catch (err) {
      console.error('Erreur lors du chargement du classement:', err);
    }
  };
  // Assigner un défi à l'utilisateur
  const assignChallenge = async (challengeId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };
    try {
      const { error } = await (supabase as any)
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active',
          points_earned: 0
        });
      if (error) throw error;
      toast({
        title: "Défi assigné !",
        description: "Le défi a été ajouté à votre liste",
      });
      await loadUserChallenges();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de l\'assignation du défi:', err);
      return { error: 'Impossible d\'assigner le défi' };
    }
  };
  // Compléter un défi
  const completeChallenge = async (userChallengeId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };
    try {
      // Récupérer le défi pour obtenir les points
      const userChallenge = userChallenges.find(uc => uc.id === userChallengeId);
      if (!userChallenge) {
        return { error: 'Défi non trouvé' };
      }
      const challenge = userChallenge.challenge;
      if (!challenge) {
        return { error: 'Défi non trouvé' };
      }
      // Mettre à jour le statut du défi
      const { error } = await (supabase as any)
        .from('user_challenges')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          points_earned: challenge.points
        })
        .eq('id', userChallengeId);
      if (error) throw error;
      // Mettre à jour le classement
      await (supabase as any).rpc('update_leaderboard');
      toast({
        title: "Défi accompli !",
        description: `Félicitations ! Vous avez gagné ${challenge.points} points.`,
      });
      await loadUserChallenges();
      await loadUserStats();
      await loadLeaderboard();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la complétion du défi:', err);
      return { error: 'Impossible de compléter le défi' };
    }
  };
  // Mettre à jour la durée du programme
  const updateProgramDuration = async (duration: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };
    try {
      const { error } = await (supabase as any)
        .from('user_challenge_stats')
        .upsert({
          user_id: user.id,
          program_duration: duration,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      await loadUserStats();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la durée:', err);
      return { error: 'Impossible de mettre à jour la durée' };
    }
  };
  // Charger toutes les données
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        loadChallenges(),
        loadUserChallenges(),
        loadUserStats(),
        loadLeaderboard()
      ]);
      setLoading(false);
    };
    loadAllData();
  }, [user]);
  return {
    challenges,
    userChallenges,
    stats,
    leaderboard,
    loading,
    error,
    assignChallenge,
    completeChallenge,
    updateProgramDuration,
    refresh: () => {
      loadChallenges();
      loadUserChallenges();
      loadUserStats();
      loadLeaderboard();
    }
  };
}; 