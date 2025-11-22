import { useState, useEffect } from 'react';
import wikipediaService, { WikipediaEvent } from '@/services/wikipediaService';

interface UseWikipediaEventsReturn {
  events: WikipediaEvent[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  getEventsForDate: (date: Date) => Promise<WikipediaEvent[]>;
  getEventDetails: (title: string) => Promise<{ description: string; url: string } | null>;
}

export const useWikipediaEvents = (): UseWikipediaEventsReturn => {
  const [events, setEvents] = useState<WikipediaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const todayEvents = await wikipediaService.getTodayEvents();
      setEvents(todayEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des événements');
      console.error('Erreur useWikipediaEvents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = async (date: Date): Promise<WikipediaEvent[]> => {
    try {
      return await wikipediaService.getEventsForDate(date);
    } catch (err) {
      console.error('Erreur getEventsForDate:', err);
      return [];
    }
  };

  const getEventDetails = async (title: string) => {
    try {
      return await wikipediaService.getEventDetails(title);
    } catch (err) {
      console.error('Erreur getEventDetails:', err);
      return null;
    }
  };

  const refreshEvents = async () => {
    await fetchTodayEvents();
  };

  useEffect(() => {
    fetchTodayEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refreshEvents,
    getEventsForDate,
    getEventDetails
  };
};

export default useWikipediaEvents; 