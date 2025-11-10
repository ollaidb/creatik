import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  Globe,
  Loader2,
  Lock,
  Save,
  Shield,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ProfileVisibility = 'public' | 'private';

type CreatorProfileSummary = {
  id: string;
  name: string | null;
  is_public: boolean | null;
};

const VISIBILITY_COPY: Record<
  ProfileVisibility,
  { summary: string; detail: string; title: string }
> = {
  public: {
    title: 'Profil public',
    summary: 'Visible par toute la communauté Creatik.',
    detail:
      'Vos publications approuvées et vos playlists publiques sont accessibles aux visiteurs.',
  },
  private: {
    title: 'Profil privé',
    summary: 'Réservé à votre usage personnel.',
    detail:
      'Seuls vous et vos collaborateurs internes pouvez voir vos contenus et statistiques.',
  },
};

const getInitialProfileType = () => {
  if (typeof window === 'undefined') {
    return 'creator';
  }
  const stored = window.localStorage.getItem('userProfileType');
  return stored === 'contributor' ? 'contributor' : 'creator';
};

const getCurrentProfileType = () => {
  if (typeof window === 'undefined') {
    return 'creator';
  }
  return window.location.pathname.includes('contributor-profile')
    ? 'contributor'
    : 'creator';
};

const PrivacySettings: React.FC = () => {
  const { navigateBack } = useSmartNavigation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfileSummary[]>([]);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private' as ProfileVisibility,
    allowDataCollection: true,
    allowMarketing: false,
    allowAnalytics: true,
  });

  const [creatorStatus, setCreatorStatus] = useState({
    isCreator: true,
    creatorType: getInitialProfileType(),
    verified: false,
    publicProfile: false,
    showEarnings: false,
  });

  const loadCreatorProfiles = useCallback(async () => {
    if (!user) {
      setCreatorProfiles([]);
      setPrivacySettings((prev) => ({ ...prev, profileVisibility: 'private' }));
      setCreatorStatus((prev) => ({ ...prev, publicProfile: false }));
      setLoadingCreators(false);
      return;
    }

    try {
      setLoadingCreators(true);
      const { data, error } = await supabase
        .from('creators')
        .select('id, name, is_public')
        .eq('owner_user_id', user.id);

      if (error) {
        throw error;
      }

      const profiles: CreatorProfileSummary[] = (data || []).map((profile) => ({
        id: profile.id,
        name: profile.name ?? null,
        is_public: profile.is_public ?? false,
      }));

      const hasPublicProfile = profiles.some((profile) => profile.is_public);

      setCreatorProfiles(profiles);
      setPrivacySettings((prev) => ({
        ...prev,
        profileVisibility: hasPublicProfile ? 'public' : 'private',
      }));
      setCreatorStatus((prev) => ({
        ...prev,
        publicProfile: hasPublicProfile,
      }));
    } catch (error) {
      console.error('Erreur chargement profils créateur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la visibilité de votre profil public.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCreators(false);
    }
  }, [user, toast]);

  useEffect(() => {
    void loadCreatorProfiles();
  }, [loadCreatorProfiles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('profileVisibility', privacySettings.profileVisibility);
    }
  }, [privacySettings.profileVisibility]);

  const handlePrivacyChange = (visibility: ProfileVisibility) => {
    setPrivacySettings((prev) => ({ ...prev, profileVisibility: visibility }));
    setCreatorStatus((prev) => ({ ...prev, publicProfile: visibility === 'public' }));
  };

  const handleCreatorChange = (type: 'creator' | 'contributor') => {
    setCreatorStatus((prev) => ({ ...prev, creatorType: type }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour modifier la visibilité de votre profil.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const newVisibilityIsPublic = privacySettings.profileVisibility === 'public';

      if (creatorProfiles.length > 0) {
        const { error } = await supabase
          .from('creators')
          .update({ is_public: newVisibilityIsPublic })
          .eq('owner_user_id', user.id);

        if (error) {
          throw error;
        }

        toast({
          title: newVisibilityIsPublic
            ? 'Profil public activé'
            : 'Profil passé en privé',
          description: newVisibilityIsPublic
            ? 'Votre profil créateur est désormais visible par la communauté.'
            : 'Votre profil créateur n’est plus accessible publiquement.',
        });
      } else if (newVisibilityIsPublic) {
        toast({
          title: 'Aucun profil créateur',
          description:
            "Publiez d'abord votre profil créateur via la page Publications pour l'activer en public.",
          variant: 'destructive',
        });
        setPrivacySettings((prev) => ({ ...prev, profileVisibility: 'private' }));
        setCreatorStatus((prev) => ({ ...prev, publicProfile: false }));
      }

      window.localStorage.setItem('userProfileType', creatorStatus.creatorType);

      setIsEditing(false);
      await loadCreatorProfiles();
    } catch (error) {
      console.error('Erreur sauvegarde visibilité profil:', error);
      toast({
        title: 'Erreur de sauvegarde',
        description:
          'Une erreur est survenue lors de la mise à jour de la visibilité de votre profil public.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCreatorStatus((prev) => ({ ...prev, creatorType: getCurrentProfileType() }));
    setIsEditing(false);
    void loadCreatorProfiles();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
                  Gérez la visibilité de votre profil créateur public.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              variant={isEditing ? 'outline' : 'default'}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visibilité du profil public
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choisissez si votre profil créateur doit être visible par tout le monde ou
                rester privé. Ce paramètre impacte les pages communauté qui affichent vos
                publications.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant={
                    privacySettings.profileVisibility === 'public' ? 'default' : 'outline'
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePrivacyChange('public')}
                  disabled={!isEditing || loadingCreators || saving}
                >
                  <Globe className="w-4 h-4" />
                  Profil public
                </Button>
                <Button
                  variant={
                    privacySettings.profileVisibility === 'private' ? 'default' : 'outline'
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePrivacyChange('private')}
                  disabled={!isEditing || loadingCreators || saving}
                >
                  <Lock className="w-4 h-4" />
                  Profil privé
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
                <p className="font-medium text-foreground">
                  {VISIBILITY_COPY[privacySettings.profileVisibility].title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {VISIBILITY_COPY[privacySettings.profileVisibility].summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {VISIBILITY_COPY[privacySettings.profileVisibility].detail}
                </p>
              </div>

              {creatorProfiles.length === 0 && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span>
                    Aucun profil créateur n’est encore lié à votre compte. Publiez votre
                    profil via l’onglet Publications pour l’activer publiquement.
                  </span>
                </div>
              )}

              {loadingCreators && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement de vos profils créateurs…
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Statut utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Type de profil</Label>
              <p className="text-sm text-muted-foreground">
                Sélectionnez le mode de navigation principal que vous souhaitez utiliser.
              </p>
              <div className="flex gap-2">
                <Button
                  variant={creatorStatus.creatorType === 'creator' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCreatorChange('creator')}
                  disabled={!isEditing || saving}
                >
                  Créateur
                </Button>
                <Button
                  variant={
                    creatorStatus.creatorType === 'contributor' ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => handleCreatorChange('contributor')}
                  disabled={!isEditing || saving}
                >
                  Contributeur
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Protection des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Collecte de données</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser la collecte de données anonymes pour améliorer l’expérience.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowDataCollection}
                  onCheckedChange={(checked) =>
                    setPrivacySettings((prev) => ({ ...prev, allowDataCollection: checked }))
                  }
                  disabled={!isEditing || saving}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des communications marketing ciblées.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowMarketing}
                  onCheckedChange={(checked) =>
                    setPrivacySettings((prev) => ({ ...prev, allowMarketing: checked }))
                  }
                  disabled={!isEditing || saving}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Partager des données anonymes pour les statistiques globales.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowAnalytics}
                  onCheckedChange={(checked) =>
                    setPrivacySettings((prev) => ({ ...prev, allowAnalytics: checked }))
                  }
                  disabled={!isEditing || saving}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-end gap-4"
          >
            <Button variant="outline" onClick={handleCancel} size="lg">
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              size="lg"
              disabled={saving || loadingCreators}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </motion.div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default PrivacySettings;

