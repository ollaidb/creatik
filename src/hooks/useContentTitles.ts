import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useContentTitles = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['content-titles', subcategoryId],
    queryFn: async () => {
      let query = supabase
        .from('content_titles')
        .select('*')
        .order('created_at', { ascending: false });
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
