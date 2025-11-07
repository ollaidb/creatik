import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('❌ Erreur lors de la récupération des catégories:', error);
        throw error;
      }
      
      return data || [];
    },
    // Optimisation des performances
    staleTime: 1000 * 60 * 15, // 15 minutes - plus long pour éviter les refetch fréquents
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false, // Ne pas refetch si déjà en cache
    refetchInterval: false,
    // Gestion des erreurs et retry - Limité pour éviter la saturation
    retry: (failureCount, error) => {
      // Ne pas retry si c'est une erreur de permission ou client
      if (error && typeof error === 'object') {
        const errorMessage = String(error);
        if (errorMessage.includes('permission denied') || 
            errorMessage.includes('does not exist') ||
            (('code' in error) && typeof (error as SupabaseError).code === 'string' && (error as SupabaseError).code?.startsWith('4'))) {
          return false;
        }
      }
      // Maximum 0 retry pour éviter la saturation - si ça échoue, on utilise le cache
      return false;
    },
    retryDelay: 2000,
  });
};

export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      console.log(`🔄 Récupération de la catégorie ${categoryId}...`);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) {
        console.error(`❌ Erreur lors de la récupération de la catégorie ${categoryId}:`, error);
        throw error;
      }
      
      console.log(`✅ Catégorie ${categoryId} récupérée:`, data?.name);
      return data;
    },
    enabled: !!categoryId,
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: (failureCount, error) => {
      console.log(`🔄 Tentative ${failureCount + 1} de récupération de la catégorie ${categoryId}`);
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as SupabaseError;
        if (supabaseError.code && supabaseError.code.startsWith('4')) {
          return false;
        }
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
