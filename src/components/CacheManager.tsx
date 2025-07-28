import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheManagerProps {
  children: React.ReactNode;
}

const CacheManager: React.FC<CacheManagerProps> = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fonction pour vider le cache et forcer les mises à jour
    const clearCache = () => {
      queryClient.clear();
      queryClient.invalidateQueries();
    };

    // Écouter les événements de mise à jour
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Recharger les données quand l'utilisateur revient sur l'onglet
        queryClient.invalidateQueries();
      }
    };

    const handleOnline = () => {
      // Recharger les données quand la connexion revient
      queryClient.invalidateQueries();
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