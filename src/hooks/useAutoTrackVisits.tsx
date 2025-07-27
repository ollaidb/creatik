import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useVisitHistory } from '@/hooks/useVisitHistory';

export const useAutoTrackVisits = () => {
  const location = useLocation();
  const { addVisit } = useVisitHistory();

  useEffect(() => {
    // Ne pas tracker les pages sensibles
    const sensitivePaths = ['/profile', '/login', '/register', '/admin'];
    if (sensitivePaths.some(path => location.pathname.startsWith(path))) {
      return;
    }

    // Tracker les clics sur les éléments de la page
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Trouver l'élément cliqué le plus proche avec des données
      let clickedElement = target;
      let visitInfo: any = null;

      // Chercher dans les parents pour trouver l'élément avec des données
      while (clickedElement && clickedElement !== document.body) {
        const title = clickedElement.getAttribute('data-title') || 
                     clickedElement.getAttribute('title') ||
                     clickedElement.textContent?.trim();
        
        const type = clickedElement.getAttribute('data-type') ||
                    clickedElement.getAttribute('data-category') ||
                    clickedElement.className.includes('category') ? 'category' :
                    clickedElement.className.includes('challenge') ? 'challenge' :
                    clickedElement.className.includes('subcategory') ? 'subcategory' :
                    clickedElement.className.includes('content') ? 'content' : null;

        if (title && type) {
          visitInfo = {
            type: type as 'category' | 'subcategory' | 'challenge' | 'content' | 'title',
            title: title,
            description: `Visite de ${title}`,
            url: location.pathname,
            icon: getIconForType(type),
            color: getColorForType(type)
          };
          break;
        }
        
        clickedElement = clickedElement.parentElement as HTMLElement;
      }

      // Si on a trouvé des informations, ajouter à l'historique
      if (visitInfo) {
        addVisit(visitInfo);
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('click', handleClick);

    // Nettoyer l'écouteur
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [location.pathname, addVisit]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'category':
        return '📂';
      case 'subcategory':
        return '📁';
      case 'challenge':
        return '🎯';
      case 'content':
        return '📝';
      case 'title':
        return '📄';
      default:
        return '👁️';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'category':
        return 'blue';
      case 'subcategory':
        return 'green';
      case 'challenge':
        return 'orange';
      case 'content':
        return 'purple';
      case 'title':
        return 'gray';
      default:
        return 'gray';
    }
  };
}; 