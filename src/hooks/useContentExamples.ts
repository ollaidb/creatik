
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContentExamples = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['content-examples', subcategoryId],
    queryFn: async () => {
      let query = supabase
        .from('content_examples')
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
