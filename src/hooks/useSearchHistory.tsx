import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const { user } = useAuth();

  const loadHistory = useCallback(() => {
    if (!user) return;
    const savedHistory = localStorage.getItem(`search_history_${user.id}`);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
    }
  }, [user, loadHistory]);

  const addToHistory = (query: string) => {
    if (!user || !query.trim()) return;
    const newItem: SearchHistoryItem = {
      id: `${Date.now()}_${Math.random()}`,
      query: query.trim(),
      timestamp: new Date().toISOString()
    };
    setHistory(prev => {
      // Éviter les doublons récents
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase()
      );
      // Garder seulement les 50 derniers
      const updated = [newItem, ...filtered].slice(0, 50);
      // Sauvegarder dans le localStorage
      localStorage.setItem(`search_history_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    if (!user) return;
    setHistory([]);
    localStorage.removeItem(`search_history_${user.id}`);
  };

  return {
    history,
    addToHistory,
    clearHistory
  };
};
