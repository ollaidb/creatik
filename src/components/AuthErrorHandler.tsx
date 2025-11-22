import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { isAuthError, refreshSession } from '@/utils/authInterceptor';

/**
 * Composant pour gérer les erreurs d'autorisation globales
 * Invalide le cache React Query quand une erreur 403/401 est détectée
 */
export const AuthErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const refreshInProgressRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);

  useEffect(() => {
    // Intercepter les erreurs de requêtes React Query
    const handleQueryError = async (error: unknown) => {
      if (!isAuthError(error)) return;
      
      // Éviter les refresh multiples simultanés
      const now = Date.now();
      if (refreshInProgressRef.current || (now - lastRefreshTimeRef.current) < 5000) {
        return; // Un refresh est déjà en cours ou vient d'être fait récemment
      }

      console.warn('🔐 Erreur d\'autorisation détectée, tentative de rafraîchissement...');
      refreshInProgressRef.current = true;
      lastRefreshTimeRef.current = now;
      
      try {
        // Rafraîchir la session
        const refreshed = await refreshSession();
        
        if (refreshed) {
          console.log('✅ Session rafraîchie avec succès, refetch des requêtes en erreur...');
          // Refetch seulement les requêtes qui ont échoué avec erreur d'autorisation
          // Ne pas invalider pour éviter de perdre les données en cache
          queryClient.refetchQueries({
            predicate: (query) => {
              const error = query.state.error;
              return error ? isAuthError(error) : false;
            }
          });
        } else {
          console.warn('⚠️ Impossible de rafraîchir la session');
          // Ne pas invalider tout le cache si le refresh échoue
          // Garder les données en cache pour éviter de perdre l'information
          // L'utilisateur devra peut-être se reconnecter, mais les données restent visibles
        }
      } catch (refreshError) {
        console.error('❌ Erreur lors du rafraîchissement:', refreshError);
      } finally {
        refreshInProgressRef.current = false;
      }
    };

    // Écouter les erreurs de requêtes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'error' && event.query?.state?.error) {
        handleQueryError(event.query.state.error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, user]);

  return <>{children}</>;
};

