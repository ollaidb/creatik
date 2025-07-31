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

  // Charger les défis depuis localStorage (temporaire)
  useEffect(() => {
    if (!user) return;

    const loadChallenges = () => {
      try {
        setLoading(true);
        
        const storedUserChallenges = localStorage.getItem(`user_challenges_${user.id}`);
        const storedStats = localStorage.getItem(`challenge_stats_${user.id}`);

        if (storedUserChallenges) {
          const challenges = JSON.parse(storedUserChallenges);
          // Filtrer pour ne garder que les défis non supprimés
          const activeChallenges = challenges.filter((challenge: UserChallenge) => 
            challenge.status !== 'deleted'
          );
          setUserChallenges(activeChallenges);
        }

        if (storedStats) {
          setStats(JSON.parse(storedStats));
        } else {
          const defaultStats: ChallengeStats = {
            total_challenges: 0,
            completed_challenges: 0,
            pending_challenges: 0,
            program_duration: '3months',
            contents_per_day: 1,
          };
          setStats(defaultStats);
          localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(defaultStats));
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des défis:', err);
        setError('Erreur lors du chargement des défis');
        setLoading(false);
      }
    };

    loadChallenges();
  }, [user]);

  // Sauvegarder les changements
  const saveChanges = () => {
    if (!user) return;
    localStorage.setItem(`user_challenges_${user.id}`, JSON.stringify(userChallenges));
    if (stats) {
      localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(stats));
    }
  };

  // Ajouter un nouveau défi personnel
  const addChallenge = async (title: string) => {
    if (!user) {
      return { error: "Utilisateur non connecté" };
    }

    try {
      const newChallenge: UserChallenge = {
        id: Date.now().toString(),
        user_id: user.id,
        title,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      setUserChallenges(prev => [...prev, newChallenge]);
      saveChanges();

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du défi:', error);
      return { error: "Erreur lors de l'ajout du défi" };
    }
  };

  // Valider un défi
  const completeChallenge = async (challengeId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(uc => 
          uc.id === challengeId 
            ? { ...uc, status: 'completed', completed_at: new Date().toISOString() }
            : uc
        )
      );

      saveChanges();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la validation du défi:', error);
      return { error: 'Erreur lors de la validation du défi' };
    }
  };

  // Supprimer un défi (aller dans la corbeille)
  const deleteChallenge = async (challengeId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(uc => 
          uc.id === challengeId 
            ? { ...uc, status: 'deleted' }
            : uc
        )
      );

      saveChanges();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du défi:', error);
      return { error: 'Erreur lors de la suppression du défi' };
    }
  };

  // Mettre à jour le titre d'un défi
  const updateChallengeTitle = async (challengeId: string, newTitle: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      setUserChallenges(prev => 
        prev.map(uc => 
          uc.id === challengeId 
            ? { ...uc, title: newTitle }
            : uc
        )
      );

      saveChanges();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du titre:', error);
      return { error: 'Erreur lors de la mise à jour du titre' };
    }
  };

  // Réorganiser les défis
  const reorderChallenges = async (newOrder: UserChallenge[]) => {
    setUserChallenges(newOrder);
    saveChanges();
  };

  // Mettre à jour la durée du programme
  const updateProgramDuration = async (duration: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      if (stats) {
        const updatedStats = { ...stats, program_duration: duration };
        setStats(updatedStats);
        localStorage.setItem(`challenge_stats_${user.id}`, JSON.stringify(updatedStats));
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la durée:', error);
      return { error: 'Erreur lors de la mise à jour de la durée' };
    }
  };

  return {
    challenges: userChallenges.filter(challenge => challenge.status === 'pending'), // Seulement les défis en attente
    userChallenges: userChallenges.filter(challenge => challenge.status !== 'deleted'), // Tous sauf supprimés
    stats,
    leaderboard: [], // Vide pour l'instant
    loading,
    error,
    addChallenge,
    completeChallenge,
    deleteChallenge,
    updateChallengeTitle,
    reorderChallenges,
    updateProgramDuration,
  };
}; 