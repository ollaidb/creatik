import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

const WelcomeMessage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Vérifier si c'est la première connexion de l'utilisateur
    if (user && !localStorage.getItem(`welcome_shown_${user.id}`)) {
      setShowWelcome(true);
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
      
      // Afficher un toast de bienvenue
      toast({
        title: "Bienvenue sur Creatik !",
        description: `Bonjour ${user.email}, vous êtes maintenant connecté.`,
      });
    }
  }, [user, toast]);

  if (!showWelcome || !user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Card className="w-80 shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Bienvenue sur Creatik !
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Vous êtes maintenant connecté et pouvez accéder à toutes les fonctionnalités.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWelcome(false)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
