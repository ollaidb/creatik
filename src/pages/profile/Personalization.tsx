import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import UserPreferencesForm from '@/components/UserPreferencesForm';

const Personalization = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={navigateBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Personnalisation</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <UserPreferencesForm />
      </main>
      <Navigation />
    </div>
  );
};

export default Personalization;
