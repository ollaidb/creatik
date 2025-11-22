import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Idee {
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

export function useIdees(subcategoryId?: string, platform?: string) {
  return useQuery({
    queryKey: ['idees', subcategoryId, platform],
    queryFn: async () => {
      console.log('🔍 Chargement des idées:', { subcategoryId, platform });
      
      let query = supabase
        .from('content_idees')
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
        console.error('❌ Erreur lors du chargement des idées:', error);
        throw error;
      }

      console.log('✅ Idées chargées:', data?.length || 0);
      return data as Idee[] || [];
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