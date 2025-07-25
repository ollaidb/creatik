
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
import { Target, Trophy, Clock, ArrowRight, Heart, User, Star } from "lucide-react";
import { usePublicChallenges } from "@/hooks/usePublicChallenges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { challenges: publicChallenges, toggleLike, addToPersonalChallenges } = usePublicChallenges();
  
  // Simuler des idées favorites
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
      
      {/* Section Tendances */}
      {/* <TrendingSection /> */}
      
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
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        Relevez le défi et gagnez des points !
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-300 text-xs">
                    +50 pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-base text-orange-900 dark:text-orange-100 mb-1">
                      Créer un titre viral sur "Astuces de vie"
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                      Proposez un titre qui pourrait devenir viral dans la catégorie Astuces de vie. 
                      Soyez créatif et pensez à ce qui pourrait captiver l'attention !
                    </p>
                    <div className="flex items-center gap-3 text-xs text-orange-600 dark:text-orange-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Temps restant: 23h 45m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>1,234 participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate('/publish')}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1.5"
                      size="sm"
                    >
                      Relever le défi
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      )}

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
                    Publier un Challenge
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={(challenge.creator?.user_metadata as UserMeta)?.avatar_url || ''} />
                              <AvatarFallback>
                                <User className="w-2.5 h-2.5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs text-muted-foreground">
                              {getCreatorName(challenge.creator)}
                            </div>
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{challenge.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(challenge.id)}
                            className={`flex items-center gap-1 p-1 h-6 ${
                              challenge.is_liked ? 'text-red-500' : 'text-muted-foreground'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${challenge.is_liked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{challenge.likes_count}</span>
                          </Button>
                          
                          {user && (
                            <Button
                              size="sm"
                              onClick={() => addToPersonalChallenges(challenge.id)}
                              className="flex items-center gap-1 p-1 h-6 text-xs"
                            >
                              <Target className="w-3 h-3" />
                              <span className="text-xs">Ajouter</span>
                            </Button>
                          )}
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
      
      <div className="container mx-auto px-4 py-4">
        {/* Section: Vidéos les plus recherchées */}
        <section className="mb-6">
          <motion.h2 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Idées les plus populaires
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contentIdeas
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 3)
              .map((idea) => (
                <motion.div key={idea.id} variants={itemVariants}>
                  <ContentCard 
                    idea={idea} 
                    onFavorite={handleToggleFavorite}
                  />
                </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Section: Favoris */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <motion.h2 
              className="text-lg font-semibold text-gray-900 dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Vos favoris
            </motion.h2>
            {user && favoriteCategories.length > 0 && (
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                onClick={() => navigate('/profile/favorites')}
              >
                Voir tout
              </button>
            )}
          </div>
          
          {!user ? (
            <motion.div 
              className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-muted-foreground mb-3 text-sm">
                Connectez-vous pour voir vos catégories favorites
              </p>
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => navigate('/profile')}
              >
                Se connecter
              </button>
            </motion.div>
          ) : isLoading ? (
            <motion.p 
              className="text-muted-foreground text-center py-6 text-sm"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              Chargement de vos favoris...
            </motion.p>
          ) : favoriteCategories.length > 0 ? (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {favoriteCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <CategoryCard 
                    category={{
                      id: category.id,
                      name: category.name,
                      color: category.color
                    }}
                    className="w-full h-20 sm:h-24 md:h-28"
                    onClick={() => navigate(`/category/${category.id}/subcategories`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-muted-foreground mb-3 text-sm">
                Vous n'avez pas encore de favoris.
              </p>
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => navigate('/categories')}
              >
                Explorez les catégories
              </button>
            </motion.div>
          )}
        </section>
        
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
        
        {/* Section: Catégories */}
        <section className="mb-6">
          <motion.h2 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Catégories
          </motion.h2>
          
          <motion.div 
            className="grid grid-flow-col auto-cols-max gap-3 overflow-x-auto pb-3 scrollbar-hide"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories?.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <CategoryCard 
                  category={{
                    id: category.id,
                    name: category.name,
                    color: category.color
                  }}
                  className="w-28 h-20"
                  onClick={() => {
                    if (!visitedCategories.includes(category.id)) {
                      setVisitedCategories(prev => [...prev, category.id]);
                    }
                    navigate(`/category/${category.id}/subcategories`);
                  }}
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
