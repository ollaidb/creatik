import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileService, UserSocialAccount, UserSocialPost, UserContentPlaylist } from '@/services/userProfileService';

interface AddPublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  socialAccounts: UserSocialAccount[];
  playlists: UserContentPlaylist[];
}

export const AddPublicationModal: React.FC<AddPublicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  socialAccounts,
  playlists
}) => {
  const [formData, setFormData] = useState({
    social_account_id: '',
    playlist_id: '',
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [filteredPlaylists, setFilteredPlaylists] = useState<UserContentPlaylist[]>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        social_account_id: socialAccounts.length > 0 ? socialAccounts[0].id : '',
        playlist_id: '',
        title: ''
      });
    }
  }, [isOpen, socialAccounts]);

  // Filtrer les playlists selon le réseau social sélectionné
  useEffect(() => {
    if (formData.social_account_id) {
      const filtered = playlists.filter(playlist => playlist.social_network_id === formData.social_account_id);
      setFilteredPlaylists(filtered);
      // Réinitialiser la playlist si elle n'est plus valide
      if (formData.playlist_id && !filtered.find(p => p.id === formData.playlist_id)) {
        setFormData(prev => ({ ...prev, playlist_id: '' }));
      }
    } else {
      setFilteredPlaylists([]);
    }
  }, [formData.social_account_id, playlists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.social_account_id || !formData.playlist_id || !formData.title.trim()) return;

    try {
      setLoading(true);
      
      // Créer la publication
      const publicationData: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        social_account_id: formData.social_account_id,
        title: formData.title.trim(),
        content: undefined,
        status: 'published',
        scheduled_date: undefined,
        published_date: new Date().toISOString(),
        engagement_data: null
      };

      const newPost = await UserProfileService.addSocialPost(publicationData);
      
      // Ajouter la publication à la playlist
      await UserProfileService.addPostToPlaylist(formData.playlist_id, newPost.id);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la publication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      social_account_id: '',
      playlist_id: '',
      title: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Créer une publication</h2>
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
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
                <Label htmlFor="social_account">Réseau social *</Label>
                <Select
                  value={formData.social_account_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, social_account_id: value, playlist_id: '' }))}
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

              <div className="space-y-2">
                <Label htmlFor="playlist">Playlist *</Label>
                <Select
                  value={formData.playlist_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, playlist_id: value }))}
                  disabled={!formData.social_account_id || filteredPlaylists.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.social_account_id 
                        ? "Sélectionnez d'abord un réseau social" 
                        : filteredPlaylists.length === 0 
                          ? "Aucune playlist disponible" 
                          : "Sélectionner une playlist"
                    } />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="space-y-2">
                <Label htmlFor="title">Titre de la publication *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de votre publication"
                  required
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
                  disabled={loading || !formData.social_account_id || !formData.playlist_id || !formData.title.trim()}
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
