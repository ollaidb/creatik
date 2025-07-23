
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Heart } from 'lucide-react';
import { useCategoriesByTheme, useThemes } from '@/hooks/useThemes';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import CategoryCard from '@/components/CategoryCard';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';

const Favorites = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  
  const { data: themes } = useThemes();
  const { data: categories, isLoading } = useCategoriesByTheme(selectedTheme);

  // Filtrer les catégories pour ne montrer que les favoris
  const filteredFavorites = categories?.filter(cat => favorites.includes(cat.id)) || [];

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

  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <StickyHeader showSearchBar={false} />
        
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Mes Favoris</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center h-60">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
          <p className="text-muted-foreground text-center mb-4">
            Connectez-vous pour voir vos catégories favorites
          </p>
          <Button onClick={() => navigate('/profile')}>
            Se connecter
          </Button>
        </main>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <StickyHeader />
      
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Favoris</h1>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Publier
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Menu des thèmes horizontal */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {themes?.map((theme) => (
              <Button
                key={theme.id}
                variant={selectedTheme === (theme.name === 'Tout' ? 'all' : theme.id) ? 'default' : 'outline'}
                onClick={() => setSelectedTheme(theme.name === 'Tout' ? 'all' : theme.id)}
                className="rounded-full flex-1 min-w-0 max-w-xs"
              >
                {theme.name}
              </Button>
            ))}
          </div>
        </div>

        {isLoading || favoritesLoading ? (
          <div className="text-center py-8">
            <p>Chargement des favoris...</p>
          </div>
        ) : (
          <>
            {filteredFavorites.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredFavorites.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <CategoryCard 
                      category={{
                        id: category.id,
                        name: category.name,
                        color: category.color
                      }}
                      className="w-full h-24"
                      onClick={() => navigate(`/categories/${category.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2">
                  Vous n'avez pas encore ajouté de catégories en favoris pour ce thème
                </p>
                <Button 
                  onClick={() => navigate('/categories')} 
                  className="mt-4"
                  variant="outline"
                >
                  Découvrir les catégories
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Favorites;
