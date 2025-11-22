import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, User, Plus, Clock, Star, Calendar, ChevronDown, ChevronUp, MessageCircle, Target } from 'lucide-react';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileService, type UserSocialAccount, type UserSocialPost, type UserContentPlaylist } from '@/services/userProfileService';
import { SelectNetworkPlaylistModal } from '@/components/modals/SelectNetworkPlaylistModal';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { getNetworkDisplayName } from '@/utils/networkUtils';
import LocalSearchBar from '@/components/LocalSearchBar';

interface PublicChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  duration_days: number;
  is_daily: boolean;
  is_active: boolean;
  created_by: string;
  likes_count: number;
  category_id?: string;
  subcategory_id?: string;
  challenge_type?: string;
  status?: string;
  platform?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    };
  };
}

const CommunityAccounts = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const [expandedChallenges, setExpandedChallenges] = useState<Set<string>>(new Set());
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<{ title: string; challengeId: string } | null>(null);
  const [creatorsInfo, setCreatorsInfo] = useState<Record<string, {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    email?: string;
  }>>({});
  
  const filterLikedOnly = searchParams.get('filter') === 'liked';
  const { challenges, loading, error, addToPersonalChallenges } = usePublicChallenges(filterLikedOnly);
  const { data: socialNetworks } = useSocialNetworks();
  const { favorites: favoriteChallenges, toggleFavorite, isFavorite } = useFavorites('challenge');

  // Charger les comptes sociaux et les playlists de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setSocialAccounts([]);
        setPlaylists([]);
        return;
      }
      
      try {
        const [accounts, userPlaylists] = await Promise.all([
          UserProfileService.getSocialAccounts(user.id),
          UserProfileService.getPlaylists(user.id)
        ]);
        setSocialAccounts(accounts);
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    
    loadUserData();
  }, [user]);

  // Charger les informations des créateurs
  useEffect(() => {
    const loadCreatorsInfo = async () => {
      if (!challenges || challenges.length === 0) return;

      // Récupérer tous les IDs uniques des créateurs
      const creatorIds = [...new Set(challenges.map(c => c.created_by).filter(Boolean))];
      
      if (creatorIds.length === 0) return;

      try {
        // Charger tous les profils des créateurs en une seule requête
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', creatorIds);

        if (!profilesError && profilesData) {
          // Créer un objet map avec l'ID comme clé
          const infoMap: Record<string, {
            first_name?: string;
            last_name?: string;
            avatar_url?: string;
            email?: string;
          }> = {};
          
          profilesData.forEach(profile => {
            infoMap[profile.id] = {
              first_name: profile.first_name || undefined,
              last_name: profile.last_name || undefined,
              avatar_url: profile.avatar_url || undefined,
              email: profile.email || undefined
            };
          });
          
          setCreatorsInfo(infoMap);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations des créateurs:', error);
      }
    };

    loadCreatorsInfo();
  }, [challenges]);

  // Filtrer les challenges de type "account" et par réseau social
  const accountChallenges = challenges.filter(challenge => {
    const matchesType = challenge.challenge_type === 'account';
    const matchesNetwork = selectedNetwork === 'all' || challenge.platform === selectedNetwork;
    const matchesSearch = !searchTerm || challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesNetwork && matchesSearch;
  });

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

  const handleNetworkChange = (networkId: string) => {
    const params = new URLSearchParams(searchParams);
    if (networkId === 'all') {
      params.delete('network');
    } else {
      params.set('network', networkId);
    }
    navigate(`/community/accounts?${params.toString()}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return 'Moyen';
    }
  };

  const getCreatorName = (challenge: PublicChallenge) => {
    // Si on a les informations du créateur dans notre état
    if (challenge.created_by && creatorsInfo[challenge.created_by]) {
      const creatorInfo = creatorsInfo[challenge.created_by];
      const firstName = creatorInfo.first_name;
      const lastName = creatorInfo.last_name;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      if (creatorInfo.email) return creatorInfo.email.split('@')[0];
      return 'Utilisateur';
    }
    
    // Fallback vers les informations du creator si disponibles
    if (challenge.creator) {
      const firstName = challenge.creator.user_metadata?.first_name;
      const lastName = challenge.creator.user_metadata?.last_name;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      if (challenge.creator.email) return challenge.creator.email.split('@')[0];
    }
    
    return 'Utilisateur';
  };

  const getCreatorAvatar = (challenge: PublicChallenge) => {
    // Si on a les informations du créateur dans notre état
    if (challenge.created_by && creatorsInfo[challenge.created_by]) {
      return creatorsInfo[challenge.created_by].avatar_url;
    }
    
    // Fallback vers les informations du creator si disponibles
    if (challenge.creator) {
      return (challenge.creator.user_metadata as { avatar_url?: string })?.avatar_url;
    }
    
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleExpanded = (challengeId: string) => {
    const newExpanded = new Set(expandedChallenges);
    if (newExpanded.has(challengeId)) {
      newExpanded.delete(challengeId);
    } else {
      newExpanded.add(challengeId);
    }
    setExpandedChallenges(newExpanded);
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // Fonction pour ouvrir la modale de sélection réseau/playlist
  const handleAddToPublications = (challenge: PublicChallenge) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des publications",
        variant: "destructive",
      });
      return;
    }

    if (socialAccounts.length === 0) {
      toast({
        title: "Aucun réseau social",
        description: "Vous devez d'abord ajouter un réseau social dans votre profil",
        variant: "destructive",
      });
      return;
    }

    // Ouvrir la modale de sélection
    setSelectedChallenge({ title: challenge.title, challengeId: challenge.id });
    setIsSelectModalOpen(true);
  };

  // Fonction pour confirmer l'ajout avec réseau et playlist sélectionnés
  const handleConfirmAddToPublications = async (socialAccountId: string, playlistId?: string) => {
    if (!user || !selectedChallenge) return;

    try {
      const publicationData: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        social_account_id: socialAccountId,
        title: selectedChallenge.title,
        content: undefined,
        status: 'draft',
        scheduled_date: undefined,
        published_date: undefined,
        engagement_data: null
      };

      const newPost = await UserProfileService.addSocialPost(publicationData);
      
      // Ajouter à la playlist si sélectionnée
      if (playlistId) {
        await UserProfileService.addPostToPlaylist(playlistId, newPost.id);
      }

      toast({
        title: "Ajouté",
        description: "Le contenu a été ajouté à vos publications",
      });
      
      setSelectedChallenge(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contenu aux publications",
        variant: "destructive",
      });
    }
  };

  const renderChallengeCard = (challenge: PublicChallenge) => (
    <motion.div
      key={challenge.id}
      variants={itemVariants}
    >
      <Card 
        className="hover:shadow-lg transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02]"
        onClick={() => navigate(`/community/account/${challenge.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                <AvatarImage src={getCreatorAvatar(challenge) || (challenge.creator?.user_metadata as { avatar_url?: string })?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                  {getCreatorName(challenge).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">
                    {getCreatorName(challenge)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(challenge.created_at)}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(challenge.id);
              }}
              className="p-1 h-auto"
            >
              {expandedChallenges.has(challenge.id) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          <CardTitle className="text-lg mb-2 text-gray-900 dark:text-gray-100">
            {challenge.title}
          </CardTitle>

          <div className="mb-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {expandedChallenges.has(challenge.id) 
                ? challenge.description 
                : truncateDescription(challenge.description, 80)
              }
            </p>
            {challenge.description.length > 80 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(challenge.id);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto mt-1"
              >
                {expandedChallenges.has(challenge.id) ? 'Voir moins' : 'Lire plus'}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToPublications(challenge);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary"
                  title="Ajouter aux publications"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-blue-600"
              >
                <MessageCircle className="w-3 h-3" />
                Commenter
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(challenge.id);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 text-xs text-muted-foreground hover:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:scale-95"
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${
                  isFavorite(challenge.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-muted-foreground hover:text-red-500'
                }`} />
                <span>{challenge.likes_count || 0}</span>
              </Button>
            </div>
          </div>

          {expandedChallenges.has(challenge.id) && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{challenge.duration_days} jour{challenge.duration_days > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{challenge.points} points</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{getDifficultyText(challenge.difficulty)}</span>
                </div>
                {challenge.platform && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{challenge.platform}</span>
                  </div>
                )}
              </div>
              
              {challenge.tags && challenge.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {challenge.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateBack()} 
              className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Compte
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

  if (error) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateBack()} 
              className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Compte
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
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
            onClick={() => navigateBack()} 
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Compte
            </h1>
            <p className="text-sm text-muted-foreground">
              {accountChallenges.length} compte{accountChallenges.length > 1 ? 's' : ''}
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
              placeholder="Rechercher un compte..."
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
                variant={selectedNetwork === network.name || selectedNetwork === network.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNetworkChange(network.name)}
                className="rounded-full min-w-[100px] flex-shrink-0"
              >
                {network.display_name}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des comptes */}
        {accountChallenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Aucun compte trouvé pour cette recherche' 
                : selectedNetwork !== 'all'
                ? `Aucun compte disponible pour ${getNetworkDisplayName(selectedNetwork)}`
                : 'Aucun compte disponible'}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/publish')}
              className="mt-4"
            >
              Publier le premier compte
            </Button>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {accountChallenges.map((challenge) => renderChallengeCard(challenge))}
          </motion.div>
        )}
      </div>
      
      {/* Modale de sélection réseau/playlist */}
      {selectedChallenge && user && (
        <SelectNetworkPlaylistModal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedChallenge(null);
          }}
          onConfirm={handleConfirmAddToPublications}
          userId={user.id}
          socialAccounts={socialAccounts}
          playlists={playlists}
          title={selectedChallenge.title}
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default CommunityAccounts;

