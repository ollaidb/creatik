import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, User } from 'lucide-react';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { navigateBack } = useSmartNavigation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher un message de connexion
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              onClick={navigateBack}
              className="w-full"
            >
              Retour
            </Button>
          </CardContent>
        </Card>

        {/* Modal d'authentification */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
