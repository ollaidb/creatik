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
      console.log('🔄 Début de la requête des catégories...');
      const startTime = performance.now();
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`✅ Catégories récupérées en ${duration.toFixed(2)}ms:`, data?.length || 0);
        
        if (error) {
          console.error('❌ Erreur lors de la récupération des catégories:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.warn('⚠️ Aucune catégorie trouvée dans la base de données');
        }
        
        return data;
      } catch (error) {
        console.error('❌ Exception lors de la récupération des catégories:', error);
        throw error;
      }
    },
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    // Gestion des erreurs et retry
    retry: (failureCount, error) => {
      console.log(`🔄 Tentative ${failureCount + 1} de récupération des catégories`);
      // Retry seulement pour les erreurs réseau, pas pour les erreurs 4xx
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as SupabaseError;
        if (supabaseError.code && supabaseError.code.startsWith('4')) {
          console.log('❌ Erreur client, pas de retry');
          return false;
        }
      }
      return failureCount < 2; // Maximum 3 tentatives
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponentiel
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
