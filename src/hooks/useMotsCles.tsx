import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MotsCles {
  id: string;
  title: string;
  content?: string;
  author_id?: string;
  category_id?: string;
  subcategory_id?: string;
  platform: string;
  created_at: string;
  updated_at: string;
}

export function useMotsCles(subcategoryId?: string, platform?: string) {
  return useQuery({
    queryKey: ['mots-cles', subcategoryId, platform],
    queryFn: async () => {
      console.log('🔍 Chargement des mots-clés:', { subcategoryId, platform });
      
      let query = supabase
        .from('content_mots_cles')
        .select('*')
        .order('created_at', { ascending: false });

      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }

      if (platform && platform !== 'all') {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors du chargement des mots-clés:', error);
        throw error;
      }

      console.log('✅ Mots-clés chargés:', data?.length || 0);
      return data as MotsCles[] || [];
    },
    enabled: !!subcategoryId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
} 