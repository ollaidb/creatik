import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface PublicChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  duration_days: number;
  is_daily: boolean;
  is_active: boolean;
  created_by: string;
  likes_count: number;
  category_id?: string;
  subcategory_id?: string;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

export const usePublicChallenges = (filterLikedOnly: boolean = false) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<PublicChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les challenges publics
  const loadPublicChallenges = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = (supabase as any)
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const challengesWithCreator = (data || []).map((challenge: PublicChallenge) => ({
        ...challenge,
        creator: null // Pas de créateur pour l'instant
      }));
      
      setChallenges(challengesWithCreator);
    } catch (err) {
      console.error('Erreur lors du chargement des challenges publics:', err);
      setError('Impossible de charger les challenges');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un challenge à ses défis personnels
  const addToPersonalChallenges = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des défis",
        variant: "destructive"
      });
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        title: "Défi ajouté !",
        description: "Le challenge a été ajouté à vos défis personnels",
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout du défi:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le défi",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPublicChallenges();
  }, [user, filterLikedOnly]);

  return {
    challenges,
    loading,
    error,
    addToPersonalChallenges,
    refresh: loadPublicChallenges
  };
}; 