import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  challenge_type?: string;
  status?: string;
  platform?: string;
  tags?: string[];
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
  const queryClient = useQueryClient();

  // Utiliser React Query pour le chargement avec cache
  const { data: challenges = [], isLoading: loading, isError, error, refetch } = useQuery({
    queryKey: ['public-challenges', filterLikedOnly],
    queryFn: async () => {
      const startTime = performance.now();
      
      const { data, error: queryError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const duration = performance.now() - startTime;
      console.log(`✅ Challenges récupérés en ${duration.toFixed(2)}ms:`, data?.length || 0);

      if (queryError) {
        console.error('❌ Erreur lors du chargement des challenges:', queryError);
        throw queryError;
      }

      const challengesWithCreator = (data || []).map((challenge: PublicChallenge) => ({
        ...challenge,
        creator: null
      }));

      return challengesWithCreator;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Ne pas retry si erreur de permission ou table inexistante
      if (error && typeof error === 'object') {
        const errorMessage = String(error);
        if (errorMessage.includes('permission denied') || 
            errorMessage.includes('does not exist')) {
          return false;
        }
      }
      return failureCount < 1; // Maximum 1 retry
    },
    retryDelay: 1000,
  });

  // Mutation pour ajouter un challenge aux défis personnels
  const addToPersonalChallengesMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active',
          points_earned: 0
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Défi ajouté !",
        description: "Le challenge a été ajouté à vos défis personnels",
      });
      // Invalider les défis personnels pour rafraîchir
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
    },
    onError: (err: Error) => {
      console.error('❌ Erreur lors de l\'ajout du défi:', err);
      if (err.message === 'Utilisateur non connecté') {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous pour ajouter des défis",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le défi",
          variant: "destructive"
        });
      }
    },
  });

  const addToPersonalChallenges = (challengeId: string) => {
    addToPersonalChallengesMutation.mutate(challengeId);
  };

  return {
    challenges,
    loading,
    error: isError ? (error instanceof Error ? error.message : 'Erreur lors du chargement') : null,
    addToPersonalChallenges,
    refresh: () => refetch()
  };
}; 