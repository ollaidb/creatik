import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Hook personnalisé pour optimiser les requêtes et éviter les problèmes de cache
export function useOptimizedQuery<TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    ...options,
  });
}

// Hook pour forcer le rechargement des données
export function useForceRefresh() {
  const refresh = () => {
    // Forcer le rechargement en invalidant le cache
    window.location.reload();
  };
  
  return { refresh };
} 