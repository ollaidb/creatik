import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar as CalendarIcon } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EventsCalendar from '@/components/EventsCalendar';
import type { Event } from '@/hooks/useEvents';

// Fonction pour obtenir l'icône selon le type d'événement
const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'birthday':
      return '🎂';
    case 'death':
      return '🕯️';
    case 'historical_event':
      return '📜';
    case 'holiday':
      return '🎉';
    case 'international_day':
      return '🌍';
    default:
      return '📅';
  }
};

// Fonction pour obtenir le label du type d'événement
const getEventTypeLabel = (eventType: string) => {
  switch (eventType) {
    case 'birthday':
      return 'Anniversaire';
    case 'death':
      return 'Décès';
    case 'historical_event':
      return 'Événement historique';
    case 'holiday':
      return 'Férié';
    case 'international_day':
      return 'Journée internationale';
    default:
      return 'Événement';
  }
};

const Events: React.FC = () => {
  const { events, categories, loading, error, getEventsForDate } = useEvents();
  const [activeTab, setActiveTab] = useState<'all' | 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [targetedEventId, setTargetedEventId] = useState<string | null>(null);
  const [eventsOfDay, setEventsOfDay] = useState<Event[]>([]);

  // Formater la date sélectionnée
  const formattedSelectedDate = selectedDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Récupérer l'ID de l'événement depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    setTargetedEventId(eventId || null);
    
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedDate(new Date(event.date));
      }
    }
  }, [events]);

  // Charger les événements du jour sélectionné
  useEffect(() => {
    const loadEventsOfDay = async () => {
      try {
        const events = await getEventsForDate(selectedDate);
        setEventsOfDay(events || []);
      } catch (err) {
        console.error('Erreur lors du chargement des événements du jour:', err);
        setEventsOfDay([]);
      }
    };

    loadEventsOfDay();
  }, [getEventsForDate, selectedDate]);

  // Appliquer les filtres sur les événements du jour
  const filteredEvents = eventsOfDay.filter(event => {
    if (activeTab !== 'all' && event.event_type !== activeTab) {
      return false;
    }
    if (selectedCategory !== 'all') {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category && event.category !== category.name) {
        return false;
      }
    }
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Tous', count: eventsOfDay.length },
    { id: 'birthday', label: 'Anniversaires', count: eventsOfDay.filter(e => e.event_type === 'birthday').length },
    { id: 'death', label: 'Décès', count: eventsOfDay.filter(e => e.event_type === 'death').length },
    { id: 'historical_event', label: 'Événements', count: eventsOfDay.filter(e => e.event_type === 'historical_event').length },
    { id: 'holiday', label: 'Fériés', count: eventsOfDay.filter(e => e.event_type === 'holiday').length },
    { id: 'international_day', label: 'Journées', count: eventsOfDay.filter(e => e.event_type === 'international_day').length },
  ];

  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 pb-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 sm:h-8 bg-neutral-800 rounded w-1/2 sm:w-1/3"></div>
            <div className="h-10 sm:h-12 bg-neutral-800 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-neutral-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 pb-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <Card className="bg-neutral-800 border-neutral-700">
            <CardContent className="pt-6">
              <p className="text-center text-red-400">Erreur: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-16">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="text-white hover:text-blue-300 hover:bg-neutral-800 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white leading-tight flex items-center justify-between">
                <span>Événements du jour - {formattedSelectedDate}</span>
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </h1>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          {/* Onglets */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const getTabColor = (tabId: string) => {
                    switch (tabId) {
                      case 'all':
                        return 'from-gray-500 to-gray-600';
                      case 'birthday':
                        return 'from-pink-500 to-rose-500';
                      case 'death':
                        return 'from-gray-600 to-gray-700';
                      case 'historical_event':
                        return 'from-blue-500 to-cyan-500';
                      case 'holiday':
                        return 'from-green-500 to-emerald-500';
                      case 'international_day':
                        return 'from-purple-500 to-pink-500';
                      default:
                        return 'from-gray-500 to-gray-600';
                    }
                  };
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'all' | 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day')}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px] text-center
                        ${isActive 
                          ? 'bg-gradient-to-r ' + getTabColor(tab.id) + ' text-white shadow-lg scale-105' 
                          : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`
                        text-xs font-medium leading-tight
                        ${isActive ? 'text-white' : 'text-gray-200'}
                      `}>
                        {tab.label} ({tab.count})
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Menu des catégories */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                <motion.button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px] text-center
                    ${selectedCategory === 'all' 
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg scale-105' 
                      : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`
                    text-xs font-medium leading-tight
                    ${selectedCategory === 'all' ? 'text-white' : 'text-gray-200'}
                  `}>
                    Toutes les catégories
                  </span>
                </motion.button>
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px] text-center
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' 
                          : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`
                        text-xs font-medium leading-tight
                        ${isActive ? 'text-white' : 'text-gray-200'}
                      `}>
                        {category.icon} {category.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm text-gray-300 mb-4">
            {filteredEvents.length === 0
              ? `Aucun événement pour cette date.`
              : `${filteredEvents.length} événement${filteredEvents.length !== 1 ? 's' : ''} trouvé${filteredEvents.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Grille des événements */}
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              key="no-events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-300 text-sm sm:text-base">Aucun événement trouvé pour cette date</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="events-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)"
                  }}
                  whileTap={{ 
                    scale: 0.97, 
                    y: -1,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
                  }}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  className="event-card-mobile"
                >
                  <Card 
                    className={`bg-neutral-800 border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      targetedEventId === event.id ? 'ring-2 ring-blue-400 bg-blue-950' : ''
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm text-white leading-tight flex-1">
                          {event.person_name || event.title}
                        </h3>
                        <span className="text-xs text-gray-300 ml-2">
                          {event.event_type === 'birthday' ? 'Anniversaire' : 
                           event.event_type === 'historical_event' ? 'Événement' : 
                           getEventTypeLabel(event.event_type)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events; 