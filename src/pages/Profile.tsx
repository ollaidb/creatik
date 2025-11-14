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
  LogIn,
  LogOut,
  Edit,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Users2,
  ClipboardList,
  ListPlus,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Twitch,
  Music2,
  Podcast,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryCachePersister } from '@/utils/queryCachePersister';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { UserProfileService, UserSocialAccount, UserSocialPost, UserContentPlaylist } from '@/services/userProfileService';
import { ProgramSettingsService, ProgramSettingsInput } from '@/services/programSettingsService';
import { useUserProfile } from '@/hooks/useUserProfile';

import { useProfileFiltering } from '@/hooks/useProfileFiltering';
import { useNetworkStats } from '@/hooks/useNetworkStats';
import { AddSocialAccountModal } from '@/components/modals/AddSocialAccountModal';
import { AddPlaylistModal } from '@/components/modals/AddPlaylistModal';
import { AddPublicationModal } from '@/components/modals/AddPublicationModal';

// ------------------------------
// Données de démonstration invité
// ------------------------------
const GUEST_SOCIAL_ACCOUNTS: UserSocialAccount[] = [
  {
    id: 'guest-instagram',
    user_id: 'guest',
    platform: 'instagram',
    username: 'creatik_demo',
    display_name: 'Creatik Studio',
    profile_url: 'https://instagram.com/creatik',
    is_active: true,
    custom_name: 'Instagram',
    order: 1,
    created_at: '2024-01-10T09:00:00.000Z',
    updated_at: '2024-01-15T09:00:00.000Z'
  },
  {
    id: 'guest-youtube',
    user_id: 'guest',
    platform: 'youtube',
    username: 'creatik_channel',
    display_name: 'Creatik Channel',
    profile_url: 'https://youtube.com/@creatik',
    is_active: true,
    custom_name: 'YouTube',
    order: 2,
    created_at: '2024-01-12T10:00:00.000Z',
    updated_at: '2024-01-18T10:00:00.000Z'
  }
];

const GUEST_SOCIAL_POSTS: UserSocialPost[] = [
  {
    id: 'guest-post-1',
    user_id: 'guest',
    social_account_id: 'guest-instagram',
    title: '5 astuces pour booster votre visibilité sur Instagram',
    content: 'Un carousel de 5 slides avec des conseils pratiques.',
    published_date: '2024-02-02T09:00:00.000Z',
    status: 'published',
    created_at: '2024-01-30T08:00:00.000Z',
    updated_at: '2024-02-02T09:00:00.000Z'
  },
  {
    id: 'guest-post-2',
    user_id: 'guest',
    social_account_id: 'guest-youtube',
    title: 'Vlog : les coulisses d’une semaine de création de contenu',
    content: 'Vidéo longue format 12 minutes.',
    published_date: '2024-02-05T18:00:00.000Z',
    status: 'published',
    created_at: '2024-02-01T11:30:00.000Z',
    updated_at: '2024-02-05T18:00:00.000Z'
  }
];

const GUEST_PLAYLISTS: UserContentPlaylist[] = [
  {
    id: 'guest-playlist-1',
    user_id: 'guest',
    social_network_id: 'instagram',
    name: 'Série Instagram - Conseils pratiques',
    description: 'Suite de contenus pour aider les entrepreneurs à utiliser Instagram.',
    is_public: true,
    color: '#F472B6',
    order: 1,
    created_at: '2024-01-20T10:00:00.000Z',
    updated_at: '2024-01-20T10:00:00.000Z'
  },
  {
    id: 'guest-playlist-2',
    user_id: 'guest',
    social_network_id: 'youtube',
    name: 'YouTube - Histoires inspirantes',
    description: 'Mini documentaire sur des créateurs à suivre.',
    is_public: true,
    color: '#FB7185',
    order: 2,
    created_at: '2024-01-22T10:00:00.000Z',
    updated_at: '2024-01-22T10:00:00.000Z'
  }
];


