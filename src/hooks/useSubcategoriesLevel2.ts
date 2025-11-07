import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubcategoryLevel2 {
  id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSubcategoriesLevel2 = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['subcategories-level2', subcategoryId],
    queryFn: async (): Promise<SubcategoryLevel2[]> => {
      if (!subcategoryId) {
        return [];
      }

      const { data, error } = await supabase
        .from('subcategories_level2')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('name');

      if (error) {
        console.error('Error fetching subcategories level 2:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!subcategoryId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object') {
        const errorMessage = String(error);
        if (errorMessage.includes('permission denied') || 
            errorMessage.includes('does not exist')) {
          return false;
        }
      }
      return failureCount < 1;
    },
    retryDelay: 1000,
  });
}; 