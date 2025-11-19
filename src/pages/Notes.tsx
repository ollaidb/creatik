import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, FileText, User, FolderPlus, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';

const Notes = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
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
                  <h1 className="text-xl font-semibold text-foreground">Notes</h1>
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous pour accéder à vos notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Connectez-vous pour créer et gérer vos notes.</p>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
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
              <h1 className="text-xl font-semibold text-foreground">Notes</h1>
              <p className="text-sm text-muted-foreground">
                Organisez vos idées et notes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Deux blocs 50/50 */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloc Compte */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow h-full min-h-[300px] flex flex-col"
            onClick={() => navigate('/notes/account-ideas')}
          >
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Compte</h2>
                  <p className="text-sm text-muted-foreground">
                    Idées et stratégies pour votre compte
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Gérez vos idées de compte
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Contenu */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow h-full min-h-[300px] flex flex-col"
            onClick={() => navigate('/notes/content')}
          >
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Contenu</h2>
                  <p className="text-sm text-muted-foreground">
                    Créez et organisez votre contenu
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Gérez vos contenus
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Notes;
