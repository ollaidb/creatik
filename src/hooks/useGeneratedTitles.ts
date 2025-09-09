import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export interface GeneratedTitle {
  id: string;
  title: string;
  platform: string;
  subcategory_id: string;
  generation_date: string;
  usage_count: number;
}

export interface UseGeneratedTitlesParams {
  platform: string;
  subcategoryId: string;
  limit?: number;
}

export const useGeneratedTitles = ({ 
  platform, 
  subcategoryId, 
  limit = 20 
}: UseGeneratedTitlesParams) => {
  return useQuery({
    queryKey: ['generated-titles', platform, subcategoryId, limit],
    queryFn: async (): Promise<GeneratedTitle[]> => {
      const { data, error } = await supabase
        .from('generated_titles')
        .select(`
          id,
          title,
          platform,
          subcategory_id,
          generation_date,
          usage_count
        `)
        .eq('platform', platform)
        .eq('subcategory_id', subcategoryId)
        .eq('is_active', true)
        .order('generation_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération des titres générés:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!platform && !!subcategoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les titres générés par plateforme
export const useGeneratedTitlesByPlatform = (platform: string) => {
  return useQuery({
    queryKey: ['generated-titles-by-platform', platform],
    queryFn: async (): Promise<GeneratedTitle[]> => {
      const { data, error } = await supabase
        .from('generated_titles')
        .select(`
          id,
          title,
          platform,
          subcategory_id,
          generation_date,
          usage_count
        `)
        .eq('platform', platform)
        .eq('is_active', true)
        .order('generation_date', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Erreur lors de la récupération des titres par plateforme:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!platform,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour incrémenter le compteur d'utilisation d'un titre
export const useIncrementTitleUsage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (titleId: string) => {
      // D'abord récupérer la valeur actuelle
      const { data: currentData, error: fetchError } = await supabase
        .from('generated_titles')
        .select('usage_count')
        .eq('id', titleId)
        .single();

      if (fetchError) {
        console.error('Erreur lors de la récupération du compteur:', fetchError);
        throw fetchError;
      }

      // Ensuite incrémenter
      const { data, error } = await supabase
        .from('generated_titles')
        .update({ 
          usage_count: (currentData?.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', titleId)
        .select('usage_count')
        .single();

      if (error) {
        console.error('Erreur lors de l\'incrémentation du compteur:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['generated-titles'] });
      queryClient.invalidateQueries({ queryKey: ['generated-titles-stats'] });
    },
  });
};

// Fonction pour générer de nouveaux titres
export const generateNewTitles = async (
  platform: string, 
  subcategoryId: string, 
  count: number = 10
): Promise<number> => {
  const { data, error } = await supabase.rpc('generate_and_save_titles', {
    p_platform: platform,
    p_subcategory_id: subcategoryId,
    p_count: count
  });

  if (error) {
    console.error('Erreur lors de la génération de nouveaux titres:', error);
    throw error;
  }

  return data;
};

// Fonction pour récupérer des statistiques sur les titres générés
export const useGeneratedTitlesStats = () => {
  return useQuery({
    queryKey: ['generated-titles-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_titles')
        .select('platform, subcategory_id, usage_count, generation_date')
        .eq('is_active', true);

      if (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw error;
      }

      const stats = {
        totalTitles: data?.length || 0,
        totalUsage: data?.reduce((sum, title) => sum + (title.usage_count || 0), 0) || 0,
        platforms: data?.reduce((acc, title) => {
          acc[title.platform] = (acc[title.platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
        averageUsage: data?.length ? 
          data.reduce((sum, title) => sum + (title.usage_count || 0), 0) / data.length : 0
      };

      return stats;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 