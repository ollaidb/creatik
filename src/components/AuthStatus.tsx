import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { User, LogOut } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <LogOut className="h-3 w-3 mr-1" />
        Non connecté
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
      <User className="h-3 w-3 mr-1" />
      Connecté
    </Badge>
  );
};

export default AuthStatus;