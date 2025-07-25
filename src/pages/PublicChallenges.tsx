import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, Target, Plus, User, Clock, Star } from 'lucide-react';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
const PublicChallenges = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  // Déterminer si on affiche seulement les challenges likés
  const filterLikedOnly = searchParams.get('filter') === 'liked';
  const { challenges, loading, error, toggleLike, addToPersonalChallenges } = usePublicChallenges(filterLikedOnly);
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
  const getCreatorName = (creator: any) => {
    if (!creator) return 'Utilisateur';
    const firstName = creator.user_metadata?.first_name;
    const lastName = creator.user_metadata?.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'Utilisateur';
  };
  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Challenges Likés' : 'Challenges Publics'}
          </h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </main>
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
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Challenges Likés' : 'Challenges Publics'}
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
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {filterLikedOnly ? 'Mes Challenges Likés' : 'Challenges Publics'}
          </h1>
        </div>
        {user && (
          <Button 
            onClick={() => navigate('/publish')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publier un Challenge
          </Button>
        )}
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {challenges.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {filterLikedOnly ? 'Aucun challenge liké' : 'Aucun challenge public'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filterLikedOnly 
                  ? 'Vous n\'avez pas encore liké de challenges. Explorez les challenges publics !'
                  : 'Soyez le premier à publier un challenge !'
                }
              </p>
              {!filterLikedOnly && user && (
                <Button onClick={() => navigate('/publish')}>
                  Publier un Challenge
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={challenge.creator?.user_metadata?.avatar_url} />
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {getCreatorName(challenge.creator)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(challenge.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {getDifficultyText(challenge.difficulty)}
                        </Badge>
                        <Badge variant="secondary">
                          {challenge.points} pts
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{challenge.duration_days} jour{challenge.duration_days > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{challenge.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(challenge.id)}
                          className={`flex items-center gap-1 ${
                            challenge.is_liked ? 'text-red-500' : 'text-muted-foreground'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${challenge.is_liked ? 'fill-current' : ''}`} />
                          <span>{challenge.likes_count}</span>
                        </Button>
                        {user && (
                          <Button
                            size="sm"
                            onClick={() => addToPersonalChallenges(challenge.id)}
                            className="flex items-center gap-1"
                          >
                            <Target className="w-4 h-4" />
                            Ajouter
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default PublicChallenges; 