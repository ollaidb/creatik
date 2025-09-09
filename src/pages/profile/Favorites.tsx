import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Heart, Search } from 'lucide-react';
import { useCategoriesByTheme } from '@/hooks/useCategoriesByTheme';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSubcategoriesLevel2 } from '@/hooks/useSubcategoriesLevel2';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useGeneratedTitles } from '@/hooks/useGeneratedTitles';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import { useFavorites } from '@/hooks/useFavorites'; 
import { useAuth } from '@/hooks/useAuth';
import CategoryCard from '@/components/CategoryCard';
import SubcategoryCard from '@/components/SubcategoryCard';
import Navigation from '@/components/Navigation';

// Interface pour les éléments navigables
interface NavigableItem {
  id: string;
  category_id?: string;
  subcategory_id?: string;
  source?: string;
  account_url?: string;
  url?: string;
}

import ChallengeButton from '@/components/ChallengeButton';
import { useToast } from '@/hooks/use-toast';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';

const FAVORITE_TABS = [
  { key: 'categories', label: 'Catégories' },
  { key: 'subcategories', label: 'Sous-catégories' },
  { key: 'subcategories-level2', label: 'Sous-sous-catégories' },
  { key: 'titles', label: 'Titres' },
  { key: 'comptes', label: 'Comptes' },
  { key: 'sources', label: 'Sources' },
  { key: 'hooks', label: 'Hooks' },
  { key: 'challenges', label: 'Challenges' },
];

