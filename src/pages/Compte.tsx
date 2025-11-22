import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Palette,
  LogOut,
  Eye,
  HelpCircle,
  Scale,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Compte = () => {
  const navigate = useNavigate();
  const { navigateWithReturn, navigateBack } = useSmartNavigation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  // Section 1: COMPTE
  const accountItems = [
    {
      title: 'Compte',
      description: 'Informations personnelles et mot de passe',
      icon: User,
      path: '/profile/account',
      color: 'bg-blue-500'
    },
    {
      title: 'Confidentialité',
      description: 'Profil public/privé et statut créateur',
      icon: Eye,
      path: '/profile/privacy-settings',
      color: 'bg-purple-500'
    }
  ];

  // Section 2: CONTENU
  const contentItems = [
    {
      title: 'Mode d\'affichage',
      description: 'Light/Dark mode',
      icon: Palette,
      path: '/profile/display-mode',
      color: 'bg-pink-500'
    },
    {
      title: 'Langue',
      description: 'Français ou Anglais',
      icon: Settings,
      path: '/profile/language',
      color: 'bg-indigo-500'
    },
    {
      title: 'Personnalisation',
      description: 'Personnaliser votre interface',
      icon: Palette,
      path: '/profile/personalization',
      color: 'bg-cyan-500'
    }
  ];

  // Section 3: ASSISTANCE ET INFORMATIONS
  const assistanceItems = [
    {
      title: 'Conditions et politiques',
      description: 'Toutes les pages légales',
      icon: Scale,
      path: '/profile/conditions-policies',
      color: 'bg-slate-500'
    },
    {
      title: 'Assistance',
      description: 'Support et contact',
      icon: HelpCircle,
      path: '/profile/support',
      color: 'bg-teal-500'
    },
    {
      title: 'Contact',
      description: 'Nous contacter',
      icon: Mail,
      path: '/profile/contact',
      color: 'bg-blue-500'
    }
  ];

  // Section 4: CONNEXION
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: "Impossible de se déconnecter. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('just_logged_out', 'true');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
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
                <h1 className="text-xl font-semibold text-foreground">Paramètres et confidentialité</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez vos paramètres et confidentialité
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Section 1: COMPTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">Compte</h2>
            <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30 hover:bg-card/50"
                  onClick={() => navigateWithReturn(item.path, '/compte')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color} text-white`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Section 2: CONTENU */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">Contenu</h2>
            <p className="text-sm text-muted-foreground">Gérez votre contenu et préférences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30 hover:bg-card/50"
                  onClick={() => navigateWithReturn(item.path, '/compte')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color} text-white`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Section 3: ASSISTANCE ET INFORMATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">Assistance et informations</h2>
            <p className="text-sm text-muted-foreground">Support et informations légales</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistanceItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30 hover:bg-card/50"
                  onClick={() => navigateWithReturn(item.path, '/compte')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color} text-white`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Section 4: CONNEXION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">Connexion</h2>
            <p className="text-sm text-muted-foreground">Gérez votre session</p>
          </div>
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      Se déconnecter
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Fermer votre session et vous déconnecter de l'application
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};

export default Compte;
