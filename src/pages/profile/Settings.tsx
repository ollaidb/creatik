import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Moon, Sun } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useTheme } from '@/hooks/use-theme';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [dataSharing, setDataSharing] = React.useState(false);
  const [cookieConsent, setCookieConsent] = React.useState(true);
  const [notificationPermission, setNotificationPermission] = React.useState(false);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Paramètres</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {/* Theme Toggle Section */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {theme === 'dark' ? (
                      <Moon className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mode d'affichage</h3>
                    <p className="text-muted-foreground text-sm">
                      Basculer entre le mode clair et sombre
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle theme"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Confidentialité & sécurité</h2>
          <Card className="overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Partage de données</h3>
                <p className="text-sm text-muted-foreground">
                  Permettre le partage anonyme de données pour améliorer l'expérience
                </p>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={setDataSharing} 
              />
            </div>
            <Separator />
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Consentement aux cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Autoriser l'utilisation de cookies pour personnaliser le contenu
                </p>
              </div>
              <Switch 
                checked={cookieConsent} 
                onCheckedChange={setCookieConsent} 
              />
            </div>
            <Separator />
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Notifications push</h3>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications sur les nouvelles fonctionnalités
                </p>
              </div>
              <Switch 
                checked={notificationPermission} 
                onCheckedChange={setNotificationPermission} 
              />
            </div>
          </Card>
        </div>

        {/* Navigation History Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Historique de navigation</h2>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Vous pouvez effacer votre historique de navigation à tout moment.
            </p>
            <Button variant="outline" className="w-full">
              Effacer l'historique
            </Button>
          </Card>
        </div>

        {/* Reset Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Réinitialisation des préférences</h2>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Réinitialisez toutes vos préférences aux valeurs par défaut.
            </p>
            <Button variant="outline" className="w-full">
              Réinitialiser les préférences
            </Button>
          </Card>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Settings; 