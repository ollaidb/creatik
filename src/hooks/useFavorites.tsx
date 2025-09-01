import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useFavorites(type: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id, type],
    queryFn: async () => {
      if (!user) return [];
      
      console.log(`🔍 Chargement des favoris pour le type: ${type}`);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', type);
      
      if (error) {
        console.error(`❌ Erreur lors du chargement des favoris (${type}):`, error);
        throw error;
      }
      
      console.log(`✅ Favoris chargés pour ${type}:`, data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const favoriteIds = data ? data.map((fav: any) => fav.item_id) : [];
      setLocalFavorites(favoriteIds); // Synchroniser l'état local
      return favoriteIds;
    },
    enabled: !!user
  });

  const toggleFavorite = useCallback(async (itemId: string) => {
    if (!user) return;
    
    console.log(`🔄 Toggle favori - Type: ${type}, ItemId: ${itemId}`);
    
    const isCurrentlyFavorite = localFavorites.includes(itemId);
    
    // Mise à jour immédiate de l'état local pour un feedback instantané
    if (isCurrentlyFavorite) {
      setLocalFavorites(prev => prev.filter(id => id !== itemId));
    } else {
      setLocalFavorites(prev => [...prev, itemId]);
    }
    
    try {
      if (isCurrentlyFavorite) {
        console.log(`🗑️ Suppression du favori: ${itemId}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId)
          .eq('item_type', type);
        
        if (error) {
          console.error(`❌ Erreur lors de la suppression du favori:`, error);
          // Remettre l'état local en cas d'erreur
          setLocalFavorites(prev => [...prev, itemId]);
          throw error;
        }
        console.log(`✅ Favori supprimé: ${itemId}`);
      } else {
        console.log(`➕ Ajout du favori: ${itemId}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('user_favorites')
          .insert({ user_id: user.id, item_id: itemId, item_type: type });
        
        if (error) {
          console.error(`❌ Erreur lors de l'ajout du favori:`, error);
          // Remettre l'état local en cas d'erreur
          setLocalFavorites(prev => prev.filter(id => id !== itemId));
          throw error;
        }
        console.log(`✅ Favori ajouté: ${itemId}`);
      }
      
      // Invalider le cache pour synchroniser avec la base de données
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id, type] });
    } catch (error) {
      console.error(`❌ Erreur lors du toggle favori:`, error);
      throw error;
    }
  }, [user, type, localFavorites, queryClient]);

  // Utiliser l'état local pour le feedback immédiat, sinon les données du cache
  const currentFavorites = localFavorites.length > 0 ? localFavorites : favorites;

  return {
    favorites: currentFavorites,
    isLoading,
    toggleFavorite,
    isFavorite: (itemId: string) => currentFavorites.includes(itemId)
  };
}
