import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, BarChart3, Settings, CheckCircle, Clock, Star, TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';
const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedDuration, setSelectedDuration] = useState('3months');
  const {
    challenges,
    userChallenges,
    stats,
    leaderboard,
    loading,
    error,
    assignChallenge,
    completeChallenge,
    updateProgramDuration
  } = useChallenges();
  const getDurationText = (duration: string) => {
    switch (duration) {
      case '1month': return '1 mois';
      case '2months': return '2 mois';
      case '3months': return '3 mois';
      case '6months': return '6 mois';
      case '1year': return '1 an';
      default: return '3 mois';
    }
  };
  const getProgressPercentage = () => {
    if (!stats) return 0;
    const totalChallenges = challenges.length;
    if (totalChallenges === 0) return 0;
    return (stats.completed_challenges / totalChallenges) * 100;
  };
  const handleDurationChange = async (duration: string) => {
    setSelectedDuration(duration);
    const result = await updateProgramDuration(duration);
    if (result.success) {
      toast({
        title: "Durée mise à jour",
        description: `Programme configuré pour ${getDurationText(duration)}`,
      });
    }
  };
  const handleAssignChallenge = async (challengeId: string) => {
    const result = await assignChallenge(challengeId);
    if (result.error) {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };
  const handleCompleteChallenge = async (userChallengeId: string) => {
    const result = await completeChallenge(userChallengeId);
    if (result.error) {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Défis</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
              <p className="text-muted-foreground mb-4">
                Connectez-vous pour accéder à vos défis personnalisés
              </p>
              <Button onClick={() => navigate('/profile')}>
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Défis</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des défis...</p>
            </div>
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
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Défis</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Erreur</h3>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
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
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Défis</h1>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          {stats?.total_points || 0} pts
        </Badge>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {/* Sélecteur de durée */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Personnalisation du programme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Durée du programme</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="1month">1 mois</option>
                  <option value="2months">2 mois</option>
                  <option value="3months">3 mois</option>
                  <option value="6months">6 mois</option>
                  <option value="1year">1 an</option>
                </select>
              </div>
              <div className="text-sm text-muted-foreground">
                Programme actuel : <span className="font-medium">{getDurationText(selectedDuration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Menu avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="completed">Accomplis</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          {/* Onglet Défis */}
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Défis disponibles</h2>
                <Badge variant="secondary">
                  {challenges.length} défis
                </Badge>
              </div>
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <Badge variant="outline">{challenge.points} pts</Badge>
                            <Badge variant={challenge.difficulty === 'easy' ? 'default' : challenge.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                              {challenge.difficulty === 'easy' ? 'Facile' : challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{challenge.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{challenge.category}</span>
                            <span>•</span>
                            <span>Créé le {new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                            {challenge.is_daily && (
                              <>
                                <span>•</span>
                                <span className="text-blue-500">Quotidien</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAssignChallenge(challenge.id)}
                          className="ml-4"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Participer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          {/* Onglet Accomplis */}
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Défis accomplis</h2>
                <Badge variant="default" className="bg-green-500">
                  {userChallenges.filter(c => c.status === 'completed').length} accomplis
                </Badge>
              </div>
              {userChallenges.filter(c => c.status === 'completed').map((userChallenge) => (
                <motion.div
                  key={userChallenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-lg">{userChallenge.challenge?.title}</h3>
                            <Badge variant="default" className="bg-green-500">
                              +{userChallenge.points_earned} pts
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{userChallenge.challenge?.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{userChallenge.challenge?.category}</span>
                            <span>•</span>
                            <span>Accompli le {userChallenge.completed_at ? new Date(userChallenge.completed_at).toLocaleDateString('fr-FR') : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          {/* Onglet Statistiques */}
          <TabsContent value="stats" className="mt-6">
            <div className="space-y-6">
              {/* Progression générale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Progression générale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression globale</span>
                        <span>{Math.round(getProgressPercentage())}%</span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats?.total_points || 0}</div>
                        <div className="text-sm text-muted-foreground">Points totaux</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats?.completed_challenges || 0}</div>
                        <div className="text-sm text-muted-foreground">Défis accomplis</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats?.current_streak || 0}</div>
                        <div className="text-sm text-muted-foreground">Streak actuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats?.best_streak || 0}</div>
                        <div className="text-sm text-muted-foreground">Meilleur streak</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Classement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Classement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.slice(0, 10).map((entry, index) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold">Utilisateur #{entry.user_id.slice(0, 8)}</div>
                              <div className="text-sm text-muted-foreground">
                                {entry.total_points} points
                              </div>
                            </div>
                          </div>
                          <Award className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Aucun classement disponible
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Récompenses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Récompenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="font-semibold">Créateur Débutant</div>
                      <div className="text-sm text-muted-foreground">5 défis accomplis</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="font-semibold">Créateur Régulier</div>
                      <div className="text-sm text-muted-foreground">7 jours consécutifs</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="font-semibold">Créateur Expert</div>
                      <div className="text-sm text-muted-foreground">30 défis accomplis</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
export default Challenges; 