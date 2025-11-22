import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Copy, User, Plus } from 'lucide-react';
import { useUsernameIdeas } from '@/hooks/useUsernameIdeas';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { getNetworkDisplayName } from '@/utils/networkUtils';
import LocalSearchBar from '@/components/LocalSearchBar';

const UsernameIdeas = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: usernameIdeas = [], isLoading } = useUsernameIdeas(selectedNetwork === 'all' ? undefined : selectedNetwork);
  const { data: socialNetworks } = useSocialNetworks();
  const { favorites, toggleFavorite, isFavorite } = useFavorites('username');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filtrer les pseudos selon la recherche
  const filteredIdeas = usernameIdeas.filter(idea =>
    idea.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (pseudo: string) => {
    try {
      await navigator.clipboard.writeText(pseudo);
      toast({
        title: "Pseudo copié",
        description: `"${pseudo}" a été copié dans le presse-papiers`
      });
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur copie",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (ideaId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        variant: "destructive"
      });
      return;
    }
    try {
      await toggleFavorite(ideaId);
      toast({
        title: isFavorite(ideaId) ? "Retiré des favoris" : "Ajouté aux favoris"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleNetworkChange = (networkId: string) => {
    const params = new URLSearchParams(searchParams);
    if (networkId === 'all') {
      params.delete('network');
    } else {
      params.set('network', networkId);
    }
    navigate(`/community/usernames?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/public-challenges')} 
              className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Pseudo
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/public-challenges')} 
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Pseudo
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredIdeas.length} idée{filteredIdeas.length > 1 ? 's' : ''}
            </p>
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
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <LocalSearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un pseudo..."
              className="w-full"
            />
          </div>
        </div>

        {/* Menu de filtrage par réseau social */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedNetwork === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleNetworkChange('all')}
              className="rounded-full min-w-[80px] flex-shrink-0"
            >
              Tout
            </Button>
            {socialNetworks?.map((network) => (
              <Button
                key={network.id}
                variant={selectedNetwork === network.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNetworkChange(network.id)}
                className="rounded-full min-w-[100px] flex-shrink-0"
              >
                {network.display_name}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des idées de pseudos */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Aucun pseudo trouvé pour cette recherche' 
                : selectedNetwork !== 'all'
                ? `Aucune idée de pseudo disponible pour ${getNetworkDisplayName(selectedNetwork)}`
                : 'Aucune idée de pseudo disponible'}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/publish')}
              className="mt-4"
            >
              Publier la première idée
            </Button>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredIdeas.map((idea, index) => (
              <motion.div key={idea.id} variants={itemVariants}>
                <Card className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base">
                            {idea.pseudo}
                          </h3>
                          {idea.network && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {idea.network.display_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(idea.pseudo)}
                        className="p-2 h-8 w-8"
                        title="Copier"
                      >
                        <Copy size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(idea.id)}
                        className={`p-2 h-8 w-8 transition-all duration-200 ${
                          isFavorite(idea.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-400'
                        }`}
                        title={isFavorite(idea.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart 
                          size={16} 
                          className={`transition-all duration-200 ${
                            isFavorite(idea.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'fill-transparent text-current'
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default UsernameIdeas;

