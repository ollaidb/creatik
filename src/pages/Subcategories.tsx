import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Heart, Filter } from 'lucide-react';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useCategories } from '@/hooks/useCategories';
import { useFavorites } from '@/hooks/useFavorites';
import { useFilterCategoriesByNetwork } from '@/hooks/useSocialNetworks';
import SubcategoryCard from '@/components/SubcategoryCard';
import { Button } from '@/components/ui/button';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';

const Subcategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'priority' | 'recent'>('priority');
  
  // Récupérer le réseau depuis l'URL
  const selectedNetwork = searchParams.get('network') || 'all';
  
  const { data: subcategories, isLoading } = useSubcategories(categoryId);
  const { data: categories } = useCategories();
  const currentCategory = categories?.find(cat => cat.id === categoryId);
  const { favorites, toggleFavorite, isFavorite } = useFavorites('subcategory');
  
  // Filtrer les sous-catégories selon le réseau
  const filteredSubcategories = useFilterCategoriesByNetwork(
    subcategories?.filter(subcategory => 
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    selectedNetwork
  );
  
  // Fonction de tri
  const getSortedSubcategories = (subcategories: Array<{id: string, name: string, created_at?: string}>) => {
    if (!subcategories) return [];
    
    switch (sortOrder) {
      case 'alphabetical':
        return [...subcategories].sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return [...subcategories].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case 'priority':
      default:
        return subcategories;
    }
  };

  // Fonction pour changer l'ordre de tri
  const handleSortChange = () => {
    const sortOptions: Array<'alphabetical' | 'priority' | 'recent'> = ['priority', 'alphabetical', 'recent'];
    const currentIndex = sortOptions.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortOrder(sortOptions[nextIndex]);
  };

  const handleSearch = (query: string) => {
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  const handleBackClick = () => {
    navigate('/categories');
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
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackClick} 
              className="p-2 h-10 w-10 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                Chargement...
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackClick} 
            className="p-2 h-10 w-10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentCategory?.name || 'Catégorie'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getSortedSubcategories(filteredSubcategories).length} sous-catégories disponibles
              {selectedNetwork !== 'all' && ` pour ${selectedNetwork}`}
            </p>
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

      {/* Contenu principal */}
      <div className="px-4 py-4">
        {/* Barre de recherche intelligente */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleSortChange}
                className="p-2 h-10 w-10 rounded-full"
                title={`Trié par ${sortOrder === 'alphabetical' ? 'ordre alphabétique' : sortOrder === 'priority' ? 'priorité' : 'récent'}`}
              >
                <Filter size={20} />
              </Button>
              <IntelligentSearchBar 
                onSearch={handleSearch}
                placeholder="Rechercher une sous-catégorie..."
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Liste des sous-catégories */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {getSortedSubcategories(filteredSubcategories).map((subcategory) => (
            <motion.div key={subcategory.id} variants={itemVariants}>
              <div 
                onClick={() => navigate(`/category/${categoryId}/subcategory/${subcategory.id}?network=${selectedNetwork}`)}
                className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group h-20 sm:h-24 md:h-28 bg-white dark:bg-gray-800 border-4 border-blue-500"
              >
                {/* Icône cœur en haut à droite */}
                <div
                  className="absolute top-2 right-2 z-10"
                  onClick={e => { e.stopPropagation(); toggleFavorite(subcategory.id); }}
                >
                  <Heart className={isFavorite(subcategory.id) ? 'w-5 h-5 text-red-500 fill-red-500' : 'w-5 h-5 text-gray-300'} />
                </div>
                <div className="p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-base md:text-lg leading-tight text-center">
                    {subcategory.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Message si pas de sous-catégories */}
        {getSortedSubcategories(filteredSubcategories).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {searchTerm 
                ? 'Aucune sous-catégorie trouvée pour cette recherche' 
                : selectedNetwork !== 'all'
                ? `Aucune sous-catégorie disponible pour ${selectedNetwork}`
                : 'Aucune sous-catégorie disponible pour cette catégorie'
              }
            </div>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} className="text-sm">
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subcategories; 