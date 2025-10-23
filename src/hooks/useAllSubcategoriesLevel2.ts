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

export const useAllSubcategoriesLevel2 = () => {
  return useQuery({
    queryKey: ['all-subcategories-level2'],
    queryFn: async (): Promise<SubcategoryLevel2[]> => {
      const { data, error } = await supabase
        .from('subcategories_level2')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching all subcategories level 2:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });
};
