import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  EyeOff,
  Users,
  UserCheck,
  Globe,
  Lock,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [isEditing, setIsEditing] = useState(false);

  // État des paramètres de confidentialité
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // 'public' | 'private'
    showEmail: false,
    showPhone: false,
    showBio: true,
    allowMessages: true,
    showOnlineStatus: true,
    allowDataCollection: true,
    allowMarketing: false,
    allowAnalytics: true
  });

  // État du statut créateur
  const [creatorStatus, setCreatorStatus] = useState({
    isCreator: true,
    creatorType: 'influencer', // 'influencer' | 'content_creator' | 'business'
    verified: false,
    publicProfile: true,
    showEarnings: false
  });

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleCreatorChange = (setting: string, value: any) => {
    setCreatorStatus(prev => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    console.log('Sauvegarde des paramètres de confidentialité:', privacySettings);
    console.log('Sauvegarde du statut créateur:', creatorStatus);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Confidentialité</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez votre vie privée et votre statut créateur
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Annuler" : "Modifier"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Visibilité du profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visibilité du profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Type de profil</Label>
                    <p className="text-sm text-muted-foreground">
                      Choisissez qui peut voir votre profil
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={privacySettings.profileVisibility === 'public' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePrivacyChange('profileVisibility', 'public')}
                      disabled={!isEditing}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Public
                    </Button>
                    <Button
                      variant={privacySettings.profileVisibility === 'private' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePrivacyChange('profileVisibility', 'private')}
                      disabled={!isEditing}
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Privé
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Afficher l'email</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux autres utilisateurs de voir votre email
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showEmail}
                      onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Afficher le téléphone</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux autres utilisateurs de voir votre numéro
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showPhone}
                      onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Afficher la biographie</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux autres utilisateurs de voir votre biographie
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showBio}
                      onCheckedChange={(checked) => handlePrivacyChange('showBio', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Autoriser les messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux autres utilisateurs de vous envoyer des messages
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statut créateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Statut créateur
                {creatorStatus.verified && (
                  <Badge variant="default" className="ml-2">
                    Vérifié
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Être créateur de contenu</Label>
                    <p className="text-sm text-muted-foreground">
                      Activez votre statut de créateur pour accéder aux fonctionnalités avancées
                    </p>
                  </div>
                  <Switch
                    checked={creatorStatus.isCreator}
                    onCheckedChange={(checked) => handleCreatorChange('isCreator', checked)}
                    disabled={!isEditing}
                  />
                </div>

                {creatorStatus.isCreator && (
                  <>
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Type de créateur</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={creatorStatus.creatorType === 'influencer' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCreatorChange('creatorType', 'influencer')}
                          disabled={!isEditing}
                        >
                          Influenceur
                        </Button>
                        <Button
                          variant={creatorStatus.creatorType === 'content_creator' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCreatorChange('creatorType', 'content_creator')}
                          disabled={!isEditing}
                        >
                          Créateur de contenu
                        </Button>
                        <Button
                          variant={creatorStatus.creatorType === 'business' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCreatorChange('creatorType', 'business')}
                          disabled={!isEditing}
                        >
                          Entreprise
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Profil public créateur</Label>
                        <p className="text-sm text-muted-foreground">
                          Rendre votre profil créateur visible publiquement
                        </p>
                      </div>
                      <Switch
                        checked={creatorStatus.publicProfile}
                        onCheckedChange={(checked) => handleCreatorChange('publicProfile', checked)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Afficher les revenus</Label>
                        <p className="text-sm text-muted-foreground">
                          Afficher vos revenus de créateur (optionnel)
                        </p>
                      </div>
                      <Switch
                        checked={creatorStatus.showEarnings}
                        onCheckedChange={(checked) => handleCreatorChange('showEarnings', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Paramètres de données */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Protection des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Collecte de données</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser la collecte de données pour améliorer l'expérience
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDataCollection}
                    onCheckedChange={(checked) => handlePrivacyChange('allowDataCollection', checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des communications marketing
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowMarketing}
                    onCheckedChange={(checked) => handlePrivacyChange('allowMarketing', checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Partager des données anonymes pour les statistiques
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowAnalytics}
                    onCheckedChange={(checked) => handlePrivacyChange('allowAnalytics', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bouton de sauvegarde */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end"
          >
            <Button onClick={handleSave} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </motion.div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default PrivacySettings;
