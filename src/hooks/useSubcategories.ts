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
    enabled: !!categoryId, // Seulement activé si categoryId est fourni
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false
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
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false
  });
};
