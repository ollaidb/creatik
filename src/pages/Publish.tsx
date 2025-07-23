
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PublishBar from '@/components/PublishBar';
import Navigation from '@/components/Navigation';
import { useCategories } from '@/hooks/useCategories';

const Publish = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Publier</h1>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Contribuez à CréaTik</h2>
          <p className="text-muted-foreground">
            Partagez vos idées et enrichissez notre bibliothèque de contenu créatif
          </p>
        </div>

        <PublishBar categories={categories || []} />
      </main>

      <Navigation />
    </div>
  );
};

export default Publish;