const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [profileType, setProfileType] = useState<'creator' | 'contributor'>('creator');
  const menuRef = useRef<HTMLDivElement>(null);

  // Détecter le type de profil sauvegardé au chargement
  useEffect(() => {
    const savedProfileType = localStorage.getItem('userProfileType') as 'creator' | 'contributor' | null;
    if (savedProfileType) {
      setProfileType(savedProfileType);
      if (savedProfileType === 'contributor') {
        navigate('/contributor-profile');
      }
    }
  }, [navigate]);

  // Rediriger vers la page appropriée selon le type de profil
  const handleProfileTypeChange = (newType: 'creator' | 'contributor') => {
    setProfileType(newType);
    if (newType === 'contributor') {
      navigate('/contributor-profile');
    } else {
      navigate('/profile');
    }
  };

  // Fonctions d'authentification
  const handleLoginClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('🔐 Ouverture de la modal de connexion...');
    setIsAuthModalOpen(true);
  };

  const handleLogoutClick = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: "Impossible de se déconnecter. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        // Marquer la déconnexion pour afficher le message
        localStorage.setItem('just_logged_out', 'true');
        toast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };
  
  const promptAuthentication = (message?: string) => {
    toast({
      title: "Connexion requise",
      description: message || "Connectez-vous pour accéder à cette fonctionnalité.",
      variant: "default",
    });
    handleLoginClick();
  };

  const ensureAuthenticated = (message?: string) => {
    if (!user) {
      promptAuthentication(message);
      return false;
    }
    return true;
  };

  const handleQuickAddSelection = (target: QuickAddTarget) => {
    let message = "Connectez-vous pour utiliser cette action.";
    switch (target) {
      case 'network':
        message = "Connectez-vous pour ajouter un réseau social.";
        break;
      case 'playlist':
        message = "Connectez-vous pour créer une playlist.";
        break;
      case 'publication':
        message = "Connectez-vous pour ajouter une publication.";
        break;
    }
    if (!ensureAuthenticated(message)) {
      return;
    }
    setIsQuickAddDialogOpen(false);
    switch (target) {
      case 'network':
        setIsAddSocialModalOpen(true);
        break;
      case 'playlist':
        setIsAddPlaylistModalOpen(true);
        break;
      case 'publication':
        setIsAddPublicationModalOpen(true);
        break;
    }
  };
  
  
  // États pour les données réelles
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [socialPosts, setSocialPosts] = useState<UserSocialPost[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);
  const [isEditSocialModalOpen, setIsEditSocialModalOpen] = useState(false);
  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);
  const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState(false);
  const [isAddPublicationModalOpen, setIsAddPublicationModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isRenameAllModalOpen, setIsRenameAllModalOpen] = useState(false);
  const [isReorderPlaylistModalOpen, setIsReorderPlaylistModalOpen] = useState(false);
  const [isRenameAllPlaylistModalOpen, setIsRenameAllPlaylistModalOpen] = useState(false);
  const [isDeleteSocialModalOpen, setIsDeleteSocialModalOpen] = useState(false);
  const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  type QuickAddTarget = 'network' | 'playlist' | 'publication';
  
  // États pour le renommage
  const [renamingAccountId, setRenamingAccountId] = useState<string | null>(null);
  const [renamingAccountName, setRenamingAccountName] = useState('');
  const [renamingPlaylistId, setRenamingPlaylistId] = useState<string | null>(null);
  const [renamingPlaylistName, setRenamingPlaylistName] = useState('');
  
  // États pour la suppression sélective
  const [selectedSocialAccounts, setSelectedSocialAccounts] = useState<string[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  
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
  } = useProfileFiltering(socialAccounts, socialPosts, playlists, [], user?.id || '');

  // Hook pour les statistiques du réseau sélectionné
  const { stats: networkStats, loading: statsLoading, refreshStats } = useNetworkStats(selectedSocialNetworkId);
  
  // États pour les onglets
  const [activeTab, setActiveTab] = useState('publications');

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

  // Utiliser React Query pour charger les données du profil avec cache
  const { data: profileData, isLoading: profileLoading, error: profileError, isFetching } = useUserProfile(user?.id);
  
  // Conserver les données précédentes pendant le chargement pour éviter la disparition
  const previousDataRef = useRef<typeof profileData>(null);
  
  // Initialiser avec les données du cache persistant si disponibles
  useEffect(() => {
    if (!profileData && user?.id && !profileLoading) {
      try {
        const cachedData = queryCachePersister.getInitialData<typeof profileData>(['user-profile', user.id]);
        if (cachedData) {
          previousDataRef.current = cachedData;
          setSocialAccounts(cachedData.socialAccounts);
          setSocialPosts(cachedData.socialPosts);
          setPlaylists(cachedData.playlists);
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération du cache:', error);
      }
    }
  }, [user?.id, profileLoading]);
  
  useEffect(() => {
    if (profileData) {
      // Sauvegarder les données pour les réutiliser si nécessaire
      previousDataRef.current = profileData;
      
      // Mettre à jour les données seulement si elles sont différentes pour éviter les re-renders inutiles
      setSocialAccounts(prev => {
        const newAccounts = profileData.socialAccounts;
        if (JSON.stringify(prev) !== JSON.stringify(newAccounts)) {
          return newAccounts;
        }
        return prev;
      });
      setSocialPosts(prev => {
        const newPosts = profileData.socialPosts;
        if (JSON.stringify(prev) !== JSON.stringify(newPosts)) {
          return newPosts;
        }
        return prev;
      });
      setPlaylists(prev => {
        const newPlaylists = profileData.playlists;
        if (JSON.stringify(prev) !== JSON.stringify(newPlaylists)) {
          return newPlaylists;
        }
        return prev;
      });
    } else if (previousDataRef.current && !isFetching) {
      // Si les données disparaissent mais qu'on a des données précédentes, les réutiliser
      // Cela évite la disparition des données pendant le rechargement
      const prev = previousDataRef.current;
      setSocialAccounts(prev.socialAccounts);
      setSocialPosts(prev.socialPosts);
      setPlaylists(prev.playlists);
    }
  }, [profileData, isFetching]);
  
  // Combiner le loading du profil avec les autres états de chargement
  // Ne pas mettre loading à true si on a déjà des données en cache ou des données précédentes
  useEffect(() => {
    if (profileLoading && !profileData && !previousDataRef.current) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [profileLoading, profileData]);

  useEffect(() => {
    if (!user) {
      setSocialAccounts(GUEST_SOCIAL_ACCOUNTS);
      setSocialPosts(GUEST_SOCIAL_POSTS);
      setPlaylists(GUEST_PLAYLISTS);
      setLoading(false);
      previousDataRef.current = null; // Réinitialiser les données précédentes
    }
  }, [user]);


  // Note: Les défis ont été migrés vers le système de publications
  // Ce code a été supprimé car il référençait l'ancien système de défis

  // Fonction pour recharger les données après ajout
  const refreshData = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Rechargement des données du profil...');
      setLoading(true);
      
      // Charger les données séparément pour éviter les conflits de jointures
      const [socialAccounts, socialPosts, playlists] = await Promise.all([
        UserProfileService.getSocialAccounts(user.id),
        UserProfileService.getSocialPosts(user.id),
        UserProfileService.getPlaylists(user.id)
      ]);
      
      setSocialAccounts(socialAccounts);
      setSocialPosts(socialPosts);
      setPlaylists(playlists);
      
      // Rafraîchir aussi les statistiques
      refreshStats();
      
      console.log('✅ Données rechargées:', {
        socialAccounts: socialAccounts.length,
        socialPosts: socialPosts.length,
        playlists: playlists.length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur lors du rechargement des données:', error);
      setLoading(false);
    }
  };

  // Fonctions de suppression
  const handleDeleteSocialAccount = async (accountId: string, platform: string, customName?: string) => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos réseaux sociaux.")) {
      return;
    }
    const displayName = customName || platform;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte "${displayName}" ?`)) {
      return;
    }
    
    try {
      await UserProfileService.deleteSocialAccount(accountId);
      await refreshData();
      toast({
        title: "Compte supprimé",
        description: `Le compte "${displayName}" a été supprimé.`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte social:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte social.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllSocialAccounts = () => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos réseaux sociaux.")) {
      return;
    }
    if (socialAccounts.length === 0) return;
    
    const count = socialAccounts.length;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer tous les ${count} réseaux sociaux ? Cette action est irréversible.`)) return;

    // Supprimer tous les comptes un par un
    const deletePromises = socialAccounts.map(account => 
      UserProfileService.deleteSocialAccount(account.id)
    );

    Promise.all(deletePromises)
      .then(async () => {
        await refreshData();
      toast({
          title: "Tous les comptes supprimés",
          description: `${count} réseaux sociaux ont été supprimés.`,
        });
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de certains comptes.",
          variant: "destructive",
        });
      });
  };

  const handleDeleteAllPlaylists = () => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos playlists.")) {
      return;
    }
    if (playlists.length === 0) return;
    
    const count = playlists.length;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer toutes les ${count} playlists ? Cette action est irréversible.`)) return;

    // Supprimer toutes les playlists un par un
    const deletePromises = playlists.map(playlist => 
      UserProfileService.deletePlaylist(playlist.id)
    );

    Promise.all(deletePromises)
      .then(async () => {
        await refreshData();
        toast({
          title: "Toutes les playlists supprimées",
          description: `${count} playlists ont été supprimées.`,
        });
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de certaines playlists.",
          variant: "destructive",
        });
      });
  };

  const handleDeleteSelectedSocialAccounts = async () => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos réseaux sociaux.")) {
      return;
    }
    if (selectedSocialAccounts.length === 0) return;
    
    const count = selectedSocialAccounts.length;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer les ${count} compte${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''} ?`)) return;

    try {
      const deletePromises = selectedSocialAccounts.map(accountId => 
        UserProfileService.deleteSocialAccount(accountId)
      );

      await Promise.all(deletePromises);
      await refreshData();
      setSelectedSocialAccounts([]);
      setIsDeleteSocialModalOpen(false);
      
      toast({
        title: "Comptes supprimés",
        description: `${count} compte${count > 1 ? 's' : ''} supprimé${count > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des comptes.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelectedPlaylists = async () => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos playlists.")) {
      return;
    }
    if (selectedPlaylists.length === 0) return;
    
    const count = selectedPlaylists.length;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer les ${count} playlist${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''} ?`)) return;

    try {
      const deletePromises = selectedPlaylists.map(playlistId => 
        UserProfileService.deletePlaylist(playlistId)
      );

      await Promise.all(deletePromises);
      await refreshData();
      setSelectedPlaylists([]);
      setIsDeletePlaylistModalOpen(false);
      
      toast({
        title: "Playlists supprimées",
        description: `${count} playlist${count > 1 ? 's' : ''} supprimée${count > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des playlists.",
        variant: "destructive",
      });
    }
  };

  const handleRenameAccount = async () => {
    if (!ensureAuthenticated("Connectez-vous pour renommer vos réseaux sociaux.")) {
      return;
    }
    if (!renamingAccountId || !renamingAccountName.trim()) return;
    
    try {
      await UserProfileService.updateSocialAccount(renamingAccountId, {
        custom_name: renamingAccountName.trim()
      });
      await refreshData();
      setRenamingAccountId(null);
      setRenamingAccountName('');
      toast({
        title: "Compte renommé",
        description: "Le nom du compte a été mis à jour.",
      });
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renommer le compte.",
        variant: "destructive",
      });
    }
  };

  const handleRenamePlaylist = async () => {
    if (!ensureAuthenticated("Connectez-vous pour renommer vos playlists.")) {
      return;
    }
    if (!renamingPlaylistId || !renamingPlaylistName.trim()) return;
    
    try {
      await UserProfileService.updatePlaylist(renamingPlaylistId, {
        name: renamingPlaylistName.trim(),
        updated_at: new Date().toISOString()
      });
      
      await refreshData();
      setRenamingPlaylistId(null);
      setRenamingPlaylistName('');
      
      toast({
        title: "Playlist renommée",
        description: "Le nom de la playlist a été mis à jour.",
      });
    } catch (error) {
      console.error('Erreur lors du renommage de la playlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renommer la playlist.",
        variant: "destructive",
      });
    }
  };

  const handleReorderSocialAccounts = async (newOrder: UserSocialAccount[]) => {
    if (!ensureAuthenticated("Connectez-vous pour organiser vos réseaux sociaux.")) {
      return;
    }
    try {
      // Mettre à jour l'état local immédiatement
      setSocialAccounts(newOrder);
      
      // Sauvegarder l'ordre en base de données
      const updatePromises = newOrder.map((account, index) => 
        UserProfileService.updateSocialAccount(account.id, { 
          order: index + 1,
          updated_at: new Date().toISOString()
        })
      );
      
      await Promise.all(updatePromises);
      
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des réseaux sociaux a été sauvegardé.",
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      // Recharger les données en cas d'erreur
      await refreshData();
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des réseaux sociaux.",
        variant: "destructive",
      });
    }
  };

  const handleReorderPlaylists = async (newOrder: UserContentPlaylist[]) => {
    if (!ensureAuthenticated("Connectez-vous pour organiser vos playlists.")) {
      return;
    }
    try {
      // Mettre à jour l'état local immédiatement
      setPlaylists(newOrder);
      
      // Sauvegarder l'ordre en base de données
      const updatePromises = newOrder.map((playlist, index) => 
        UserProfileService.updatePlaylist(playlist.id, { 
          order: index + 1,
          updated_at: new Date().toISOString()
        })
      );
      
      await Promise.all(updatePromises);
      
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des playlists a été sauvegardé.",
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des playlists:', error);
      // Recharger les données en cas d'erreur
      await refreshData();
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des playlists.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlaylist = async (playlistId: string, playlistName: string) => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos playlists.")) {
      return;
    }
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la playlist "${playlistName}" ?`)) return;
    
    try {
      await UserProfileService.deletePlaylist(playlistId);
      refreshData();
      // Si la playlist supprimée était sélectionnée, désélectionner
      if (selectedPlaylistId === playlistId) {
        selectPlaylist('');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la playlist:', error);
    }
  };

  const handleDeletePublication = async (postId: string, postTitle: string) => {
    if (!ensureAuthenticated("Connectez-vous pour gérer vos publications.")) {
      return;
    }
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la publication "${postTitle}" ?`)) return;
    
    try {
      await UserProfileService.deleteSocialPost(postId);
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication:', error);
    }
  };


const getNetworkIcon = (platform: string) => {
  switch ((platform || '').toLowerCase()) {
    case 'instagram':
      return Instagram;
    case 'youtube':
      return Youtube;
    case 'tiktok':
      return Music2;
    case 'facebook':
      return Facebook;
    case 'linkedin':
      return Linkedin;
    case 'twitter':
    case 'x':
      return Twitter;
    case 'twitch':
      return Twitch;
    case 'podcasts':
    case 'podcast':
      return Podcast;
    case 'blog':
      return BookOpen;
    case 'article':
      return FileText;
    default:
      return Globe;
  }
};

// Fonction pour obtenir la couleur du réseau social
const getNetworkColor = (platform: string) => {
  switch ((platform || '').toLowerCase()) {
    case 'instagram':
      return 'text-[#E4405F]';
    case 'youtube':
      return 'text-[#FF0000]';
    case 'tiktok':
      return 'text-[#000000]';
    case 'facebook':
      return 'text-[#1877F2]';
    case 'linkedin':
      return 'text-[#0077B5]';
    case 'twitter':
    case 'x':
      return 'text-[#1DA1F2]';
    case 'twitch':
      return 'text-[#9146FF]';
    case 'podcasts':
    case 'podcast':
      return 'text-[#993399]';
    default:
      return 'text-gray-500';
  }
};

const renderNetworkLabel = (label: string, platform: string) => {
  const Icon = getNetworkIcon(platform);
  const iconColor = getNetworkColor(platform);
  return (
    <span className="flex items-center gap-2 truncate">
      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
      <span className="truncate">{label}</span>
    </span>
  );
};


  // Données du profil utilisateur
  const userProfile = {
    name: user?.user_metadata?.full_name || "Utilisateur",
    profilePicture: user?.user_metadata?.avatar_url || null
  };


  const creatorMenuItems = [
    { icon: BookOpen, label: "Notes", path: "/notes", color: "text-blue-500" },
    { icon: Target, label: "Communauté", path: "/public-challenges", color: "text-orange-500" },
    { icon: Heart, label: "Favoris", path: "/profile/favorites", color: "text-red-500" },
    { icon: FileText, label: "Ressources", path: "/profile/resources", color: "text-green-500" },
    { icon: Calendar, label: "Historique", path: "/profile/history", color: "text-purple-500" },
    { icon: ClipboardList, label: "Publications", path: "/profile/publications", color: "text-teal-500" }
  ];

  const contributorMenuItems = [
    { icon: Target, label: "Communauté", path: "/public-challenges", color: "text-orange-500" },
    { icon: Users2, label: "Mes Contributions", path: "/my-contributions", color: "text-indigo-500" }
  ];

  const profileMenuItems = profileType === 'creator' ? creatorMenuItems : contributorMenuItems;

  const quickAddOptions: Array<{
    id: QuickAddTarget;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'network',
      label: 'Réseau social',
      description: 'Connecter un nouveau compte social',
      icon: Users
    },
    {
      id: 'playlist',
      label: 'Playlist',
      description: 'Organiser vos contenus par thématique',
      icon: ListPlus
    },
    {
      id: 'publication',
      label: 'Publication',
      description: 'Ajouter un contenu publié',
      icon: FileText
    }
  ];

  const renderSocialAccountChips = () => {
    if (loading) {
      return (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[80px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
          ))}
          <div className="min-w-[32px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
        </>
      );
    }

    if (user) {
      return (
        <Reorder.Group
          axis="x"
          values={socialAccounts}
          onReorder={handleReorderSocialAccounts}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        >
          {socialAccounts.map((account) => {
            const isSelected = selectedSocialNetworkId === account.id;
            return (
              <Reorder.Item
                key={account.id}
                value={account}
                className="min-w-[80px] flex-shrink-0"
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`text-xs h-8 w-full ${
                    isSelected ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectSocialNetwork(account.id);
                  }}
                >
                  {renderNetworkLabel(account.custom_name || account.platform, account.platform)}
                </Button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      );
    }

    return (
      <>
        {socialAccounts.map((account) => {
          const isSelected = selectedSocialNetworkId === account.id;
          return (
            <Button
              key={account.id}
              variant={isSelected ? "default" : "outline"}
              className="text-xs h-8 min-w-[80px] flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectSocialNetwork(account.id);
              }}
            >
              {renderNetworkLabel(account.custom_name || account.platform, account.platform)}
            </Button>
          );
        })}
      </>
    );
  };

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
          
          // Trouver le compte social associé à la publication
          const account = socialAccounts.find(acc => acc.id === post.social_account_id);
          const Icon = account ? getNetworkIcon(account.platform) : Globe;
          const iconColor = account ? getNetworkColor(account.platform) : 'text-gray-500';
          const accountName = account ? (account.custom_name || account.display_name || account.platform) : 'Réseau inconnu';
          
          return (
            <div key={post.id} className="group relative p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {accountName} • {date} à {time}
                      </p>
                    </div>
                    {user && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeletePublication(post.id, post.title);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Message d'information pour les utilisateurs non connectés */}
      {!user && (
        <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <LogIn className="w-4 h-4" />
              <span className="text-sm">
                Connectez-vous pour accéder à toutes les fonctionnalités de votre profil
              </span>
            </div>
          </div>
        </div>
      )}

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
              {/* Bouton d'authentification */}
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="flex items-center gap-2 z-10 relative"
                  title="Menu"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 z-10 relative"
                  title="Connexion"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Button>
              )}
              
              
              {/* Menu déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setIsShareModalOpen(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager le profil</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
            {profileType === 'creator' && (
              <Button
                variant="default"
                className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs text-center">Ajouter</span>
              </Button>
            )}
            {profileMenuItems.map((item, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(item.path);
                }}
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
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {renderSocialAccountChips()}
            </div>
        </div>
      </div>

      {/* Section 3: Playlists */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[80px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
                  ))}
                  <div className="min-w-[32px] h-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
                </>
              ) : !selectedSocialNetworkId ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Sélectionnez un réseau social pour voir ses playlists
                </div>
              ) : (
                <>
                  <div className="group relative min-w-[80px] flex-shrink-0">
                    <Button
                      variant={selectedPlaylistId === '' ? "default" : "outline"}
                      className={`text-xs h-8 w-full ${
                        selectedPlaylistId === '' ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectPlaylist('');
                      }}
                    >
                      Tout
                    </Button>
                  </div>
                  
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPlaylist(playlist.id);
                          }}
                        >
                          {playlist.name}
                        </Button>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeletePlaylist(playlist.id, playlist.name);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
        </div>
      </div>

      {/* Section Contenu avec onglets */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          {!user && (
            <div className="mb-4 text-center text-sm text-muted-foreground">
              Mode aperçu : connectez-vous pour créer, planifier et suivre votre contenu.
                </div>
          )}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-max min-w-full justify-start gap-1">
                <TabsTrigger value="publications" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  Contenu
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
              {renderPublications()}
            </TabsContent>
            
            {/* Onglet Accomplis */}
            <TabsContent value="completed" className="mt-6">
              <div className="space-y-3">
                {(() => {
                  const completedPosts = filteredPosts.filter(post => post.status === 'published');
                  if (completedPosts.length === 0) {
                    return (
                      <Card className="text-center py-12">
                        <CardContent>
                          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Aucune publication accomplie</h3>
                          <p className="text-muted-foreground">
                            Vous n'avez pas encore publié de contenu
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }
                  return completedPosts.map((post) => {
                    const publishedDate = post.published_date ? new Date(post.published_date) : new Date(post.created_at);
                    const date = publishedDate.toLocaleDateString('fr-FR');
                    const time = publishedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    
                    // Trouver le compte social associé à la publication
                    const account = socialAccounts.find(acc => acc.id === post.social_account_id);
                    const Icon = account ? getNetworkIcon(account.platform) : Globe;
                    const iconColor = account ? getNetworkColor(account.platform) : 'text-gray-500';
                    const accountName = account ? (account.custom_name || account.display_name || account.platform) : 'Réseau inconnu';
                    
                    return (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={`w-6 h-6 ${iconColor} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{post.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {accountName} • Publié le {date} à {time}
                                  </p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
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
                ) : user && networkStats ? (
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
                            {(() => {
                              const durationText = {
                                '1month': '1 mois',
                                '2months': '2 mois',
                                '3months': '3 mois',
                                '6months': '6 mois',
                                '1year': '1 an',
                                '2years': '2 ans',
                                '3years': '3 ans'
                              }[networkStats.program_duration] || '3 mois';
                              return `${durationText} • ${networkStats.contents_per_day} contenu(s) par jour • ${networkStats.required_publications} publications au total`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
          </Card>
                ) : user ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        Sélectionnez un réseau social pour voir ses statistiques
                    </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Statistiques (aperçu démo)
                      </CardTitle>
                      <CardDescription>
                        Exemples de progression calculés à partir des données invitées.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground">
                          Connectez-vous pour voir vos statistiques détaillées
                        </div>
                    </div>
                    </CardContent>
                  </Card>
                )}
                    </div>
            </TabsContent>
            
            {/* Onglet Corbeille */}
            <TabsContent value="trash" className="mt-6">
              <div className="space-y-3">
                {(() => {
                  const archivedPosts = filteredPosts.filter(post => post.status === 'archived');
                  if (archivedPosts.length === 0) {
                    return (
                      <Card className="text-center py-12">
                        <CardContent>
                          <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Corbeille vide</h3>
                          <p className="text-muted-foreground">
                            Aucune publication supprimée pour le moment
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }
                  return archivedPosts.map((post) => {
                    const deletedDate = new Date(post.updated_at || post.created_at || Date.now());
                    const date = deletedDate.toLocaleDateString('fr-FR');
                    const time = deletedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    
                    // Trouver le compte social associé à la publication
                    const account = socialAccounts.find(acc => acc.id === post.social_account_id);
                    const Icon = account ? getNetworkIcon(account.platform) : Globe;
                    const iconColor = account ? getNetworkColor(account.platform) : 'text-gray-500';
                    const accountName = account ? (account.custom_name || account.display_name || account.platform) : 'Réseau inconnu';
                    
                    return (
                      <Card key={post.id} className="hover:shadow-md transition-shadow border-red-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={`w-6 h-6 ${iconColor} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg text-foreground">{post.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {accountName} • Supprimé le {date} à {time}
                                  </p>
                                </div>
                                <Trash2 className="w-6 h-6 text-red-600 shrink-0" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
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
                      {account.custom_name || account.platform}
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

      {/* Menu d'ajout rapide */}
      <Dialog open={isQuickAddDialogOpen} onOpenChange={setIsQuickAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Que souhaitez-vous ajouter ?</DialogTitle>
            <DialogDescription>
              Choisissez un type de contenu à créer. Toutes les options sont accessibles depuis un seul endroit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {quickAddOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 text-left"
                onClick={() => handleQuickAddSelection(option.id)}
              >
                <div className="flex items-center gap-3">
                  <option.icon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'options d'édition des réseaux sociaux */}
      <Dialog open={isEditSocialModalOpen} onOpenChange={setIsEditSocialModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Options d'édition</DialogTitle>
            <DialogDescription>
              Que souhaitez-vous faire avec vos réseaux sociaux ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setIsEditSocialModalOpen(false);
                setIsReorderModalOpen(true);
              }}
            >
              <GripVertical className="w-4 h-4 mr-2" />
              Déplacer et réorganiser
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setIsEditSocialModalOpen(false);
                setIsRenameAllModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Renommer les comptes
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={() => {
                setIsEditSocialModalOpen(false);
                setIsDeleteSocialModalOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer des comptes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'options d'édition des playlists */}
      <Dialog open={isEditPlaylistModalOpen} onOpenChange={setIsEditPlaylistModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Options d'édition des playlists</DialogTitle>
            <DialogDescription>
              Que souhaitez-vous faire avec vos playlists ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setIsEditPlaylistModalOpen(false);
                setIsReorderPlaylistModalOpen(true);
              }}
            >
              <GripVertical className="w-4 h-4 mr-2" />
              Déplacer et réorganiser
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setIsEditPlaylistModalOpen(false);
                setIsRenameAllPlaylistModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Renommer les playlists
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={() => {
                setIsEditPlaylistModalOpen(false);
                setIsDeletePlaylistModalOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer des playlists
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de réorganisation */}
      <Dialog open={isReorderModalOpen} onOpenChange={setIsReorderModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Réorganiser vos réseaux sociaux</DialogTitle>
            <DialogDescription>
              Glissez-déposez pour réorganiser l'ordre de vos comptes sociaux.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Maintenez et glissez les comptes pour les réorganiser
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Reorder.Group
                axis="y"
                values={socialAccounts}
                onReorder={handleReorderSocialAccounts}
                className="space-y-2"
              >
                {socialAccounts.map((account) => (
                  <Reorder.Item
                    key={account.id}
                    value={account}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <div className="font-medium">{account.custom_name || account.platform}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.platform} • {account.username || 'Aucun nom d\'utilisateur'}
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsReorderModalOpen(false)}>
                Terminé
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de renommage de tous les comptes */}
      <Dialog open={isRenameAllModalOpen} onOpenChange={setIsRenameAllModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Renommer vos comptes sociaux</DialogTitle>
            <DialogDescription>
              Cliquez sur un compte pour le renommer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{account.custom_name || account.platform}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.platform} • {account.username || 'Aucun nom d\'utilisateur'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRenamingAccountId(account.id);
                      setRenamingAccountName(account.custom_name || account.platform);
                      setIsRenameAllModalOpen(false);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsRenameAllModalOpen(false)}>
                Terminé
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de renommage */}
      <Dialog open={renamingAccountId !== null} onOpenChange={() => setRenamingAccountId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer le compte</DialogTitle>
            <DialogDescription>
              Donnez un nom personnalisé à ce compte social.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rename-account">Nom personnalisé</Label>
              <Input
                id="rename-account"
                value={renamingAccountName}
                onChange={(e) => setRenamingAccountName(e.target.value)}
                placeholder="Ex: Mon compte principal"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameAccount();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRenamingAccountId(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleRenameAccount}
                disabled={!renamingAccountName.trim()}
                className="flex-1"
              >
                Renommer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de renommage des playlists */}
      <Dialog open={renamingPlaylistId !== null} onOpenChange={() => setRenamingPlaylistId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer la playlist</DialogTitle>
            <DialogDescription>
              Donnez un nouveau nom à cette playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playlist-name">Nom de la playlist</Label>
              <Input
                id="playlist-name"
                value={renamingPlaylistName}
                onChange={(e) => setRenamingPlaylistName(e.target.value)}
                placeholder="Entrez le nouveau nom"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRenamingPlaylistId(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleRenamePlaylist}
                disabled={!renamingPlaylistName.trim()}
                className="flex-1"
              >
                Renommer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de réorganisation des playlists */}
      <Dialog open={isReorderPlaylistModalOpen} onOpenChange={setIsReorderPlaylistModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Réorganiser vos playlists</DialogTitle>
            <DialogDescription>
              Glissez-déposez pour réorganiser l'ordre de vos playlists.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Maintenez et glissez les playlists pour les réorganiser
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Reorder.Group
                axis="y"
                values={playlists}
                onReorder={handleReorderPlaylists}
                className="space-y-2"
              >
                {playlists.map((playlist) => (
                  <Reorder.Item
                    key={playlist.id}
                    value={playlist}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <div className="font-medium">{playlist.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {playlist.description || 'Aucune description'}
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsReorderPlaylistModalOpen(false)}>
                Terminé
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de renommage de toutes les playlists */}
      <Dialog open={isRenameAllPlaylistModalOpen} onOpenChange={setIsRenameAllPlaylistModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Renommer vos playlists</DialogTitle>
            <DialogDescription>
              Cliquez sur une playlist pour la renommer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{playlist.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {playlist.description || 'Aucune description'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRenamingPlaylistId(playlist.id);
                      setRenamingPlaylistName(playlist.name);
                      setIsRenameAllPlaylistModalOpen(false);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsRenameAllPlaylistModalOpen(false)}>
                Terminé
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression sélective des réseaux sociaux */}
      <Dialog open={isDeleteSocialModalOpen} onOpenChange={setIsDeleteSocialModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supprimer des comptes sociaux</DialogTitle>
            <DialogDescription>
              Sélectionnez les comptes que vous souhaitez supprimer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSocialAccounts.includes(account.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSocialAccounts(prev => [...prev, account.id]);
                      } else {
                        setSelectedSocialAccounts(prev => prev.filter(id => id !== account.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{account.custom_name || account.platform}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.platform} • {account.username || 'Aucun nom d\'utilisateur'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSocialAccounts([]);
                  setIsDeleteSocialModalOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteSelectedSocialAccounts}
                disabled={selectedSocialAccounts.length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer ({selectedSocialAccounts.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression sélective des playlists */}
      <Dialog open={isDeletePlaylistModalOpen} onOpenChange={setIsDeletePlaylistModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supprimer des playlists</DialogTitle>
            <DialogDescription>
              Sélectionnez les playlists que vous souhaitez supprimer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlaylists(prev => [...prev, playlist.id]);
                      } else {
                        setSelectedPlaylists(prev => prev.filter(id => id !== playlist.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{playlist.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {playlist.description || 'Aucune description'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPlaylists([]);
                  setIsDeletePlaylistModalOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteSelectedPlaylists}
                disabled={selectedPlaylists.length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer ({selectedPlaylists.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default UserProfile;
