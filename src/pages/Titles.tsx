import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus, User, ExternalLink, Link } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useSubcategoryLevel2 } from '@/hooks/useSubcategoryLevel2';
import { useGeneratedTitles } from '@/hooks/useGeneratedTitles';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useContentTitlesLevel2 } from '@/hooks/useContentTitlesLevel2';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { useBlogs } from '@/hooks/useBlogs';
import { useArticles } from '@/hooks/useArticles';
import { useMotsCles } from '@/hooks/useMotsCles';
import { useExemples } from '@/hooks/useExemples';
import { useIdees } from '@/hooks/useIdees';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import LocalSearchBar from '@/components/LocalSearchBar';
import SubcategoryTabs from '@/components/SubcategoryTabs';
import HashtagsSection from '@/components/HashtagsSection';
import Navigation from '@/components/Navigation';

type TabType = 'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks' | 'blog' | 'article' | 'mots-cles' | 'exemple' | 'idees';

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
  
  const detectedNetwork = selectedNetwork;
  const currentSubcategoryId = isLevel2 ? subcategoryLevel2Id! : subcategoryId!;
    
  // Récupérer TOUS les types de titres
  const { 
    data: generatedTitles, 
    isLoading: generatedTitlesLoading, 
    refetch: refreshGeneratedTitles 
  } = useGeneratedTitles({
    platform: detectedNetwork,
    subcategoryId: currentSubcategoryId,
    limit: 50
  });

  // Récupérer les titres de content_titles (publiés, manuels, IA)
  const { 
    data: contentTitlesLevel2, 
    isLoading: contentTitlesLevel2Loading 
  } = useContentTitlesLevel2(subcategoryLevel2Id, detectedNetwork);

  const { 
    data: contentTitlesLevel1, 
    isLoading: contentTitlesLevel1Loading 
  } = useContentTitles(subcategoryId, detectedNetwork);

  // Utiliser les données appropriées selon le niveau
  const contentTitles = isLevel2 ? contentTitlesLevel2 : contentTitlesLevel1;
  const contentTitlesLoading = isLevel2 ? contentTitlesLevel2Loading : contentTitlesLevel1Loading;
  
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(detectedNetwork);
  const { data: sources = [], isLoading: sourcesLoading } = useSources(detectedNetwork);
  
  // Nouveaux hooks pour les nouveaux types de contenu
  const { data: blogs = [], isLoading: blogsLoading } = useBlogs(currentSubcategoryId, detectedNetwork);
  const { data: articles = [], isLoading: articlesLoading } = useArticles(currentSubcategoryId, detectedNetwork);
  const { data: motsCles = [], isLoading: motsClesLoading } = useMotsCles(currentSubcategoryId, detectedNetwork);
  const { data: exemples = [], isLoading: exemplesLoading } = useExemples(currentSubcategoryId, detectedNetwork);
  const { data: idees = [], isLoading: ideesLoading } = useIdees(currentSubcategoryId, detectedNetwork);
  
  // Utiliser les données appropriées selon le niveau
  const currentSubcategory = isLevel2 ? subcategoryLevel2 : subcategory;
  const isLoading = isLevel2 ? 
    (subcategoryLevel2Loading || generatedTitlesLoading || contentTitlesLoading) : 
    (subcategoryLoading || generatedTitlesLoading || contentTitlesLoading);
  
  // Hooks pour les favoris
  const { favorites: titleFavorites, toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavorite } = useFavorites('title');
  const { favorites: accountFavorites, toggleFavorite: toggleAccountFavorite, isFavorite: isAccountFavorite } = useFavorites('account');
  const { favorites: sourceFavorites, toggleFavorite: toggleSourceFavorite, isFavorite: isSourceFavorite } = useFavorites('source');
  const { favorites: blogFavorites, toggleFavorite: toggleBlogFavorite, isFavorite: isBlogFavorite } = useFavorites('blog');
  const { favorites: articleFavorites, toggleFavorite: toggleArticleFavorite, isFavorite: isArticleFavorite } = useFavorites('article');
  const { favorites: motsClesFavorites, toggleFavorite: toggleMotsClesFavorite, isFavorite: isMotsClesFavorite } = useFavorites('mots-cles');
  const { favorites: exempleFavorites, toggleFavorite: toggleExempleFavorite, isFavorite: isExempleFavorite } = useFavorites('exemple');
  const { favorites: ideeFavorites, toggleFavorite: toggleIdeeFavorite, isFavorite: isIdeeFavorite } = useFavorites('idee');
  
  // Combiner tous les types de titres
  const allTitles = [
    // Titres générés avec les mots de la base de données
    ...(generatedTitles || []).map(title => ({
      ...title,
      type: 'generated',
      source: 'word_blocks'
    })),
    // Titres de content_titles (publiés, manuels, IA)
    ...(contentTitles || []).map(title => ({
      ...title,
      type: 'content',
      source: 'content_titles',
      usage_count: 0, // Valeur par défaut pour les titres content
      generation_date: title.created_at || new Date().toISOString()
    }))
  ];
  
  // Filtrer les titres par searchTerm
  const filteredTitles = allTitles.filter(title => 
    title.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  // Filtrer les sources selon la catégorie et sous-catégorie
  const filteredSources = sources.filter(source => {
    // Pour l'instant, on affiche toutes les sources car les propriétés category/subcategory n'existent pas
    // TODO: Implémenter le filtrage quand la structure sera mise à jour
    return true;
  });

  // Fonction pour obtenir le nom d'affichage du réseau social
  const getNetworkDisplayName = (networkId: string) => {
    switch (networkId) {
      case 'tiktok': return 'TikTok';
      case 'instagram': return 'Instagram';
      case 'youtube': return 'YouTube';
      case 'twitter': return 'Twitter';
      case 'facebook': return 'Facebook';
      case 'linkedin': return 'LinkedIn';
      case 'twitch': return 'Twitch';
      case 'blog': return 'Blog';
      case 'article': return 'Article';
      default: return 'Toutes les plateformes';
    }
  };

  // Fonction pour obtenir le type de titre
  const getTitleType = (title: { type?: string; source?: string }) => {
    if (title.type === 'generated') {
      return 'Généré avec IA';
    } else if (title.type === 'content') {
      return 'Titre publié';
    }
    return 'Titre disponible';
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
    generatedTitles: generatedTitles?.length || 0,
    contentTitles: contentTitles?.length || 0,
    allTitles: allTitles.length,
    filteredTitles: filteredTitles.length,
    accounts: accounts.length,
    filteredAccounts: filteredAccounts.length,
    sources: sources.length,
    filteredSources: filteredSources.length,
    blogs: blogs.length,
    articles: articles.length,
    motsCles: motsCles.length,
    exemples: exemples.length,
    idees: idees.length,
    showHooksValue: isHooksAvailableForNetwork(detectedNetwork),
    urlParams: searchParams.toString(),
    currentUrl: window.location.href
  });

  const handleCopyTitle = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      toast({
        title: "Titre copié"
      });
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur copie",
        variant: "destructive",
      });
    }
  };

  const handleLikeTitle = async (titleId: string) => {
    try {
      await toggleTitleFavorite(titleId);
      toast({
        title: isTitleFavorite(titleId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeAccount = async (accountId: string) => {
    try {
      await toggleAccountFavorite(accountId);
      toast({
        title: isAccountFavorite(accountId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeSource = async (sourceId: string) => {
    try {
      await toggleSourceFavorite(sourceId);
      toast({
        title: isSourceFavorite(sourceId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeBlog = async (blogId: string) => {
    try {
      await toggleBlogFavorite(blogId);
      toast({
        title: isBlogFavorite(blogId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeArticle = async (articleId: string) => {
    try {
      await toggleArticleFavorite(articleId);
      toast({
        title: isArticleFavorite(articleId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeMotsCles = async (motsClesId: string) => {
    try {
      await toggleMotsClesFavorite(motsClesId);
      toast({
        title: isMotsClesFavorite(motsClesId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeExemple = async (exempleId: string) => {
    try {
      await toggleExempleFavorite(exempleId);
      toast({
        title: isExempleFavorite(exempleId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleLikeIdee = async (ideeId: string) => {
    try {
      await toggleIdeeFavorite(ideeId);
      toast({
        title: isIdeeFavorite(ideeId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
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
      case 'twitch':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>('titres');

  const handleTabChange = (newTab: TabType) => {
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
              {filteredTitles.length} titres disponibles
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
              placeholder="Rechercher tous les titres..."
              className="w-full"
            />
          </div>
        </div>

        {/* Onglets */}
        <SubcategoryTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showHooks={isHooksAvailableForNetwork(detectedNetwork)}
          selectedNetwork={selectedNetwork}
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
              {filteredTitles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun titre disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Les titres incluent les titres publiés, manuels, générés par IA et avec les mots de la base de données.
                  </p>
                </div>
              ) : (
                filteredTitles.map((title, index) => (
                  <motion.div key={`${title.type}-${title.id}`} variants={itemVariants}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                          {title.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                            onClick={() => handleAddToChallenge(title.id)}
                          className="p-2 h-8 w-8"
                        >
                            <Plus size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeTitle(title.id)}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isTitleFavorite(title.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart 
                            size={16} 
                            className={`transition-all duration-200 ${
                              isTitleFavorite(title.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent text-current'
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeAccount(account.id);
                          }}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isAccountFavorite(account.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart 
                            size={16} 
                            className={`transition-all duration-200 ${
                              isAccountFavorite(account.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent text-current'
                            }`}
                          />
                        </Button>
                        {account.account_url && (
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                      </div>
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeSource(source.id);
                          }}
                          className={`p-2 h-8 w-8 transition-all duration-200 ${
                            isSourceFavorite(source.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart 
                            size={16} 
                            className={`transition-all duration-200 ${
                              isSourceFavorite(source.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent text-current'
                            }`}
                          />
                        </Button>
                        {source.url && (
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun blog disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <motion.div key={blog.id} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {blog.title}
                          </h3>
                          {blog.content && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {blog.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeBlog(blog.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isBlogFavorite(blog.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isBlogFavorite(blog.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'article' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun article disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                </div>
              ) : (
                articles.map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {article.title}
                          </h3>
                          {article.content && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {article.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeArticle(article.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isArticleFavorite(article.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isArticleFavorite(article.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'mots-cles' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {motsCles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun mot-clé disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                </div>
              ) : (
                motsCles.map((motsCle) => (
                  <motion.div key={motsCle.id} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {motsCle.title}
                          </h3>
                          {motsCle.content && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {motsCle.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeMotsCles(motsCle.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isMotsClesFavorite(motsCle.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isMotsClesFavorite(motsCle.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'exemple' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {exemples.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun exemple disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                </div>
              ) : (
                exemples.map((exemple) => (
                  <motion.div key={exemple.id} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {exemple.title}
                          </h3>
                          {exemple.content && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {exemple.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeExemple(exemple.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isExempleFavorite(exemple.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isExempleFavorite(exemple.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'idees' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {idees.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucune idée disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                </div>
              ) : (
                idees.map((idee) => (
                  <motion.div key={idee.id} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {idee.title}
                          </h3>
                          {idee.content && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              {idee.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeIdee(idee.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isIdeeFavorite(idee.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isIdeeFavorite(idee.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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