import React from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const Training = () => {
  const { navigateBack } = useSmartNavigation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Ressources de formation
            </h1>
            <p className="text-sm text-muted-foreground">Formations et cours pour créateurs</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formations et cours</CardTitle>
            <CardDescription>Contenu à venir</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cette section contiendra des ressources de formation, des cours et des guides pour améliorer vos compétences de créateur de contenu.
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Training;

