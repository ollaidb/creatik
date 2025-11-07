import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubcategoryLevel2 {
  id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  subcategory?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export const useSubcategoryLevel2 = (subcategoryLevel2Id?: string) => {
  return useQuery({
    queryKey: ['subcategory-level2', subcategoryLevel2Id],
    queryFn: async (): Promise<SubcategoryLevel2 | null> => {
      if (!subcategoryLevel2Id) {
        return null;
      }

      const { data, error } = await supabase
        .from('subcategories_level2')
        .select(`
          *,
          subcategory:subcategories(
            id,
            name,
            category:categories(
              id,
              name
            )
          )
        `)
        .eq('id', subcategoryLevel2Id)
        .single();

      if (error) {
        console.error('Error fetching subcategory level 2:', error);
        throw error;
      }

      return data;
    },
    enabled: !!subcategoryLevel2Id,
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