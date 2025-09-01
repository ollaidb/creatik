import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Source {
  id: string;
  title: string;
  url?: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  social_network_id?: string;
  created_at: string;
  updated_at: string;
}

export const useSources = (categoryId?: string, subcategoryId?: string) => {
  return useQuery({
    queryKey: ['sources', categoryId, subcategoryId],
    queryFn: async (): Promise<Source[]> => {
      let query = supabase
        .from('sources')
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
        console.error('Erreur lors de la récupération des sources:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });
}; 