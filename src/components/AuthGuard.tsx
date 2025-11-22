import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // L'AuthGuard ne bloque plus l'accès aux pages
  // L'authentification se fait maintenant au niveau des fonctionnalités individuelles

  return <>{children}</>;
};

export default AuthGuard;
