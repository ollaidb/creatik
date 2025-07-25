
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', type);
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data ? data.map((fav: any) => fav.item_id) : [];
    },
    enabled: !!user
  });

  const toggleFavorite = async (itemId: string) => {
    if (!user) return;
    const isFavorite = favorites.includes(itemId);
    if (isFavorite) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', type);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('user_favorites')
        .insert({ user_id: user.id, item_id: itemId, item_type: type });
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
