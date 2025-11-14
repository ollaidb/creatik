import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter, Search, CalendarDays, Users, BookOpen, Music, Film, PenTool, Microscope, Trophy, Building, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import type { Event, EventCategory } from '@/hooks/useEvents';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, categories, loading, error, getEventsForDate } = useEvents();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [eventsByDate, setEventsByDate] = useState<Record<string, number>>({});
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  // Types d'événements disponibles
  const eventTypes = [
    { value: 'birthday', label: 'Anniversaire', icon: '🎂' },
    { value: 'death', label: 'Décès', icon: '🕯️' },
    { value: 'historical_event', label: 'Événement historique', icon: '📜' },
    { value: 'holiday', label: 'Férié', icon: '🎉' },
    { value: 'international_day', label: 'Journée internationale', icon: '🌍' }
  ];

  // Récupérer l'événement depuis l'URL si présent
  const eventId = searchParams.get('event');

  useEffect(() => {
    if (eventId) {
      // Scroll vers l'événement spécifique
      const eventElement = document.getElementById(`event-${eventId}`);
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [eventId]);

  useEffect(() => {
    const loadEventsForDate = async () => {
      try {
        const eventsForDate = await getEventsForDate(selectedDate);
        setFilteredEvents(eventsForDate);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        toast({ title: "Erreur", description: "Impossible de charger les événements", variant: "destructive" });
      }
    };

    loadEventsForDate();
  }, [selectedDate, getEventsForDate, toast]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonctions pour le calendrier
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Ajouter les jours du mois précédent pour remplir la première semaine
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Ajouter tous les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Ajouter les jours du mois suivant pour remplir la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth() &&
           date.getFullYear() === currentMonth.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selectDate = async (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    
    // Forcer le rechargement des événements pour cette date
    try {
      const eventsForDate = await getEventsForDate(date);
      setFilteredEvents(eventsForDate);
    } catch (error) {
      console.error('Erreur lors du chargement des événements pour la date sélectionnée:', error);
      toast({ title: "Erreur", description: "Impossible de charger les événements pour cette date", variant: "destructive" });
    }
  };

  // Fonction pour charger les événements par date pour le calendrier
  const loadEventsForCalendar = async () => {
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const eventsMap: Record<string, number> = {};
      
      // Charger les événements pour chaque jour du mois
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        const eventsForDate = await getEventsForDate(d);
        if (eventsForDate.length > 0) {
          eventsMap[dateString] = eventsForDate.length;
        }
      }
      
      setEventsByDate(eventsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des événements pour le calendrier:', error);
    }
  };

  // Charger les événements du calendrier quand le mois change
  useEffect(() => {
    if (showCalendar) {
      loadEventsForCalendar();
    }
  }, [currentMonth, showCalendar, loadEventsForCalendar]);

  // Réinitialiser le type d'événement quand la catégorie change
  useEffect(() => {
    setSelectedEventType('all');
  }, [selectedCategory]);

  // Réinitialiser la catégorie quand le type d'événement change
  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedEventType]);

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Personnalités': <Users className="w-4 h-4" />,
      'Événements historiques': <BookOpen className="w-4 h-4" />,
      'Fériés': <CalendarDays className="w-4 h-4" />,
      'Journées internationales': <CalendarDays className="w-4 h-4" />,
      'Musiciens': <Music className="w-4 h-4" />,
      'Acteurs': <Film className="w-4 h-4" />,
      'Écrivains': <PenTool className="w-4 h-4" />,
      'Scientifiques': <Microscope className="w-4 h-4" />,
      'Sportifs': <Trophy className="w-4 h-4" />,
      'Politiciens': <Building className="w-4 h-4" />,
      'Artistes': <Palette className="w-4 h-4" />
    };
    return iconMap[categoryName] || <CalendarDays className="w-4 h-4" />;
  };

  const getCategoryColor = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      'Personnalités': 'bg-blue-500',
      'Événements historiques': 'bg-red-500',
      'Fériés': 'bg-green-500',
      'Journées internationales': 'bg-purple-500',
      'Musiciens': 'bg-yellow-500',
      'Acteurs': 'bg-pink-500',
      'Écrivains': 'bg-cyan-500',
      'Scientifiques': 'bg-lime-500',
      'Sportifs': 'bg-orange-500',
      'Politiciens': 'bg-indigo-500',
      'Artistes': 'bg-violet-500'
    };
    return colorMap[categoryName] || 'bg-gray-500';
  };

  const filteredEventsByCategory = selectedCategory === 'all' 
    ? filteredEvents 
    : filteredEvents.filter(event => event.category === selectedCategory);

  const filteredEventsByType = selectedEventType === 'all'
    ? filteredEventsByCategory
    : filteredEventsByCategory.filter(event => event.event_type === selectedEventType);

  const filteredEventsBySearch = searchTerm 
    ? filteredEventsByType.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.person_name && event.person_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredEventsByType;

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Erreur de chargement</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              size="sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  Événements du jour
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* Barre de recherche et sélecteur de date */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalendar(true)}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </div>

                    {/* Menu des catégories - Style horizontal comme Categories */}
            <div className="mb-4">
              <div className="max-w-4xl mx-auto">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 pb-2 min-w-max">
                    <motion.button
                      onClick={() => setSelectedCategory('all')}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                        ${selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter className="w-3 h-3" />
                      <span className={`
                        text-xs font-medium leading-tight
                        ${selectedCategory === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                      `}>
                        Tout
                      </span>
                    </motion.button>
                    {categories.map((category) => {
                      const isActive = selectedCategory === category.name;
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`
                            px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                            ${isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={isActive ? {
                            scale: [1, 1.1, 1.05],
                            boxShadow: [
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            ]
                          } : {}}
                          transition={isActive ? {
                            duration: 0.6,
                            ease: "easeInOut"
                          } : {
                            duration: 0.2
                          }}
                        >
                          {getCategoryIcon(category.name)}
                          <span className={`
                            text-xs font-medium leading-tight
                            ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                          `}>
                            {category.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu des types d'événements - Style horizontal comme Categories */}
            <div className="mb-4">
              <div className="max-w-4xl mx-auto">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 pb-2 min-w-max">
                    <motion.button
                      onClick={() => setSelectedEventType('all')}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                        ${selectedEventType === 'all'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter className="w-3 h-3" />
                      <span className={`
                        text-xs font-medium leading-tight
                        ${selectedEventType === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                      `}>
                        Tous types
                      </span>
                    </motion.button>
                    {eventTypes.map((eventType) => {
                      const isActive = selectedEventType === eventType.value;
                      return (
                        <motion.button
                          key={eventType.value}
                          onClick={() => setSelectedEventType(eventType.value)}
                          className={`
                            px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                            ${isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={isActive ? {
                            scale: [1, 1.1, 1.05],
                            boxShadow: [
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            ]
                          } : {}}
                          transition={isActive ? {
                            duration: 0.6,
                            ease: "easeInOut"
                          } : {
                            duration: 0.2
                          }}
                        >
                          <span className="text-sm">{eventType.icon}</span>
                          <span className={`
                            text-xs font-medium leading-tight
                            ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                          `}>
                            {eventType.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

        {/* Événements */}
        <div className="space-y-4">
          {filteredEventsBySearch.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aucun événement ne correspond à vos critères pour cette date.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEventsBySearch.map((event) => (
              <Card
                key={event.id}
                id={`event-${event.id}`}
                className={`bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                  eventId === event.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => {
                  setSearchParams({ event: event.id });
                  const element = document.getElementById(`event-${event.id}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {event.category && (
                          <Badge className={`${getCategoryColor(event.category)} text-white`}>
                            {event.category}
                          </Badge>
                        )}
                        {event.event_type && (
                          <Badge variant="outline">
                            {event.event_type}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      
                      {event.person_name && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                          👤 {event.person_name}
                          {event.profession && ` - ${event.profession}`}
                        </p>
                      )}
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {event.description}
                      </p>
                      
                      {event.wikipedia_url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-purple-600 hover:text-purple-700 mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(event.wikipedia_url, '_blank');
                          }}
                        >
                          En savoir plus sur Wikipedia
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal Calendrier */}
      {showCalendar && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCalendar(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[280px] w-full p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du calendrier */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-0.5"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-0.5"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 py-0.5">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-0">
              {getDaysInMonth(currentMonth).map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const hasEvents = eventsByDate[dateString] > 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => selectDate(date)}
                    className={`
                      aspect-square rounded-sm text-[10px] font-medium transition-colors relative
                      ${isSameDay(date, selectedDate) 
                        ? 'bg-purple-600 text-white' 
                        : isCurrentMonth(date)
                          ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'text-gray-400 dark:text-gray-500'
                      }
                    `}
                  >
                    <span className="relative">
                      {date.getDate()}
                      {hasEvents && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>


          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Events; 