import { lazy } from 'react';

// Utilitaires pour optimiser les performances

// Fonction pour debouncer les appels de fonction
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Fonction pour throttler les appels de fonction
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Configuration optimisée pour React Query
export const queryConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: 1,
  retryDelay: 1000,
};

// Fonction pour optimiser les images
export function optimizeImageUrl(url: string, width: number = 400): string {
  // Ajouter des paramètres d'optimisation si c'est une URL d'image
  if (url.includes('supabase.co') || url.includes('cloudinary.com')) {
    return `${url}?w=${width}&q=80&f=auto`;
  }
  return url;
}

// Fonction pour lazy load les composants
export function lazyLoad<T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc);
} 