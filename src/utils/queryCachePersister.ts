// Utilitaire pour persister le cache React Query dans localStorage
// Évite la disparition des données lors du rechargement de la page

const CACHE_KEY = 'react-query-cache';
const CACHE_VERSION = '1.0';

interface CacheEntry {
  queryKey: string[];
  data: unknown;
  dataUpdatedAt: number;
  error: unknown | null;
  errorUpdatedAt: number | null;
}

interface QueryState {
  state?: {
    data?: unknown;
    dataUpdatedAt?: number;
    error?: unknown | null;
    errorUpdatedAt?: number | null;
    status?: string;
  };
}

export const queryCachePersister = {
  // Sauvegarder le cache dans localStorage
  save: (queryCache: Map<string, unknown>) => {
    try {
      const cacheEntries: CacheEntry[] = [];
      
      queryCache.forEach((queryState: QueryState | unknown, queryKey: string) => {
        const state = (queryState as QueryState)?.state;
        if (state?.data !== undefined && state.status === 'success') {
          try {
            // Vérifier que les données peuvent être sérialisées
            JSON.stringify(state.data);
            
            cacheEntries.push({
              queryKey: typeof queryKey === 'string' ? JSON.parse(queryKey) : queryKey,
              data: state.data,
              dataUpdatedAt: state.dataUpdatedAt || Date.now(),
              error: state.error || null,
              errorUpdatedAt: state.errorUpdatedAt || null,
            });
          } catch (e) {
            // Ignorer les données non sérialisables
            console.warn('Données non sérialisables ignorées:', queryKey);
          }
        }
      });
      
      const cacheData = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        entries: cacheEntries,
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du cache:', error);
    }
  },
  
  // Restaurer le cache depuis localStorage
  load: (): Map<string, unknown> | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      
      // Vérifier la version et l'âge du cache (max 1 heure)
      if (cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      const cacheAge = Date.now() - cacheData.timestamp;
      if (cacheAge > 1000 * 60 * 60) { // 1 heure
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      const restoredCache = new Map();
      
      cacheData.entries.forEach((entry: CacheEntry) => {
        const queryKey = JSON.stringify(entry.queryKey);
        restoredCache.set(queryKey, {
          state: {
            data: entry.data,
            dataUpdatedAt: entry.dataUpdatedAt,
            error: entry.error,
            errorUpdatedAt: entry.errorUpdatedAt,
            status: entry.error ? 'error' : 'success',
          },
        });
      });
      
      return restoredCache;
    } catch (error) {
      console.warn('Erreur lors de la restauration du cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  },
  
  // Obtenir les données initiales pour une query spécifique
  getInitialData: <T>(queryKey: string[]): T | undefined => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return undefined;
      
      const cacheData = JSON.parse(cached);
      const cacheAge = Date.now() - cacheData.timestamp;
      
      // Ne pas utiliser un cache trop ancien (max 1 heure)
      if (cacheAge > 1000 * 60 * 60) {
        return undefined;
      }
      
      const entry = cacheData.entries.find((e: CacheEntry) => 
        JSON.stringify(e.queryKey) === JSON.stringify(queryKey)
      );
      
      if (entry && !entry.error) {
        return entry.data as T;
      }
      
      return undefined;
    } catch (error) {
      console.warn('Erreur lors de la récupération des données initiales:', error);
      return undefined;
    }
  },
  
  // Nettoyer le cache
  clear: () => {
    localStorage.removeItem(CACHE_KEY);
  },
};

