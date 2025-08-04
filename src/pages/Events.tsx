import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, categories, loading, error, getEventsForDate } = useEvents();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

  const filteredEventsBySearch = searchTerm 
    ? filteredEventsByCategory.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.person_name && event.person_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredEventsByCategory;

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
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Événements du jour
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Date sélectionnée */}
        <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedDate)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredEventsBySearch.length} événement(s) trouvé(s)
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                Aujourd'hui
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                {getCategoryIcon(category.name)}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
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

      <Navigation />
    </div>
  );
};

export default Events; 