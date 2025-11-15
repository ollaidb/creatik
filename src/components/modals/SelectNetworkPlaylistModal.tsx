import React, { useState, useEffect } from 'react';
import { X, Instagram, Youtube, Facebook, Twitter, Linkedin, Twitch, Music2, Podcast, Globe, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileService, UserSocialAccount, UserSocialPost, UserContentPlaylist } from '@/services/userProfileService';

interface SelectNetworkPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (socialAccountId: string, playlistId?: string) => void;
  userId: string;
  socialAccounts: UserSocialAccount[];
  playlists: UserContentPlaylist[];
  title: string;
}

export const SelectNetworkPlaylistModal: React.FC<SelectNetworkPlaylistModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userId,
  socialAccounts,
  playlists,
  title
}) => {
  const [selectedSocialAccountId, setSelectedSocialAccountId] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<UserContentPlaylist[]>([]);

  // Fonction pour obtenir l'icône du réseau social
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

  // Réinitialiser les sélections quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      if (socialAccounts.length > 0) {
        setSelectedSocialAccountId(socialAccounts[0].id);
      } else {
        setSelectedSocialAccountId('');
      }
      setSelectedPlaylistId('');
    }
  }, [isOpen, socialAccounts]);

  // Filtrer les playlists selon le réseau social sélectionné
  useEffect(() => {
    if (selectedSocialAccountId) {
      const selectedAccount = socialAccounts.find(acc => acc.id === selectedSocialAccountId);
      if (selectedAccount) {
        // Filtrer les playlists qui correspondent au réseau social sélectionné
        const filtered = playlists.filter(playlist => 
          playlist.social_network_id === selectedAccount.platform
        );
        setFilteredPlaylists(filtered);
        // Réinitialiser la sélection de playlist si elle n'est plus valide
        if (selectedPlaylistId && !filtered.find(p => p.id === selectedPlaylistId)) {
          setSelectedPlaylistId('');
        }
      } else {
        setFilteredPlaylists([]);
      }
    } else {
      setFilteredPlaylists([]);
    }
  }, [selectedSocialAccountId, playlists, socialAccounts, selectedPlaylistId]);

  const handleConfirm = () => {
    if (!selectedSocialAccountId) return;
    onConfirm(selectedSocialAccountId, selectedPlaylistId || undefined);
    onClose();
  };

  const handleClose = () => {
    setSelectedSocialAccountId('');
    setSelectedPlaylistId('');
    onClose();
  };

  if (!isOpen) return null;

  // Si aucun réseau social n'est disponible, ajouter directement
  if (socialAccounts.length === 0) {
    // On peut ajouter directement sans sélection
    // Cette situation devrait être gérée par le composant parent
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Ajouter aux publications</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Aperçu du titre */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-foreground line-clamp-2">{title}</p>
            </div>
          </div>

          {/* Sélection du réseau social */}
          <div className="space-y-2">
            <Label htmlFor="social_account">Réseau social *</Label>
            <Select
              value={selectedSocialAccountId}
              onValueChange={(value) => {
                setSelectedSocialAccountId(value);
                setSelectedPlaylistId(''); // Réinitialiser la playlist lors du changement de réseau
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un réseau social">
                  {selectedSocialAccountId && (() => {
                    const selectedAccount = socialAccounts.find(acc => acc.id === selectedSocialAccountId);
                    if (!selectedAccount) return null;
                    const Icon = getNetworkIcon(selectedAccount.platform);
                    const iconColor = getNetworkColor(selectedAccount.platform);
                    return (
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                        <span>{selectedAccount.custom_name || selectedAccount.display_name || selectedAccount.platform}</span>
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {socialAccounts.map((account) => {
                  const Icon = getNetworkIcon(account.platform);
                  const iconColor = getNetworkColor(account.platform);
                  return (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                        <span className="font-medium">{account.custom_name || account.display_name || account.platform}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de la playlist (optionnel) */}
          {selectedSocialAccountId && (
            <div className="space-y-2">
              <Label htmlFor="playlist">Playlist (optionnel)</Label>
              <Select
                value={selectedPlaylistId}
                onValueChange={(value) => setSelectedPlaylistId(value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    filteredPlaylists.length === 0 
                      ? "Aucune playlist disponible (optionnel)" 
                      : "Sélectionner une playlist (optionnel)"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune playlist</SelectItem>
                  {filteredPlaylists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: playlist.color }}
                        />
                        <span>{playlist.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedSocialAccountId}
              className="flex-1"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

