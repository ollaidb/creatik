import { useState, useEffect } from 'react';

export interface Event {
  id: string;
  event_type: 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day';
  title: string;
  description: string;
  date: string;
  year?: number;
  person_name?: string;
  profession?: string;
  category: string;
  tags?: string[];
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler un chargement
    setLoading(true);
    
    setTimeout(() => {
      // Obtenir la date d'aujourd'hui
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      // Obtenir les dates pour les prochains jours
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);
      const dayAfterTomorrowString = dayAfterTomorrow.toISOString().split('T')[0];

      // Données d'exemple pour les catégories
      const eventCategories: EventCategory[] = [
        { id: '1', name: 'Musiciens', color: '#3B82F6', icon: '🎵' },
        { id: '2', name: 'Acteurs', color: '#EF4444', icon: '🎬' },
        { id: '3', name: 'Écrivains', color: '#10B981', icon: '📚' },
        { id: '4', name: 'Premier vol', color: '#8B5CF6', icon: '✈️' },
        { id: '5', name: 'Fériés français', color: '#F59E0B', icon: '🇫🇷' },
        { id: '6', name: 'Droits humains', color: '#EC4899', icon: '🤝' },
        { id: '7', name: 'Scientifiques', color: '#DDA0DD', icon: '🔬' },
        { id: '8', name: 'Sportifs', color: '#F7DC6F', icon: '⚽' },
        { id: '9', name: 'Politiciens', color: '#98D8C8', icon: '🏛️' },
        { id: '10', name: 'Artistes', color: '#4ECDC4', icon: '🎨' }
      ];

      // Données d'exemple pour les événements avec les vraies dates
      const sampleEvents: Event[] = [
        // ÉVÉNEMENTS POUR AUJOURD'HUI
        {
          id: '1',
          event_type: 'birthday',
          title: 'Anniversaire de Mick Jagger',
          description: 'Chanteur et musicien britannique, membre des Rolling Stones',
          date: todayString,
          year: 1943,
          person_name: 'Mick Jagger',
          profession: 'Musicien',
          category: 'Musiciens',
          tags: ['Rock', 'Rolling Stones', 'Musique']
        },
        {
          id: '2',
          event_type: 'birthday',
          title: 'Anniversaire de Kate Beckinsale',
          description: 'Actrice britannique célèbre pour ses rôles dans Underworld',
          date: todayString,
          year: 1973,
          person_name: 'Kate Beckinsale',
          profession: 'Actrice',
          category: 'Acteurs',
          tags: ['Cinéma', 'Actrice', 'Hollywood']
        },
        {
          id: '3',
          event_type: 'birthday',
          title: 'Anniversaire de Sandra Bullock',
          description: 'Actrice américaine oscarisée pour The Blind Side',
          date: todayString,
          year: 1964,
          person_name: 'Sandra Bullock',
          profession: 'Actrice',
          category: 'Acteurs',
          tags: ['Cinéma', 'Actrice', 'Oscar']
        },
        {
          id: '4',
          event_type: 'death',
          title: 'Décès de Jimi Hendrix',
          description: 'Guitariste et chanteur américain, légende du rock',
          date: todayString,
          year: 1970,
          person_name: 'Jimi Hendrix',
          profession: 'Guitariste',
          category: 'Musiciens',
          tags: ['Rock', 'Guitare', 'Musique']
        },
        {
          id: '5',
          event_type: 'international_day',
          title: 'Journée internationale de la paix',
          description: 'Journée dédiée à la promotion de la paix dans le monde',
          date: todayString,
          category: 'Droits humains',
          tags: ['Paix', 'Monde', 'Solidarité']
        },

        // ÉVÉNEMENTS POUR DEMAIN
        {
          id: '6',
          event_type: 'birthday',
          title: 'Anniversaire de Maya Angelou',
          description: 'Poétesse et écrivaine américaine, militante des droits civiques',
          date: tomorrowString,
          year: 1928,
          person_name: 'Maya Angelou',
          profession: 'Écrivaine',
          category: 'Écrivains',
          tags: ['Poésie', 'Littérature', 'Féminisme']
        },
        {
          id: '7',
          event_type: 'historical_event',
          title: 'Premier vol commercial',
          description: 'Premier vol commercial de l\'histoire de l\'aviation',
          date: tomorrowString,
          year: 1914,
          category: 'Premier vol',
          tags: ['Aviation', 'Transport', 'Innovation']
        },

        // ÉVÉNEMENTS POUR APRÈS-DEMAIN
        {
          id: '8',
          event_type: 'birthday',
          title: 'Anniversaire de Jacqueline Kennedy Onassis',
          description: 'Première dame américaine, épouse de John F. Kennedy',
          date: dayAfterTomorrowString,
          year: 1929,
          person_name: 'Jacqueline Kennedy Onassis',
          profession: 'Première dame',
          category: 'Politiciens',
          tags: ['Politique', 'PremièreDame', 'Histoire']
        },

        // ÉVÉNEMENTS POUR LE 14 JUILLET (si c'est aujourd'hui ou dans le futur)
        {
          id: '9',
          event_type: 'holiday',
          title: 'Fête nationale française',
          description: 'Célébration de la prise de la Bastille en 1789',
          date: '2024-07-14',
          category: 'Fériés français',
          tags: ['France', 'Fête nationale', 'Célébration']
        },

        // ÉVÉNEMENTS POUR LE 15 AOÛT
        {
          id: '10',
          event_type: 'holiday',
          title: 'Assomption',
          description: 'Fête religieuse catholique célébrant l\'Assomption de Marie',
          date: '2024-08-15',
          category: 'Fériés français',
          tags: ['Religieux', 'Catholique', 'Marie']
        },

        // ÉVÉNEMENTS POUR LE 1ER SEPTEMBRE
        {
          id: '11',
          event_type: 'birthday',
          title: 'Anniversaire de Zendaya',
          description: 'Actrice et chanteuse américaine, star de Euphoria',
          date: '2024-09-01',
          year: 1996,
          person_name: 'Zendaya',
          profession: 'Actrice',
          category: 'Acteurs',
          tags: ['Cinéma', 'Actrice', 'Euphoria']
        },

        // ÉVÉNEMENTS POUR LE 15 SEPTEMBRE
        {
          id: '12',
          event_type: 'birthday',
          title: 'Anniversaire de Tom Hardy',
          description: 'Acteur britannique, star de Mad Max et Venom',
          date: '2024-09-15',
          year: 1977,
          person_name: 'Tom Hardy',
          profession: 'Acteur',
          category: 'Acteurs',
          tags: ['Cinéma', 'Acteur', 'MadMax']
        },

        // ÉVÉNEMENTS POUR LE 1ER OCTOBRE
        {
          id: '13',
          event_type: 'birthday',
          title: 'Anniversaire de Julie Andrews',
          description: 'Actrice britannique, star de Mary Poppins et Sound of Music',
          date: '2024-10-01',
          year: 1935,
          person_name: 'Julie Andrews',
          profession: 'Actrice',
          category: 'Acteurs',
          tags: ['Cinéma', 'Actrice', 'MaryPoppins']
        },

        // ÉVÉNEMENTS POUR LE 15 OCTOBRE
        {
          id: '14',
          event_type: 'birthday',
          title: 'Anniversaire de Friedrich Nietzsche',
          description: 'Philosophe allemand, auteur de Ainsi parlait Zarathoustra',
          date: '2024-10-15',
          year: 1844,
          person_name: 'Friedrich Nietzsche',
          profession: 'Philosophe',
          category: 'Écrivains',
          tags: ['Philosophie', 'Allemagne', 'Zarathoustra']
        },

        // ÉVÉNEMENTS POUR LE 1ER NOVEMBRE
        {
          id: '15',
          event_type: 'holiday',
          title: 'Toussaint',
          description: 'Fête catholique célébrant tous les saints',
          date: '2024-11-01',
          category: 'Fériés français',
          tags: ['Religieux', 'Catholique', 'Saints']
        },

        // ÉVÉNEMENTS POUR LE 15 NOVEMBRE
        {
          id: '16',
          event_type: 'birthday',
          title: 'Anniversaire de Claude Monet',
          description: 'Peintre français, fondateur de l\'impressionnisme',
          date: '2024-11-15',
          year: 1840,
          person_name: 'Claude Monet',
          profession: 'Peintre',
          category: 'Artistes',
          tags: ['Peinture', 'Impressionnisme', 'Art']
        },

        // ÉVÉNEMENTS POUR LE 1ER DÉCEMBRE
        {
          id: '17',
          event_type: 'international_day',
          title: 'Journée mondiale de lutte contre le sida',
          description: 'Journée de sensibilisation à la prévention du VIH',
          date: '2024-12-01',
          category: 'Droits humains',
          tags: ['Santé', 'VIH', 'Prévention']
        },

        // ÉVÉNEMENTS POUR LE 15 DÉCEMBRE
        {
          id: '18',
          event_type: 'birthday',
          title: 'Anniversaire de Gustave Eiffel',
          description: 'Ingénieur français, créateur de la tour Eiffel',
          date: '2024-12-15',
          year: 1832,
          person_name: 'Gustave Eiffel',
          profession: 'Ingénieur',
          category: 'Scientifiques',
          tags: ['Architecture', 'TourEiffel', 'Ingénierie']
        }
      ];

      setCategories(eventCategories);
      setEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getEventsByType = (type: string): Event[] => {
    return events.filter(event => event.event_type === type);
  };

  const getEventsByCategory = (categoryId: string): Event[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    return events.filter(event => event.category === category.name);
  };

  const searchEvents = (query: string): Event[] => {
    const searchLower = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.person_name?.toLowerCase().includes(searchLower) ||
      event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  };

  return {
    events,
    categories,
    loading,
    error,
    getEventsForDate,
    getEventsByType,
    getEventsByCategory,
    searchEvents
  };
}; 