import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useThemes = () => {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    }
  });
};
export const useCategoriesByTheme = (themeId?: string) => {
  return useQuery({
    queryKey: ['categories-by-theme', themeId],
    queryFn: async () => {
      if (!themeId || themeId === 'all') {
        // Si pas de thème ou "Tout", retourner toutes les catégories
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (error) throw error;
        return data;
      }
      // Sinon, filtrer par thème
      const { data, error } = await supabase
        .from('category_themes')
        .select(`
          category:categories(*)
        `)
        .eq('theme_id', themeId);
      if (error) throw error;
      return data.map(item => item.category).filter(Boolean);
    },
    enabled: true
  });
};
