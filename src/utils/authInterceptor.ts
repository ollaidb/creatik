import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Vérifie si une erreur est une erreur d'autorisation (403, 401)
 */
export const isAuthError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  
  // Vérifier les erreurs Supabase
  if ('code' in error) {
    const code = (error as PostgrestError).code;
    if (code === 'PGRST301' || code === '42501') return true; // Permission denied
  }
  
  // Vérifier les erreurs HTTP
  if ('status' in error) {
    const status = (error as { status: number }).status;
    if (status === 401 || status === 403) return true;
  }
  
  // Vérifier les messages d'erreur
  const errorMessage = String(error);
  return errorMessage.includes('permission denied') ||
         errorMessage.includes('JWT') ||
         errorMessage.includes('401') ||
         errorMessage.includes('403') ||
         errorMessage.includes('unauthorized');
};

/**
 * Rafraîchit la session Supabase si elle existe
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    // Récupérer la session actuelle
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Erreur lors de la récupération de la session:', error);
      return false;
    }
    
    if (!session || !session.user) {
      // Pas de session, rien à rafraîchir
      return false;
    }
    
    // Vérifier si le token est expiré ou va expirer bientôt (dans les 5 prochaines minutes)
    const expiresAt = session.expires_at;
    if (expiresAt) {
      const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
      // Si le token expire dans plus de 5 minutes, pas besoin de refresh
      if (expiresIn > 300) {
        return true; // La session est toujours valide
      }
    }
    
    // Forcer le refresh du token
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.warn('Erreur lors du refresh du token:', refreshError);
      // Si le refresh échoue, vérifier si c'est une erreur récupérable
      // Certaines erreurs peuvent être temporaires (réseau, etc.)
      if (refreshError.message?.includes('network') || refreshError.message?.includes('timeout')) {
        // Erreur réseau, la session peut encore être valide
        return true;
      }
      return false;
    }
    
    // Vérifier que la session rafraîchie est valide
    if (!refreshedSession || !refreshedSession.user) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors du rafraîchissement de la session:', error);
    return false;
  }
};

/**
 * Wrapper pour les requêtes Supabase qui gère automatiquement les erreurs d'autorisation
 */
export const withAuthRetry = async <T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  maxRetries: number = 1
): Promise<{ data: T | null; error: PostgrestError | null }> => {
  let lastError: PostgrestError | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await queryFn();
    
    // Si pas d'erreur, retourner le résultat
    if (!result.error) {
      return result;
    }
    
    lastError = result.error;
    
    // Si c'est une erreur d'autorisation, essayer de rafraîchir la session
    if (isAuthError(result.error) && attempt < maxRetries) {
      console.log(`Tentative de rafraîchissement de session (tentative ${attempt + 1}/${maxRetries + 1})`);
      const refreshed = await refreshSession();
      
      if (refreshed) {
        // Réessayer la requête avec la nouvelle session
        continue;
      } else {
        // Si le refresh échoue, retourner l'erreur
        return result;
      }
    } else {
      // Si ce n'est pas une erreur d'autorisation ou qu'on a atteint le max de retries
      return result;
    }
  }
  
  return { data: null, error: lastError };
};

