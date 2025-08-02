import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus, User, ExternalLink, Link } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';
import SubcategoryTabs from '@/components/SubcategoryTabs';
import HashtagsSection from '@/components/HashtagsSection';
import { RippleCard } from '@/components/RippleCard';
import Navigation from '@/components/Navigation';

const Titles = () => {
  const { subcategoryId, categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const { toast } = useToast();
  
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const detectedNetwork = selectedNetwork === 'all' && 
    (searchParams.toString().includes('youtube') || 
     window.location.href.includes('youtube')) 
    ? 'youtube' 
    : selectedNetwork;
  const { data: titles, isLoading: titlesLoading, refetch: refreshTitles } = useContentTitles(subcategoryId, detectedNetwork);
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(detectedNetwork);
  const { data: sources = [], isLoading: sourcesLoading } = useSources(detectedNetwork);
  
  // Filtrer les comptes selon la catégorie et sous-catégorie
  const filteredAccounts = accounts.filter(account => 
    account.category === subcategory?.category?.name && account.subcategory === subcategory?.name
  );

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

  const handleSearch = (query: string) => {
    // Logique de recherche
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  const handleLikeTitle = (titleId: string) => {
    // TODO: Implémenter la fonctionnalité de like
    toast({
      title: "Titre liké !",
      description: "Ce titre a été ajouté à tes favoris",
    });
  };

  const handleAddToChallenge = (titleId: string) => {
    // TODO: Implémenter l'ajout aux défis
    toast({
      title: "Titre ajouté !",
      description: "Ce titre a été ajouté à vos défis",
    });
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
    name: string;
    url: string | null;
    description: string | null;
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

  // Onglet Titres / Comptes / Sources / Hashtags
  const [tab, setTab] = useState<'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks'>('titres');
  
  // Gestion des favoris pour les titres, comptes et sources
  const { favorites, toggleFavorite, isFavorite } = useFavorites(
    tab === 'comptes' ? 'account' : tab === 'sources' ? 'source' : tab === 'hooks' ? 'hook' : 'title'
  );

  // Gestion du changement d'onglet
  const handleTabChange = (newTab: 'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks') => {
    if (newTab === 'hooks') {
      // Naviguer vers la page Hooks
      navigate(`/category/${categoryId}/subcategory/${subcategoryId}/hooks?network=${selectedNetwork}`);
    } else {
      setTab(newTab);
    }
  };

  // Correction du bouton retour
  const handleBack = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}/subcategories?network=${selectedNetwork}`);
    } else {
      navigate('/categories');
    }
  };

  if (subcategoryLoading || titlesLoading || accountsLoading || sourcesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/category/${subcategoryId}/subcategories?network=${selectedNetwork}`)} 
              className="p-2 h-10 w-10 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {subcategory?.name || 'Sous-catégorie'}
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
            onClick={handleBack}
            className="p-2 h-10 w-10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {subcategory?.name || 'Sous-catégorie'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {tab === 'titres' ? (titles?.length || 0) : 
               tab === 'comptes' ? (filteredAccounts?.length || 0) : 
               (filteredSources?.length || 0)} {tab === 'titres' ? 'titres' : tab === 'comptes' ? 'comptes' : 'sources'}
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
        {/* Onglets Titres / Comptes / Sources / Hashtags */}
        <SubcategoryTabs 
          activeTab={tab}
          onTabChange={handleTabChange}
          showHooks={isHooksAvailableForNetwork(detectedNetwork)}
        />
        {/* Barre de recherche intelligente */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <IntelligentSearchBar 
              onSearch={handleSearch}
              placeholder={tab === 'comptes' ? 'Rechercher un compte...' : tab === 'sources' ? 'Rechercher une source...' : 'Rechercher un titre...'}
              className="w-full"
            />
          </div>
        </div>
        {/* Affichage selon l'onglet sélectionné */}
        {tab === 'titres' && (
          // Liste des titres avec structure inspirée de la photo
          <div className="space-y-3">
            {titles
              ?.filter(t => detectedNetwork === 'all' || t.social_network_id === detectedNetwork)
              .map((title, index) => (
                <RippleCard
                  key={title.id}
                  title={title}
                  index={index}
                  isFavorite={isFavorite(title.id)}
                  onFavorite={toggleFavorite}
                  onAddToChallenge={handleAddToChallenge}
                />
              ))}
            {/* Message si pas de titres */}
            {titles?.filter(t => detectedNetwork === 'all' || t.social_network_id === detectedNetwork).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  {detectedNetwork !== 'all' 
                    ? `Aucun titre disponible pour ${getNetworkDisplayName(detectedNetwork)}`
                    : 'Aucun titre disponible pour cette sous-catégorie'
                  }
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'comptes' && (
          // Liste des comptes d'activisme
          <div className="space-y-3">
            {filteredAccounts?.map((account, index) => (
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
                          <div className={`w-full h-full rounded-full bg-gradient-to-br ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-lg`}>
                            {getPlatformIcon(account.platform)}
                          </div>
                        )}
                      </div>
                      {/* Badge de plateforme */}
                      <div className="absolute -bottom-1 -right-1">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-xs`}>
                          {getPlatformIcon(account.platform)}
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
                      onClick={() => toggleFavorite(account.id)}
                      className="p-2 h-10 w-10 rounded-full"
                    >
                      <Heart size={18} className={isFavorite(account.id) ? 'text-red-500 fill-red-500' : ''} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProfileClick(account)}
                      className="p-2 h-10 w-10 rounded-full text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink size={18} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredAccounts?.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>
                  {selectedNetwork !== 'all' 
                    ? `Aucun compte disponible pour ${getNetworkDisplayName(selectedNetwork)}`
                    : 'Aucun compte disponible pour cette sous-catégorie.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
        {tab === 'sources' && (
          // Liste des sources avec design Google
          <div className="space-y-4">
            {filteredSources?.map((source, index) => (
              <motion.div 
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleSourceClick({
                  id: source.id,
                  name: source.name,
                  url: source.url,
                  description: source.description,
                  category: undefined,
                  subcategory: undefined
                })}
              >
                <div className="space-y-2">
                  {/* URL et icône */}
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                    <Link className="w-4 h-4" />
                    <span className="truncate">{source.url}</span>
                  </div>
                  
                  {/* Titre cliquable */}
                  <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {source.name}
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
                        toggleFavorite(source.id);
                      }}
                      className="p-2 h-8 w-8 rounded-full"
                    >
                      <Heart size={16} className={isFavorite(source.id) ? 'text-red-500 fill-red-500' : ''} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSourceClick({
                          id: source.id,
                          name: source.name,
                          url: source.url,
                          description: source.description,
                          category: undefined,
                          subcategory: undefined
                        });
                      }}
                      className="p-2 h-8 w-8 rounded-full text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredSources?.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>
                  {selectedNetwork !== 'all' 
                    ? `Aucune source disponible pour ${getNetworkDisplayName(selectedNetwork)}`
                    : 'Aucune source disponible pour cette sous-catégorie.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
        {tab === 'hashtags' && (
          <HashtagsSection 
            subcategoryId={subcategoryId}
            subcategoryName={subcategory?.name}
          />
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default Titles; 