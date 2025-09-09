import { useState, useEffect } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'holiday' | 'birthday' | 'anniversary' | 'cultural' | 'business';
  country?: string;
  hashtags: string[];
  category: string;
}

export const useTodayEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Données de test au lieu d'appeler les APIs
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Journée mondiale de la santé',
          description: 'Journée dédiée à la promotion de la santé mondiale',
          date: '2024-04-07',
          type: 'holiday',
          country: 'International',
          hashtags: ['#santé', '#bienêtre', '#mondial'],
          category: 'santé'
        },
        {
          id: '2',
          title: 'Anniversaire de la création d\'Instagram',
          description: 'Instagram a été créé le 6 octobre 2010',
          date: '2024-10-06',
          type: 'anniversary',
          hashtags: ['#instagram', '#anniversaire', '#socialmedia'],
          category: 'technology'
        },
        {
          id: '3',
          title: 'Journée nationale du fromage',
          description: 'Célébration de la gastronomie française',
          date: '2024-03-27',
          type: 'cultural',
          country: 'France',
          hashtags: ['#fromage', '#gastronomie', '#france'],
          category: 'cuisine'
        },
        {
          id: '4',
          title: 'Anniversaire de célébrités',
          description: 'Plusieurs célébrités fêtent leur anniversaire aujourd\'hui',
          date: '2024-04-07',
          type: 'birthday',
          hashtags: ['#anniversaire', '#célébrités', '#birthday'],
          category: 'entertainment'
        },
        {
          id: '5',
          title: 'Journée mondiale de l\'environnement',
          description: 'Sensibilisation à la protection de l\'environnement',
          date: '2024-06-05',
          type: 'holiday',
          country: 'International',
          hashtags: ['#environnement', '#écologie', '#protection'],
          category: 'environment'
        }
      ];
      
      setEvents(mockEvents);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error('Erreur useTodayEvents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterByType = (type: string) => {
    return events.filter(event => event.type === type);
  };

  const filterByCategory = (category: string) => {
    return events.filter(event => event.category === category);
  };

  const getHolidays = () => filterByType('holiday');
  const getBirthdays = () => filterByType('birthday');
  const getAnniversaries = () => filterByType('anniversary');

  useEffect(() => {
    fetchTodayEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchTodayEvents,
    filterByType,
    filterByCategory,
    getHolidays,
    getBirthdays,
    getAnniversaries
  };
}; 