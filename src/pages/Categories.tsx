
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import { useCategoriesByTheme } from '@/hooks/useCategoriesByTheme';
import { useThemes } from '@/hooks/useThemes';
import CategoryCard from '@/components/CategoryCard';
import Navigation from '@/components/Navigation';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';
import ChallengeButton from '@/components/ChallengeButton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFavorites } from '@/hooks/useFavorites';

const Categories = () => {
  const navigate = useNavigate();
  const { subcategoryId, categoryId } = useParams();

  const handleBack = () => {
    if (subcategoryId) {
      navigate(`/category/${categoryId}/subcategories`);
    } else if (categoryId) {
      navigate('/categories');
    } else {
      navigate('/');
    }
  };

  const [selectedTheme, setSelectedTheme] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: categories, isLoading, error } = useCategoriesByTheme(selectedTheme);
  console.log('categories:', categories);
  console.log('error:', error);
  const { data: themes } = useThemes();

  const handleSearch = (query: string) => {
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  const selectedThemeName = themes?.find(t => t.id === selectedTheme)?.name || 
                           (selectedTheme === 'all' ? 'Tout' : 'Tout');

  const filteredCategories = categories?.filter(category => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  // Onglet Titres / Sources / Comptes
  // Supprimer le code du menu à onglets Titres / Comptes / Sources
  // Supprimer aussi les conditions d'affichage liées à tab (tab === 'titres', tab === 'sources', tab === 'comptes')

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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack} 
              className="p-2 h-10 w-10 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Catégories</h1>
            </div>
          </div>
          <Button 
            size="sm"
            onClick={() => navigate('/publish')}
            className="px-3 py-2 h-auto rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Barre de recherche intelligente et bouton Challenge */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl space-y-3">
            <IntelligentSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher une catégorie..."
              className="w-full"
            />
            <div className="flex justify-center">
              <ChallengeButton 
                variant="outline"
                size="sm"
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Menu des thèmes - Version Desktop (boutons) */}
        {/* Supprimer le menu à onglets Titres / Comptes / Sources */}

        {/* Menu des thèmes - Version Mobile (dropdown) */}
        <div className="mb-6 md:hidden">
          <Select 
            value={selectedTheme} 
            onValueChange={setSelectedTheme}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un thème">
                {selectedThemeName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themes?.map((theme) => (
                <SelectItem 
                  key={theme.id} 
                  value={theme.name === 'Tout' ? 'all' : theme.id}
                >
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Chargement des catégories...</p>
          </div>
        ) : (
          <>
            {/* Supprimer aussi les conditions d'affichage liées à tab (tab === 'titres', tab === 'sources', tab === 'comptes') */}
            {/* Liste des titres (comme avant) */}
            <>
                {/* Grille des catégories - Responsive */}
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredCategories?.map((category) => (
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

                {filteredCategories?.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                    <h3 className="text-lg font-medium">Aucune catégorie trouvée</h3>
                    <p className="text-muted-foreground mt-2">
                      Aucune catégorie disponible pour ce thème
                    </p>
                  </div>
                )}
              </>
            {/* Supprimer aussi les conditions d'affichage liées à tab (tab === 'titres', tab === 'sources', tab === 'comptes') */}
            {/* Placeholder ou vraie liste des sources */}
            <div className="text-center py-8">
                <p>Sources</p>
              </div>
            {/* Supprimer aussi les conditions d'affichage liées à tab (tab === 'titres', tab === 'sources', tab === 'comptes') */}
            {/* Placeholder ou vraie liste des comptes */}
            <div className="text-center py-8">
                <p>Comptes</p>
              </div>
          </>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Categories;
