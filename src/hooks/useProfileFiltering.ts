import { useState, useEffect, useMemo } from 'react';
import { UserSocialAccount, UserSocialPost, UserContentPlaylist } from '@/services/userProfileService';
import { ProgramSettingsService } from '@/services/programSettingsService';

export interface ProfileFilteringState {
  // États de sélection
  selectedSocialNetworkId: string;
  selectedPlaylistId: string;
  
  // Données filtrées
  filteredPosts: UserSocialPost[];
  filteredPlaylists: UserContentPlaylist[];
  filteredChallenges: any[];
  
  // Paramètres de programmation
  programSettings: {
    duration: string;
    contentsPerDay: number;
  } | null;
  
  // États de chargement
  loading: boolean;
  error: string | null;
}

export const useProfileFiltering = (
  socialAccounts: UserSocialAccount[],
  socialPosts: UserSocialPost[],
  playlists: UserContentPlaylist[],
  userChallenges: any[],
  userId: string
) => {
  const [selectedSocialNetworkId, setSelectedSocialNetworkId] = useState<string>('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [programSettings, setProgramSettings] = useState<{
    duration: string;
    contentsPerDay: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sélectionner automatiquement le premier réseau social
  useEffect(() => {
    if (socialAccounts.length > 0 && !selectedSocialNetworkId) {
      setSelectedSocialNetworkId(socialAccounts[0].id);
    }
  }, [socialAccounts, selectedSocialNetworkId]);

  // Charger les paramètres de programmation pour le réseau sélectionné
  useEffect(() => {
    const loadProgramSettings = async () => {
      if (!selectedSocialNetworkId || !userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Charger les paramètres pour le réseau sélectionné (sans playlist spécifique)
        const settings = await ProgramSettingsService.getUserProgramSettings(userId);
        const networkSettings = settings.find(s => 
          s.social_account_id === selectedSocialNetworkId && 
          s.playlist_id === null // Paramètres généraux du réseau, pas d'une playlist spécifique
        );
        
        if (networkSettings) {
          setProgramSettings({
            duration: networkSettings.duration,
            contentsPerDay: networkSettings.contents_per_day
          });
        } else {
          setProgramSettings(null);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
        setError('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    loadProgramSettings();
  }, [selectedSocialNetworkId, userId]);

  // Filtrer les playlists selon le réseau social sélectionné
  const filteredPlaylists = useMemo(() => {
    if (!selectedSocialNetworkId) return playlists;
    
    return playlists.filter(playlist => 
      playlist.social_network_id === selectedSocialNetworkId
    );
  }, [playlists, selectedSocialNetworkId]);

  // Filtrer les publications selon le réseau social et la playlist sélectionnés
  const filteredPosts = useMemo(() => {
    let posts = socialPosts;
    
    // Filtrer par réseau social
    if (selectedSocialNetworkId) {
      posts = posts.filter(post => post.social_account_id === selectedSocialNetworkId);
    }
    
    // Filtrer par playlist si une playlist spécifique est sélectionnée (pas "Tout")
    if (selectedPlaylistId && selectedPlaylistId !== '') {
      posts = posts.filter(post => post.playlist_id === selectedPlaylistId);
    }
    // Si selectedPlaylistId est vide (option "Tout"), on garde toutes les publications du réseau
    
    return posts;
  }, [socialPosts, selectedSocialNetworkId, selectedPlaylistId]);

  // Filtrer les défis selon le réseau social et la playlist sélectionnés
  const filteredChallenges = useMemo(() => {
    let challenges = userChallenges;
    
    // Filtrer par réseau social
    if (selectedSocialNetworkId) {
      challenges = challenges.filter(challenge => 
        challenge.social_account_id === selectedSocialNetworkId
      );
    }
    
    // Filtrer par playlist si une playlist spécifique est sélectionnée (pas "Tout")
    if (selectedPlaylistId && selectedPlaylistId !== '') {
      challenges = challenges.filter(challenge => 
        challenge.playlist_id === selectedPlaylistId
      );
    }
    // Si selectedPlaylistId est vide (option "Tout"), on garde tous les défis du réseau
    
    return challenges;
  }, [userChallenges, selectedSocialNetworkId, selectedPlaylistId]);

  // Fonction pour changer de réseau social
  const selectSocialNetwork = (networkId: string) => {
    setSelectedSocialNetworkId(networkId);
    setSelectedPlaylistId(''); // Reset playlist selection
  };

  // Fonction pour changer de playlist
  const selectPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedPlaylistId('');
    if (socialAccounts.length > 0) {
      setSelectedSocialNetworkId(socialAccounts[0].id);
    }
  };

  // Fonction pour obtenir les statistiques filtrées
  const getFilteredStats = () => {
    return {
      totalPosts: filteredPosts.length,
      totalPlaylists: filteredPlaylists.length,
      totalChallenges: filteredChallenges.length,
      completedChallenges: filteredChallenges.filter(c => c.status === 'completed').length,
      programSettings
    };
  };

  return {
    // États
    selectedSocialNetworkId,
    selectedPlaylistId,
    filteredPosts,
    filteredPlaylists,
    filteredChallenges,
    programSettings,
    loading,
    error,
    
    // Actions
    selectSocialNetwork,
    selectPlaylist,
    resetFilters,
    getFilteredStats
  };
};
