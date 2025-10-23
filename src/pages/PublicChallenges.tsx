import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Target, Plus, User, Clock, Star, Calendar, Trophy, Eye, ChevronDown, ChevronUp, MessageCircle, ThumbsUp } from 'lucide-react';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

// Type pour les challenges publics
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

const PublicChallenges = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { favorites: favoriteChallenges, toggleFavorite, isFavorite } = useFavorites('challenge');
  const [expandedChallenges, setExpandedChallenges] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('content');
  
  // Déterminer si on affiche seulement les challenges likés
  const filterLikedOnly = searchParams.get('filter') === 'liked';
  const { challenges, loading, error, addToPersonalChallenges } = usePublicChallenges(filterLikedOnly);

  // Récupérer le paramètre de retour
  const returnTo = searchParams.get('returnTo') || 'profile';

  // Filtrer les challenges selon le type
  const contentChallenges = challenges.filter(challenge => 
    challenge.challenge_type === 'content' || !challenge.challenge_type
  );
  const accountChallenges = challenges.filter(challenge => 
    challenge.challenge_type === 'account'
  );

  const handleBackClick = () => {
    if (returnTo === 'home') {
      navigate('/');
    } else {
      navigateBack();
    }
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

  const getCreatorName = (creator: {
    id: string;
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    };
  } | null) => {
    if (!creator) return 'Utilisateur';
    const firstName = creator.user_metadata?.first_name;
    const lastName = creator.user_metadata?.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'Utilisateur';
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

  const renderChallengeCard = (challenge: PublicChallenge, isAccountType: boolean = false) => (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 cursor-pointer hover:scale-[1.02]"
        onClick={() => navigate(`/challenge/${challenge.id}`)}
      >
        <CardContent className="p-4">
          {/* En-tête avec type de challenge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                <AvatarImage src={(challenge.creator?.user_metadata as { avatar_url?: string })?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">
                    {getCreatorName(challenge.creator)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {isAccountType ? 'Compte' : 'Contenu'}
                  </Badge>
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
                e.stopPropagation(); // Empêcher la navigation de la carte
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

          {/* Titre du challenge */}
          <CardTitle className="text-lg mb-2 text-gray-900 dark:text-gray-100">
            {challenge.title}
          </CardTitle>

          {/* Description avec système "Lire plus" */}
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
                            e.stopPropagation(); // Empêcher la navigation de la carte
                            toggleExpanded(challenge.id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto mt-1"
                        >
                          {expandedChallenges.has(challenge.id) ? 'Voir moins' : 'Lire plus'}
                        </Button>
            )}
          </div>

          {/* Actions principales */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher la navigation de la carte
                    addToPersonalChallenges(challenge.id);
                  }}
                  className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 text-xs px-3 py-1"
                >
                  <Plus className="w-3 h-3" />
                  Défi
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Empêcher la navigation de la carte
                  // Ici tu pourras ajouter une action spécifique si besoin
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
                            e.stopPropagation(); // Empêcher la navigation de la carte
                            toggleFavorite(challenge.id);
                          }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 text-xs ${
                            isFavorite(challenge.id) 
                              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                              : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                        >
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite(challenge.id) ? 'fill-current' : ''}`} />
                          <span>{challenge.likes_count || 0}</span>
                        </Button>
            </div>
          </div>

          {/* Détails supplémentaires (affichés seulement si développé) */}
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
              
              {/* Tags si disponibles */}
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
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Communautés Likées' : 'Communauté'}
          </h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Communautés Likées' : 'Communauté'}
          </h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Communautés Likées' : 'Communauté'}
          </h1>
        </div>
        {user && (
          <Button 
            onClick={() => navigate('/publish')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publier
          </Button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Contenu ({contentChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Comptes ({accountChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {contentChallenges.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun challenge de contenu</h3>
                  <p className="text-muted-foreground mb-4">
                    Soyez le premier à publier un challenge de contenu !
                  </p>
                  {user && (
                    <Button onClick={() => navigate('/publish')}>
                      Publier
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              contentChallenges.map(challenge => renderChallengeCard(challenge, false))
            )}
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            {accountChallenges.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun challenge de compte</h3>
                  <p className="text-muted-foreground mb-4">
                    Soyez le premier à publier un challenge de compte !
                  </p>
                  {user && (
                    <Button onClick={() => navigate('/publish')}>
                      Publier
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              accountChallenges.map(challenge => renderChallengeCard(challenge, true))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Navigation />
    </div>
  );
};

export default PublicChallenges; 