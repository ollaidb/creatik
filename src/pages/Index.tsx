import React, { useState, useEffect } from "react";
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
  const { getEventsForDate } = useEvents();
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const { userChallenges, stats, completeChallenge } = useChallenges();

  // Simuler des idées favorites
  useEffect(() => {
    const withFavorites = contentIdeas.map(idea => ({
      ...idea,
      isFavorite: Math.random() > 0.7
    }));
    setFavoriteIdeas(withFavorites.filter(idea => idea.isFavorite));
    setPersonalizedIdeas(getPersonalizedRecommendations(visitedCategories));
  }, [visitedCategories]);

  // Charger les événements d'aujourd'hui
  useEffect(() => {
    const loadTodayEvents = async () => {
      try {
        const today = new Date();
        const events = await getEventsForDate(today);
        setTodayEvents(events || []);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setTodayEvents([]);
      }
    };

    loadTodayEvents();
  }, [getEventsForDate]);

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
  const activeChallenge = userChallenges.find(uc => uc.status === 'active' && uc.challenge);
  const challenge = activeChallenge?.challenge;

  // Calculer le temps restant pour le défi
  const getTimeRemaining = () => {
    if (!activeChallenge) return null;
    
    const startDate = new Date(activeChallenge.created_at);
    const endDate = new Date(startDate.getTime() + (challenge?.duration_days || 1) * 24 * 60 * 60 * 1000);
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
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Défi accompli !",
        description: `Félicitations ! Vous avez gagné ${challenge?.points || 0} points.`,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero />
      
      {/* Section Défi du jour */}
      {user && (
        <section className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-orange-900 dark:text-orange-100">
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
                        <h3 className="font-semibold text-base text-orange-900 dark:text-orange-100 mb-1">
                          {challenge.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-orange-600 dark:text-orange-400">
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
                            <span>{challenge.duration_days} jour{challenge.duration_days > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCompleteChallenge}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Accomplir le défi
                          <CheckCircle className="w-3 h-3 ml-1" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/profile/challenges')}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900/20 text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Voir tous mes défis
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold text-base text-orange-900 dark:text-orange-100 mb-1">
                          Aucun défi actif
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                          Commencez un nouveau défi pour gagner des points et progresser !
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate('/challenges')}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Choisir un défi
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/profile/challenges')}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900/20 text-sm px-3 py-1.5"
                          size="sm"
                        >
                          Voir tous mes défis
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
      
      {/* Section Quoi poster aujourd'hui */}
      <section className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => navigate('/events')}
            >
              Quoi poster aujourd'hui
            </h2>
          </div>
          {todayEvents.length === 0 ? (
            <Card className="text-center py-6">
              <CardContent>
                <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-base font-medium mb-2">Aucun événement aujourd'hui</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Aucun événement à afficher pour aujourd'hui
                </p>
                <Button onClick={() => navigate('/events')} size="sm">
                  Voir tous les événements
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {todayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-64 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/events')}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                          {event.person_name || event.title}
                        </h3>
                        <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {getEventTypeText(event.event_type)}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Section Tendances */}
      {trends.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tendances du moment
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Découvrez ce qui fait le buzz sur les réseaux sociaux
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getTopTrends(3).map((trend, index) => (
              <motion.div key={trend.id} variants={itemVariants}>
                <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {trend.title}
                      </CardTitle>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {trend.platform}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {trend.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {trend.hashtags.slice(0, 2).map((hashtag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {trend.engagement.toLocaleString()} engagements
                      </span>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => navigate('/trending')}
                      >
                        Voir plus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
      {/* <TrendingSection /> */}
      {/* Section Challenge */}
      <section className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Challenge
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/challenges')}
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <Target className="w-3 h-3" />
              Voir tous
            </Button>
          </div>
          {publicChallenges.length === 0 ? (
            <Card className="text-center py-6">
              <CardContent>
                <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-base font-medium mb-2">Aucun challenge public</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Soyez le premier à publier un challenge !
                </p>
                {user && (
                  <Button onClick={() => navigate('/publish')} size="sm">
                    Publier
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {publicChallenges.slice(0, 3).map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={(challenge.creator?.user_metadata as UserMeta)?.avatar_url || ''} />
                            <AvatarFallback>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs text-muted-foreground">
                            {getCreatorName(challenge.creator)}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-2">{challenge.title}</h3>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {challenge.description.length > 80 
                          ? challenge.description.substring(0, 80) + '...'
                          : challenge.description
                        }
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="w-3 h-3" />
                            <span>{challenge.likes_count}</span>
                          </div>
                        </div>
                        
                        {user && (
                          <Button
                            size="sm"
                            onClick={() => addToPersonalChallenges(challenge.id)}
                            className="flex items-center gap-1 p-1 h-6 text-xs bg-gradient-to-r from-primary to-secondary text-white"
                          >
                            <Plus className="w-3 h-3" />
                            <span className="text-xs">Défi</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
      <div className="container mx-auto px-4 py-4">
        {/* Section: Recommandations personnalisées */}
        <section className="mb-6">
          <motion.h2 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Recommandations pour vous
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
              {personalizedIdeas.map((idea) => (
              <motion.div key={idea.id} variants={itemVariants}>
                  <ContentCard 
                    idea={idea} 
                    onFavorite={handleToggleFavorite}
                  />
              </motion.div>
            ))}
          </motion.div>
        </section>

      </div>
      <Navigation />
    </div>
  );
};

export default Index;
