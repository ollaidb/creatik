import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Exemple {
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

export function useExemples(subcategoryId?: string, platform?: string) {
  return useQuery({
    queryKey: ['exemples', subcategoryId, platform],
    queryFn: async () => {
      console.log('🔍 Chargement des exemples:', { subcategoryId, platform });
      
      let query = supabase
        .from('content_exemples')
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
        console.error('❌ Erreur lors du chargement des exemples:', error);
        throw error;
      }

      console.log('✅ Exemples chargés:', data?.length || 0);
      return data as Exemple[] || [];
    },
    enabled: !!subcategoryId
  });
} 