
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();
  
  const [dataSharing, setDataSharing] = React.useState(false);
  const [cookieConsent, setCookieConsent] = React.useState(true);
  const [notificationPermission, setNotificationPermission] = React.useState(false);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Confidentialité & sécurité</h1>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {/* Gestion des données personnelles */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Gestion des données personnelles</h2>
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
        </section>

        {/* Historique de navigation */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Historique de navigation</h2>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Vous pouvez effacer votre historique de navigation à tout moment.
            </p>
            <Button variant="outline" className="w-full">
              Effacer l'historique
            </Button>
          </Card>
        </section>

        {/* Réinitialisation des préférences */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Réinitialisation des préférences</h2>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Réinitialisez toutes vos préférences aux valeurs par défaut.
            </p>
            <Button variant="outline" className="w-full">
              Réinitialiser les préférences
            </Button>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
