import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileService } from '@/services/userProfileService';
import { SocialNetworksService, SocialNetwork } from '@/services/socialNetworksService';
import { ProgramSettingsService, ProgramSettingsInput } from '@/services/programSettingsService';

interface AddSocialAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  existingPlatforms: string[];
}

export const AddSocialAccountModal: React.FC<AddSocialAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  existingPlatforms
}) => {
  const [loading, setLoading] = useState(false);
  const [allSocialNetworks, setAllSocialNetworks] = useState<SocialNetwork[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(true);
  
  // États pour le workflow en 3 étapes
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [createPlaylist, setCreatePlaylist] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  const [programSettings, setProgramSettings] = useState({
    duration: '3months',
    contentsPerDay: 1
  });

  // Charger tous les réseaux sociaux de l'application
  useEffect(() => {
    const loadSocialNetworks = async () => {
      try {
        setLoadingNetworks(true);
        const networks = await SocialNetworksService.getAllSocialNetworks();
        setAllSocialNetworks(networks);
      } catch (error) {
        console.error('Erreur lors du chargement des réseaux sociaux:', error);
        setAllSocialNetworks(SocialNetworksService.getDefaultSocialNetworks());
      } finally {
        setLoadingNetworks(false);
      }
    };

    if (isOpen) {
      loadSocialNetworks();
    }
  }, [isOpen]);

  // Réinitialiser les états quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedPlatform('');
      setCreatePlaylist(true);
      setPlaylistName('');
      setProgramSettings({
        duration: '3months',
        contentsPerDay: 1
      });
    }
  }, [isOpen]);

  const handleAddPlatform = async () => {
    try {
      setLoading(true);
      
      // Générer un nom d'utilisateur unique avec timestamp
      const timestamp = Date.now();
      const uniqueUsername = `@${selectedPlatform}_user_${timestamp}`;
      
      // 1. Créer le compte social
      const socialAccount = await UserProfileService.addSocialAccount({
        user_id: userId,
        platform: selectedPlatform,
        username: uniqueUsername,
        display_name: selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1),
        profile_url: `https://${selectedPlatform}.com/${uniqueUsername}`,
        is_active: true
      });

      let playlist = null;
      
      // 2. Créer la playlist (optionnel)
      if (createPlaylist) {
        playlist = await UserProfileService.addPlaylist({
          user_id: userId,
          name: playlistName || `${selectedPlatform} - Playlist`,
          description: `Playlist pour ${selectedPlatform}`,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          social_network_id: socialAccount.id
        });
      }

      // 3. Programmer les défis (toujours au niveau du réseau social, pas de la playlist)
      // La programmation s'applique à TOUTES les playlists du réseau, pas à une playlist spécifique
      const settingsInput: ProgramSettingsInput = {
        social_account_id: socialAccount.id,
        playlist_id: null, // Toujours null pour la programmation générale du réseau
        duration: programSettings.duration,
        contents_per_day: programSettings.contentsPerDay
      };

      await ProgramSettingsService.upsertProgramSettings(userId, settingsInput);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du compte social:', error);
      
      // Afficher un message d'erreur plus clair
      if (error.code === '23505') {
        alert(`❌ ${selectedPlatform} est déjà ajouté à votre profil.`);
      } else {
        alert(`❌ Erreur lors de l'ajout de ${selectedPlatform}. Veuillez réessayer.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les réseaux disponibles (pas encore ajoutés par l'utilisateur)
  const availablePlatforms = allSocialNetworks.filter(
    network => !existingPlatforms.includes(network.name)
  );

  const handleClose = () => {
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choisir le réseau social";
      case 2: return "Créer une playlist";
      case 3: return "Programmer les défis";
      default: return "Ajouter un réseau social";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Sélectionnez le réseau social que vous souhaitez ajouter";
      case 2: return "Créez une playlist pour organiser vos contenus";
      case 3: return "Configurez la durée et le nombre de contenus par jour";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{getStepTitle()}</h2>
            <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicateur de progression */}
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          {loadingNetworks ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des réseaux sociaux...</p>
            </div>
          ) : availablePlatforms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Tous les réseaux sociaux sont déjà ajoutés</p>
              <Button
                variant="outline"
                onClick={onClose}
                className="mt-4"
              >
                Fermer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Étape 1: Sélection du réseau */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {availablePlatforms.map((network) => (
                      <Button
                        key={network.name}
                        variant={selectedPlatform === network.name ? "default" : "outline"}
                        onClick={() => setSelectedPlatform(network.name)}
                        className="flex items-center justify-center h-10 w-full"
                      >
                        <span className="font-medium">{network.display_name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 2: Création de playlist */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Voulez-vous créer une playlist pour ce réseau ?</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={createPlaylist ? "default" : "outline"}
                        onClick={() => setCreatePlaylist(true)}
                        className="flex-1"
                      >
                        Oui, créer une playlist
                      </Button>
                      <Button
                        variant={!createPlaylist ? "default" : "outline"}
                        onClick={() => setCreatePlaylist(false)}
                        className="flex-1"
                      >
                        Non, pas maintenant
                      </Button>
                    </div>
                  </div>
                  
                  {createPlaylist && (
                    <div>
                      <Label htmlFor="playlist-name">Nom de la playlist</Label>
                      <Input
                        id="playlist-name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder={`${selectedPlatform} - Ma playlist`}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Étape 3: Programmation des défis (toujours affichée) */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="duration">Durée du programme</Label>
                    <Select
                      value={programSettings.duration}
                      onValueChange={(value) => setProgramSettings(prev => ({ ...prev, duration: value }))}
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
                        onClick={() => setProgramSettings(prev => ({ 
                          ...prev, 
                          contentsPerDay: Math.max(1, prev.contentsPerDay - 1) 
                        }))}
                        className="w-10 h-10 p-0"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-lg font-semibold">{programSettings.contentsPerDay}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProgramSettings(prev => ({ 
                          ...prev, 
                          contentsPerDay: prev.contentsPerDay + 1 
                        }))}
                        className="w-10 h-10 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex gap-2 pt-4">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Précédent
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !selectedPlatform) ||
                      (currentStep === 2 && createPlaylist && !playlistName.trim())
                    }
                    className="flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddPlatform}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Création..." : "Créer"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
