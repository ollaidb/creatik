import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    // Refetch automatique toutes les 30 secondes pour voir les nouvelles publications
    refetchInterval: 30000,
    // Refetch quand la fenêtre redevient active
    refetchOnWindowFocus: true,
    // Refetch quand on revient en ligne
    refetchOnReconnect: true,
    // Garder les données en cache pendant 30 secondes
    staleTime: 30000
  });
};
export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
    // Refetch automatique pour les catégories individuelles aussi
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000
  });
};
