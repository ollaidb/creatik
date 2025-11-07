import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  from?: string;
  returnTo?: string;
}

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigue vers une nouvelle page en utilisant l'historique natif du navigateur
   * Cela permet un retour logique automatique
   */
  const navigateWithReturn = (to: string, returnTo?: string) => {
    // Utiliser navigate() normalement pour ajouter à l'historique
    navigate(to);
  };

  /**
   * Retourne à la page précédente en utilisant l'historique natif du navigateur
   * Utilise l'historique de React Router qui gère automatiquement la pile de navigation
   * Si pas d'historique dans la pile React Router, retourne à la page d'accueil
   */
  const navigateBack = () => {
    // Utiliser navigate(-1) pour revenir dans l'historique
    // React Router gère automatiquement la pile de navigation
    // Si on est à la racine de l'historique, ça ne fera rien ou retournera à la page précédente du navigateur
    navigate(-1);
  };

  /**
   * Obtient le chemin de retour (pour compatibilité avec l'ancien code)
   * Utilise l'historique du navigateur si disponible
   */
  const getReturnPath = (): string => {
    const state = location.state as NavigationState;
    if (state?.returnTo) {
      return state.returnTo;
    }
    if (state?.from) {
      return state.from;
    }
    // Si pas d'état, vérifier si on peut revenir en arrière
    if (window.history.length > 1) {
      return ''; // Indique qu'on peut utiliser navigate(-1)
    }
    return '/';
  };

  return {
    navigateWithReturn,
    navigateBack,
    getReturnPath
  };
};
