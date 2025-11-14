import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheManagerProps {
  children: React.ReactNode;
}

const CacheManager: React.FC<CacheManagerProps> = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Optimisé : Ne pas invalider automatiquement les requêtes
    // Le cache React Query gère déjà la fraîcheur des données
    // Invalider seulement si nécessaire après un certain temps d'inactivité
    
    let lastActiveTime = Date.now();
    const INACTIVITY_THRESHOLD = 1000 * 60 * 60; // 1 heure - augmenté pour éviter les invalidations trop fréquentes

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Vérifier si l'utilisateur est revenu après une longue période d'inactivité
        const timeSinceLastActive = Date.now() - lastActiveTime;
        
        // Invalider seulement si l'utilisateur était inactif plus d'1 heure
        // et seulement les requêtes qui sont vraiment anciennes
        if (timeSinceLastActive > INACTIVITY_THRESHOLD) {
          // Invalider seulement les requêtes qui sont vraiment anciennes (plus d'1 heure)
          queryClient.invalidateQueries({
            predicate: (query) => {
              // Invalider seulement si les données sont très anciennes (plus d'1 heure)
              const dataUpdatedAt = query.state.dataUpdatedAt || 0;
              const isStale = Date.now() - dataUpdatedAt > INACTIVITY_THRESHOLD;
              // Ne pas invalider les requêtes qui sont en cours ou qui ont échoué récemment
              const isNotLoading = query.state.status !== 'loading';
              const isNotRecentError = query.state.status !== 'error' || (Date.now() - (query.state.errorUpdatedAt || 0)) > 5000;
              return isStale && isNotLoading && isNotRecentError;
            }
          });
        }
      } else {
        // Mettre à jour le temps d'inactivité quand l'utilisateur quitte l'onglet
        lastActiveTime = Date.now();
      }
    };

    const handleOnline = () => {
      // Quand la connexion revient, refetch seulement les requêtes qui ont échoué
      // et qui ne sont pas des erreurs d'autorisation (celles-ci sont gérées par AuthErrorHandler)
      queryClient.refetchQueries({
        predicate: (query) => {
          if (query.state.status !== 'error') return false;
          // Ne pas refetch les erreurs d'autorisation - elles sont gérées par AuthErrorHandler
          const error = query.state.error;
          if (error && typeof error === 'object') {
            const errorMessage = String(error);
            if (errorMessage.includes('permission denied') || 
                errorMessage.includes('JWT') ||
                errorMessage.includes('401') ||
                errorMessage.includes('403')) {
              return false;
            }
          }
          return true;
        }
      });
    };

    // Ajouter les event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    // Nettoyer les event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);

  return <>{children}</>;
};

export default CacheManager; 