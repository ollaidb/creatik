import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

// Types pour les défis personnels
interface UserChallenge {
  id: string;
  user_id: string;
  title: string;
  status: 'pending' | 'completed' | 'deleted';
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface ChallengeStats {
  total_challenges: number;
  completed_challenges: number;
  pending_challenges: number;
  program_duration: string;
  contents_per_day: number;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les défis depuis Supabase
  const loadChallenges = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);
      setError(null);

      // Charger les défis personnels
      const { data: challengesData, error: challengesError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (challengesError) throw challengesError;
      setUserChallenges(challengesData || []);

      // Charger les statistiques
      const { data: statsData, error: statsError } = await supabase
        .from('challenge_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (statsData) {
        setStats(statsData);
      } else {
        // Créer des statistiques par défaut
        const defaultStats: ChallengeStats = {
          total_challenges: 0,
          completed_challenges: 0,
          pending_challenges: 0,
          program_duration: '3months',
          contents_per_day: 1
        };
        setStats(defaultStats);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un défi
  const addChallenge = async (title: string) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      const newChallenge = {
        user_id: user.id,
        title,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('user_challenges')
        .insert([newChallenge])
        .select()
        .single();

      if (error) throw error;

      setUserChallenges(prev => [...prev, data]);
      await updateStats();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de l\'ajout' };
    }
  };

  // Valider un défi
  const completeChallenge = async (id: string) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_challenges')
        .update({ 
          status: 'completed', 
          completed_at: now,
          updated_at: now
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'completed', completed_at: now }
            : c
        )
      );

      await updateStats();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la validation' };
    }
  };

  // Supprimer un défi
  const deleteChallenge = async (id: string) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'deleted' }
            : c
        )
      );

      await updateStats();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la suppression' };
    }
  };

  // Mettre à jour le titre d'un défi
  const updateChallengeTitle = async (id: string, title: string) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, title }
            : c
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  // Réorganiser les défis
  const reorderChallenges = async (newOrder: UserChallenge[]) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      // Mettre à jour l'ordre dans la base de données
      const updates = newOrder.map((challenge, index) => ({
        id: challenge.id,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_challenges')
        .upsert(updates);

      if (error) throw error;

      setUserChallenges(newOrder);
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la réorganisation:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la réorganisation' };
    }
  };

  // Mettre à jour la durée du programme
  const updateProgramDuration = async (duration: string) => {
    if (!user || !supabase) return { error: 'Utilisateur non connecté' };

    try {
      const { error } = await supabase
        .from('challenge_stats')
        .upsert({
          user_id: user.id,
          program_duration: duration,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setStats(prev => prev ? { ...prev, program_duration: duration } : null);
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la durée:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  // Mettre à jour les statistiques
  const updateStats = async () => {
    if (!user || !supabase) return;

    try {
      const pendingCount = userChallenges.filter(c => c.status === 'pending').length;
      const completedCount = userChallenges.filter(c => c.status === 'completed').length;
      const totalCount = userChallenges.filter(c => c.status !== 'deleted').length;

      const statsData = {
        user_id: user.id,
        total_challenges: totalCount,
        completed_challenges: completedCount,
        pending_challenges: pendingCount,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('challenge_stats')
        .upsert(statsData);

      if (error) throw error;

      setStats(prev => prev ? { ...prev, ...statsData } : statsData);
    } catch (err) {
      console.error('Erreur lors de la mise à jour des stats:', err);
    }
  };

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    loadChallenges();
  }, [user]);

  // Filtrer les défis par statut
  const challenges = userChallenges.filter(c => c.status === 'pending');

  return {
    challenges,
    userChallenges: userChallenges.filter(c => c.status !== 'deleted'),
    stats,
    leaderboard: [], // Vide pour l'instant
    loading,
    error,
    addChallenge,
    completeChallenge,
    deleteChallenge,
    updateChallengeTitle,
    reorderChallenges,
    updateProgramDuration
  };
}; 