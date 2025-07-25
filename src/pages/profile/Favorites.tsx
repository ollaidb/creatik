import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Heart } from 'lucide-react';
import { useCategoriesByTheme } from '@/hooks/useCategoriesByTheme';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useFavorites } from '@/hooks/useFavorites'; 
import { useAuth } from '@/hooks/useAuth';
import CategoryCard from '@/components/CategoryCard';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
import ChallengeButton from '@/components/ChallengeButton';
import { useToast } from '@/hooks/use-toast';
const FAVORITE_TABS = [
  { key: 'categories', label: 'Catégories' },
  { key: 'subcategories', label: 'Sous-catégories' },
  { key: 'titles', label: 'Titres' },
  { key: 'comptes', label: 'Comptes' },
  { key: 'sources', label: 'Sources' },
  { key: 'challenges', label: 'Challenges' },
];
const Favorites = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('categories');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const { user } = useAuth();
  const { favorites: favoriteCategories, toggleFavorite, isFavorite } = useFavorites('category');
  const { favorites: favoriteSubcategories } = useFavorites('subcategory');
  const { favorites: favoriteTitles } = useFavorites('title');
  const { data: allCategories = [] } = useCategoriesByTheme('all');
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: allTitles = [] } = useContentTitles();
  const { toast } = useToast();
  const categoriesToShow = allCategories.filter(cat => favoriteCategories.includes(cat.id));
  const subcategoriesToShow = allSubcategories.filter(sub => favoriteSubcategories.includes(sub.id));
  const titlesToShow = allTitles.filter(title => favoriteTitles.includes(title.id));
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
        {/* Menu d'onglets favoris */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {FAVORITE_TABS.map(tab => (
            <Button
              key={tab.key}
              variant={selectedTab === tab.key ? 'default' : 'outline'}
              onClick={() => setSelectedTab(tab.key)}
              className="rounded-full flex-1 min-w-0 max-w-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {/* Supprimer l'ancien menu des thèmes horizontal et le bouton Challenge ici */}
        {/* Affichage conditionnel selon l'onglet sélectionné */}
        {selectedTab === 'categories' && (
          // ... ici tu mets l'affichage des catégories favorites (comme avant)
          <>
            {/* Supprimer l'ancien menu des thèmes horizontal et le bouton Challenge ici */}
            {categoriesToShow.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {categoriesToShow.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <div className="relative">
                      <CategoryCard
                        category={{
                          id: category.id,
                          name: category.name,
                          color: category.color
                        }}
                        className="w-full h-24"
                        onClick={() => navigate(`/category/${category.id}/subcategories`)}
                      />
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(category.id);
                          toast({
                            title: isFavorite(category.id)
                              ? "Retiré des favoris"
                              : "Ajouté à vos favoris !",
                            description: isFavorite(category.id)
                              ? "La catégorie a été retirée de vos favoris."
                              : "Vous verrez cette catégorie dans votre page de favoris.",
                          });
                        }}
                      >
                        <Heart className={isFavorite(category.id) ? 'w-5 h-5 text-red-500 fill-red-500' : 'w-5 h-5 text-gray-300'} />
                      </div>
                    </div>
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
        {selectedTab === 'subcategories' && (
          <>
            {subcategoriesToShow.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {subcategoriesToShow.map((subcategory) => (
                  <motion.div key={subcategory.id} variants={itemVariants}>
                    <div className="w-full h-24 flex items-center justify-center border rounded bg-white dark:bg-gray-800">
                      {subcategory.name}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2">
                  Vous n'avez pas encore ajouté de sous-catégories en favoris
                </p>
              </div>
            )}
          </>
        )}
        {selectedTab === 'titles' && (
          <>
            {titlesToShow.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {titlesToShow.map((title) => (
                  <motion.div key={title.id} variants={itemVariants}>
                    <div className="w-full h-24 flex items-center justify-center border rounded bg-white dark:bg-gray-800">
                      {title.title}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2">
                  Vous n'avez pas encore ajouté de titres en favoris
                </p>
              </div>
            )}
          </>
        )}
        {selectedTab === 'comptes' && (
          <>
            {/* Remplace ce hook par le tien si tu as une table comptes */}
            {/* const { data: allComptes = [] } = useComptes(); */}
            {/* const { favorites: favoriteComptes } = useFavorites('compte'); */}
            {/* const comptesToShow = allComptes.filter(compte => favoriteComptes.includes(compte.id)); */}
            <div className="text-center py-8 text-gray-400">
              Comptes favoris (fonctionnalité à brancher si tu as la table et le hook)
            </div>
          </>
        )}
        {selectedTab === 'sources' && (
          <>
            {/* Remplace ce hook par le tien si tu as une table sources */}
            {/* const { data: allSources = [] } = useSources(); */}
            {/* const { favorites: favoriteSources } = useFavorites('source'); */}
            {/* const sourcesToShow = allSources.filter(source => favoriteSources.includes(source.id)); */}
            <div className="text-center py-8 text-gray-400">
              Sources favorites (fonctionnalité à brancher si tu as la table et le hook)
            </div>
          </>
        )}
        {selectedTab === 'challenges' && (
          <>
            {/* Remplace ce hook par le tien si tu as une table challenges */}
            {/* const { data: allChallenges = [] } = useChallenges(); */}
            {/* const { favorites: favoriteChallenges } = useFavorites('challenge'); */}
            {/* const challengesToShow = allChallenges.filter(challenge => favoriteChallenges.includes(challenge.id)); */}
            <div className="text-center py-8 text-gray-400">
              Challenges favoris (fonctionnalité à brancher si tu as la table et le hook)
            </div>
          </>
        )}
      </main>
      <Navigation />
    </div>
  );
};
export default Favorites;
