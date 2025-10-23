import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContentTitles = (subcategoryId?: string, networkId?: string) => {
  return useQuery({
    queryKey: ['content-titles', subcategoryId, networkId],
    queryFn: async () => {
      let query = supabase
        .from('content_titles')
        .select('*')
        .eq('type', 'title') // Filtrer seulement les titres, pas les hooks
        .order('created_at', { ascending: false });
      
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      
      // Filtrer par plateforme si spécifié
      if (networkId && networkId !== 'all') {
        // Chercher d'abord les titres spécifiques à la plateforme
        query = query.eq('platform', networkId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true
  });
};
