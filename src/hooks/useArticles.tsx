import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Article {
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

export function useArticles(subcategoryId?: string, platform?: string) {
  return useQuery({
    queryKey: ['articles', subcategoryId, platform],
    queryFn: async () => {
      console.log('🔍 Chargement des articles:', { subcategoryId, platform });
      
      let query = supabase
        .from('content_articles')
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
        console.error('❌ Erreur lors du chargement des articles:', error);
        throw error;
      }

      console.log('✅ Articles chargés:', data?.length || 0);
      return data as Article[] || [];
    },
    enabled: !!subcategoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
} 