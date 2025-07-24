import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSubcategory = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', subcategoryId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
}; 