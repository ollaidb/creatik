import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Legal = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={navigateBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mentions légales</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conditions d'utilisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Acceptation des conditions</h3>
              <p className="text-muted-foreground">
                En utilisant CréaTik, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">2. Description du service</h3>
              <p className="text-muted-foreground">
                CréaTik est une plateforme d'inspiration pour créateurs de contenu, offrant des idées, 
                des catégories et des outils pour stimuler la créativité.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">3. Utilisation appropriée</h3>
              <p className="text-muted-foreground">
                Vous vous engagez à utiliser le service de manière légale et respectueuse, 
                sans porter atteinte aux droits d'autrui ou perturber le fonctionnement de la plateforme.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Politique de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Collecte des données</h3>
              <p className="text-muted-foreground">
                Nous collectons uniquement les informations nécessaires au fonctionnement du service : 
                email, préférences de contenu et données d'utilisation anonymisées.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Utilisation des données</h3>
              <p className="text-muted-foreground">
                Vos données sont utilisées pour personnaliser votre expérience et améliorer nos services. 
                Nous ne vendons ni ne partageons vos informations personnelles avec des tiers.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Vos droits</h3>
              <p className="text-muted-foreground">
                Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles à tout moment. 
                Contactez-nous pour exercer ces droits.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informations légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Éditeur</h3>
              <p className="text-muted-foreground">
                CréaTik<br />
                Plateforme d'inspiration créative
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Hébergement</h3>
              <p className="text-muted-foreground">
                Service hébergé sur Supabase<br />
                Conformément aux standards de sécurité européens
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};
export default Legal;
