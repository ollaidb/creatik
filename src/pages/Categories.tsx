import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Filter, Globe, Smartphone, Youtube, Instagram, Facebook, Twitter, Twitch, Linkedin, ArrowLeft } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useThemes, useCategoriesByTheme } from '@/hooks/useThemes';
import { useSocialNetworks, useFilterCategoriesByNetwork } from '@/hooks/useSocialNetworks';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import LocalSearchBar from '@/components/LocalSearchBar';
import ChallengeButton from '@/components/ChallengeButton';
import Navigation from '@/components/Navigation';

const Categories = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Récupérer les choix depuis l'URL ou utiliser les valeurs par défaut
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    searchParams.get('theme') || null
  );
  const [selectedNetwork, setSelectedNetwork] = useState(
    searchParams.get('network') || 'all'
  );
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'priority' | 'recent'>('priority');
  
  const { data: categories, isLoading } = useCategories();
  const { data: categoriesByTheme } = useCategoriesByTheme(selectedTheme);
  const { data: themes } = useThemes();
  const { data: socialNetworks } = useSocialNetworks();

  // Mettre à jour l'URL quand les choix changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTheme) params.set('theme', selectedTheme);
    if (selectedNetwork !== 'all') params.set('network', selectedNetwork);
    setSearchParams(params, { replace: true });
  }, [selectedTheme, selectedNetwork]);

  // Utiliser les catégories filtrées par thème et réseau
  const baseCategories = selectedTheme ? categoriesByTheme : categories;
  const filteredCategories = useFilterCategoriesByNetwork(
    baseCategories?.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    selectedNetwork
  );

  // Logs de débogage
  console.log('🔍 Debug Categories:', {
    selectedTheme,
    selectedNetwork,
    categories: categories?.length || 0,
    categoriesByTheme: categoriesByTheme?.length || 0,
    baseCategories: baseCategories?.length || 0,
    filteredCategories: filteredCategories?.length || 0,
    themes: themes?.length || 0,
    socialNetworks: socialNetworks?.length || 0,
    // Détails du filtrage
    baseCategoriesNames: baseCategories?.map(c => c.name).slice(0, 5),
    filteredCategoriesNames: filteredCategories?.map(c => c.name).slice(0, 5),
    searchTerm,
    sortOrder,
    // Détails des réseaux sociaux
    socialNetworksData: socialNetworks?.slice(0, 3),
    // Vérifier si la personnalisation fonctionne
    hasSelectedNetwork: selectedNetwork !== 'all',
    hasSelectedTheme: selectedTheme !== null,
    // Détails de l'URL
    urlParams: searchParams.toString(),
    allUrlParams: Object.fromEntries(searchParams.entries())
  });

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
        return categories;
    }
  };

  // Fonction pour changer l'ordre de tri
  const handleSortChange = () => {
    const sortOptions: Array<'alphabetical' | 'priority' | 'recent'> = ['priority', 'alphabetical', 'recent'];
    const currentIndex = sortOptions.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortOrder(sortOptions[nextIndex]);
  };

  const handleBackClick = () => {
    navigate('/');
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
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:border-gray-700 px-4 py-3"
             style={{
               ...(window.matchMedia('(prefers-color-scheme: dark)').matches && {
                 backgroundColor: '#0f0f10'
               })
             }}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackClick} 
              className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                Chargement...
              </h1>
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
    <div className="min-h-screen pb-20">
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:border-gray-700 px-4 py-3"
           style={{
             ...(window.matchMedia('(prefers-color-scheme: dark)').matches && {
               backgroundColor: '#0f0f10'
             })
           }}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackClick} 
            className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              Catégories
            </h1>
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
        {/* Menu des thèmes */}
        {themes && (
          <div className="mb-3">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2 min-w-max">
                <motion.button
                  onClick={() => setSelectedTheme(null)}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                    ${!selectedTheme
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`
                    text-xs font-medium leading-tight
                    ${!selectedTheme ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                  `}>
                    Tout
                  </span>
                </motion.button>
                {themes.map((theme) => {
                  const isActive = selectedTheme === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                        ${isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
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
        )}

        {/* Menu des réseaux sociaux */}
        {socialNetworks && (
          <div className="mb-3">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2 min-w-max">
                {socialNetworks.map((network) => {
                  const isActive = selectedNetwork === network.id;
                  return (
                    <motion.button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                        ${isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isActive ? {
                        scale: [1, 1.1, 1.05],
                        boxShadow: [
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        ]
                      } : {}}
                      transition={isActive ? {
                        duration: 0.6,
                        ease: "easeInOut"
                      } : {
                        duration: 0.2
                      }}
                    >
                      <span className={`
                        text-xs font-medium leading-tight
                        ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                      `}>
                        {network.display_name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et tri */}
        <div className="mb-2">
          <div className="max-w-lg mx-auto md:max-w-2xl space-y-3">
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
              <LocalSearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Rechercher une catégorie..."
                className="flex-1"
              />
            </div>
            <div className="flex justify-center">
              <ChallengeButton 
                variant="outline"
                size="sm"
                className="rounded-full bg-red-600 hover:bg-red-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${selectedNetwork}-${selectedTheme}`}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {getSortedCategories(filteredCategories).map((category, index) => (
            <motion.div 
              key={category.id} 
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <CategoryCard 
                category={{
                  id: category.id,
                  name: category.name,
                  color: category.color || 'primary'
                }}
                index={index}
                onClick={() => navigate(`/category/${category.id}/subcategories?network=${selectedNetwork}`)}
                className="w-full h-20 sm:h-24 md:h-28"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Message si pas de catégories */}
        {getSortedCategories(filteredCategories).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {searchTerm 
                ? 'Aucune catégorie trouvée pour cette recherche' 
                : selectedNetwork !== 'all'
                ? `Aucune catégorie disponible pour ${socialNetworks?.find(n => n.id === selectedNetwork)?.display_name}`
                : 'Aucune catégorie disponible'
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
      <Navigation />
    </div>
  );
};

export default Categories;