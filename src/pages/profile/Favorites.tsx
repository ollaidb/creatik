import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Heart, Search } from 'lucide-react';
import { useCategoriesByTheme } from '@/hooks/useCategoriesByTheme';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import { useFavorites } from '@/hooks/useFavorites'; 
import { useAuth } from '@/hooks/useAuth';
import CategoryCard from '@/components/CategoryCard';
import SubcategoryCard from '@/components/SubcategoryCard';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
import ChallengeButton from '@/components/ChallengeButton';
import { useToast } from '@/hooks/use-toast';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { favorites: favoriteCategories, toggleFavorite, isFavorite } = useFavorites('category');
  const { favorites: favoriteSubcategories, toggleFavorite: toggleSubcategoryFavorite, isFavorite: isSubcategoryFavorite } = useFavorites('subcategory');
  const { favorites: favoriteTitles, toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavorite } = useFavorites('title');
  const { favorites: favoriteAccounts, toggleFavorite: toggleAccountFavorite, isFavorite: isAccountFavorite } = useFavorites('account');
  const { favorites: favoriteSources, toggleFavorite: toggleSourceFavorite, isFavorite: isSourceFavorite } = useFavorites('source');
  const { favorites: favoriteChallenges, toggleFavorite: toggleChallengeFavorite, isFavorite: isChallengeFavorite } = useFavorites('challenge');
  const { data: allCategories = [] } = useCategoriesByTheme('all');
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: allTitles = [] } = useContentTitles();
  const { data: allAccounts = [] } = useAccounts();
  const { data: allSources = [] } = useSources();
  const { challenges: allChallenges = [] } = usePublicChallenges();
  const { toast } = useToast();

  const categoriesToShow = allCategories.filter(cat => favoriteCategories.includes(cat.id));
  const subcategoriesToShow = allSubcategories.filter(sub => favoriteSubcategories.includes(sub.id));
  const titlesToShow = allTitles.filter(title => favoriteTitles.includes(title.id));
  const accountsToShow = allAccounts.filter(account => favoriteAccounts.includes(account.id));
  const sourcesToShow = allSources.filter(source => favoriteSources.includes(source.id));
  const challengesToShow = allChallenges.filter(challenge => favoriteChallenges.includes(challenge.id));

  // Logs de débogage
  console.log('🔍 Debug Favorites:', {
    allCategories: allCategories.length,
    favoriteCategories: favoriteCategories.length,
    categoriesToShow: categoriesToShow.length,
    allSubcategories: allSubcategories.length,
    favoriteSubcategories: favoriteSubcategories.length,
    subcategoriesToShow: subcategoriesToShow.length,
    allTitles: allTitles.length,
    favoriteTitles: favoriteTitles.length,
    titlesToShow: titlesToShow.length,
    allAccounts: allAccounts.length,
    favoriteAccounts: favoriteAccounts.length,
    accountsToShow: accountsToShow.length,
    allSources: allSources.length,
    favoriteSources: favoriteSources.length,
    sourcesToShow: sourcesToShow.length,
    allChallenges: allChallenges.length,
    favoriteChallenges: favoriteChallenges.length,
    challengesToShow: challengesToShow.length
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
    if (account.account_url) {
      window.open(account.account_url, '_blank');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Ce profil n'a pas de lien externe configuré.",
        variant: "destructive"
      });
    }
  };

  const handleSourceClick = (source: {
    id: string;
    title: string;
    url: string;
    description: string;
    category?: string;
    subcategory?: string;
  }) => {
    if (source.url) {
      window.open(source.url, '_blank');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Cette source n'a pas de lien externe configuré.",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📷';
      case 'youtube': return '📺';
      case 'twitter': return '🐦';
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      case 'pinterest': return '📌';
      case 'snapchat': return '👻';
      case 'twitch': return '🎮';
      default: return '👤';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok': return 'from-pink-500 to-red-500';
      case 'instagram': return 'from-purple-500 to-pink-500';
      case 'youtube': return 'from-red-500 to-red-600';
      case 'twitter': return 'from-blue-400 to-blue-500';
      case 'facebook': return 'from-blue-600 to-blue-700';
      case 'linkedin': return 'from-blue-700 to-blue-800';
      case 'pinterest': return 'from-red-500 to-red-600';
      case 'snapchat': return 'from-yellow-400 to-yellow-500';
      case 'twitch': return 'from-purple-600 to-purple-700';
      default: return 'from-gray-500 to-gray-600';
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
      {/* Header adapté pour mobile */}
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
          <span className="hidden sm:inline">Publier</span>
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Menu d'onglets favoris adapté pour mobile */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {FAVORITE_TABS.map(tab => {
                const isActive = selectedTab === tab.key;
                const getTabColor = (tabKey: string) => {
                  switch (tabKey) {
                    case 'categories':
                      return 'from-blue-500 to-cyan-500';
                    case 'subcategories':
                      return 'from-green-500 to-emerald-500';
                    case 'titles':
                      return 'from-purple-500 to-pink-500';
                    case 'comptes':
                      return 'from-orange-500 to-red-500';
                    case 'sources':
                      return 'from-indigo-500 to-purple-500';
                    case 'challenges':
                      return 'from-yellow-500 to-orange-500';
                    default:
                      return 'from-gray-500 to-gray-600';
                  }
                };
                
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`
                      px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px] text-center
                      ${isActive 
                        ? 'bg-gradient-to-r ' + getTabColor(tab.key) + ' text-white shadow-lg scale-105' 
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
                {categoriesToShow.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <div className="relative">
                      <CategoryCard
                        category={{
                          id: category.id,
                          name: category.name,
                          color: category.color
                        }}
                        className="w-full h-20 sm:h-24"
                        onClick={() => navigate(`/category/${category.id}/subcategories`)}
                      />
                      <div
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10"
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
                {subcategoriesToShow.map((subcategory) => (
                  <motion.div key={subcategory.id} variants={itemVariants}>
                    <div 
                      onClick={() => navigate(`/category/${subcategory.category_id}/subcategory/${subcategory.id}`)}
                      className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group h-20 sm:h-24 md:h-28 bg-white dark:bg-gray-800 border-4 border-blue-500"
                    >
                      {/* Icône cœur en haut à droite */}
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={e => { 
                          e.stopPropagation(); 
                          toggleSubcategoryFavorite(subcategory.id);
                          toast({
                            title: isSubcategoryFavorite(subcategory.id)
                              ? "Retiré des favoris"
                              : "Ajouté à vos favoris !",
                            description: isSubcategoryFavorite(subcategory.id)
                              ? "La sous-catégorie a été retirée de vos favoris."
                              : "Vous verrez cette sous-catégorie dans vos favoris.",
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
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
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
                                ? "Retiré des favoris"
                                : "Ajouté à vos favoris !",
                              description: isTitleFavorite(title.id)
                                ? "Le titre a été retiré de vos favoris."
                                : "Vous verrez ce titre dans vos favoris.",
                            });
                          }}
                          className="p-2 h-10 w-10 rounded-full"
                        >
                          <Heart size={18} className={isTitleFavorite(title.id) ? 'text-red-500 fill-red-500' : ''} />
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
                                ? "Retiré des favoris"
                                : "Ajouté à vos favoris !",
                              description: isAccountFavorite(account.id)
                                ? "Le compte a été retiré de vos favoris."
                                : "Vous verrez ce compte dans vos favoris.",
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
                        <span className="truncate">{source.url}</span>
                      </div>
                      
                      {/* Titre cliquable */}
                      <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {source.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {source.description}
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
                                ? "Retiré des favoris"
                                : "Ajouté à vos favoris !",
                              description: isSourceFavorite(source.id)
                                ? "La source a été retirée de vos favoris."
                                : "Vous verrez cette source dans vos favoris.",
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
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
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
                                ? "Retiré des favoris"
                                : "Ajouté à vos favoris !",
                              description: isChallengeFavorite(challenge.id)
                                ? "Le challenge a été retiré de vos favoris."
                                : "Vous verrez ce challenge dans vos favoris.",
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
