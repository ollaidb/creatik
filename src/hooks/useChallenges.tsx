import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

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

  // Charger les défis depuis localStorage (préparé pour migration Supabase)
  const loadChallenges = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Charger les défis personnels depuis localStorage
      const storedChallenges = localStorage.getItem(`user_challenges_${user.id}`);
      const challengesData = storedChallenges ? JSON.parse(storedChallenges) : [];
      setUserChallenges(challengesData);

      console.log('Défis chargés:', challengesData);
      console.log('Défis supprimés:', challengesData.filter(c => c.status === 'deleted'));

      // Charger les statistiques depuis localStorage
      const storedStats = localStorage.getItem(`challenge_stats_${user.id}`);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
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
        // Sauvegarder les stats par défaut
        localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(defaultStats));
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les changements
  const saveChanges = () => {
    if (!user) return;
    localStorage.setItem(`user_challenges_${user.id}`, JSON.stringify(userChallenges));
    if (stats) {
      localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(stats));
    }
  };

  // Ajouter un défi
  const addChallenge = async (title: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const newChallenge: UserChallenge = {
        id: Date.now().toString(),
        user_id: user.id,
        title,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      setUserChallenges(prev => [...prev, newChallenge]);
      saveChanges();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de l\'ajout' };
    }
  };

  // Valider un défi
  const completeChallenge = async (id: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const now = new Date().toISOString();
      
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'completed', completed_at: now }
            : c
        )
      );

      saveChanges();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la validation' };
    }
  };

  // Supprimer un défi
  const deleteChallenge = async (id: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const now = new Date().toISOString();
      
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'deleted', updated_at: now }
            : c
        )
      );

      saveChanges();
      
      console.log('Défi supprimé vers la corbeille:', id);
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la suppression' };
    }
  };

  // Mettre à jour le titre d'un défi
  const updateChallengeTitle = async (id: string, title: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, title }
            : c
        )
      );
      
      saveChanges();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  // Réorganiser les défis
  const reorderChallenges = async (newOrder: UserChallenge[]) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(newOrder);
      saveChanges();
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la réorganisation:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la réorganisation' };
    }
  };

  // Mettre à jour la durée du programme
  const updateProgramDuration = async (duration: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      // Mettre à jour les stats avec la nouvelle durée
      const updatedStats = stats ? { ...stats, program_duration: duration } : {
        total_challenges: 0,
        completed_challenges: 0,
        pending_challenges: 0,
        program_duration: duration,
        contents_per_day: 1
      };
      
      setStats(updatedStats);
      
      // Sauvegarder immédiatement dans localStorage
      localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(updatedStats));
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la durée:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  // Mettre à jour le nombre de contenus par jour
  const updateContentsPerDay = async (contentsPerDay: number) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      // Mettre à jour les stats avec le nouveau nombre de contenus
      const updatedStats = stats ? { ...stats, contents_per_day: contentsPerDay } : {
        total_challenges: 0,
        completed_challenges: 0,
        pending_challenges: 0,
        program_duration: '3months',
        contents_per_day: contentsPerDay
      };
      
      setStats(updatedStats);
      
      // Sauvegarder immédiatement dans localStorage
      localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(updatedStats));
      
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du nombre de contenus:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  // Mettre à jour les statistiques
  const updateStats = async () => {
    if (!user) return;

    try {
      const pendingCount = userChallenges.filter(c => c.status === 'pending').length;
      const completedCount = userChallenges.filter(c => c.status === 'completed').length;
      const totalCount = userChallenges.filter(c => c.status !== 'deleted').length;

      const statsData: ChallengeStats = {
        total_challenges: totalCount,
        completed_challenges: completedCount,
        pending_challenges: pendingCount,
        program_duration: stats?.program_duration || '3months',
        contents_per_day: stats?.contents_per_day || 1
      };

      setStats(statsData);
      saveChanges();
    } catch (err) {
      console.error('Erreur lors de la mise à jour des stats:', err);
    }
  };

  // Remettre un défi accompli en défis
  const restoreChallenge = async (id: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'pending', completed_at: undefined }
            : c
        )
      );
      saveChanges();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la restauration:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la restauration' };
    }
  };

  // Restaurer un défi supprimé
  const restoreDeletedChallenge = async (id: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'pending' }
            : c
        )
      );
      saveChanges();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la restauration:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la restauration' };
    }
  };

  // Supprimer définitivement un défi
  const permanentlyDeleteChallenge = async (id: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => prev.filter(c => c.id !== id));
      saveChanges();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression définitive:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la suppression définitive' };
    }
  };

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    loadChallenges();
  }, [user]);

  // Mettre à jour les statistiques automatiquement quand userChallenges change
  useEffect(() => {
    if (userChallenges.length > 0) {
      updateStats();
    }
  }, [userChallenges]);

  // Filtrer les défis par statut
  const challenges = userChallenges.filter(c => c.status === 'pending');
  const deletedChallenges = userChallenges.filter(c => c.status === 'deleted');

  return {
    challenges,
    userChallenges: userChallenges.filter(c => c.status !== 'deleted'),
    deletedChallenges, // Ajouter les défis supprimés
    stats,
    leaderboard: [], // Vide pour l'instant
    loading,
    error,
    addChallenge,
    completeChallenge,
    deleteChallenge,
    updateChallengeTitle,
    restoreChallenge,
    reorderChallenges,
    updateProgramDuration,
    updateContentsPerDay,
    restoreDeletedChallenge,
    permanentlyDeleteChallenge
  };
}; 