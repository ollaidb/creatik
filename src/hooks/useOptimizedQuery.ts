import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Hook personnalisé pour optimiser les requêtes et éviter les problèmes de cache
export function useOptimizedQuery<TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  // Ajouter un timestamp pour éviter le cache
  const cacheBustingKey = [...queryKey, Date.now().toString()];
  
  return useQuery({
    queryKey: cacheBustingKey,
    queryFn,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    ...options,
  });
}

// Hook pour forcer le rechargement des données
export function useForceRefresh() {
  const refresh = () => {
    // Vider le cache de React Query
    window.location.reload();
  };
  
  return refresh;
} 