const Favorites = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('categories');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { favorites: favoriteCategories, toggleFavorite, isFavorite } = useFavorites('category');
  const { favorites: favoriteSubcategories, toggleFavorite: toggleSubcategoryFavorite, isFavorite: isSubcategoryFavorite } = useFavorites('subcategory');
  const { favorites: favoriteSubcategoriesLevel2, toggleFavorite: toggleSubcategoryLevel2Favorite, isFavorite: isSubcategoryLevel2Favorite } = useFavorites('subcategory_level2');
  const { favorites: favoriteTitles, toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavorite } = useFavorites('title');
  const { favorites: favoriteAccounts, toggleFavorite: toggleAccountFavorite, isFavorite: isAccountFavorite } = useFavorites('account');
  const { favorites: favoriteSources, toggleFavorite: toggleSourceFavorite, isFavorite: isSourceFavorite } = useFavorites('source');
  const { favorites: favoriteHooks, toggleFavorite: toggleHookFavorite, isFavorite: isHookFavorite } = useFavorites('hook');
  const { favorites: favoriteChallenges, toggleFavorite: toggleChallengeFavorite, isFavorite: isChallengeFavorite } = useFavorites('challenge');
  const { data: allCategories = [] } = useCategoriesByTheme('all');
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: allSubcategoriesLevel2 = [] } = useSubcategoriesLevel2(null); // Passer null pour récupérer toutes
  const { data: contentTitles = [] } = useContentTitles();
  const { data: generatedTitles = [] } = useGeneratedTitles({
    platform: 'all',
    subcategoryId: null,
    limit: 1000
  });
  const { data: allAccounts = [] } = useAccounts();
  const { data: allSources = [] } = useSources();
  const { data: allHooks = [] } = useContentTitles(); // Utiliser contentTitles pour les hooks
  const { challenges: allChallenges = [] } = usePublicChallenges();
  const { toast } = useToast();

  // Récupérer le paramètre de retour
  const returnTo = searchParams.get('returnTo') || 'profile';

  const handleBackClick = () => {
    if (returnTo === 'home') {
      navigate('/');
    } else {
      navigateBack();
    }
  };

  // Combiner tous les types de titres
  const allTitles = [
    // Titres de content_titles (publiés, manuels, IA)
    ...(contentTitles || []).map(title => ({
      ...title,
      type: 'content',
      source: 'content_titles'
    })),
    // Titres générés avec les mots de la base de données
    ...(generatedTitles || []).map(title => ({
      ...title,
      type: 'generated',
      source: 'word_blocks'
    }))
  ];

  const categoriesToShow = allCategories.filter(cat => favoriteCategories.includes(cat.id));
  const subcategoriesToShow = allSubcategories.filter(sub => favoriteSubcategories.includes(sub.id));
  const subcategoriesLevel2ToShow = allSubcategoriesLevel2.filter(sub => favoriteSubcategoriesLevel2.includes(sub.id));
  const titlesToShow = allTitles.filter(title => favoriteTitles.includes(title.id));
  const accountsToShow = allAccounts.filter(account => favoriteAccounts.includes(account.id));
  const sourcesToShow = allSources.filter(source => favoriteSources.includes(source.id));
  const hooksToShow = allHooks.filter(hook => hook.type === 'hook' && favoriteHooks.includes(hook.id));
  const challengesToShow = allChallenges.filter(challenge => favoriteChallenges.includes(challenge.id));

  // Logs de débogage
  console.log('🔍 Debug Favorites:', {
    allCategories: allCategories.length,
    favoriteCategories: favoriteCategories.length,
    categoriesToShow: categoriesToShow.length,
    allSubcategories: allSubcategories.length,
    favoriteSubcategories: favoriteSubcategories.length,
    subcategoriesToShow: subcategoriesToShow.length,
    allSubcategoriesLevel2: allSubcategoriesLevel2.length,
    favoriteSubcategoriesLevel2: favoriteSubcategoriesLevel2.length,
    subcategoriesLevel2ToShow: subcategoriesLevel2ToShow.length,
    contentTitles: contentTitles.length,
    generatedTitles: generatedTitles.length,
    allTitles: allTitles.length,
    favoriteTitles: favoriteTitles.length,
    titlesToShow: titlesToShow.length,
    allAccounts: allAccounts.length,
    favoriteAccounts: favoriteAccounts.length,
    accountsToShow: accountsToShow.length,
    allSources: allSources.length,
    favoriteSources: favoriteSources.length,
    sourcesToShow: sourcesToShow.length,
    allHooks: allHooks.length,
    favoriteHooks: favoriteHooks.length,
    hooksToShow: hooksToShow.length,
    allChallenges: allChallenges.length,
    favoriteChallenges: favoriteChallenges.length,
    challengesToShow: challengesToShow.length,
    // Détails des titres
    contentTitlesIds: contentTitles.slice(0, 3).map(t => t.id),
    generatedTitlesIds: generatedTitles.slice(0, 3).map(t => t.id),
    favoriteTitlesIds: favoriteTitles.slice(0, 5),
    titlesToShowIds: titlesToShow.slice(0, 3).map(t => t.id),
    // Détails des sous-catégories
    allSubcategoriesIds: allSubcategories.slice(0, 3).map(s => s.id),
    favoriteSubcategoriesIds: favoriteSubcategories.slice(0, 5),
    subcategoriesToShowIds: subcategoriesToShow.slice(0, 3).map(s => s.id),
    // Détails des sous-sous-catégories
    allSubcategoriesLevel2Ids: allSubcategoriesLevel2.slice(0, 3).map(s => s.id),
    favoriteSubcategoriesLevel2Ids: favoriteSubcategoriesLevel2.slice(0, 5),
    subcategoriesLevel2ToShowIds: subcategoriesLevel2ToShow.slice(0, 3).map(s => s.id)
  });

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

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Fonction pour déterminer le chemin de navigation intelligent
  const getNavigationPath = (item: NavigableItem, type: string) => {
    switch (type) {
      case 'category':
        return `/category/${item.id}/subcategories`;
      
      case 'subcategory':
        return `/category/${item.category_id}/subcategory/${item.id}`;
      
      case 'subcategory_level2':
        // Pour les sous-catégories de niveau 2, on a besoin de récupérer la catégorie parent
        // On va naviguer vers la page des titres avec le bon contexte
        return `/category/${item.category_id}/subcategory/${item.subcategory_id}`;
      
      case 'title':
        // Pour les titres, on doit déterminer s'ils viennent de content_titles ou word_blocks
        if (item.source === 'content_titles') {
          // Titre publié - naviguer vers la page des titres avec le bon contexte
          return `/category/${item.category_id}/subcategory/${item.subcategory_id}`;
        } else if (item.source === 'word_blocks') {
          // Titre généré - naviguer vers la page des titres avec le bon contexte
          return `/category/${item.category_id}/subcategory/${item.subcategory_id}`;
        }
        // Fallback
        return `/category/${item.category_id}/subcategory/${item.subcategory_id}`;
      
      case 'challenge':
        return `/challenge/${item.id}`;
      
      case 'account':
        // Pour les comptes, ouvrir l'URL si disponible, sinon naviguer vers la page des comptes
        if (item.account_url) {
          window.open(item.account_url, '_blank');
          return null; // Pas de navigation interne
        }
        return `/accounts`;
      
      case 'source':
        // Pour les sources, ouvrir l'URL si disponible, sinon naviguer vers la page des sources
        if (item.url) {
          window.open(item.url, '_blank');
          return null; // Pas de navigation interne
        }
        return `/sources`;
      
      case 'hook':
        // Pour les hooks, naviguer vers la page des hooks avec le bon contexte
        return `/category/${item.category_id}/subcategory/${item.subcategory_id}/hooks`;
      
      default:
        return '/';
    }
  };

  const handleProfileClick = (account: {
    id: string;
    account_name: string;
    description?: string;
    platform?: string;
    account_url?: string;
    avatar_url?: string;
    category?: string;
    subcategory?: string;
  }) => {
    const path = getNavigationPath(account, 'account');
    if (path) {
      navigate(path);
    }
  };

  const handleSourceClick = (source: {
    id: string;
    name: string;
    url: string | null;
    description: string | null;
    category?: string;
    subcategory?: string;
  }) => {
    const path = getNavigationPath(source, 'source');
    if (path) {
      navigate(path);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📷';
      case 'youtube':
        return '📺';
      case 'twitter':
        return '🐦';
      case 'facebook':
        return '📘';
      case 'linkedin':
        return '💼';
      case 'twitch':
        return '🎮';
      case 'blog':
        return '📝';
      case 'article':
        return '📄';
      default:
        return '🌐';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return 'from-pink-500 to-red-500';
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'youtube':
        return 'from-red-500 to-red-600';
      case 'twitter':
        return 'from-blue-400 to-blue-500';
      case 'facebook':
        return 'from-blue-600 to-blue-700';
      case 'linkedin':
        return 'from-blue-700 to-blue-800';
      case 'twitch':
        return 'from-purple-600 to-purple-700';
      case 'blog':
        return 'from-orange-500 to-orange-600';
      case 'article':
        return 'from-green-600 to-green-700';
      default:
        return 'from-gray-500 to-gray-600';
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
              onClick={handleBackClick} 
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
          <Button onClick={navigateBack}>
            Se connecter
          </Button>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header adapté pour mobile */}
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
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
        {/* Menu d'onglets favoris adapté pour mobile */}
        <div className="mb-3">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {FAVORITE_TABS.map(tab => {
                const isActive = selectedTab === tab.key;
                const getTabColor = (tabKey: string) => {
                  switch (tabKey) {
                    case 'categories':
                      return 'from-blue-500 to-cyan-500';
                    case 'subcategories':
                      return 'from-green-500 to-emerald-500';
                    case 'subcategories-level2':
                      return 'from-purple-500 to-pink-500';
                    case 'titles':
                      return 'from-purple-500 to-pink-500';
                    case 'comptes':
                      return 'from-orange-500 to-red-500';
                    case 'sources':
                      return 'from-indigo-500 to-purple-500';
                    case 'hooks':
                      return 'from-yellow-500 to-orange-500';
                    case 'challenges':
                      return 'from-red-500 to-pink-500';
                    default:
                      return 'from-gray-500 to-gray-600';
                  }
                };
                
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`
                      px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                      ${isActive 
                        ? 'bg-gradient-to-r ' + getTabColor(tab.key) + ' text-white shadow-lg scale-105' 
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
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Affichage conditionnel selon l'onglet sélectionné */}
        {selectedTab === 'categories' && (
          <>
            {categoriesToShow.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {categoriesToShow.map((category, index) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <div className="relative">
                      <CategoryCard
                        category={{
                          id: category.id,
                          name: category.name,
                          color: category.color
                        }}
                        index={index}
                        className="w-full h-20 sm:h-24"
                        onClick={() => {
                          const path = getNavigationPath(category, 'category');
                          if (path) navigate(path);
                        }}
                      />
                      <div
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10"
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(category.id);
                          toast({
                            title: isFavorite(category.id)
                              ? "Retiré"
                              : "Ajouté"
                          });
                        }}
                      >
                        <Heart className={isFavorite(category.id) ? 'w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500' : 'w-4 h-4 sm:w-5 sm:h-5 text-gray-300'} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de catégories en favoris
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
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Sous-catégories de niveau 1 */}
                {subcategoriesToShow.map((subcategory) => (
                  <motion.div key={`level1-${subcategory.id}`} variants={itemVariants}>
                    <div 
                      onClick={() => {
                        const path = getNavigationPath(subcategory, 'subcategory');
                        if (path) navigate(path);
                      }}
                      className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group h-20 sm:h-24 md:h-28 bg-white dark:bg-gray-800 border-2"
                      style={{ borderColor: '#270014' }}
                    >
                      {/* Icône cœur en haut à droite */}
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={e => { 
                          e.stopPropagation(); 
                          toggleSubcategoryFavorite(subcategory.id);
                          toast({
                            title: isSubcategoryFavorite(subcategory.id)
                              ? "Retiré"
                              : "Ajouté"
                          });
                        }}
                      >
                        <Heart className={isSubcategoryFavorite(subcategory.id) ? 'w-5 h-5 text-red-500 fill-red-500' : 'w-5 h-5 text-gray-300'} />
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
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de sous-catégories en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'subcategories-level2' && (
          <>
            {subcategoriesLevel2ToShow.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Sous-catégories de niveau 2 */}
                {subcategoriesLevel2ToShow.map((subcategory) => (
                  <motion.div key={`level2-${subcategory.id}`} variants={itemVariants}>
                    <div 
                      onClick={() => {
                        const path = getNavigationPath(subcategory, 'subcategory_level2');
                        if (path) navigate(path);
                      }}
                      className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group h-20 sm:h-24 md:h-28 bg-white dark:bg-gray-800 border-2"
                      style={{ borderColor: '#270014' }}
                    >
                      {/* Icône cœur en haut à droite */}
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={e => { 
                          e.stopPropagation(); 
                          toggleSubcategoryLevel2Favorite(subcategory.id);
                          toast({
                            title: isSubcategoryLevel2Favorite(subcategory.id)
                              ? "Retiré"
                              : "Ajouté"
                          });
                        }}
                      >
                        <Heart className={isSubcategoryLevel2Favorite(subcategory.id) ? 'w-5 h-5 text-red-500 fill-red-500' : 'w-5 h-5 text-gray-300'} />
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
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de sous-sous-catégories en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'titles' && (
          <>
            {titlesToShow.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {titlesToShow.map((title, index) => (
                  <motion.div 
                    key={title.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      const path = getNavigationPath(title, 'title');
                      if (path) navigate(path);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white text-base leading-relaxed">
                          {title.title}
                        </h3>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleTitleFavorite(title.id);
                            toast({
                              title: isTitleFavorite(title.id)
                                ? "Retiré"
                                : "Ajouté"
                            });
                          }}
                          className={`p-2 h-10 w-10 rounded-full transition-all duration-200 ${
                            isTitleFavorite(title.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart 
                            size={18} 
                            className={`transition-all duration-200 ${
                              isTitleFavorite(title.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent text-current'
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de titres en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'comptes' && (
          <>
            {accountsToShow.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {accountsToShow.map((account, index) => (
                  <motion.div 
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Avatar du compte */}
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={() => handleProfileClick(account)}
                          >
                            {account.avatar_url ? (
                              <img 
                                src={account.avatar_url} 
                                alt={account.account_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full rounded-full bg-gradient-to-br ${getPlatformColor(account.platform || '')} flex items-center justify-center text-white text-lg`}>
                                {getPlatformIcon(account.platform || '')}
                              </div>
                            )}
                          </div>
                          {/* Badge de plateforme */}
                          <div className="absolute -bottom-1 -right-1">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getPlatformColor(account.platform || '')} flex items-center justify-center text-white text-xs`}>
                              {getPlatformIcon(account.platform || '')}
                            </div>
                          </div>
                        </div>
                        {/* Informations du compte */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white text-base truncate">
                            {account.account_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {account.description}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleAccountFavorite(account.id);
                            toast({
                              title: isAccountFavorite(account.id)
                                ? "Retiré"
                                : "Ajouté"
                            });
                          }}
                          className="p-2 h-10 w-10 rounded-full"
                        >
                          <Heart size={18} className={isAccountFavorite(account.id) ? 'text-red-500 fill-red-500' : ''} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProfileClick(account)}
                          className="p-2 h-10 w-10 rounded-full text-blue-600 hover:text-blue-700"
                        >
                          <Search size={18} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de comptes en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'sources' && (
          <>
            {sourcesToShow.length > 0 ? (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sourcesToShow.map((source, index) => (
                  <motion.div 
                    key={source.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleSourceClick(source)}
                  >
                    <div className="space-y-2">
                      {/* URL et icône */}
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                        <Search className="w-4 h-4" />
                        <span className="truncate">{source.url || 'Lien non disponible'}</span>
                      </div>
                      
                      {/* Titre cliquable */}
                      <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {source.name || 'Source non renseignée'}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {source.description || 'Aucune description disponible.'}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSourceFavorite(source.id);
                            toast({
                              title: isSourceFavorite(source.id)
                                ? "Retiré"
                                : "Ajouté"
                            });
                          }}
                          className="p-2 h-8 w-8 rounded-full"
                        >
                          <Heart size={16} className={isSourceFavorite(source.id) ? 'text-red-500 fill-red-500' : ''} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSourceClick(source);
                          }}
                          className="p-2 h-8 w-8 rounded-full text-blue-600 hover:text-blue-700"
                        >
                          <Search size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de sources en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'hooks' && (
          <>
            {hooksToShow.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {hooksToShow.map((hook, index) => (
                  <motion.div 
                    key={hook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      const path = getNavigationPath(hook, 'hook');
                      if (path) navigate(path);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white text-base leading-relaxed">
                          {hook.title}
                        </h3>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleHookFavorite(hook.id);
                            toast({
                              title: isHookFavorite(hook.id)
                                ? "Retiré"
                                : "Ajouté"
                            });
                          }}
                          className="p-2 h-10 w-10 rounded-full"
                        >
                          <Heart size={18} className={isHookFavorite(hook.id) ? 'text-red-500 fill-red-500' : ''} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de hooks en favoris
                </p>
              </div>
            )}
          </>
        )}

        {selectedTab === 'challenges' && (
          <>
            {challengesToShow.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {challengesToShow.map((challenge, index) => (
                  <motion.div 
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      const path = getNavigationPath(challenge, 'challenge');
                      if (path) navigate(path);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white text-base leading-relaxed">
                          {challenge.title}
                        </h3>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleChallengeFavorite(challenge.id);
                            toast({
                              title: isChallengeFavorite(challenge.id)
                                ? "Retiré"
                                : "Ajouté"
                            });
                          }}
                          className="p-2 h-10 w-10 rounded-full"
                        >
                          <Heart size={18} className={isChallengeFavorite(challenge.id) ? 'text-red-500 fill-red-500' : ''} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium">Aucun favori trouvé</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Vous n'avez pas encore ajouté de challenges en favoris
                </p>
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
