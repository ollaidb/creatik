import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Filter, Globe, Users, ArrowLeft, FolderOpen } from 'lucide-react';
import { useThemes } from '@/hooks/useThemes';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useCreators } from '@/hooks/useCreators';
import { Button } from '@/components/ui/button';
import LocalSearchBar from '@/components/LocalSearchBar';
import Navigation from '@/components/Navigation';

const Creators = () => {
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
  
  const { data: themes } = useThemes();
  const { data: socialNetworks } = useSocialNetworks();
  const { data: creators, isLoading: creatorsLoading } = useCreators();

  // Mettre à jour l'URL quand les choix changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTheme) params.set('theme', selectedTheme);
    if (selectedNetwork !== 'all') params.set('network', selectedNetwork);
    setSearchParams(params, { replace: true });
  }, [selectedTheme, selectedNetwork]);

  // Fonction pour changer le tri
  const handleSortChange = () => {
    const orders: Array<'alphabetical' | 'priority' | 'recent'> = ['priority', 'alphabetical', 'recent'];
    const currentIndex = orders.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % orders.length;
    setSortOrder(orders[nextIndex]);
  };

  // Utiliser les vraies données des créateurs
  const creatorsList = creators || [];

  // Filtrer les créateurs selon la recherche
  const filteredCreators = creatorsList.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creator.display_name && creator.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (creator.bio && creator.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Trier les créateurs
  const getSortedCreators = (creators: typeof creatorsList) => {
    switch (sortOrder) {
      case 'alphabetical':
        return [...creators].sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return [...creators].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'priority':
      default:
        return creators; // Ordre par défaut
    }
  };

  // Variants pour les animations
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 h-10 w-10 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Créateurs
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/publish')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>
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
                  const isActive = selectedNetwork === network.name;
                  return (
                    <motion.button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.name)}
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
                placeholder="Rechercher un créateur..."
                className="flex-1"
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/categories')}
                variant="outline"
                size="sm"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Catégories
              </Button>
            </div>
          </div>
        </div>

        {/* Grille des créateurs */}
        {creatorsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement des créateurs...</p>
            </div>
          </div>
        ) : filteredCreators.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${selectedNetwork}-${selectedTheme}`}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {getSortedCreators(filteredCreators).map((creator, index) => (
              <motion.div 
                key={creator.id} 
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: Math.min(index * 0.05, 0.5),
                  duration: 0.2,
                  ease: "easeOut"
                }}
                layout
              >
                <div 
                  className="flex flex-col items-center justify-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate(`/creator/${creator.id}`)}
                >
                  {/* Photo de profil en cercle (le bloc entier) */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-lg hover:shadow-xl border-2 border-white dark:border-gray-700 overflow-hidden mb-2">
                    <img 
                      src={creator.avatar || '/placeholder.svg'} 
                      alt={creator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  
                  {/* Nom du créateur */}
                  <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base leading-tight">
                    {creator.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium mb-2">Aucun créateur trouvé</p>
            <p className="text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        )}


      </div>
      <Navigation />
    </div>
  );
};

export default Creators;
