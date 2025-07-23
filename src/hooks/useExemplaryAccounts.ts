
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExemplaryAccounts = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['exemplary-accounts', subcategoryId],
    queryFn: async () => {
      let query = supabase
        .from('exemplary_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
};
