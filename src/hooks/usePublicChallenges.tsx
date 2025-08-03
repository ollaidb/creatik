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
      console.log('🔄 Chargement des challenges publics...');
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`✅ Challenges récupérés en ${duration.toFixed(2)}ms:`, data?.length || 0);

      if (error) {
        console.error('❌ Erreur lors du chargement des challenges:', error);
        throw error;
      }

      const challengesWithCreator = (data || []).map((challenge: PublicChallenge) => ({
        ...challenge,
        creator: null // Pas de créateur pour l'instant
      }));
      
      setChallenges(challengesWithCreator);
      console.log('✅ Challenges chargés avec succès');
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des challenges publics:', err);
      setError('Impossible de charger les challenges');
      
      // Fallback: utiliser des données temporaires si la table n'existe pas
      if (err instanceof Error && err.message.includes('does not exist')) {
        console.log('⚠️ Table challenges non trouvée, utilisation de données temporaires');
        setChallenges([
          {
            id: 'temp-1',
            title: 'Défi de création de contenu',
            description: 'Créez du contenu engageant pour votre audience',
            category: 'Création',
            points: 100,
            difficulty: 'medium',
            duration_days: 7,
            is_daily: false,
            is_active: true,
            created_by: 'system',
            likes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            creator: null
          }
        ]);
        setError(null);
      }
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
      console.log('🔄 Ajout du challenge aux défis personnels...');
      
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active',
          points_earned: 0
        });
        
      if (error) {
        console.error('❌ Erreur lors de l\'ajout du défi:', error);
        throw error;
      }
      
      console.log('✅ Challenge ajouté avec succès');
      toast({
        title: "Défi ajouté !",
        description: "Le challenge a été ajouté à vos défis personnels",
      });
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout du défi:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le défi",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect usePublicChallenges - user:', user?.id, 'filterLikedOnly:', filterLikedOnly);
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