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

    // Déterminer le type et les informations de la visite
    let visitInfo: {
      type: 'category' | 'subcategory' | 'challenge' | 'search' | 'content';
      title: string;
      description: string;
      url: string;
      icon?: string;
      color?: string;
    } = {
      type: 'search',
      title: 'Page visitée',
      description: location.pathname,
      url: location.pathname,
      icon: undefined,
      color: undefined
    };

    // Catégories
    if (location.pathname === '/categories') {
      visitInfo = {
        type: 'category',
        title: 'Toutes les catégories',
        description: 'Explorer toutes les catégories disponibles',
        url: location.pathname,
        icon: 'Grid3X3',
        color: '#8B5CF6'
      };
    }

    // Sous-catégories
    if (location.pathname.includes('/category/') && location.pathname.includes('/subcategories')) {
      visitInfo = {
        type: 'subcategory',
        title: 'Sous-catégories',
        description: 'Explorer les sous-catégories',
        url: location.pathname,
        icon: 'Hash',
        color: '#3B82F6'
      };
    }

    // Défis
    if (location.pathname === '/challenges') {
      visitInfo = {
        type: 'challenge',
        title: 'Défis',
        description: 'Découvrir les défis disponibles',
        url: location.pathname,
        icon: 'Target',
        color: '#F59E0B'
      };
    }

    // Contenu
    if (location.pathname.includes('/category/') && location.pathname.includes('/subcategory/')) {
      visitInfo = {
        type: 'content',
        title: 'Contenu',
        description: 'Explorer le contenu',
        url: location.pathname,
        icon: 'FileText',
        color: '#10B981'
      };
    }

    // Ajouter la visite
    addVisit(visitInfo);
  }, [location.pathname, addVisit]);
}; 