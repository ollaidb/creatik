import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContentTitleLevel2 {
  id: string;
  title: string;
  description?: string;
  subcategory_level2_id: string;
  type: string;
  platform: string;
  created_at: string;
  updated_at: string;
}

export const useContentTitlesLevel2 = (subcategoryLevel2Id?: string, network?: string) => {
  return useQuery({
    queryKey: ['content-titles-level2', subcategoryLevel2Id, network],
    queryFn: async (): Promise<ContentTitleLevel2[]> => {
      if (!subcategoryLevel2Id) {
        return [];
      }

      let query = supabase
        .from('content_titles_level2')
        .select('*')
        .eq('subcategory_level2_id', subcategoryLevel2Id);

      // Filtrer par réseau social si spécifié
      if (network && network !== 'all') {
        query = query.eq('platform', network);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content titles level 2:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!subcategoryLevel2Id,
  });
}; 