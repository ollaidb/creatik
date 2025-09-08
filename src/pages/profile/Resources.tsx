import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

const Resources = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
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
                <h1 className="text-xl font-semibold text-foreground">Ressources</h1>
                <p className="text-sm text-muted-foreground">
                  Générateur de reçus et contrats
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-4">Page Ressources</h2>
          <p className="text-muted-foreground mb-6">
            Cette page permettra de générer des reçus et contrats pour influenceurs.
          </p>
          <Button onClick={() => navigate('/profile')}>
            Retour au profil
          </Button>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Resources;
