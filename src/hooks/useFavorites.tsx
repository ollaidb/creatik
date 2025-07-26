import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useFavorites(type: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      return data ? data.map((fav: any) => fav.item_id) : [];
    },
    enabled: !!user
  });

  const toggleFavorite = async (itemId: string) => {
    if (!user) return;
    
    console.log(`🔄 Toggle favori - Type: ${type}, ItemId: ${itemId}`);
    
    const isFavorite = favorites.includes(itemId);
    
    if (isFavorite) {
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
        throw error;
      }
      console.log(`✅ Favori ajouté: ${itemId}`);
    }
    
    queryClient.invalidateQueries({ queryKey: ['favorites', user?.id, type] });
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite: (itemId: string) => favorites.includes(itemId)
  };
}
