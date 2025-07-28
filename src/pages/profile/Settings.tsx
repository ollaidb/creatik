import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Moon, Sun } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useTheme } from '@/hooks/use-theme';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Paramètres</h1>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Publier
        </Button>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {/* Theme Toggle Section */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {theme === 'dark' ? (
                      <Moon className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mode d'affichage</h3>
                    <p className="text-muted-foreground text-sm">
                      Basculer entre le mode clair et sombre
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle theme"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Settings; 