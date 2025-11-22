import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';

const LogoutMessage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur vient de se déconnecter
    if (!user && localStorage.getItem('just_logged_out') === 'true') {
      setShowLogout(true);
      localStorage.removeItem('just_logged_out');
      
      // Afficher un toast de déconnexion
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    }
  }, [user, toast]);

  if (!showLogout) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Card className="w-80 shadow-lg border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <LogOut className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Déconnexion réussie
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Vous avez été déconnecté avec succès. À bientôt !
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogout(false)}
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

export default LogoutMessage;
