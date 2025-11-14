import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  social_account_id?: string;
  playlist_id?: string | null;
  is_custom?: boolean;
  custom_title?: string;
  custom_description?: string;
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
  
  // Refs pour le debounce de sauvegarde
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedChallengesRef = useRef<string>('');
  const lastSavedStatsRef = useRef<string>('');
  
  // Refs pour capturer les valeurs actuelles au démontage
  const currentUserRef = useRef(user);
  const currentChallengesRef = useRef<UserChallenge[]>([]);
  const currentStatsRef = useRef<ChallengeStats | null>(null);
  
  // Ref pour éviter les chargements multiples
  const isLoadingRef = useRef(false);
  const lastLoadedUserIdRef = useRef<string | null>(null);

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useCallback((challenges: UserChallenge[], stats: ChallengeStats | null) => {
    if (!user) return;
    
    // Annuler la sauvegarde précédente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Créer une sauvegarde avec debounce (300ms)
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const challengesStr = JSON.stringify(challenges);
        const statsStr = stats ? JSON.stringify(stats) : '';
        
        // Sauvegarder seulement si les données ont changé
        if (challengesStr !== lastSavedChallengesRef.current) {
          localStorage.setItem(`user_challenges_${user.id}`, challengesStr);
          lastSavedChallengesRef.current = challengesStr;
        }
        
        if (stats && statsStr !== lastSavedStatsRef.current) {
          localStorage.setItem(`challenge_stats_${user.id}`, statsStr);
          lastSavedStatsRef.current = statsStr;
        }
      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
      }
    }, 300);
  }, [user]);

  // Charger les défis depuis localStorage (préparé pour migration Supabase)
  const loadChallenges = useCallback(async () => {
    if (!user) return;
    
    // Protection contre les chargements multiples pour le même utilisateur
    if (isLoadingRef.current && lastLoadedUserIdRef.current === user.id) {
      return;
    }

    try {
      isLoadingRef.current = true;
      lastLoadedUserIdRef.current = user.id;
      setLoading(true);
      setError(null);

      // Charger les défis personnels depuis localStorage
      const storedChallenges = localStorage.getItem(`user_challenges_${user.id}`);
      const challengesData = storedChallenges ? JSON.parse(storedChallenges) : [];
      setUserChallenges(challengesData);
      
      // Mettre à jour la référence pour éviter les sauvegardes inutiles
      lastSavedChallengesRef.current = JSON.stringify(challengesData);

      // Charger les statistiques depuis localStorage
      const storedStats = localStorage.getItem(`challenge_stats_${user.id}`);
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats);
        setStats(parsedStats);
        lastSavedStatsRef.current = storedStats;
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
        const defaultStatsStr = JSON.stringify(defaultStats);
        lastSavedStatsRef.current = defaultStatsStr;
        // Sauvegarder les stats par défaut
        localStorage.setItem(`challenge_stats_${user.id}`, defaultStatsStr);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user]);

  // Ajouter un défi
  const addChallenge = async (title: string, additionalData?: {
    social_account_id?: string;
    playlist_id?: string | null;
    is_custom?: boolean;
    custom_title?: string;
    custom_description?: string;
  }) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const newChallenge: UserChallenge = {
        id: Date.now().toString(),
        user_id: user.id,
        title,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...additionalData // Inclure les données supplémentaires
      };

      setUserChallenges(prev => [...prev, newChallenge]);
      
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
      
      // Attendre un délai pour permettre l'animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserChallenges(prev => 
        prev.map(c => 
          c.id === id 
            ? { ...c, status: 'completed', completed_at: now }
            : c
        )
      );
      
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
  const updateStats = useCallback(async () => {
    if (!user) return;

    try {
      const pendingCount = userChallenges.filter(c => c.status === 'pending').length;
      const completedCount = userChallenges.filter(c => c.status === 'completed').length;
      const totalCount = userChallenges.filter(c => c.status !== 'deleted').length;

      // Utiliser une mise à jour fonctionnelle pour préserver les valeurs existantes
      setStats(prevStats => ({
        total_challenges: totalCount,
        completed_challenges: completedCount,
        pending_challenges: pendingCount,
        program_duration: prevStats?.program_duration || '3months',
        contents_per_day: prevStats?.contents_per_day || 1
      }));
    } catch (err) {
      console.error('Erreur lors de la mise à jour des stats:', err);
    }
  }, [user, userChallenges]);

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
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression définitive:', err);
      return { error: err instanceof Error ? err.message : 'Erreur lors de la suppression définitive' };
    }
  };

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      // Réinitialiser les refs quand l'utilisateur change
      if (lastLoadedUserIdRef.current !== user.id) {
        isLoadingRef.current = false;
        lastLoadedUserIdRef.current = null;
      }
      loadChallenges();
    } else {
      setUserChallenges([]);
      setStats(null);
      setLoading(false);
      isLoadingRef.current = false;
      lastLoadedUserIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Seulement quand l'ID de l'utilisateur change

  // Mettre à jour les statistiques automatiquement quand userChallenges change
  useEffect(() => {
    if (user && userChallenges.length >= 0) {
      updateStats();
    }
  }, [user, userChallenges, updateStats]);

  // Mettre à jour les refs pour le cleanup
  useEffect(() => {
    currentUserRef.current = user;
    currentChallengesRef.current = userChallenges;
    currentStatsRef.current = stats;
  }, [user, userChallenges, stats]);

  // Sauvegarder avec debounce quand userChallenges ou stats changent
  useEffect(() => {
    if (!user) return;
    
    // Ne sauvegarder que si on a des données
    if (userChallenges.length > 0 || stats) {
      debouncedSave(userChallenges, stats);
    }
    
    // Cleanup: sauvegarder immédiatement au démontage ou changement d'utilisateur
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        // Sauvegarder immédiatement si on a des données en attente
        const currentUser = currentUserRef.current;
        const currentChallenges = currentChallengesRef.current;
        const currentStats = currentStatsRef.current;
        if (currentUser && (currentChallenges.length > 0 || currentStats)) {
          try {
            const challengesStr = JSON.stringify(currentChallenges);
            const statsStr = currentStats ? JSON.stringify(currentStats) : '';
            if (challengesStr !== lastSavedChallengesRef.current) {
              localStorage.setItem(`user_challenges_${currentUser.id}`, challengesStr);
            }
            if (currentStats && statsStr !== lastSavedStatsRef.current) {
              localStorage.setItem(`challenge_stats_${currentUser.id}`, statsStr);
            }
          } catch (err) {
            console.error('Erreur lors de la sauvegarde finale:', err);
          }
        }
      }
    };
  }, [user?.id, userChallenges, stats, debouncedSave, user]);

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