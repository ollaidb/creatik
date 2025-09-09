import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileService, UserSocialAccount } from '@/services/userProfileService';
import { ProgramSettingsService } from '@/services/programSettingsService';

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
    onClose();
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
          {socialAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Vous devez d'abord ajouter un réseau social</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mt-4"
              >
                Fermer
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="social_network">Réseau social *</Label>
                <Select
                  value={selectedSocialNetwork}
                  onValueChange={setSelectedSocialNetwork}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un réseau social" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.display_name || account.platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
      </div>
    </div>
  );
};
