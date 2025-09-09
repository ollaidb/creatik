import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Heart, 
  BookOpen, 
  Users, 
  Plus,
  Share2,
  MoreHorizontal,
  Bell,
  User,
  Target,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  Trash2,
  Palette,
  ChevronDown,
  Trophy,
  CheckCircle,
  Square,
  CheckSquare,
  GripVertical,
  Save,
  X,
  ArrowLeft,
  BarChart3,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { UserProfileService, UserSocialAccount, UserSocialPost, UserContentPlaylist } from '@/services/userProfileService';
import { ProgramSettingsService, ProgramSettingsInput } from '@/services/programSettingsService';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';
import { useProfileFiltering } from '@/hooks/useProfileFiltering';
import { useNetworkStats } from '@/hooks/useNetworkStats';
import { AddSocialAccountModal } from '@/components/modals/AddSocialAccountModal';
import { AddPlaylistModal } from '@/components/modals/AddPlaylistModal';
import { AddPublicationModal } from '@/components/modals/AddPublicationModal';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Hook pour les défis
  const {
    challenges,
    userChallenges,
    deletedChallenges,
    stats,
    leaderboard,
    loading: challengesLoading,
    error: challengesError,
    addChallenge,
    completeChallenge,
    deleteChallenge,
    updateChallengeTitle,
    restoreChallenge,
    reorderChallenges,
    updateProgramDuration,
    restoreDeletedChallenge,
    permanentlyDeleteChallenge,
    updateContentsPerDay
  } = useChallenges();
  
  // États pour les données réelles
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [socialPosts, setSocialPosts] = useState<UserSocialPost[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);
  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);
  const [isAddPublicationModalOpen, setIsAddPublicationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Hook de filtrage pour gérer la sélection et le filtrage des données
  const {
    selectedSocialNetworkId,
    selectedPlaylistId,
    filteredPosts,
    filteredPlaylists,
    filteredChallenges,
    programSettings,
    selectSocialNetwork,
    selectPlaylist,
    resetFilters,
    getFilteredStats
  } = useProfileFiltering(socialAccounts, socialPosts, playlists, userChallenges, user?.id || '');

  // Hook pour les statistiques du réseau sélectionné
  const { stats: networkStats, loading: statsLoading, refreshStats } = useNetworkStats(selectedSocialNetworkId);
  
  // États pour le système de défis
  const [activeTab, setActiveTab] = useState('publications');
  const [selectedDuration, setSelectedDuration] = useState('3months');
  const [contentsPerDay, setContentsPerDay] = useState(1);
  const [showDurationConfirm, setShowDurationConfirm] = useState(false);
  const [showContentsConfirm, setShowContentsConfirm] = useState(false);
  const [pendingDuration, setPendingDuration] = useState('');
  const [pendingContents, setPendingContents] = useState(0);
  
  // États pour l'édition et le drag & drop des défis
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [reorderedChallenges, setReorderedChallenges] = useState<any[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [isEditModeCompleted, setIsEditModeCompleted] = useState(false);
  const [challengesToDelete, setChallengesToDelete] = useState<Set<string>>(new Set());
  const [validatingChallenges, setValidatingChallenges] = useState<Set<string>>(new Set());
  
  // États pour les modales de défis
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [challengeToRestore, setChallengeToRestore] = useState<string | null>(null);
  const [restoreType, setRestoreType] = useState<'completed' | 'pending'>('pending');
  const [showRestoreOptions, setShowRestoreOptions] = useState(false);
  const [challengeToRestoreOptions, setChallengeToRestoreOptions] = useState<string | null>(null);
  
  // États pour la programmation par réseau/playlist
  const [showProgramSettingsDialog, setShowProgramSettingsDialog] = useState(false);
  const [localProgramSettings, setLocalProgramSettings] = useState({
    socialNetworkId: selectedSocialNetworkId,
    playlistId: selectedPlaylistId,
    duration: '3months',
    contentsPerDay: 1
  });

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Charger les données du profil
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await UserProfileService.getUserProfileData(user.id);
        setSocialAccounts(data.socialAccounts);
        setSocialPosts(data.socialPosts);
        setPlaylists(data.playlists);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);

  // Mettre à jour les paramètres de programmation quand la sélection change
  useEffect(() => {
    setLocalProgramSettings(prev => ({
      ...prev,
      socialNetworkId: selectedSocialNetworkId,
      playlistId: selectedPlaylistId
    }));
  }, [selectedSocialNetworkId, selectedPlaylistId]);


  // useEffect pour les défis
  useEffect(() => {
    const completedCount = userChallenges.filter(c => c.status === 'completed').length;
    setCurrentDay(completedCount + 1);
  }, [userChallenges]);

  // Charger les valeurs initiales depuis les statistiques
  useEffect(() => {
    if (stats) {
      if (stats.program_duration) {
        setSelectedDuration(stats.program_duration);
      }
      if (stats.contents_per_day) {
        setContentsPerDay(stats.contents_per_day);
      }
    }
  }, [stats]);

  // Fonction pour recharger les données après ajout
  const refreshData = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Rechargement des données du profil...');
      setLoading(true); // Activer le loading pendant le rechargement
      
      const data = await UserProfileService.getUserProfileData(user.id);
      setSocialAccounts(data.socialAccounts);
      setSocialPosts(data.socialPosts);
      setPlaylists(data.playlists);
      
      // Rafraîchir aussi les statistiques
      refreshStats();
      
      console.log('✅ Données rechargées:', {
        socialAccounts: data.socialAccounts.length,
        socialPosts: data.socialPosts.length,
        playlists: data.playlists.length
      });
      
      // Forcer un re-render en mettant à jour l'état de loading
      setTimeout(() => setLoading(false), 100);
    } catch (error) {
      console.error('❌ Erreur lors du rechargement des données:', error);
      setLoading(false);
    }
  };

  // Fonctions de suppression
  const handleDeleteSocialAccount = async (accountId: string, platform: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte ${platform} ?`)) return;
    
    try {
      await UserProfileService.deleteSocialAccount(accountId);
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte social:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId: string, playlistName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la playlist "${playlistName}" ?`)) return;
    
    try {
      await UserProfileService.deletePlaylist(playlistId);
      refreshData();
      // Si la playlist supprimée était sélectionnée, désélectionner
      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId('');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la playlist:', error);
    }
  };

  const handleDeletePublication = async (postId: string, postTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la publication "${postTitle}" ?`)) return;
    
    try {
      await UserProfileService.deleteSocialPost(postId);
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication:', error);
    }
  };

  // Fonctions utilitaires pour les défis
  const getDurationText = (duration: string) => {
    switch (duration) {
      case '1month': return '1 mois';
      case '2months': return '2 mois';
      case '3months': return '3 mois';
      case '6months': return '6 mois';
      case '1year': return '1 an';
      case '2years': return '2 ans';
      case '3years': return '3 ans';
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
      case '2years': return 730;
      case '3years': return 1095;
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

  // Fonctions pour la gestion des défis
  const handleCompleteChallenge = async (id: string) => {
    setValidatingChallenges(prev => new Set([...prev, id]));
    
    setTimeout(async () => {
      try {
        const result = await completeChallenge(id);
        
        if (result?.error) {
          toast({
            title: "Erreur",
            description: result.error,
            variant: "destructive",
          });
        } else {
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
      } finally {
        setValidatingChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }, 100);
  };

  const handleAddChallenge = async () => {
    if (!newChallengeTitle.trim()) return;
    
    // Vérifier qu'un réseau social est sélectionné
    if (!selectedSocialNetworkId) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sélectionner un réseau social",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Créer un défi personnalisé lié au réseau social et à la playlist sélectionnés
      const challengeData = {
        title: newChallengeTitle.trim(),
        social_account_id: selectedSocialNetworkId,
        playlist_id: selectedPlaylistId || null, // null si pas de playlist sélectionnée
        is_custom: true
      };
      
      const result = await addChallenge(newChallengeTitle.trim(), challengeData);
      if (result?.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Défi ajouté",
          description: `Défi ajouté pour ${socialAccounts.find(acc => acc.id === selectedSocialNetworkId)?.platform || 'ce réseau'}`,
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

  // Filtrer les défis par statut en utilisant les données filtrées
  const defis = filteredChallenges.filter((c) => c.status === "pending");
  const accomplis = filteredChallenges.filter((c) => c.status === "completed");

  // Données du profil utilisateur
  const userProfile = {
    name: user?.user_metadata?.full_name || "Utilisateur",
    profilePicture: user?.user_metadata?.avatar_url || null
  };


  const profileMenuItems = [
    { icon: BookOpen, label: "Notes", path: "/notes", color: "text-blue-500" },
    { icon: Target, label: "Challenges", path: "/public-challenges", color: "text-orange-500" },
    { icon: Heart, label: "Favoris", path: "/profile/favorites", color: "text-red-500" }
  ];

  const renderPublications = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-card border border-border rounded-lg animate-pulse">
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Afficher les publications filtrées selon le réseau social et la playlist sélectionnés
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>
            {selectedPlaylistId 
              ? "Aucune publication dans cette playlist" 
              : "Aucune publication pour ce réseau social"
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {filteredPosts.map((post) => {
          const publishedDate = post.published_date ? new Date(post.published_date) : new Date(post.created_at);
          const date = publishedDate.toLocaleDateString('fr-FR');
          const time = publishedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={post.id} className="group relative p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-all">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {date} à {time}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                onClick={() => handleDeletePublication(post.id, post.title)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header du profil */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback className="text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
            </div>
            <div className="flex gap-2 relative" ref={menuRef}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2"
              >
                <MoreHorizontal className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {/* Menu déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsShareModalOpen(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager le profil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/compte');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres et confidentialité</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Icônes des pages existantes */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {profileMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs text-center">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Réseaux sociaux */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {socialAccounts.length} réseau{socialAccounts.length > 1 ? 'x' : ''} social{socialAccounts.length > 1 ? 'aux' : ''}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {loading ? (
              // Skeleton loading pour les réseaux sociaux
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="min-w-[80px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
                ))}
                <div className="min-w-[32px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
              </>
            ) : socialAccounts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Aucun réseau social ajouté
              </div>
            ) : (
              <>
                {socialAccounts.map((account) => {
                  const isSelected = selectedSocialNetworkId === account.id;
                  return (
                    <div key={account.id} className="group relative min-w-[80px] flex-shrink-0">
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`text-xs h-8 w-full ${
                          isSelected ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => selectSocialNetwork(account.id)}
                      >
                        {account.display_name || account.platform}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSocialAccount(account.id, account.platform);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
                
                <Button
                  variant="outline"
                  className="min-w-[32px] flex-shrink-0 border-dashed flex items-center justify-center h-8"
                  onClick={() => setIsAddSocialModalOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Playlists */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">Playlists</h4>
            <span className="text-xs text-muted-foreground">
              {filteredPlaylists.length} playlist{filteredPlaylists.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {loading ? (
              // Skeleton loading pour les playlists
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[80px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
                ))}
                <div className="min-w-[32px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
              </>
            ) : socialAccounts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Ajoutez un réseau social pour créer des playlists
              </div>
            ) : !selectedSocialNetworkId ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Sélectionnez un réseau social pour voir ses playlists
              </div>
            ) : (
              <>
                {/* Option "Tout" pour afficher toutes les publications du réseau */}
                <div className="group relative min-w-[80px] flex-shrink-0">
                  <Button
                    variant={selectedPlaylistId === '' ? "default" : "outline"}
                    className={`text-xs h-8 w-full ${
                      selectedPlaylistId === '' ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => selectPlaylist('')}
                  >
                    Tout
                  </Button>
                </div>
                
                {/* Playlists spécifiques */}
                {filteredPlaylists.map((playlist) => {
                           const isSelected = selectedPlaylistId === playlist.id;
                           return (
                             <div key={playlist.id} className="group relative min-w-[80px] flex-shrink-0">
                               <Button
                                 variant={isSelected ? "default" : "outline"}
                                 className={`text-xs h-8 w-full ${
                                   isSelected ? "bg-primary text-primary-foreground" : ""
                                 }`}
                                 style={{ borderColor: isSelected ? undefined : playlist.color }}
                                 onClick={() => selectPlaylist(playlist.id)}
                               >
                                 {playlist.name}
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeletePlaylist(playlist.id, playlist.name);
                                 }}
                               >
                                 <Trash2 className="w-3 h-3" />
                               </Button>
                             </div>
                           );
                         })}
                
                <Button
                  variant="outline"
                  className="min-w-[32px] flex-shrink-0 border-dashed flex items-center justify-center h-8"
                  onClick={() => setIsAddPlaylistModalOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section Contenu avec onglets */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-max min-w-full justify-start gap-1">
                <TabsTrigger value="publications" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="challenges" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Défis
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Accomplis
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Statistiques
                </TabsTrigger>
                <TabsTrigger value="trash" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Corbeille
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Onglet Contenu */}
            <TabsContent value="publications" className="mt-6">
              <div className="text-center mb-4">
                {selectedSocialNetworkId && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedPlaylistId ? (
                      `${filteredPosts.length} publication${filteredPosts.length > 1 ? 's' : ''} dans cette playlist`
                    ) : (
                      `${filteredPosts.length} publication${filteredPosts.length > 1 ? 's' : ''} sur ${socialAccounts.find(acc => acc.id === selectedSocialNetworkId)?.platform || 'ce réseau'}`
                    )}
                  </p>
                )}
                <Button
                  onClick={() => setIsAddPublicationModalOpen(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
              {renderPublications()}
            </TabsContent>
            
            {/* Onglet Défis */}
            <TabsContent value="challenges" className="mt-6">
              {/* En-tête centré */}
              <div className="text-center mb-4">
                <div className="flex justify-center gap-2">
                  {defis.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowProgramSettingsDialog(true)}
                      className="w-10 h-10 p-0"
                      title="Programmer"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-10 h-10 p-0" title="Ajouter un défi">
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
              </div>

              {/* Liste des défis */}
              <div className="space-y-3">
                {defis.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun défi</h3>
                      <p className="text-muted-foreground">
                        Créez votre premier défi pour commencer votre programme
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  defis.map((challenge) => (
                    <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Jour {currentDay}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleCompleteChallenge(challenge.id)}
                              disabled={validatingChallenges.has(challenge.id)}
                              className={`p-2 rounded transition-all duration-700 ease-in-out ${
                                validatingChallenges.has(challenge.id)
                                  ? 'bg-green-500 border-2 border-green-600 scale-150 shadow-xl animate-pulse'
                                  : 'hover:bg-gray-100 hover:scale-105'
                              }`}
                              title="Marquer comme accompli"
                            >
                              {userChallenges.some(uc => uc.id === challenge.id && uc.status === 'completed') || validatingChallenges.has(challenge.id) ? (
                                <CheckSquare className="w-6 h-6 text-white transition-all duration-700 ease-in-out" />
                              ) : (
                                <Square className="w-6 h-6 text-gray-400 transition-all duration-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* Onglet Accomplis */}
            <TabsContent value="completed" className="mt-6">
              <div className="flex items-center justify-end mb-4">
                <Button
                  variant={isEditModeCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditModeCompleted(!isEditModeCompleted)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditModeCompleted ? "Terminer" : "Éditer"}
                </Button>
              </div>
              
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
                            <p className="text-sm text-muted-foreground">
                              Accompli le {new Date(challenge.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="ml-2">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
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
                {statsLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">Chargement des statistiques...</div>
                    </CardContent>
                  </Card>
                ) : networkStats ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Statistiques - {socialAccounts.find(acc => acc.id === selectedSocialNetworkId)?.platform || 'Réseau sélectionné'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Barre de progression */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progression du programme</span>
                            <span>{networkStats.progress_percentage}%</span>
                          </div>
                          <Progress value={networkStats.progress_percentage} className="h-3" />
                        </div>

                        {/* Statistiques principales */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{networkStats.required_publications}</div>
                            <div className="text-sm text-muted-foreground">Publications nécessaires</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{networkStats.actual_completed_challenges}</div>
                            <div className="text-sm text-muted-foreground">Défis accomplis</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{networkStats.remaining_challenges}</div>
                            <div className="text-sm text-muted-foreground">Défis restants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{networkStats.remaining_days}</div>
                            <div className="text-sm text-muted-foreground">Jours restants</div>
                          </div>
                        </div>

                        {/* Statistiques secondaires */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-600">{networkStats.actual_publications}</div>
                            <div className="text-sm text-muted-foreground">Publications créées</div>
                          </div>
                        </div>

                        {/* Configuration du programme */}
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground mb-1">Configuration du programme</div>
                          <div className="text-xs text-muted-foreground">
                            {getDurationText(networkStats.program_duration)} • {networkStats.contents_per_day} contenu(s) par jour • {networkStats.required_publications} publications au total
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        Sélectionnez un réseau social pour voir ses statistiques
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            {/* Onglet Corbeille */}
            <TabsContent value="trash" className="mt-6">
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
                    <Card key={challenge.id} className="hover:shadow-md transition-shadow border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Supprimé le {new Date(challenge.updated_at || challenge.created_at || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Navigation />

      {/* Modales */}
      <AddSocialAccountModal
        isOpen={isAddSocialModalOpen}
        onClose={() => setIsAddSocialModalOpen(false)}
        onSuccess={refreshData}
        userId={user?.id || ''}
        existingPlatforms={socialAccounts.map(account => account.platform)}
      />

      <AddPlaylistModal
        isOpen={isAddPlaylistModalOpen}
        onClose={() => setIsAddPlaylistModalOpen(false)}
        onSuccess={refreshData}
        userId={user?.id || ''}
        socialAccounts={socialAccounts}
        preselectedSocialNetworkId={selectedSocialNetworkId}
      />

      <AddPublicationModal
        isOpen={isAddPublicationModalOpen}
        onClose={() => setIsAddPublicationModalOpen(false)}
        onSuccess={refreshData}
        userId={user?.id || ''}
        socialAccounts={socialAccounts}
        playlists={playlists}
      />

      {/* Modal de partage */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Partager un réseau social</DialogTitle>
            <DialogDescription>
              Partagez l'accès à vos réseaux sociaux avec d'autres personnes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Sélection des réseaux */}
            <div>
              <Label htmlFor="networks">Réseaux à partager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner les réseaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les réseaux</SelectItem>
                  {socialAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.display_name || account.platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permissions */}
            <div>
              <Label htmlFor="permissions">Permissions</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="view" name="permissions" value="view" defaultChecked />
                  <Label htmlFor="view">Visualiser seulement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="edit" name="permissions" value="edit" />
                  <Label htmlFor="edit">Éditer (ajouter/supprimer du contenu)</Label>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email de la personne</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsShareModalOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                // TODO: Implémenter la logique de partage
                console.log('Partage en cours...');
                setIsShareModalOpen(false);
              }}
              className="flex-1"
            >
              Partager
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de programmation par réseau/playlist */}
      <Dialog open={showProgramSettingsDialog} onOpenChange={setShowProgramSettingsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Programmer les défis</DialogTitle>
            <DialogDescription>
              Configurez la durée et le nombre de contenus par réseau social et playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="social-network">Réseau social</Label>
              <Select
                value={localProgramSettings.socialNetworkId}
                onValueChange={(value) => setLocalProgramSettings(prev => ({ ...prev, socialNetworkId: value, playlistId: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un réseau social" />
                </SelectTrigger>
                <SelectContent>
                  {socialAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{account.platform}</span>
                        <span className="text-muted-foreground">- {account.display_name || account.username}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="playlist">Portée de la programmation</Label>
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <p>La programmation s'applique à <strong>toutes les playlists</strong> de ce réseau social.</p>
                <p className="text-xs mt-1">Les paramètres de durée et de contenus par jour seront utilisés pour toutes vos playlists {socialAccounts.find(acc => acc.id === localProgramSettings.socialNetworkId)?.platform || 'de ce réseau'}.</p>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Durée du programme</Label>
              <Select
                value={localProgramSettings.duration}
                onValueChange={(value) => setLocalProgramSettings(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 mois</SelectItem>
                  <SelectItem value="2months">2 mois</SelectItem>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                  <SelectItem value="2years">2 ans</SelectItem>
                  <SelectItem value="3years">3 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contents-per-day">Contenus par jour</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalProgramSettings(prev => ({ 
                    ...prev, 
                    contentsPerDay: Math.max(1, prev.contentsPerDay - 1) 
                  }))}
                  className="w-10 h-10 p-0"
                >
                  -
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-lg font-semibold">{localProgramSettings.contentsPerDay}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalProgramSettings(prev => ({ 
                    ...prev, 
                    contentsPerDay: prev.contentsPerDay + 1 
                  }))}
                  className="w-10 h-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowProgramSettingsDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={async () => {
                  if (!user?.id || !localProgramSettings.socialNetworkId) return;
                  
                  try {
                    const settingsInput: ProgramSettingsInput = {
                      social_account_id: localProgramSettings.socialNetworkId,
                      playlist_id: null, // Paramètres généraux du réseau, pas d'une playlist spécifique
                      duration: localProgramSettings.duration,
                      contents_per_day: localProgramSettings.contentsPerDay
                    };

                    await ProgramSettingsService.upsertProgramSettings(user.id, settingsInput);
                    
                    setShowProgramSettingsDialog(false);
                    toast({
                      title: "Programme configuré",
                      description: `Les paramètres ont été sauvegardés pour ${socialAccounts.find(acc => acc.id === localProgramSettings.socialNetworkId)?.platform || 'ce réseau'}.`,
                    });
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    toast({
                      title: "Erreur",
                      description: "Impossible de sauvegarder les paramètres.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!localProgramSettings.socialNetworkId}
                className="flex-1"
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
