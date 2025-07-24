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
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

interface ChallengeStats {
  totalPoints: number;
  completedChallenges: number;
  currentStreak: number;
  bestStreak: number;
  rank: number;
  totalUsers: number;
}

const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedDuration, setSelectedDuration] = useState('3months');

  // États pour les défis
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Créer un titre viral sur "Astuces de vie"',
      description: 'Proposez un titre qui pourrait devenir viral dans la catégorie Astuces de vie',
      category: 'Titre',
      points: 50,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Proposer une nouvelle sous-catégorie',
      description: 'Créez une sous-catégorie innovante pour enrichir notre bibliothèque',
      category: 'Sous-catégorie',
      points: 75,
      completed: true,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '3',
      title: 'Créer 5 titres pour "Motivation"',
      description: 'Générez 5 titres inspirants pour la catégorie Motivation',
      category: 'Titre',
      points: 100,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Statistiques simulées
  const [stats] = useState<ChallengeStats>({
    totalPoints: 1250,
    completedChallenges: 8,
    currentStreak: 5,
    bestStreak: 12,
    rank: 15,
    totalUsers: 234
  });

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true, completedAt: new Date().toISOString() }
        : challenge
    ));
    
    toast({
      title: "Défi accompli !",
      description: "Félicitations ! Vous avez gagné des points.",
    });
  };

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
    const completed = challenges.filter(c => c.completed).length;
    return (completed / challenges.length) * 100;
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
          {stats.totalPoints} pts
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
                  onChange={(e) => setSelectedDuration(e.target.value)}
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
                <h2 className="text-lg font-semibold">Défis en cours</h2>
                <Badge variant="secondary">
                  {challenges.filter(c => !c.completed).length} restants
                </Badge>
              </div>
              
              {challenges.filter(c => !c.completed).map((challenge) => (
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
                          </div>
                          <p className="text-muted-foreground mb-3">{challenge.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{challenge.category}</span>
                            <span>•</span>
                            <span>Créé le {new Date(challenge.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          className="ml-4"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accomplir
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
                  {challenges.filter(c => c.completed).length} accomplis
                </Badge>
              </div>
              
              {challenges.filter(c => c.completed).map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <Badge variant="default" className="bg-green-500">
                              +{challenge.points} pts
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{challenge.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{challenge.category}</span>
                            <span>•</span>
                            <span>Accompli le {challenge.completedAt ? new Date(challenge.completedAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
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
                        <div className="text-2xl font-bold text-blue-600">{stats.totalPoints}</div>
                        <div className="text-sm text-muted-foreground">Points totaux</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.completedChallenges}</div>
                        <div className="text-sm text-muted-foreground">Défis accomplis</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                        <div className="text-sm text-muted-foreground">Streak actuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.bestStreak}</div>
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
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        {stats.rank}
                      </div>
                      <div>
                        <div className="font-semibold">Votre position</div>
                        <div className="text-sm text-muted-foreground">
                          {stats.rank}e sur {stats.totalUsers} utilisateurs
                        </div>
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500" />
                  </div>
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