import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubcategoryHierarchyConfig {
  id: string;
  subcategory_id: string;
  has_level2: boolean;
  created_at: string;
  updated_at: string;
}

export const useSubcategoryHierarchy = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['subcategory-hierarchy', subcategoryId],
    queryFn: async (): Promise<SubcategoryHierarchyConfig | null> => {
      if (!subcategoryId) {
        return null;
      }

      const { data, error } = await supabase
        .from('subcategory_hierarchy_config')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No configuration found
        }
        console.error('Error fetching subcategory hierarchy config:', error);
        throw error;
      }

      return data;
    },
    enabled: !!subcategoryId,
  });
}; 