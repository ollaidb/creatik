import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Inspiration {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  social_network_id?: string;
  created_at: string;
  updated_at: string;
}

export const useInspirations = (categoryId?: string, subcategoryId?: string) => {
  return useQuery({
    queryKey: ['inspirations', categoryId, subcategoryId],
    queryFn: async (): Promise<Inspiration[]> => {
      let query = supabase
        .from('inspirations')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des inspirations:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });
}; 