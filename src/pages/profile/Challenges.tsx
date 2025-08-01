import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Target, BarChart3, CheckCircle, Star, TrendingUp, Users, Award, Calendar, Square, Plus, Edit, Save, X, Trash2, GripVertical, CheckSquare, Circle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
  
  // États pour l'édition et le drag & drop
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [reorderedChallenges, setReorderedChallenges] = useState<typeof challenges>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [isEditModeChallenges, setIsEditModeChallenges] = useState(false);
  const [isEditModeCompleted, setIsEditModeCompleted] = useState(false);
  const [isEditModeTrash, setIsEditModeTrash] = useState(false);
  const [challengesToDelete, setChallengesToDelete] = useState<Set<string>>(new Set());
  const {
    challenges,
    userChallenges,
    deletedChallenges,
    stats,
    leaderboard,
    loading,
    error,
    addChallenge,
    completeChallenge,
    deleteChallenge,
    updateChallengeTitle,
    restoreChallenge,
    reorderChallenges,
    updateProgramDuration,
    restoreDeletedChallenge,
    permanentlyDeleteChallenge
  } = useChallenges();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [challengeToRestore, setChallengeToRestore] = useState<string | null>(null);
  const [restoreType, setRestoreType] = useState<'completed' | 'pending'>('pending');
  const [showRestoreOptions, setShowRestoreOptions] = useState(false);
  const [challengeToRestoreOptions, setChallengeToRestoreOptions] = useState<string | null>(null);

  // État pour les défis en cours de validation
  const [validatingChallenges, setValidatingChallenges] = useState<Set<string>>(new Set());

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
        description: "",
      });
    } else {
      toast({
        title: "Erreur",
        description: "",
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
      description: "",
    });
    setShowContentsConfirm(false);
    setPendingContents(0);
  };

  const cancelContentsChange = () => {
    setShowContentsConfirm(false);
    setPendingContents(0);
  };

  // Fonction améliorée pour valider un défi
  const handleCompleteChallenge = async (id) => {
    // Marquer comme en cours de validation
    setValidatingChallenges(prev => new Set([...prev, id]));

    const now = new Date().toISOString();

    // Étape 2 – Mise à jour en base via le hook
    try {
      // Utiliser la fonction du hook pour la persistance
      const result = await completeChallenge(id);
      
      if (result?.error) {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
        // Retirer de la validation en cours en cas d'erreur
        setValidatingChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
    } else {
        // Attendre 1.5 secondes avant de retirer de la validation pour voir le feedback
        setTimeout(() => {
          setValidatingChallenges(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 1500); // Réduit à 1.5 secondes

      toast({
        title: "Défi accompli !",
          description: "",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "",
        variant: "destructive",
      });
      // Retirer de la validation en cours en cas d'erreur
      setValidatingChallenges(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Fonctions pour l'édition par long press
  const handleLongPressStart = (challengeId: string, title: string) => {
    const timer = setTimeout(() => {
      setEditingChallengeId(challengeId);
      setEditingTitle(title);
      // Vibration feedback (si supporté)
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      toast({
        title: "Mode édition activé",
        description: "Vous pouvez maintenant modifier le titre",
      });
    }, 2000); // 2 secondes de long press
    
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingChallengeId || !editingTitle.trim()) return;
    
    const result = await updateChallengeTitle(editingChallengeId, editingTitle.trim());
    if (result?.error) {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    } else {
    toast({
      title: "Modification sauvegardée",
    });
      // Revenir en mode normal après modification
      setIsEditModeChallenges(false);
      setChallengesToDelete(new Set());
    }
    
    setEditingChallengeId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingChallengeId(null);
    setEditingTitle('');
    // Revenir en mode normal après annulation
    setIsEditModeChallenges(false);
    setChallengesToDelete(new Set());
  };

  // Fonction pour le drag & drop
  const handleReorder = (newOrder: typeof challenges) => {
    reorderChallenges(newOrder);
    setReorderedChallenges(newOrder);
    toast({
      title: "Ordre mis à jour",
      description: "",
    });
    // Revenir en mode normal après réorganisation
    setIsEditModeChallenges(false);
    setChallengesToDelete(new Set());
    setEditingChallengeId(null);
    setEditingTitle('');
  };

  // Fonction pour activer/désactiver le mode édition
  const toggleEditMode = () => {
    setIsEditModeChallenges(!isEditModeChallenges);
    if (!isEditModeChallenges) {
      setChallengesToDelete(new Set());
      setEditingChallengeId(null);
      setEditingTitle('');
    }
  };

  // Fonction pour activer/désactiver le mode édition des accomplis
  const toggleEditModeCompleted = () => {
    console.log('toggleEditModeCompleted called, current activeTab:', activeTab);
    setIsEditModeCompleted(!isEditModeCompleted);
    if (!isEditModeCompleted) {
      setChallengesToDelete(new Set());
      setEditingChallengeId(null);
      setEditingTitle('');
    }
  };

  // Fonction pour activer/désactiver le mode édition de la corbeille
  const toggleEditModeTrash = () => {
    setIsEditModeTrash(!isEditModeTrash);
    if (!isEditModeTrash) {
      setChallengesToDelete(new Set());
      setEditingChallengeId(null);
      setEditingTitle('');
    }
  };

  // Fonction pour supprimer un défi
  const handleDeleteChallenge = (challengeId: string) => {
    setChallengeToDelete(challengeId);
    setShowDeleteConfirm(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteChallenge = async () => {
    if (!challengeToDelete) return;

    try {
      // Si on est dans l'onglet corbeille, supprimer définitivement
      const isInTrash = deletedChallenges.some(c => c.id === challengeToDelete);
      const result = isInTrash 
        ? await permanentlyDeleteChallenge(challengeToDelete)
        : await deleteChallenge(challengeToDelete);

      if (result?.success) {
        toast({
          title: isInTrash ? "Supprimé définitivement" : "Supprimé",
          description: "",
        });
      } else {
        toast({
          title: "Erreur",
          description: result?.error || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }

    setShowDeleteConfirm(false);
    setChallengeToDelete(null);
    // Revenir en mode normal après suppression
    setIsEditModeChallenges(false);
    setIsEditModeCompleted(false);
    setIsEditModeTrash(false);
    setChallengesToDelete(new Set());
    setEditingChallengeId(null);
    setEditingTitle('');
  };

  // Fonction pour confirmer la restauration
  const confirmRestoreChallenge = async () => {
    if (!challengeToRestore) return;

    try {
      let result;
      if (restoreType === 'completed') {
        result = await restoreChallenge(challengeToRestore);
      } else {
        result = await restoreDeletedChallenge(challengeToRestore);
      }

      if (result?.success) {
        toast({
          title: "Défi restauré",
          description: "Restauré",
        });
      } else {
        toast({
          title: "Erreur",
          description: result?.error || "Erreur lors de la restauration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la restauration",
        variant: "destructive",
      });
    }

    setShowRestoreConfirm(false);
    setChallengeToRestore(null);
    setRestoreType('pending');
    // Revenir en mode normal après restauration
    setIsEditModeChallenges(false);
    setIsEditModeCompleted(false);
    setIsEditModeTrash(false);
    setChallengesToDelete(new Set());
    setEditingChallengeId(null);
    setEditingTitle('');
  };

  // Fonction pour ajouter un nouveau défi
  const handleAddChallenge = async () => {
    if (!newChallengeTitle.trim()) return;
    
    try {
      const result = await addChallenge(newChallengeTitle.trim());
      if (result?.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Défi ajouté",
          description: "Ajouté",
        });
        setNewChallengeTitle('');
        setShowAddDialog(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du défi",
        variant: "destructive",
      });
    }
  };

  // Calculer le jour actuel basé sur les défis accomplis
  useEffect(() => {
    const completedCount = userChallenges.filter(c => c.status === 'completed').length;
    setCurrentDay(completedCount + 1);
  }, [userChallenges]);

  // Filtrer les défis par statut
  const defis = userChallenges.filter((c) => c.status === "pending");
  const accomplis = userChallenges.filter((c) => c.status === "completed");

  console.log('accomplis:', accomplis);
  console.log('activeTab:', activeTab);
  console.log('isEditModeCompleted:', isEditModeCompleted);

  // Forcer la mise à jour des filtres quand userChallenges change
  useEffect(() => {
    // Cette ligne force la re-render quand userChallenges change
    setReorderedChallenges(userChallenges.filter(c => c.status === 'pending'));
  }, [userChallenges]);

  // Réinitialiser les modes édition quand on change d'onglet
  useEffect(() => {
    console.log('activeTab changed to:', activeTab);
  }, [activeTab]);

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
        <div className="flex items-center gap-2">
          {/* Bouton Éditer unique qui fonctionne pour tous les onglets */}
          {(activeTab === 'challenges' || activeTab === 'completed' || activeTab === 'trash') && (
            <Button
              variant={
                (activeTab === 'challenges' && isEditModeChallenges) ||
                (activeTab === 'completed' && isEditModeCompleted) ||
                (activeTab === 'trash' && isEditModeTrash)
                  ? "default" 
                  : "outline"
              }
              size="icon"
              onClick={() => {
                if (activeTab === 'challenges') {
                  setIsEditModeChallenges(!isEditModeChallenges);
                } else if (activeTab === 'completed') {
                  setIsEditModeCompleted(!isEditModeCompleted);
                } else if (activeTab === 'trash') {
                  setIsEditModeTrash(!isEditModeTrash);
                }
              }}
              className="w-10 h-10"
              title={
                (activeTab === 'challenges' && isEditModeChallenges) ||
                (activeTab === 'completed' && isEditModeCompleted) ||
                (activeTab === 'trash' && isEditModeTrash)
                  ? "Terminer l'édition"
                  : "Éditer"
              }
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10"
            title="Ajouter un défi"
          >
            <Plus className="w-4 h-4" />
          </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau défi</DialogTitle>
                <DialogDescription>
                  Créez un nouveau défi personnel pour votre programme de création de contenu.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenge-title">Titre du défi</Label>
                  <Input
                    id="challenge-title"
                    value={newChallengeTitle}
                    onChange={(e) => setNewChallengeTitle(e.target.value)}
                    placeholder="Ex: Créer un post sur l'environnement"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddChallenge();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      setNewChallengeTitle('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddChallenge}
                    disabled={!newChallengeTitle.trim()}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
            {isEditModeChallenges ? (
              // Mode édition avec drag & drop
            <Reorder.Group 
              axis="y" 
                values={defis} 
              onReorder={handleReorder}
              className="space-y-3"
            >
                {defis.map((challenge) => (
                <Reorder.Item
                  key={challenge.id}
                  value={challenge}
                  className="cursor-grab active:cursor-grabbing"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          {editingChallengeId === challenge.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEdit();
                                  } else if (e.key === 'Escape') {
                                    handleCancelEdit();
                                  }
                                }}
                                className="flex-1"
                                autoFocus
                              />
                            ) : (
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{challenge.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Jour {currentDay}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {editingChallengeId === challenge.id ? (
                              <>
                              <Button
                                size="sm"
                                variant="ghost"
                                  onClick={handleSaveEdit}
                                  className="text-green-600"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingChallengeId(challenge.id);
                                    setEditingTitle(challenge.title);
                                  }}
                                  className="text-blue-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                                  onClick={() => handleDeleteChallenge(challenge.id)}
                                  className={challengesToDelete.has(challenge.id) ? "text-red-600" : "text-gray-600"}
                          >
                                  <Trash2 className="w-4 h-4" />
                          </Button>
                              </>
                            )}
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            ) : (
              // Mode normal
              <div className="space-y-3">
                {defis.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Jour {currentDay}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleCompleteChallenge(challenge.id)}
                              disabled={validatingChallenges.has(challenge.id)}
                              className={`p-2 rounded transition-all duration-300 ${
                                validatingChallenges.has(challenge.id)
                                  ? 'bg-green-500 border-2 border-green-600 scale-125 shadow-lg'
                                  : 'hover:bg-gray-100 hover:scale-105'
                              }`}
                              title="Marquer comme accompli"
                            >
                              {userChallenges.some(uc => uc.id === challenge.id && uc.status === 'completed') || validatingChallenges.has(challenge.id) ? (
                                <CheckSquare className="w-6 h-6 text-white transition-all duration-300" />
                              ) : (
                                <Square className="w-6 h-6 text-gray-400 transition-all duration-300" />
                              )}
                            </button>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Onglet Accomplis */}
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-3">
              {accomplis.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun défi accompli</h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore accompli de défis
                    </p>
                  </CardContent>
                </Card>
              ) : (
                accomplis.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Accompli le {new Date(challenge.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditModeCompleted ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                // Remettre en défis
                                setChallengeToRestore(challenge.id);
                                setRestoreType('completed');
                                setShowRestoreConfirm(true);
                              }}
                              className="text-blue-600"
                              title="Remettre en défis"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                // Supprimer définitivement
                                setChallengeToDelete(challenge.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="ml-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Onglet Corbeille */}
          <TabsContent value="trash" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Corbeille des défis</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('challenges')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux défis
              </Button>
            </div>
            <div className="space-y-3">
              {deletedChallenges.filter(challenge => challenge.title && challenge.user_id).length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Corbeille vide</h3>
                    <p className="text-muted-foreground">
                      Aucun défi personnel supprimé pour le moment
                    </p>
                  </CardContent>
                </Card>
              ) : (
                deletedChallenges.filter(challenge => challenge.title && challenge.user_id).map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-md transition-shadow border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-400">{challenge.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Supprimé le {new Date(challenge.updated_at || challenge.created_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setChallengeToRestoreOptions(challenge.id);
                              setShowRestoreOptions(true);
                            }}
                            className="text-blue-600"
                            title="Restaurer le défi"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setChallengeToDelete(challenge.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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

      {/* Modal de confirmation pour la suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-muted-foreground mb-4">
              {deletedChallenges.some(c => c.id === challengeToDelete) 
                ? "Êtes-vous sûr de vouloir supprimer définitivement ce défi ?"
                : "Êtes-vous sûr de vouloir supprimer ce défi ?"
              }
              <br />
              <span className="text-sm text-red-600">
                {deletedChallenges.some(c => c.id === challengeToDelete) 
                  ? "Cette action est irréversible."
                  : "Le défi sera déplacé dans la corbeille."
                }
              </span>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDeleteChallenge} className="flex-1">
                {deletedChallenges.some(c => c.id === challengeToDelete) ? "Supprimer définitivement" : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour la restauration */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRestoreConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Confirmer la restauration</h3>
            <p className="text-muted-foreground mb-4">
              Êtes-vous sûr de vouloir restaurer ce défi ?
              <br />
              <span className="text-sm text-blue-600">
                {restoreType === 'completed' ? 'Cela remettra le défi en cours.' : 'Cela remettra le défi de la corbeille.'}
              </span>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRestoreConfirm(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={confirmRestoreChallenge} className="flex-1">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour choisir où restaurer */}
      {showRestoreOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRestoreOptions(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Où restaurer le défi ?</h3>
            <p className="text-muted-foreground mb-4">
              Choisissez où vous voulez restaurer ce défi :
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setChallengeToRestore(challengeToRestoreOptions);
                  setRestoreType('pending');
                  setShowRestoreOptions(false);
                  setShowRestoreConfirm(true);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Restaurer dans les Défis (en cours)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setChallengeToRestore(challengeToRestoreOptions);
                  setRestoreType('completed');
                  setShowRestoreOptions(false);
                  setShowRestoreConfirm(true);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Restaurer dans les Accomplis (terminé)
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => setShowRestoreOptions(false)} className="w-full">
                Annuler
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