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
import { Target, Trophy, Clock, ArrowRight, Heart, User, Star, Plus, Calendar, CheckCircle, BarChart3, TrendingUp, CheckCircle2, Sparkles, Lightbulb } from "lucide-react";
import { usePublicChallenges } from "@/hooks/usePublicChallenges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEvents } from "@/hooks/useEvents";
import { useSocialTrends } from "@/hooks/useSocialTrends";
import { useChallenges } from "@/hooks/useChallenges";
import type { Event } from "@/hooks/useEvents";
import { UserProfileService, type UserSocialAccount, type UserSocialPost, type UserContentPlaylist } from "@/services/userProfileService";
import { useNetworkStats, type NetworkStats } from "@/hooks/useNetworkStats";
import { usePersonalizedRecommendations } from "@/hooks/usePersonalizedRecommendations";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { SelectNetworkPlaylistModal } from "@/components/modals/SelectNetworkPlaylistModal";

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
  const { favorites: titleFavorites, toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavorite } = useFavorites('title');
  const { challenges: publicChallenges, addToPersonalChallenges } = usePublicChallenges();
  const { trends, getTopTrends } = useSocialTrends();
  const { userChallenges, stats, completeChallenge } = useChallenges();
  
  // Utiliser useEvents avec mémorisation de la date pour éviter les rechargements
  const { getEventsForDate } = useEvents();
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  
  // États pour les statistiques par compte
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [accountsStats, setAccountsStats] = useState<Record<string, NetworkStats>>({});
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<{ title: string; titleId: string } | null>(null);
  
  // Hook pour les recommandations personnalisées
  const { recommendations, loading: loadingRecommendations } = usePersonalizedRecommendations();
  
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

  // Fonction pour charger les stats d'un compte
  const loadAccountStats = async (accountId: string): Promise<NetworkStats | null> => {
    if (!user) return null;
    
    try {
      // Charger les paramètres de programmation
      const { data: programSettings } = await supabase
        .from('user_program_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('social_account_id', accountId)
        .is('playlist_id', null)
        .single();

      const duration = programSettings?.duration || '3months';
      const contentsPerDay = programSettings?.contents_per_day || 1;
      
      const getDurationDays = (dur: string): number => {
        switch (dur) {
          case '1month': return 30;
          case '2months': return 60;
          case '3months': return 90;
          case '6months': return 180;
          case '1year': return 365;
          case '2years': return 730;
          case '3years': return 1095;
          default: return 90;
        }
      };
      
      const totalDays = getDurationDays(duration);
      const requiredPublications = totalDays * contentsPerDay;

      // Charger les publications
      const [totalResult, publishedResult] = await Promise.all([
        supabase
          .from('user_social_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('social_account_id', accountId),
        supabase
          .from('user_social_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('social_account_id', accountId)
          .eq('status', 'published')
      ]);

      const totalPublications = totalResult.count || 0;
      const completedPublications = publishedResult.count || 0;
      const progressPercentage = requiredPublications > 0 
        ? Math.min(100, Math.round((completedPublications / requiredPublications) * 100))
        : 0;

      return {
        actual_publications: totalPublications,
        completed_publications: completedPublications,
        pending_publications: 0,
        scheduled_publications: 0,
        required_publications: requiredPublications,
        remaining_publications: Math.max(0, requiredPublications - completedPublications),
        remaining_days: Math.max(0, totalDays - Math.floor(completedPublications / contentsPerDay)),
        progress_percentage: progressPercentage,
        program_duration: duration,
        contents_per_day: contentsPerDay
      };
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      return null;
    }
  };

  // Charger les comptes sociaux, les playlists et leurs statistiques
  useEffect(() => {
    const loadSocialAccounts = async () => {
      if (!user) {
        setSocialAccounts([]);
        setPlaylists([]);
        setAccountsStats({});
        return;
      }
      
      try {
        setLoadingAccounts(true);
        const [accounts, userPlaylists] = await Promise.all([
          UserProfileService.getSocialAccounts(user.id),
          UserProfileService.getPlaylists(user.id)
        ]);
        setSocialAccounts(accounts);
        setPlaylists(userPlaylists);
        
        // Charger les stats pour chaque compte
        const statsPromises = accounts.map(async (account) => {
          const stats = await loadAccountStats(account.id);
          return { accountId: account.id, stats };
        });
        
        const statsResults = await Promise.all(statsPromises);
        const statsMap: Record<string, NetworkStats> = {};
        statsResults.forEach(({ accountId, stats }) => {
          if (stats) statsMap[accountId] = stats;
        });
        setAccountsStats(statsMap);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };
    
    loadSocialAccounts();
  }, [user]);

  // Fonction pour calculer le niveau basé sur le pourcentage
  const getLevel = (percentage: number): { level: number; label: string } => {
    if (percentage >= 100) return { level: 5, label: 'Expert' };
    if (percentage >= 75) return { level: 4, label: 'Avancé' };
    if (percentage >= 50) return { level: 3, label: 'Intermédiaire' };
    if (percentage >= 25) return { level: 2, label: 'Débutant' };
    return { level: 1, label: 'Nouveau' };
  };

  // Fonction pour ouvrir la modale de sélection réseau/playlist
  const handleAddToPublications = (title: string, titleId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des publications",
        variant: "destructive",
      });
      return;
    }

    if (socialAccounts.length === 0) {
      // Si aucun réseau n'est disponible, ajouter directement
      toast({
        title: "Aucun réseau social",
        description: "Vous devez d'abord ajouter un réseau social dans votre profil",
        variant: "destructive",
      });
      return;
    }

    // Ouvrir la modale de sélection
    setSelectedTitle({ title, titleId });
    setIsSelectModalOpen(true);
  };

  // Fonction pour confirmer l'ajout avec réseau et playlist sélectionnés
  const handleConfirmAddToPublications = async (socialAccountId: string, playlistId?: string) => {
    if (!user || !selectedTitle) return;

    try {
      const publicationData: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        social_account_id: socialAccountId,
        title: selectedTitle.title,
        content: undefined,
        status: 'draft',
        scheduled_date: undefined,
        published_date: undefined,
        engagement_data: null
      };

      const newPost = await UserProfileService.addSocialPost(publicationData);
      
      // Ajouter à la playlist si sélectionnée
      if (playlistId) {
        await UserProfileService.addPostToPlaylist(playlistId, newPost.id);
      }

      toast({
        title: "Ajouté",
        description: "Le titre a été ajouté à vos publications",
      });
      
      setSelectedTitle(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le titre aux publications",
        variant: "destructive",
      });
    }
  };

  // Fonction pour liker un titre
  const handleLikeTitle = async (titleId: string) => {
    try {
      const wasFavorite = isTitleFavorite(titleId);
      await toggleTitleFavorite(titleId);
      toast({
        title: wasFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive",
      });
    }
  };

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

      {/* Section Statistiques d'avancement */}
      {user && socialAccounts.length > 0 && (
        <section className="container mx-auto px-4 py-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                Statistiques d'avancement
              </h2>
            </div>
            
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {loadingAccounts ? (
                <Card className="w-64 h-40 flex-shrink-0">
                  <CardContent className="p-4 flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground text-sm">Chargement...</div>
                  </CardContent>
                </Card>
              ) : (
                socialAccounts.map((account) => {
                  const stats = accountsStats[account.id];
                  if (!stats) return null;
                  
                  const { level, label } = getLevel(stats.progress_percentage);
                  const accountName = account.custom_name || account.display_name || account.username || account.platform;
                  
                  return (
                    <motion.div
                      key={`stats-${account.id}`}
                      className="flex-shrink-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="w-64 h-40 hover:shadow-md transition-shadow bg-card flex flex-col">
                        <CardContent className="p-3 flex flex-col h-full">
                          <div className="space-y-2 flex-1">
                            {/* En-tête avec nom du compte et niveau */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                  <TrendingUp className="w-3 h-3 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-xs text-foreground truncate">
                                    {accountName}
                                  </h3>
                                  <p className="text-[10px] text-muted-foreground capitalize">
                                    {account.platform}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                N{level}
                              </Badge>
                            </div>
                            
                            {/* Barre de progression */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground">Progression</span>
                                <span className="font-semibold text-foreground">
                                  {stats.progress_percentage}%
                                </span>
                              </div>
                              <Progress value={stats.progress_percentage} className="h-1.5" />
                            </div>
                            
                            {/* Statistiques détaillées */}
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-border">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground">Créées</p>
                                  <p className="text-xs font-semibold text-foreground">
                                    {stats.actual_publications}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground">Accomplies</p>
                                  <p className="text-xs font-semibold text-foreground">
                                    {stats.completed_publications}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* Section Recommandations de titres */}
      {user && recommendations.length > 0 && (
        <section className="container mx-auto px-4 py-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Recommandations pour vous
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/categories')}
                className="text-xs"
              >
                Voir plus
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            
            {loadingRecommendations ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">Chargement des recommandations...</div>
                </CardContent>
              </Card>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {recommendations.map((rec) => (
                  <motion.div
                    key={`rec-${rec.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          if (rec.category_id && rec.subcategory_id) {
                            navigate(`/category/${rec.category_id}/subcategory/${rec.subcategory_id}`);
                          } else if (rec.category_id) {
                            navigate(`/category/${rec.category_id}/subcategories`);
                          }
                        }}
                      >
                        <h3 className="text-foreground font-medium text-base leading-relaxed">
                          {rec.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeTitle(rec.id);
                          }}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isTitleFavorite(rec.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart 
                            size={16} 
                            className={`transition-all duration-200 ${
                              isTitleFavorite(rec.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent text-current'
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPublications(rec.title, rec.id);
                          }}
                          className="p-2 h-8 w-8 text-gray-400 hover:text-primary transition-all duration-200"
                          title="Ajouter aux publications"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* <TrendingSection /> */}

      

      

      {/* Modale de sélection réseau/playlist */}
      {selectedTitle && user && (
        <SelectNetworkPlaylistModal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedTitle(null);
          }}
          onConfirm={handleConfirmAddToPublications}
          userId={user.id}
          socialAccounts={socialAccounts}
          playlists={playlists}
          title={selectedTitle.title}
        />
      )}

      <Navigation />
    </div>
  );
};

export default Index;
