import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryHierarchyConfig {
  id: string;
  category_id: string;
  has_level2: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategoryHierarchy = (categoryId?: string) => {
  return useQuery({
    queryKey: ['category-hierarchy', categoryId],
    queryFn: async (): Promise<CategoryHierarchyConfig | null> => {
      if (!categoryId) {
        return null;
      }

      const { data, error } = await supabase
        .from('category_hierarchy_config')
        .select('*')
        .eq('category_id', categoryId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucune configuration trouvée, retourner null
          return null;
        }
        console.error('Error fetching category hierarchy config:', error);
        throw error;
      }

      return data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 10, // 10 minutes - la hiérarchie change rarement
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
}; 