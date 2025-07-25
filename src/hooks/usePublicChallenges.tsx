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
  is_liked?: boolean;
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
      let query = (supabase as any)
        .from('challenges')
        .select(`
          *,
          creator:profiles!challenges_created_by_fkey(
            id,
            email,
            user_metadata
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      // Si on veut seulement les challenges likés par l'utilisateur
      if (filterLikedOnly && user) {
        query = query.in('id', 
          (supabase as any)
            .from('challenge_likes')
            .select('challenge_id')
            .eq('user_id', user.id)
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      // Ajouter l'information si l'utilisateur a liké chaque challenge
      if (user) {
        const { data: likedChallenges } = await (supabase as any)
          .from('challenge_likes')
          .select('challenge_id')
          .eq('user_id', user.id);
        const likedIds = likedChallenges?.map((lc: any) => lc.challenge_id) || [];
        const challengesWithLikes = (data || []).map((challenge: PublicChallenge) => ({
          ...challenge,
          is_liked: likedIds.includes(challenge.id)
        }));
        setChallenges(challengesWithLikes);
      } else {
        setChallenges(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des challenges publics:', err);
      setError('Impossible de charger les challenges');
    } finally {
      setLoading(false);
    }
  };
  // Liker/unliker un challenge
  const toggleLike = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour liker des challenges",
        variant: "destructive"
      });
      return;
    }
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      const isCurrentlyLiked = challenge?.is_liked;
      if (isCurrentlyLiked) {
        // Unliker
        const { error } = await (supabase as any)
          .from('challenge_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('challenge_id', challengeId);
        if (error) throw error;
        toast({
          title: "Like retiré",
          description: "Le challenge a été retiré de vos favoris",
        });
      } else {
        // Liker
        const { error } = await (supabase as any)
          .from('challenge_likes')
          .insert({
            user_id: user.id,
            challenge_id: challengeId
          });
        if (error) throw error;
        toast({
          title: "Challenge liké !",
          description: "Le challenge a été ajouté à vos favoris",
        });
      }
      // Recharger les challenges
      await loadPublicChallenges();
    } catch (err) {
      console.error('Erreur lors du like/unlike:', err);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive"
      });
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
    toggleLike,
    addToPersonalChallenges,
    refresh: loadPublicChallenges
  };
}; 