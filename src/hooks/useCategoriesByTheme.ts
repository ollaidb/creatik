import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryThemeItem {
  category: {
    id: string;
    name: string;
    color: string;
    theme_id?: string;
  };
}

export const useCategoriesByTheme = (themeId?: string) => {
  return useQuery({
    queryKey: ['categoriesByTheme', themeId],
    queryFn: async () => {
      if (!themeId || themeId === 'all') {
        // Si "Tout", on récupère toutes les catégories
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data;
      }
      // Sinon, on récupère les catégories liées au thème
      const { data, error } = await supabase
        .from('category_themes')
        .select('category:categories(*)')
        .eq('theme_id', themeId);
      if (error) throw error;
      return data.map((item: CategoryThemeItem) => item.category);
    }
  });
}; 