import React, { useState } from 'react';
import { useTodayEvents } from '@/hooks/useTodayEvents';
import StickyHeader from '@/components/StickyHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, CalendarDays, Gift, Star, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '@/hooks/useTodayEvents';
import Navigation from '@/components/Navigation';

const WhatToPostToday: React.FC = () => {
  const { events, loading, error, fetchTodayEvents, getHolidays, getBirthdays, getAnniversaries } = useTodayEvents();
  const [selectedType, setSelectedType] = useState<string>('all');
  const navigate = useNavigate();

  const eventTypes = [
    { value: 'all', label: 'Tous', icon: Calendar },
    { value: 'holiday', label: 'Fêtes', icon: Gift },
    { value: 'birthday', label: 'Anniversaires', icon: Star },
    { value: 'anniversary', label: 'Anniversaires historiques', icon: Flag }
  ];

  const filteredEvents = events.filter(event => {
    return selectedType === 'all' || event.type === selectedType;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'holiday':
        return <Gift className="w-5 h-5" />;
      case 'birthday':
        return <Star className="w-5 h-5" />;
      case 'anniversary':
        return <Flag className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-500';
      case 'birthday':
        return 'bg-pink-500';
      case 'anniversary':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleUseEvent = (event: Event) => {
    navigate('/publish', {
      state: {
        title: event.title,
        description: event.description,
        hashtags: event.hashtags
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-creatik-primary">
        <StickyHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-creatik-primary">
              <Calendar className="w-6 h-6 animate-spin" />
              <span>Chargement des événements...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-creatik-primary">
        <StickyHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-creatik-error mb-4">{error}</p>
            <Button 
              onClick={fetchTodayEvents}
              className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creatik-primary">
      <StickyHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* En-tête avec date */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarDays className="w-6 h-6 text-creatik-primary" />
            <h1 className="text-2xl font-bold text-creatik-primary">
              Quoi poster aujourd'hui
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 text-creatik-secondary">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-creatik-secondary border-creatik">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-creatik-primary">{events.length}</div>
              <div className="text-sm text-creatik-secondary">Événements</div>
            </CardContent>
          </Card>
          
          <Card className="bg-creatik-secondary border-creatik">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-creatik-primary">{getHolidays().length}</div>
              <div className="text-sm text-creatik-secondary">Fêtes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-creatik-secondary border-creatik">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-creatik-primary">{getBirthdays().length}</div>
              <div className="text-sm text-creatik-secondary">Anniversaires</div>
            </CardContent>
          </Card>
          
          <Card className="bg-creatik-secondary border-creatik">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-creatik-primary">{getAnniversaries().length}</div>
              <div className="text-sm text-creatik-secondary">Historiques</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-creatik-muted" />
            <span className="text-creatik-secondary text-sm">Filtrer par type :</span>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 bg-creatik-secondary border-creatik">
              <SelectValue placeholder="Type d'événement" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={fetchTodayEvents}
            variant="outline"
            size="sm"
            className="border-creatik text-creatik-primary hover:bg-creatik-hover"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Liste des événements */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-creatik-muted mx-auto mb-4" />
            <p className="text-creatik-muted mb-4">
              Aucun événement trouvé pour aujourd'hui
            </p>
            <Button
              onClick={() => setSelectedType('all')}
              className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
            >
              Voir tous les événements
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <Card key={event.id} className="bg-creatik-secondary border-creatik hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEventColor(event.type)} text-white`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <CardTitle className="text-creatik-primary text-lg font-semibold">
                          {event.title}
                        </CardTitle>
                        <p className="text-creatik-secondary text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getEventColor(event.type)} text-white text-xs`}>
                        {event.type}
                      </Badge>
                      {event.country && (
                        <Badge variant="outline" className="border-creatik text-creatik-primary text-xs">
                          {event.country}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.hashtags.map((hashtag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-creatik-primary border-creatik text-xs"
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
                      onClick={() => handleUseEvent(event)}
                    >
                      Utiliser cet événement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default WhatToPostToday; 