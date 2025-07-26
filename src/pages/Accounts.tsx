import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Heart, ExternalLink, Plus } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Accounts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: accounts = [], isLoading } = useAccounts();
  const { favorites, toggleFavorite, isFavorite } = useFavorites('account');

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100 }
    }
  };

  const handleFavorite = (accountId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des comptes à vos favoris.",
      });
      return;
    }
    toggleFavorite(accountId);
    toast({
      title: isFavorite(accountId) ? "Retiré des favoris" : "Ajouté à vos favoris !",
      description: isFavorite(accountId)
        ? "Le compte a été retiré de vos favoris."
        : "Vous verrez ce compte dans votre page de favoris.",
    });
  };

  const handleProfileClick = (account: any) => {
    if (account.url) {
      window.open(account.url, '_blank');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Ce profil n'a pas de lien externe configuré.",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📷';
      case 'youtube':
        return '📺';
      case 'twitter':
        return '🐦';
      case 'facebook':
        return '📘';
      case 'linkedin':
        return '💼';
      case 'pinterest':
        return '📌';
      case 'snapchat':
        return '👻';
      case 'twitch':
        return '🎮';
      default:
        return '👤';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok':
        return 'from-pink-500 to-red-500';
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'youtube':
        return 'from-red-500 to-red-600';
      case 'twitter':
        return 'from-blue-400 to-blue-500';
      case 'facebook':
        return 'from-blue-600 to-blue-700';
      case 'linkedin':
        return 'from-blue-700 to-blue-800';
      case 'pinterest':
        return 'from-red-500 to-red-600';
      case 'snapchat':
        return 'from-yellow-400 to-yellow-500';
      case 'twitch':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Comptes</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des comptes...</p>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">Comptes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {accounts.length} comptes
          </Badge>
          {user && (
            <Button 
              onClick={() => navigate('/publish')}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Publier
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {accounts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {accounts.map((account) => (
              <motion.div key={account.id} variants={itemVariants}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-4 text-center">
                    {/* Photo de profil ronde */}
                    <div className="relative mb-4">
                      <div 
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300"
                        onClick={() => handleProfileClick(account)}
                      >
                        {account.avatar_url ? (
                          <img 
                            src={account.avatar_url} 
                            alt={account.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full rounded-full bg-gradient-to-br ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-2xl`}>
                            {getPlatformIcon(account.platform)}
                          </div>
                        )}
                      </div>
                      
                      {/* Badge de plateforme */}
                      <div className="absolute -bottom-1 -right-1">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-xs`}>
                          {getPlatformIcon(account.platform)}
                        </div>
                      </div>
                    </div>

                    {/* Nom du compte */}
                    <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-gray-100 truncate">
                      {account.name}
                    </h3>

                    {/* Description courte */}
                    {account.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {account.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(account.id);
                        }}
                        className={`p-2 h-8 w-8 rounded-full transition-all duration-200 ${
                          isFavorite(account.id) 
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                            : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(account.id) ? 'fill-current' : ''}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(account);
                        }}
                        className="p-2 h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/20 text-blue-600 dark:text-blue-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Aucun compte trouvé</h3>
            <p className="text-muted-foreground mt-2">
              Aucun compte n'est disponible pour le moment
            </p>
            {user && (
              <Button 
                onClick={() => navigate('/publish')}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publier un compte
              </Button>
            )}
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
};

export default Accounts; 