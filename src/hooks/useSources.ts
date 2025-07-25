import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
}; 