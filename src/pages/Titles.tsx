import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus, User, ExternalLink, Link } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useSubcategoryLevel2 } from '@/hooks/useSubcategoryLevel2';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useContentTitlesLevel2 } from '@/hooks/useContentTitlesLevel2';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import LocalSearchBar from '@/components/LocalSearchBar';
import SubcategoryTabs from '@/components/SubcategoryTabs';
import HashtagsSection from '@/components/HashtagsSection';
import Navigation from '@/components/Navigation';

const Titles = () => {
  const { subcategoryId, categoryId, subcategoryLevel2Id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Détecter si nous sommes dans un contexte de niveau 2
  const isLevel2 = !!subcategoryLevel2Id;
  
  // Utiliser les hooks appropriés selon le niveau
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const { data: subcategoryLevel2, isLoading: subcategoryLevel2Loading } = useSubcategoryLevel2(subcategoryLevel2Id);
  
  const detectedNetwork = selectedNetwork === 'all' && 
    (searchParams.toString().includes('youtube') || 
     window.location.href.includes('youtube')) 
    ? 'youtube' 
    : selectedNetwork;
    
  const { data: titles, isLoading: titlesLoading, refetch: refreshTitles } = useContentTitles(subcategoryId, detectedNetwork);
  const { data: titlesLevel2, isLoading: titlesLevel2Loading, refetch: refreshTitlesLevel2 } = useContentTitlesLevel2(subcategoryLevel2Id, detectedNetwork);
  
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(detectedNetwork);
  const { data: sources = [], isLoading: sourcesLoading } = useSources(detectedNetwork);
  
  // Utiliser les données appropriées selon le niveau
  const currentSubcategory = isLevel2 ? subcategoryLevel2 : subcategory;
  const currentTitles = isLevel2 ? titlesLevel2 : titles;
  const isLoading = isLevel2 ? 
    (subcategoryLevel2Loading || titlesLevel2Loading) : 
    (subcategoryLoading || titlesLoading);
  
  // Filtrer les titres par searchTerm
  const filteredTitles = currentTitles?.filter(title => 
    title.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (title.description && title.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  // Filtrer les comptes selon la catégorie et sous-catégorie
  const filteredAccounts = accounts.filter(account => {
    if (isLevel2) {
      return account.category === currentSubcategory?.subcategory?.category?.name && 
             account.subcategory === currentSubcategory?.name;
    } else {
      return account.category === currentSubcategory?.category?.name && 
             account.subcategory === currentSubcategory?.name;
    }
  });

  // Utiliser toutes les sources (pas de filtrage par catégorie/sous-catégorie)
  const filteredSources = sources;

  // Fonction pour obtenir le nom d'affichage du réseau social
  const getNetworkDisplayName = (networkId: string) => {
    switch (networkId) {
      case 'tiktok': return 'TikTok';
      case 'instagram': return 'Instagram';
      case 'youtube': return 'YouTube';
      case 'twitter': return 'Twitter';
      case 'facebook': return 'Facebook';
      case 'linkedin': return 'LinkedIn';
      case 'pinterest': return 'Pinterest';
      case 'snapchat': return 'Snapchat';
      case 'twitch': return 'Twitch';
      default: return 'Toutes les plateformes';
    }
  };

  // Vérifier si les hooks sont disponibles pour ce réseau
  const isHooksAvailableForNetwork = (networkId: string) => {
    // Les hooks ne sont disponibles que pour YouTube
    const isAvailable = networkId === 'youtube' || 
                       networkId === 'YouTube' ||
                       networkId === '550e8400-e29b-41d4-a716-446655440003' || // UUID de YouTube
                       searchParams.toString().includes('youtube') ||
                       searchParams.toString().includes('YouTube') ||
                       window.location.href.includes('youtube') ||
                       window.location.href.includes('YouTube');
    
    console.log('🔍 Debug Hooks Availability:', {
      networkId,
      isAvailable,
      selectedNetwork,
      detectedNetwork,
      urlParams: searchParams.toString(),
      currentUrl: window.location.href
    });
    
    return isAvailable;
  };

  // Logs de débogage
  console.log('🔍 Debug Titles:', {
    isLevel2,
    selectedNetwork,
    detectedNetwork,
    accounts: accounts.length,
    filteredAccounts: filteredAccounts.length,
    sources: sources.length,
    filteredSources: filteredSources.length,
    accountsData: accounts.slice(0, 3), // Afficher les 3 premiers comptes
    sourcesData: sources.slice(0, 3), // Afficher les 3 premières sources
    showHooksValue: isHooksAvailableForNetwork(detectedNetwork),
    urlParams: searchParams.toString(),
    currentUrl: window.location.href
  });

  const handleCopyTitle = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      toast({
        title: "Titre copié !",
        description: "Le titre a été copié dans votre presse-papiers.",
      });
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le titre.",
        variant: "destructive",
      });
    }
  };

  const handleLikeTitle = (titleId: string) => {
    // Logique pour liker un titre
    console.log('Liking title:', titleId);
  };

  const handleAddToChallenge = (titleId: string) => {
    // Logique pour ajouter à un challenge
    console.log('Adding to challenge:', titleId);
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
      console.log('No URL for account:', account.account_name);
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
    if (source.url) {
      window.open(source.url, '_blank');
    } else {
      console.log('No URL for source:', source.name);
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
      case 'pinterest':
        return '📌';
      case 'snapchat':
        return '👻';
      case 'twitch':
        return '🎮';
      default:
        return '🌐';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return 'bg-black text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      case 'twitter':
        return 'bg-blue-400 text-white';
      case 'facebook':
        return 'bg-blue-600 text-white';
      case 'linkedin':
        return 'bg-blue-700 text-white';
      case 'pinterest':
        return 'bg-red-500 text-white';
      case 'snapchat':
        return 'bg-yellow-400 text-black';
      case 'twitch':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const [activeTab, setActiveTab] = useState<'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks'>('titres');

  const handleTabChange = (newTab: 'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks') => {
    setActiveTab(newTab);
  };

  const handleBack = () => {
    if (isLevel2) {
      navigate(`/category/${categoryId}/subcategory/${subcategoryId}/subcategories-level2?network=${selectedNetwork}`);
    } else {
      navigate(`/category/${categoryId}/subcategories?network=${selectedNetwork}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen">
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
              onClick={handleBack} 
              className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
            onClick={handleBack} 
            className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentSubcategory?.name || 'Titres'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTitles?.length || 0} titres disponibles
            </p>
            {/* Indicateur du réseau social sélectionné */}
            {selectedNetwork !== 'all' && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {getNetworkDisplayName(selectedNetwork)}
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
        {/* Barre de recherche intelligente */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <LocalSearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher des titres..."
              className="w-full"
            />
          </div>
        </div>

        {/* Onglets */}
        <SubcategoryTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showHooks={isHooksAvailableForNetwork(detectedNetwork)}
        />

        {/* Contenu des onglets */}
        <div className="mt-6">
          {activeTab === 'titres' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredTitles.map((title, index) => (
                <motion.div key={title.id} variants={itemVariants}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                          {title.title}
                        </h3>
                        {title.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                            {title.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyTitle(title.title)}
                          className="p-2 h-8 w-8"
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeTitle(title.id)}
                          className="p-2 h-8 w-8"
                        >
                          <Heart size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'comptes' && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAccounts.map((account, index) => (
                <motion.div key={account.id} variants={itemVariants}>
                  <div 
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleProfileClick(account)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {account.avatar_url ? (
                          <img 
                            src={account.avatar_url} 
                            alt={account.account_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white font-medium text-sm truncate">
                          {account.account_name}
                        </h3>
                        {account.platform && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(account.platform)}`}>
                              {getPlatformIcon(account.platform)} {account.platform}
                            </span>
                          </div>
                        )}
                      </div>
                      {account.account_url && (
                        <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'sources' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredSources.map((source, index) => (
                <motion.div key={source.id} variants={itemVariants}>
                  <div 
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleSourceClick(source)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white font-medium text-base">
                          {source.name}
                        </h3>
                        {source.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                            {source.description}
                          </p>
                        )}
                      </div>
                      {source.url && (
                        <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-4" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'hashtags' && (
            <HashtagsSection subcategoryId={isLevel2 ? subcategoryLevel2Id : subcategoryId} />
          )}

          {activeTab === 'hooks' && isHooksAvailableForNetwork(detectedNetwork) && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Hooks disponibles pour {getNetworkDisplayName(detectedNetwork)}
              </p>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Titles; 