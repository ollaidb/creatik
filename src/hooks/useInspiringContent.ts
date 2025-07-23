
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInspiringContent = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['inspiring-content', subcategoryId],
    queryFn: async () => {
      let query = supabase
        .from('inspiring_content')
        .select('*')
        .order('popularity_score', { ascending: false });
      
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
};

export const useInspiringContentById = (contentId: string) => {
  return useQuery({
    queryKey: ['inspiring-content', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspiring_content')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contentId
  });
};
