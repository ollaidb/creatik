import React, { useState } from 'react';
import { X, Instagram, Youtube, Facebook, Twitter, Linkedin, Twitch, Music2, Podcast, Globe, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileService, UserSocialAccount } from '@/services/userProfileService';
import { ProgramSettingsService } from '@/services/programSettingsService';
import { AddSocialAccountModal } from './AddSocialAccountModal';

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  socialAccounts: UserSocialAccount[];
  preselectedSocialNetworkId?: string;
}

export const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  socialAccounts,
  preselectedSocialNetworkId
}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [selectedSocialNetwork, setSelectedSocialNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);

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

  // Pré-sélectionner le réseau social quand la modal s'ouvre
  React.useEffect(() => {
    if (isOpen && preselectedSocialNetworkId) {
      setSelectedSocialNetwork(preselectedSocialNetworkId);
    }
  }, [isOpen, preselectedSocialNetworkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim() || !selectedSocialNetwork) return;

    try {
      setLoading(true);
      
      // Créer la playlist
      await UserProfileService.addPlaylist({
        user_id: userId,
        social_network_id: selectedSocialNetwork,
        name: playlistName.trim(),
        description: undefined,
        color: '#3B82F6',
        is_public: false
      });
      
      // Vérifier si les paramètres de programmation existent déjà pour ce réseau
      // Si oui, ne rien faire. Si non, créer des paramètres par défaut
      try {
        const { data: existingSettings } = await ProgramSettingsService.getUserProgramSettings(userId);
        const hasNetworkSettings = existingSettings.some(s => 
          s.social_account_id === selectedSocialNetwork && s.playlist_id === null
        );
        
        if (!hasNetworkSettings) {
          await ProgramSettingsService.upsertProgramSettings(userId, {
            social_account_id: selectedSocialNetwork,
            playlist_id: null, // Paramètres généraux du réseau
            duration: '3months',
            contents_per_day: 1
          });
        }
      } catch (programError) {
        console.warn('Erreur lors de la vérification/création des paramètres de programmation:', programError);
        // Ne pas bloquer la création de la playlist si les paramètres échouent
      }
      
      onSuccess();
      onClose();
      setPlaylistName('');
      setSelectedSocialNetwork('');
    } catch (error) {
      console.error('Erreur lors de la création de la playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPlaylistName('');
    setSelectedSocialNetwork('');
    setIsAddSocialModalOpen(false);
    onClose();
  };

  const handleAddSocialAccountSuccess = () => {
    setIsAddSocialModalOpen(false);
    onSuccess(); // Rafraîchir les données pour obtenir les nouveaux comptes sociaux
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Créer une playlist</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="social_network">Réseau social *</Label>
            {socialAccounts.length === 0 ? (
              <div className="space-y-3">
                <div className="text-center py-4 text-muted-foreground border border-dashed rounded-lg p-4">
                  <p className="mb-3">Aucun réseau social disponible</p>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setIsAddSocialModalOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer un réseau social
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Select
                  value={selectedSocialNetwork}
                  onValueChange={setSelectedSocialNetwork}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un réseau social">
                      {selectedSocialNetwork && (() => {
                        const selectedAccount = socialAccounts.find(acc => acc.id === selectedSocialNetwork);
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddSocialModalOpen(true)}
                  className="w-full gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer un nouveau réseau social
                </Button>
              </div>
            )}
          </div>

          {socialAccounts.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la playlist *</Label>
                <Input
                  id="name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Ma super playlist"
                  required
                  autoFocus
                />
              </div>

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
                  type="submit"
                  disabled={loading || !playlistName.trim() || !selectedSocialNetwork}
                  className="flex-1"
                >
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Modale pour créer un nouveau réseau social */}
        <AddSocialAccountModal
          isOpen={isAddSocialModalOpen}
          onClose={() => setIsAddSocialModalOpen(false)}
          onSuccess={handleAddSocialAccountSuccess}
          userId={userId}
          existingPlatforms={socialAccounts.map(account => account.platform)}
        />
      </div>
    </div>
  );
};
