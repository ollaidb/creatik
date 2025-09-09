import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ProgramSettingsService } from '@/services/programSettingsService';

interface NetworkStats {
  // Données réelles
  actual_publications: number;
  actual_challenges: number;
  actual_completed_challenges: number;
  
  // Calculs de progression
  required_publications: number;
  required_challenges: number;
  remaining_challenges: number;
  remaining_days: number;
  progress_percentage: number;
  
  // Configuration
  program_duration: string;
  contents_per_day: number;
}

export const useNetworkStats = (selectedSocialNetworkId: string) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour calculer les jours selon la durée
  const getDurationDays = (duration: string): number => {
    switch (duration) {
      case '1month': return 30;
      case '2months': return 60;
      case '3months': return 90;
      case '6months': return 180;
      case '1year': return 365;
      case '2years': return 730;
      case '3years': return 1095;
      default: return 90;
    }
  };

  // Charger les statistiques pour le réseau sélectionné
  const loadNetworkStats = useCallback(async () => {
    if (!user || !selectedSocialNetworkId) {
      setStats(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Charger les paramètres de programmation
      const { data: programSettings, error: programError } = await supabase
        .from('user_program_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('social_account_id', selectedSocialNetworkId)
        .is('playlist_id', null)
        .single();

      // Valeurs par défaut si pas de paramètres
      const duration = programSettings?.duration || '3months';
      const contentsPerDay = programSettings?.contents_per_day || 1;
      
      // Si pas de paramètres, créer des paramètres par défaut
      if (!programSettings && programError?.code === 'PGRST116') {
        try {
          await ProgramSettingsService.upsertProgramSettings(user.id, {
            social_account_id: selectedSocialNetworkId,
            playlist_id: null,
            duration: '3months',
            contents_per_day: 1
          });
        } catch (createError) {
          console.warn('Impossible de créer les paramètres par défaut:', createError);
        }
      }
      const totalDays = getDurationDays(duration);
      const requiredPublications = totalDays * contentsPerDay;

      // Charger les données réelles
      const [publicationsResult, challengesResult, completedChallengesResult] = await Promise.all([
        supabase
          .from('user_social_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('social_account_id', selectedSocialNetworkId),
        
        supabase
          .from('user_challenges')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('social_account_id', selectedSocialNetworkId),
        
        supabase
          .from('user_challenges')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('social_account_id', selectedSocialNetworkId)
          .eq('status', 'completed')
      ]);

      const actualPublications = publicationsResult.count || 0;
      const actualChallenges = challengesResult.count || 0;
      const actualCompletedChallenges = completedChallengesResult.count || 0;

      // Calculs de progression
      const requiredChallenges = requiredPublications; // Un défi par publication
      const remainingChallenges = Math.max(0, requiredChallenges - actualCompletedChallenges);
      
      // Calculer les jours restants basés sur la progression
      const daysElapsed = Math.floor(actualCompletedChallenges / contentsPerDay);
      const remainingDays = Math.max(0, totalDays - daysElapsed);
      
      // Pourcentage de progression
      const progressPercentage = requiredChallenges > 0 
        ? Math.min(100, Math.round((actualCompletedChallenges / requiredChallenges) * 100))
        : 0;

      setStats({
        // Données réelles
        actual_publications: actualPublications,
        actual_challenges: actualChallenges,
        actual_completed_challenges: actualCompletedChallenges,
        
        // Calculs de progression
        required_publications: requiredPublications,
        required_challenges: requiredChallenges,
        remaining_challenges: remainingChallenges,
        remaining_days: remainingDays,
        progress_percentage: progressPercentage,
        
        // Configuration
        program_duration: duration,
        contents_per_day: contentsPerDay
      });

    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user, selectedSocialNetworkId]);

  // Charger les statistiques quand le réseau change
  useEffect(() => {
    loadNetworkStats();
  }, [loadNetworkStats]);

  // Fonction pour rafraîchir les statistiques
  const refreshStats = useCallback(() => {
    loadNetworkStats();
  }, [loadNetworkStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};
