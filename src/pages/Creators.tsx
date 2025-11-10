import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Plus, Filter, Globe, Users, ArrowLeft, FolderOpen } from 'lucide-react';
import { useThemes } from '@/hooks/useThemes';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useCreators } from '@/hooks/useCreators';
import { Button } from '@/components/ui/button';
import LocalSearchBar from '@/components/LocalSearchBar';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Creators = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
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
  const { toast } = useToast();

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

  if (creatorsLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={navigateBack} 
              className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
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
    <div className="min-h-screen pb-20 bg-background" style={{ 
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={navigateBack} 
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Créateurs
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredCreators.length} créateur{filteredCreators.length > 1 ? 's' : ''}
            </p>
            {/* Indicateur du réseau social sélectionné */}
            {selectedNetwork !== 'all' && (
              <p className="text-xs text-primary font-medium">
                {socialNetworks?.find(n => n.name === selectedNetwork)?.display_name}
              </p>
            )}
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
                <motion.button
                  onClick={() => setSelectedNetwork('all')}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                    ${selectedNetwork === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={selectedNetwork === 'all' ? {
                    scale: [1, 1.1, 1.05],
                    boxShadow: [
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    ]
                  } : {}}
                  transition={selectedNetwork === 'all' ? {
                    duration: 0.6,
                    ease: "easeInOut"
                  } : {
                    duration: 0.2
                  }}
                >
                  <span className={`
                    text-xs font-medium leading-tight
                    ${selectedNetwork === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                  `}>
                    Tout
                  </span>
                </motion.button>
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
                className="rounded-full"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Catégories
              </Button>
            </div>
          </div>
        </div>

        {/* Grille des créateurs */}
        {filteredCreators.length > 0 ? (
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
                  className="flex flex-col items-center justify-center text-center transform transition-all duration-300 cursor-pointer hover:scale-105"
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
                  {!creator.is_public && (
                    <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Profil privé (accès restreint sur certains contenus)
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4 text-sm">
              {searchTerm 
                ? 'Aucun créateur trouvé pour cette recherche' 
                : selectedNetwork !== 'all'
                ? `Aucun créateur disponible pour ${socialNetworks?.find(n => n.name === selectedNetwork)?.display_name}`
                : 'Aucun créateur disponible'
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

export default Creators;
