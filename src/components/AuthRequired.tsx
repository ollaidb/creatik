import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Lock } from 'lucide-react';
import AuthModal from './AuthModal';

interface AuthRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  message?: string;
  description?: string;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  children, 
  fallback,
  message = "Connexion requise",
  description = "Vous devez être connecté pour utiliser cette fonctionnalité."
}) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Si l'utilisateur est connecté, afficher le contenu
  if (user) {
    return <>{children}</>;
  }

  // Si un fallback personnalisé est fourni, l'utiliser
  if (fallback) {
    return <>{fallback}</>;
  }

  // Sinon, afficher le message de connexion par défaut
  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{message}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
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
};

export default AuthRequired;
