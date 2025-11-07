import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ContentCard from "@/components/ContentCard";
import Navigation from "@/components/Navigation";
import FavoriteCard from "@/components/FavoriteCard";
// import TrendingSection from "@/components/TrendingSection";
import { contentIdeas, getPersonalizedRecommendations } from "@/data/mockData";
import { ContentIdea } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Clock, ArrowRight, Heart, User, Star, Plus, Calendar, CheckCircle } from "lucide-react";
import { usePublicChallenges } from "@/hooks/usePublicChallenges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEvents } from "@/hooks/useEvents";
import { useSocialTrends } from "@/hooks/useSocialTrends";
import { useChallenges } from "@/hooks/useChallenges";
import type { Event } from "@/hooks/useEvents";

type UserMeta = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
};

const Index: React.FC = () => {
  const [favoriteIdeas, setFavoriteIdeas] = useState<ContentIdea[]>([]);
  const [visitedCategories, setVisitedCategories] = useState<string[]>(["education", "business"]);
  const [personalizedIdeas, setPersonalizedIdeas] = useState<ContentIdea[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { user } = useAuth();
  const { favorites, isLoading } = useFavorites('category');
  const { challenges: publicChallenges, addToPersonalChallenges } = usePublicChallenges();
  const { trends, getTopTrends } = useSocialTrends();
  const { userChallenges, stats, completeChallenge } = useChallenges();
  
  // Utiliser useEvents avec mémorisation de la date pour éviter les rechargements
  const { getEventsForDate } = useEvents();
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  
  // Mémoïser la date d'aujourd'hui pour éviter les rechargements
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []); // Seulement une fois au montage

  // Charger les événements d'aujourd'hui (une seule fois au montage)
  useEffect(() => {
    let isMounted = true;
    
    const loadTodayEvents = async () => {
      try {
        const events = await getEventsForDate(today);
        if (isMounted) {
          setTodayEvents(events || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        if (isMounted) {
          setTodayEvents([]);
        }
      }
    };

    loadTodayEvents();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Seulement au montage, la date est mémorisée

  // Simuler des idées favorites (mémoïsé pour éviter les recalculs)
  useEffect(() => {
    const withFavorites = contentIdeas.map(idea => ({
      ...idea,
      isFavorite: Math.random() > 0.7
    }));
    setFavoriteIdeas(withFavorites.filter(idea => idea.isFavorite));
    setPersonalizedIdeas(getPersonalizedRecommendations(visitedCategories));
  }, [visitedCategories]);

  // Filtrer les catégories favorites
  const favoriteCategories = categories?.filter(cat => favorites.includes(cat.id)) || [];

  const handleToggleFavorite = (id: string) => {
    setFavoriteIdeas(prev => {
      const isCurrentlyFavorite = prev.some(idea => idea.id === id);
      if (isCurrentlyFavorite) {
        return prev.filter(idea => idea.id !== id);
      } else {
        const ideaToAdd = contentIdeas.find(idea => idea.id === id);
        if (ideaToAdd) {
          return [...prev, { ...ideaToAdd, isFavorite: true }];
        }
        return prev;
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCreatorName = (creator: any) => {
    if (!creator) return 'Utilisateur';
    const firstName = creator.user_metadata?.first_name;
    const lastName = creator.user_metadata?.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'Utilisateur';
  };

  const getEventTypeText = (eventType: string) => {
    switch (eventType) {
      case 'birthday': return 'Anniversaire';
      case 'anniversary': return 'Événement';
      case 'holiday': return 'Fête';
      default: return 'Événement';
    }
  };

  // Récupérer le défi actif de l'utilisateur
  const activeChallenge = userChallenges.find(uc => uc.status === 'pending');
  const challenge = activeChallenge;

  // Calculer le temps restant pour le défi
  const getTimeRemaining = () => {
    if (!activeChallenge) return null;
    
    const startDate = new Date(activeChallenge.created_at);
    const endDate = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 jour par défaut
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const timeRemaining = getTimeRemaining();

  const handleCompleteChallenge = async () => {
    if (!activeChallenge) return;
    
    const result = await completeChallenge(activeChallenge.id);
    if (result.error) {
      toast({
        title: "Erreur",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Accompli"
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <Hero />
      
      {/* Menu principal avec boutons identiques et centrés */}
      <section className="container mx-auto px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4"
        >
          <Button
            variant="ghost"
            className="w-24 h-10 sm:w-32 sm:h-12 text-xs sm:text-sm font-medium text-primary hover:text-primary-foreground rounded-xl sm:rounded-2xl transition-all duration-500 ease-out hover:scale-105 group bg-card hover:bg-primary/10 shadow-md border border-border flex items-center justify-center"
            onClick={() => navigate('/notes')}
          >
            Notes
          </Button>
          
          <Button
            variant="ghost"
            className="w-24 h-10 sm:w-32 sm:h-12 text-xs sm:text-sm font-medium text-primary hover:text-primary-foreground rounded-xl sm:rounded-2xl transition-all duration-500 ease-out hover:scale-105 group bg-card hover:bg-primary/10 shadow-md border border-border flex items-center justify-center"
            onClick={() => navigate('/public-challenges')}
          >
            Communauté
          </Button>
          
          
        </motion.div>
      </section>
      
      {/* Section Défi du jour */}
      {user && (
        <section className="container mx-auto px-4 py-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-secondary rounded-lg">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        Défi du jour
                      </CardTitle>
                    </div>
                  </div>
                  


                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {activeChallenge && challenge ? (
                    <>
                      <div>
                        <h3 className="font-semibold text-base text-foreground mb-1">
                          {challenge.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-primary">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {timeRemaining 
                                ? `Temps restant: ${timeRemaining.days}j ${timeRemaining.hours}h ${timeRemaining.minutes}m`
                                : 'Temps écoulé'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>1 jour</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCompleteChallenge}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Accomplir le défi
                          <CheckCircle className="w-3 h-3 ml-1" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/profile/challenges')}
                          className="border-border text-foreground hover:bg-accent text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Voir mes défis
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold text-base text-foreground mb-1">
                          Aucun défi actif
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Commencez un nouveau défi pour gagner des points et progresser !
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate('/challenges')}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Choisir un défi
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/profile/challenges')}
                          className="border-border text-foreground hover:bg-accent text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Voir mes défis
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      )}
      
      {/* Section Évènement du jour */}
      <section className="container mx-auto px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 
              className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate('/events')}
            >
              Évènement du jour
            </h2>
          </div>
          {todayEvents.length === 0 ? (
            <Card className="text-center py-6">
              <CardContent>
                <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-base font-medium mb-2 text-foreground">Aucun événement aujourd'hui</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Aucun événement à afficher pour aujourd'hui
                </p>
                <Button onClick={() => navigate('/events')} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Voir tous les événements
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {todayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-64 h-20 hover:shadow-md transition-shadow cursor-pointer bg-card flex flex-col" onClick={() => navigate('/events')}>
                    <CardContent className="p-2 flex flex-col h-full">
                      <div className="flex items-center justify-between gap-2 flex-1">
                        <h3 className="font-semibold text-xs line-clamp-1 flex-1 text-foreground leading-tight">
                          {event.person_name || event.title}
                        </h3>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                            {getEventTypeText(event.event_type)}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground leading-tight whitespace-nowrap">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>


      {/* <TrendingSection /> */}

      

      

      <Navigation />
    </div>
  );
};

export default Index;
