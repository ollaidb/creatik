
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSubcategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      console.log('🔍 Fetching subcategories for categoryId:', categoryId);
      
      let query = supabase
        .from('subcategories')
        .select('*')
        .order('name');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      console.log('📊 Subcategories data:', data);
      console.log('❌ Error if any:', error);
      
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
    // Refetch automatique toutes les 5 secondes pour voir les nouvelles publications
    refetchInterval: 5000,
    // Refetch quand la fenêtre redevient active
    refetchOnWindowFocus: true,
    // Refetch quand on revient en ligne
    refetchOnReconnect: true,
    // Garder les données en cache pendant 10 secondes
    staleTime: 10000
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
