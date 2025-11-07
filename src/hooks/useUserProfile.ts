import { useQuery } from '@tanstack/react-query';
import { UserProfileService } from '@/services/userProfileService';
import { useIsPrimaryTab } from '@/components/TabCoordinator';
import { useEffect, useRef } from 'react';

export const useUserProfile = (userId: string | undefined) => {
  const isPrimaryTab = useIsPrimaryTab();
  const delayRef = useRef(false);
  
  // Pour les onglets non-principaux, ajouter un délai aléatoire avant de permettre les requêtes
  // Cela évite que tous les onglets lancent des requêtes en même temps
  useEffect(() => {
    if (!isPrimaryTab && userId && !delayRef.current) {
      // Délai aléatoire entre 500ms et 2000ms pour les onglets secondaires
      const delay = Math.random() * 1500 + 500;
      const timer = setTimeout(() => {
        delayRef.current = true;
      }, delay);
      return () => clearTimeout(timer);
    } else if (isPrimaryTab) {
      // L'onglet principal peut faire des requêtes immédiatement
      delayRef.current = true;
    }
  }, [isPrimaryTab, userId]);
  
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      return UserProfileService.getUserProfileData(userId);
    },
    // Activer seulement si on a un userId et si le délai est passé (pour les onglets secondaires)
    enabled: !!userId && (isPrimaryTab || delayRef.current),
    staleTime: 1000 * 60 * 10, // 10 minutes - plus long pour éviter les refetch
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false, // Ne pas refetch si déjà en cache
    retry: (failureCount, error) => {
      // Ne pas retry si c'est une erreur de permission ou client
      if (error && typeof error === 'object') {
        const errorMessage = String(error);
        if (errorMessage.includes('permission denied') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('JWT')) {
          return false;
        }
      }
      // Maximum 1 retry pour les erreurs réseau
      return failureCount < 1;
    },
    retryDelay: 2000, // Délai plus long entre les retry
  });
};

