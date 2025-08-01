import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Account {
  id: string;
  title: string;
  url?: string;
  platform?: string;
  category_id?: string;
  subcategory_id?: string;
  social_network_id?: string;
  created_at: string;
  updated_at: string;
}

export const useAccounts = (categoryId?: string, subcategoryId?: string) => {
  return useQuery({
    queryKey: ['accounts', categoryId, subcategoryId],
    queryFn: async (): Promise<Account[]> => {
      let query = supabase
        .from('accounts')
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
        console.error('Erreur lors de la récupération des comptes:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });
}; 