import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const storageKey = useMemo(() => {
    if (user?.id) {
      return `visitHistory_${user.id}`;
    }
    return 'visitHistory_guest';
  }, [user?.id]);

  // Charger l'historique depuis localStorage
  const loadVisits = useCallback(() => {
    if (typeof window === 'undefined') {
      setVisits([]);
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(storageKey);

    // Migration depuis l'ancien stockage commun si nécessaire
    if (!stored && user?.id) {
      const legacyStored = localStorage.getItem('visitHistory');
      if (legacyStored) {
        localStorage.setItem(storageKey, legacyStored);
        localStorage.removeItem('visitHistory');
      }
    }

    const valueToParse = stored ?? (user?.id ? localStorage.getItem(storageKey) : localStorage.getItem('visitHistory_guest'));

    if (valueToParse) {
      try {
        const parsed = JSON.parse(valueToParse);
        if (Array.isArray(parsed)) {
          setVisits(parsed);
        } else {
          setVisits([]);
        }
      } catch (error) {
        console.error('Error parsing visit history:', error);
        setVisits([]);
      }
    } else {
      setVisits([]);
    }
    setLoading(false);
  }, [storageKey, user?.id]);

  // Sauvegarder l'historique dans localStorage
  const saveVisits = useCallback((newVisits: VisitItem[]) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(newVisits));
  }, [storageKey]);

  // Ajouter une nouvelle visite
  const addVisit = useCallback((visit: Omit<VisitItem, 'id' | 'timestamp'>) => {
    const newVisit: VisitItem = {
      ...visit,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setVisits(prevVisits => {
      const updatedVisits = [newVisit, ...prevVisits.filter(v => v.url !== visit.url)].slice(0, 50);
      saveVisits(updatedVisits);
      return updatedVisits;
    });
  }, [saveVisits]);

  // Effacer l'historique
  const clearHistory = useCallback(() => {
    setVisits([]);
    saveVisits([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [saveVisits, storageKey]);

  useEffect(() => {
    setLoading(true);
    loadVisits();
  }, [loadVisits, storageKey]);

  return {
    visits,
    loading,
    addVisit,
    clearHistory
  };
}; 