import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContentTitles = (subcategoryId?: string, networkId?: string) => {
  return useQuery({
    queryKey: ['content-titles', subcategoryId, networkId],
    queryFn: async () => {
      let query = supabase
        .from('content_titles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      
      // Filtrer par réseau social si spécifié
      if (networkId && networkId !== 'all') {
        query = query.eq('social_network_id', networkId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true // Toujours activé pour charger tous les titres
  });
};
