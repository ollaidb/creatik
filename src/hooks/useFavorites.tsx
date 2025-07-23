
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Utiliser React Query pour gérer les favoris
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('category_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      return data.map(fav => fav.category_id);
    },
    enabled: !!user
  });

  const toggleFavorite = async (categoryId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour gérer vos favoris",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const isFavorite = favorites.includes(categoryId);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('category_id', categoryId);

        if (error) throw error;
        
        toast({
          title: "Retiré des favoris",
          description: "La catégorie a été retirée de vos favoris."
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            category_id: categoryId
          });

        if (error) throw error;
        
        toast({
          title: "Ajouté aux favoris",
          description: "La catégorie a été ajoutée à vos favoris."
        });
      }

      // Invalider les queries pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    favorites,
    loading: favoritesLoading || loading,
    toggleFavorite,
    isFavorite: (categoryId: string) => favorites.includes(categoryId)
  };
};
