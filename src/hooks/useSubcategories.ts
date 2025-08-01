import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSubcategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('subcategories')
        .select('*')
        .order('name');
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true, // Toujours activé pour charger toutes les sous-catégories
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

export const useSubcategory = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', subcategoryId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId,
    // Refetch automatique pour les sous-catégories individuelles aussi
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000
  });
};
