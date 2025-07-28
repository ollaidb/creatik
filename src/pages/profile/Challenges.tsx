import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, BarChart3, CheckCircle, Star, TrendingUp, Users, Award, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';

const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedDuration, setSelectedDuration] = useState('3months');
  const [contentsPerDay, setContentsPerDay] = useState(1);
  const [showDurationConfirm, setShowDurationConfirm] = useState(false);
  const [showContentsConfirm, setShowContentsConfirm] = useState(false);
  const [pendingDuration, setPendingDuration] = useState('');
  const [pendingContents, setPendingContents] = useState(0);
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

  const getDurationDays = (duration: string) => {
    switch (duration) {
      case '1month': return 30;
      case '2months': return 60;
      case '3months': return 90;
      case '6months': return 180;
      case '1year': return 365;
      default: return 90;
    }
  };

  const getTotalContents = () => {
    const days = getDurationDays(selectedDuration);
    return days * contentsPerDay;
  };

  const getRemainingContents = () => {
    const total = getTotalContents();
    const completed = stats?.completed_challenges || 0;
    return Math.max(0, total - completed);
  };

  const getProgressPercentage = () => {
    const total = getTotalContents();
    if (total === 0) return 0;
    const completed = stats?.completed_challenges || 0;
    return Math.min(100, (completed / total) * 100);
  };

  const getRemainingDays = () => {
    const totalDays = getDurationDays(selectedDuration);
    const completed = stats?.completed_challenges || 0;
    const completedDays = Math.floor(completed / contentsPerDay);
    return Math.max(0, totalDays - completedDays);
  };

  const handleDurationChange = async (duration: string) => {
    if (duration === selectedDuration) return;
    
    setPendingDuration(duration);
    setShowDurationConfirm(true);
  };

  const confirmDurationChange = async () => {
    const result = await updateProgramDuration(pendingDuration);
    if (result.success) {
      setSelectedDuration(pendingDuration);
      toast({
        title: "Durée mise à jour",
        description: `Programme configuré pour ${getDurationText(pendingDuration)}`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la durée",
        variant: "destructive",
      });
    }
    setShowDurationConfirm(false);
    setPendingDuration('');
  };

  const cancelDurationChange = () => {
    setShowDurationConfirm(false);
    setPendingDuration('');
  };

  const handleContentsPerDayChange = (newValue: number) => {
    if (newValue === contentsPerDay) return;
    
    setPendingContents(newValue);
    setShowContentsConfirm(true);
  };

  const confirmContentsChange = () => {
    setContentsPerDay(pendingContents);
    toast({
      title: "Contenus par jour mis à jour",
      description: `${pendingContents} contenu(s) par jour configuré(s)`,
    });
    setShowContentsConfirm(false);
    setPendingContents(0);
  };

  const cancelContentsChange = () => {
    setShowContentsConfirm(false);
    setPendingContents(0);
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    const result = await completeChallenge(challengeId);
    if (result.error) {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Défi accompli !",
        description: "Le défi a été marqué comme terminé",
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
        {/* Sélecteur de durée compact */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Durée du programme</h3>
            <span className="text-xs text-muted-foreground">{getDurationText(selectedDuration)}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: '1month', label: '1 mois' },
              { value: '2months', label: '2 mois' },
              { value: '3months', label: '3 mois' },
              { value: '6months', label: '6 mois' },
              { value: '1year', label: '1 an' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={selectedDuration === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleDurationChange(option.value)}
                className="whitespace-nowrap text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sélecteur de contenus par jour */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contenus par jour</h3>
            <span className="text-xs text-muted-foreground">{contentsPerDay} contenu(s)</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleContentsPerDayChange(Math.max(1, contentsPerDay - 1))}
              className="w-10 h-10 p-0"
            >
              -
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold">{contentsPerDay}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleContentsPerDayChange(contentsPerDay + 1)}
              className="w-10 h-10 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        {/* Menu avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="completed">Accomplis</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          {/* Onglet Défis */}
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex-1">{challenge.title}</h3>
                        <Button
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          size="sm"
                          variant="ghost"
                          className="ml-4 p-2"
                        >
                          <CheckCircle className="w-5 h-5" />
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
            <div className="space-y-3">
              {userChallenges.filter(c => c.status === 'completed').map((userChallenge) => (
                <motion.div
                  key={userChallenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex-1">{userChallenge.challenge?.title}</h3>
                        <Badge variant="default" className="bg-green-500">
                          +{userChallenge.points_earned} pts
                        </Badge>
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
                        <div className="text-2xl font-bold text-blue-600">{getTotalContents()}</div>
                        <div className="text-sm text-muted-foreground">Contenus totaux</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats?.completed_challenges || 0}</div>
                        <div className="text-sm text-muted-foreground">Contenus créés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{getRemainingContents()}</div>
                        <div className="text-sm text-muted-foreground">Contenus restants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{getRemainingDays()}</div>
                        <div className="text-sm text-muted-foreground">Jours restants</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Configuration actuelle</div>
                      <div className="text-xs text-muted-foreground">
                        {getDurationText(selectedDuration)} • {contentsPerDay} contenu(s) par jour • {getDurationDays(selectedDuration)} jours
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

      {/* Modal de confirmation pour la durée */}
      {showDurationConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelDurationChange}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Confirmer le changement</h3>
            <p className="text-muted-foreground mb-4">
              Êtes-vous sûr de vouloir changer la durée du programme de {getDurationText(selectedDuration)} à {getDurationText(pendingDuration)} ?
              <br />
              <span className="text-sm text-orange-600">Cette action peut affecter votre progression actuelle.</span>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelDurationChange} className="flex-1">
                Annuler
              </Button>
              <Button onClick={confirmDurationChange} className="flex-1">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour les contenus par jour */}
      {showContentsConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelContentsChange}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Confirmer le changement</h3>
            <p className="text-muted-foreground mb-4">
              Êtes-vous sûr de vouloir changer le nombre de contenus par jour de {contentsPerDay} à {pendingContents} ?
              <br />
              <span className="text-sm text-orange-600">Cette action peut affecter votre progression actuelle.</span>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelContentsChange} className="flex-1">
                Annuler
              </Button>
              <Button onClick={confirmContentsChange} className="flex-1">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Challenges; 