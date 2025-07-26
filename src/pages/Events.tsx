import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Calendar as LucideCalendar, ArrowLeft, Filter } from 'lucide-react';
import { useEvents, Event } from '@/hooks/useEvents';
import EventsCalendar from '@/components/EventsCalendar';
import { motion, AnimatePresence } from 'framer-motion';

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'birthday':
      return '🎂';
    case 'death':
      return '⚰️';
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

const getEventTypeLabel = (eventType: string) => {
  switch (eventType) {
    case 'birthday':
      return 'Anniversaire';
    case 'death':
      return 'Décès';
    case 'historical_event':
      return 'Événement';
    case 'holiday':
      return 'Férié';
    case 'international_day':
      return 'Journée';
    default:
      return 'Événement';
  }
};

const Events: React.FC = () => {
  const { events, categories, loading, error, getEventsForDate, getEventsByType, getEventsByCategory, searchEvents } = useEvents();
  const [activeTab, setActiveTab] = useState<'all' | 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [targetedEventId, setTargetedEventId] = useState<string | null>(null);

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

  // Filtrer les événements du jour sélectionné
  const eventsOfDay = getEventsForDate(selectedDate);

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
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.person_name?.toLowerCase().includes(searchLower) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white leading-tight">
                Événements du jour - {formattedSelectedDate}
              </h1>
            </div>
          </div>
          
          {/* Bouton calendrier */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              aria-label="Choisir une date"
              onClick={() => setCalendarOpen(v => !v)}
              className={calendarOpen ? 'bg-blue-900 border-blue-400 text-white' : 'bg-neutral-800 border-neutral-700 text-white'}
            >
              <LucideCalendar className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {calendarOpen && (
              <div className="absolute right-0 z-20 mt-2">
                <EventsCalendar
                  selectedDate={selectedDate}
                  onSelect={date => {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                    window.history.replaceState({}, '', '/events');
                    setTargetedEventId(null);
                  }}
                  events={events}
                />
              </div>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          {/* Onglets */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id as 'all' | 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day')}
                className={`text-xs sm:text-sm ${
                  activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-neutral-800 text-gray-200 border-neutral-700 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 text-white border-neutral-700 placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-neutral-800 text-white border-neutral-700 text-sm sm:text-base">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <LucideCalendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
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
                >
                  <Card 
                    className={`bg-neutral-800 border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      targetedEventId === event.id ? 'ring-2 ring-blue-400 bg-blue-950' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xl sm:text-2xl">{getEventIcon(event.event_type)}</div>
                        <Badge variant="secondary" className="text-xs bg-blue-900 text-white border-none">
                          {getEventTypeLabel(event.event_type)}
                        </Badge>
                      </div>
                      {event.category && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-neutral-700 text-gray-200 border-neutral-600"
                        >
                          {event.category}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <h3 className="font-bold text-base sm:text-lg mb-2 text-white leading-tight">{event.title}</h3>
                      {event.person_name && (
                        <p className="text-xs sm:text-sm text-gray-300 mb-2">
                          <span className="font-medium">Personne:</span> {event.person_name}
                          {event.profession && ` (${event.profession})`}
                        </p>
                      )}
                      {event.year && (
                        <p className="text-xs sm:text-sm text-gray-300 mb-2">
                          <span className="font-medium">Année:</span> {event.year}
                        </p>
                      )}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="text-xs text-blue-300 bg-blue-950 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
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