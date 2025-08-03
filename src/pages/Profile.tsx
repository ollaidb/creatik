import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Heart, History, Settings, Shield, HelpCircle, Mail, FileText, Plus, LogOut, Camera, BookOpen, Target } from 'lucide-react';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
import AuthModal from '@/components/AuthModal';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  requiresAuth: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // Charger l'avatar existant
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }
        if (data?.avatar_url) {
          setProfileImage(data.avatar_url);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, [user]);
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
    }
  };
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      // Upload vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      const avatarUrl = data.publicUrl;
      // Mettre à jour le profil dans la base de données
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: avatarUrl,
          email: user.email,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name
        });
      if (updateError) throw updateError;
      setProfileImage(avatarUrl);
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre avatar a été sauvegardé avec succès"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de l'avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const menuItems: MenuItem[] = [
    {
      title: 'Centres d\'intérêt',
      description: 'Personnalisez vos préférences',
      icon: Settings,
      path: '/profile/preferences',
      color: 'text-blue-500',
      requiresAuth: true
    },
    {
      title: "Publications",
      description: "Gérez vos publications et suivez leur statut",
      icon: FileText,
      path: '/profile/publications',
      color: 'text-blue-600',
      requiresAuth: true
    },
    {
      title: 'Défis',
      description: 'Participez aux défis et suivez votre progression',
      icon: Target,
      path: '/profile/challenges',
      color: 'text-orange-500',
      requiresAuth: true
    },
    {
      title: 'Historique',
      description: 'Consultez votre historique de navigation',
      icon: History,
      path: '/profile/history',
      color: 'text-purple-500',
      requiresAuth: true
    },
    {
      title: 'Paramètres',
      description: 'Gérez vos paramètres et préférences',
      icon: Settings,
      path: '/profile/settings',
      color: 'text-green-500',
      requiresAuth: true
    },
    {
      title: 'Mentions légales',
      description: 'Conditions d\'utilisation et mentions',
      icon: FileText,
      path: '/profile/legal',
      color: 'text-gray-500',
      requiresAuth: false
    },
    {
      title: 'Contact',
      description: 'Nous contacter pour toute question',
      icon: Mail,
      path: '/profile/contact',
      color: 'text-orange-500',
      requiresAuth: false
    }
  ];
  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profil</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 pb-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card>
            <CardHeader className="text-center p-4">
              <div className="relative mx-auto mb-3">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary">
                    <User className="w-8 h-8 text-white" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-image" className="absolute -bottom-1 -right-1 cursor-pointer">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                    ) : (
                      <Camera className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <CardTitle className="text-xl">
                {user ? `${user.user_metadata?.first_name || 'Utilisateur'}` : 'Utilisateur'}
              </CardTitle>
              {!user ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="mt-2 mx-auto"
                >
                  Se connecter
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="mt-2 mx-auto flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </Button>
              )}
            </CardHeader>
          </Card>
        </motion.div>
        {/* Menu Items */}
        <motion.div
          className="grid gap-3 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full"
                onClick={() => handleMenuClick(item)}
              >
                <CardContent className="p-4 h-full flex items-center">
                  <div className="flex items-center space-x-2 w-full">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xs">{item.title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <Navigation />
    </div>
  );
};
export default Profile;
