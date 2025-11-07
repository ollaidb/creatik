import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseDiagnostic } from '@/components/DatabaseDiagnostic';
import Navigation from '@/components/Navigation';

const DatabaseDiagnosticPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)} 
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Diagnostic Base de Données
            </h1>
          </div>
        </div>
      </div>
      <DatabaseDiagnostic />
      <Navigation />
    </div>
  );
};

export default DatabaseDiagnosticPage;

