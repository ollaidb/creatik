
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ContentCard from "@/components/ContentCard";
import Navigation from "@/components/Navigation";
import FavoriteCard from "@/components/FavoriteCard";

import { contentIdeas, getPersonalizedRecommendations } from "@/data/mockData";
import { ContentIdea } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

const Index: React.FC = () => {
  const [favoriteIdeas, setFavoriteIdeas] = useState<ContentIdea[]>([]);
  const [visitedCategories, setVisitedCategories] = useState<string[]>(["education", "business"]);
  const [personalizedIdeas, setPersonalizedIdeas] = useState<ContentIdea[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  
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
    <div className="min-h-screen pb-20">
      <Hero />
      
      <div className="creatik-container">
        {/* Section: Vidéos les plus recherchées */}
        <section className="creatik-section">
          <motion.h2 
            className="creatik-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Idées les plus populaires
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
        <section className="creatik-section">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="creatik-heading mb-0"
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
              className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-muted-foreground mb-4">
                Connectez-vous pour voir vos catégories favorites
              </p>
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => navigate('/profile')}
              >
                Se connecter
              </button>
            </motion.div>
          ) : favoritesLoading ? (
            <motion.p 
              className="text-muted-foreground text-center py-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              Chargement de vos favoris...
            </motion.p>
          ) : favoriteCategories.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {favoriteCategories.map((category) => (
                  <CarouselItem key={category.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <FavoriteCard 
                      category={{
                        id: category.id,
                        name: category.name,
                        color: category.color
                      }}
                      onClick={() => navigate(`/categories/${category.id}`)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-4">
                <CarouselPrevious className="static transform-none mx-0 h-8 w-8" />
                <CarouselNext className="static transform-none mx-0 h-8 w-8" />
              </div>
            </Carousel>
          ) : (
            <motion.div 
              className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-muted-foreground mb-4">
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
        <section className="creatik-section">
          <motion.h2 
            className="creatik-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Recommandations pour vous
          </motion.h2>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {personalizedIdeas.map((idea) => (
                <CarouselItem key={idea.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ContentCard 
                    idea={idea} 
                    onFavorite={handleToggleFavorite}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none mx-0 h-8 w-8" />
              <CarouselNext className="static transform-none mx-0 h-8 w-8" />
            </div>
          </Carousel>
        </section>
        
        {/* Section: Catégories */}
        <section className="creatik-section">
          <motion.h2 
            className="creatik-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Catégories
          </motion.h2>
          
          <motion.div 
            className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 scrollbar-hide"
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
                  className="w-32 h-24"
                  onClick={() => {
                    if (!visitedCategories.includes(category.id)) {
                      setVisitedCategories(prev => [...prev, category.id]);
                    }
                    navigate(`/categories/${category.id}`);
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
