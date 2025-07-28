import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Filter, Globe, Smartphone, Youtube, Instagram, Facebook, Twitter, Twitch, Linkedin } from 'lucide-react';
import { useCategoriesByTheme } from '@/hooks/useCategoriesByTheme';
import { useThemes } from '@/hooks/useThemes';
import CategoryCard from '@/components/CategoryCard';
import Navigation from '@/components/Navigation';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';
import ChallengeButton from '@/components/ChallengeButton';
import { Button } from '@/components/ui/button';
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
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'priority' | 'recent'>('priority');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categories, isLoading, error } = useCategoriesByTheme(selectedTheme);
  const { data: themes } = useThemes();
  
  // Données des réseaux sociaux
  const socialNetworks = [
    { id: 'all', name: 'Tout', icon: Globe, color: 'from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'from-black to-gray-900' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' },
    { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'from-purple-600 to-purple-700' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-800' }
  ];

  // Fonction de tri
  const getSortedCategories = (categories: Array<{id: string, name: string, color?: string, created_at?: string}>) => {
    if (!categories) return [];
    
    switch (sortOrder) {
      case 'alphabetical':
        return [...categories].sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return [...categories].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case 'priority':
      default:
        // Tri par priorité selon le réseau sélectionné
        return categories;
    }
  };

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = () => {
    switch (sortOrder) {
      case 'alphabetical':
        return '📝';
      case 'priority':
        return '⭐';
      case 'recent':
        return '🕒';
      default:
        return '⭐';
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
  const selectedThemeName = themes?.find(t => t.id === selectedTheme)?.name || 
                           (selectedTheme === 'all' ? 'Tout' : 'Tout');
  const filteredCategories = categories?.filter(category => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const getThemeColor = (themeName: string) => {
    switch (themeName.toLowerCase()) {
      case 'tout':
        return 'from-purple-500 to-pink-500';
      case 'créativité':
        return 'from-blue-500 to-cyan-500';
      case 'lifestyle':
        return 'from-pink-500 to-rose-500';
      case 'business':
        return 'from-green-500 to-emerald-500';
      case 'technologie':
        return 'from-red-500 to-red-600';
      case 'international':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
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
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleSortChange}
              className="p-2 h-10 w-10 rounded-full"
              title={`Trié par ${sortOrder === 'alphabetical' ? 'ordre alphabétique' : sortOrder === 'priority' ? 'priorité' : 'récent'}`}
            >
              <span className="text-lg">{getSortIcon()}</span>
            </Button>
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
                className="rounded-full bg-red-600 hover:bg-red-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Menu des thèmes - Barre horizontale sans icônes */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {themes?.map((theme) => {
                const isActive = selectedTheme === (theme.name === 'Tout' ? 'all' : theme.id);
                return (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.name === 'Tout' ? 'all' : theme.id)}
                    className={`
                      px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px] text-center
                      ${isActive 
                        ? 'bg-gradient-to-r ' + getThemeColor(theme.name) + ' text-white shadow-lg scale-105' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`
                      text-xs font-medium leading-tight
                      ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                    `}>
                      {theme.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu des réseaux sociaux - Barre horizontale avec icônes */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {socialNetworks.map((network) => {
                const isActive = selectedNetwork === network.id;
                const IconComponent = network.icon;
                return (
                  <motion.button
                    key={network.id}
                    onClick={() => setSelectedNetwork(network.id)}
                    className={`
                      px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                      ${isActive 
                        ? 'bg-gradient-to-r ' + network.color + ' text-white shadow-lg scale-105' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={16} />
                    <span className={`
                      text-xs font-medium leading-tight
                      ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                    `}>
                      {network.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Chargement des catégories...</p>
          </div>
        ) : (
          <>
            {/* Grille des catégories - Responsive */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getSortedCategories(filteredCategories)?.map((category) => (
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
            {getSortedCategories(filteredCategories)?.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <h3 className="text-lg font-medium">Aucune catégorie trouvée</h3>
                <p className="text-muted-foreground mt-2">
                  {selectedNetwork !== 'all' 
                    ? `Aucune catégorie disponible pour ${socialNetworks.find(n => n.id === selectedNetwork)?.name}`
                    : 'Aucune catégorie disponible pour ce thème'
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default Categories;
