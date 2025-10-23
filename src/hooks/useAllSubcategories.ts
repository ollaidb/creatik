import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useAllSubcategories = () => {
  return useQuery({
    queryKey: ['all-subcategories'],
    queryFn: async (): Promise<Subcategory[]> => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching all subcategories:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false
  });
};
