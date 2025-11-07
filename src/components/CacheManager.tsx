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
    const INACTIVITY_THRESHOLD = 1000 * 60 * 30; // 30 minutes

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Vérifier si l'utilisateur est revenu après une longue période d'inactivité
        const timeSinceLastActive = Date.now() - lastActiveTime;
        
        // Invalider seulement si l'utilisateur était inactif plus de 30 minutes
        if (timeSinceLastActive > INACTIVITY_THRESHOLD) {
          // Invalider seulement les requêtes qui sont vraiment anciennes
          queryClient.invalidateQueries({
            predicate: (query) => {
              // Invalider seulement si les données sont très anciennes (plus de 30 min)
              const dataUpdatedAt = query.state.dataUpdatedAt || 0;
              return Date.now() - dataUpdatedAt > INACTIVITY_THRESHOLD;
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
      queryClient.refetchQueries({
        predicate: (query) => {
          return query.state.status === 'error';
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