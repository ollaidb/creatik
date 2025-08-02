import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus, User, ExternalLink, Link } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useHooks } from '@/hooks/useHooks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import LocalSearchBar from '@/components/LocalSearchBar';
import Navigation from '@/components/Navigation';

const Hooks = () => {
  const { subcategoryId, categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const { data: hooks, isLoading: hooksLoading } = useHooks(categoryId, subcategoryId, selectedNetwork);
  
  // Utiliser directement les hooks filtrés par le hook
  const filteredHooks = hooks || [];

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
    return networkId === 'youtube';
  };

  // Logs de débogage
  console.log('🔍 Debug Hooks:', {
    selectedNetwork,
    hooks: hooks?.length || 0,
    filteredHooks: filteredHooks.length,
    hooksData: hooks?.slice(0, 3), // Afficher les 3 premiers hooks
    isAvailable: isHooksAvailableForNetwork(selectedNetwork)
  });

  const handleSearch = (query: string) => {
    // Logique de recherche
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le hook a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le hook",
        variant: "destructive",
      });
    }
  };

  const handleLikeHook = (hookId: string) => {
    // TODO: Implémenter la fonctionnalité de like
    toast({
      title: "Hook liké !",
      description: "Ce hook a été ajouté à tes favoris",
    });
  };

  const handleAddToChallenge = (hookId: string) => {
    // TODO: Implémenter l'ajout aux défis
    toast({
      title: "Hook ajouté !",
      description: "Ce hook a été ajouté à vos défis",
    });
  };

  // Gestion des favoris pour les hooks
  const { favorites, toggleFavorite, isFavorite } = useFavorites('hook');

  // Correction du bouton retour
  const handleBack = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}/subcategories`);
    } else {
      navigate('/categories');
    }
  };

  // Fonction pour obtenir l'icône et la couleur selon le réseau social
  const getNetworkStyle = (networkId: string) => {
    // Seul YouTube a des hooks
    return {
      icon: '📺',
      gradient: 'from-red-500 to-red-600',
      name: 'YouTube'
    };
  };

  const networkStyle = getNetworkStyle(selectedNetwork);

  if (subcategoryLoading || hooksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/category/${subcategoryId}/subcategories`)} 
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
              Hooks {networkStyle.name} - {subcategory?.name || 'Sous-catégorie'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredHooks?.length || 0} hooks disponibles
            </p>
            {/* Indicateur du réseau social sélectionné */}
            {selectedNetwork !== 'all' && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Réseau : {getNetworkDisplayName(selectedNetwork)}
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
              placeholder={`Rechercher un hook ${networkStyle.name}...`}
              className="w-full"
            />
          </div>
        </div>
        {/* Liste des hooks */}
        <div className="space-y-3">
          {filteredHooks?.map((hook, index) => (
            <motion.div 
              key={hook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icône hook personnalisée selon le réseau */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${networkStyle.gradient} flex items-center justify-center text-white text-lg`}>
                    {networkStyle.icon}
                  </div>
                  {/* Informations du hook */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-base truncate">
                      {hook.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {hook.description}
                    </p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(hook.title)}
                    className="p-2 h-10 w-10 rounded-full"
                  >
                    <Copy size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(hook.id)}
                    className="p-2 h-10 w-10 rounded-full"
                  >
                    <Heart size={18} className={isFavorite(hook.id) ? 'text-red-500 fill-red-500' : ''} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToChallenge(hook.id)}
                    className="p-2 h-10 w-10 rounded-full"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Message si pas de hooks */}
          {filteredHooks?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                {selectedNetwork !== 'all' 
                  ? `Aucun hook ${networkStyle.name} disponible pour ${getNetworkDisplayName(selectedNetwork)}`
                  : 'Aucun hook disponible pour cette sous-catégorie'
                }
              </div>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Hooks; 