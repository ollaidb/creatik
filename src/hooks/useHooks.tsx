import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hook {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  social_network_id?: string;
  created_at: string;
  updated_at: string;
}

export const useHooks = (categoryId?: string, subcategoryId?: string) => {
  return useQuery({
    queryKey: ['hooks', categoryId, subcategoryId],
    queryFn: async (): Promise<Hook[]> => {
      let query = supabase
        .from('hooks')
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
        console.error('Erreur lors de la récupération des hooks:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });
}; 