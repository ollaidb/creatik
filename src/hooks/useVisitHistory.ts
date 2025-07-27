import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface VisitItem {
  id: string;
  type: 'category' | 'subcategory' | 'challenge' | 'search' | 'content';
  title: string;
  description?: string;
  url: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

export const useVisitHistory = () => {
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger l'historique depuis localStorage
  const loadVisits = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('visitHistory');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVisits(parsed);
        } catch (error) {
          console.error('Error parsing visit history:', error);
        }
      }
    }
    setLoading(false);
  };

  // Sauvegarder l'historique dans localStorage
  const saveVisits = (newVisits: VisitItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('visitHistory', JSON.stringify(newVisits));
    }
  };

  // Ajouter une nouvelle visite
  const addVisit = (visit: Omit<VisitItem, 'id' | 'timestamp'>) => {
    const newVisit: VisitItem = {
      ...visit,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    const updatedVisits = [newVisit, ...visits.filter(v => v.url !== visit.url)].slice(0, 50);
    setVisits(updatedVisits);
    saveVisits(updatedVisits);
  };

  // Effacer l'historique
  const clearHistory = () => {
    setVisits([]);
    saveVisits([]);
  };

  useEffect(() => {
    loadVisits();
  }, []);

  return {
    visits,
    loading,
    addVisit,
    clearHistory
  };
}; 