import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/use-theme';
import { ArrowLeft, Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import type { ThemeMode } from '@/types/theme';

const DisplayMode = () => {
  const { navigateBack } = useSmartNavigation();
  const { themeMode, setThemeMode } = useTheme();
  
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(themeMode);

  // Synchroniser avec le thème actuel au chargement
  useEffect(() => {
    setSelectedMode(themeMode);
  }, [themeMode]);

  const displayModes = [
    {
      id: 'light',
      name: 'Mode Clair',
      description: 'Interface claire et lumineuse',
      icon: Sun,
      preview: 'bg-white text-black',
      benefits: ['Meilleure lisibilité en journée', 'Économie de batterie', 'Interface moderne']
    },
    {
      id: 'dark',
      name: 'Mode Sombre',
      description: 'Interface sombre et élégante',
      icon: Moon,
      preview: 'bg-gray-900 text-white',
      benefits: ['Réduction de la fatigue oculaire', 'Économie de batterie sur OLED', 'Interface élégante']
    },
    {
      id: 'system',
      name: 'Système',
      description: 'Suit les paramètres de votre appareil',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-900 text-black',
      benefits: ['Changement automatique', 'Cohérence avec l\'OS', 'Confort optimal']
    }
  ];

  const handleModeSelect = (modeId: string) => {
    const newMode = modeId as ThemeMode;
    setSelectedMode(newMode);
    // Appliquer immédiatement le thème
    setThemeMode(newMode);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('displayMode_selectedMode', newMode);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mode d'affichage</h1>
            <p className="text-muted-foreground">Personnalisez l'apparence de l'interface</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Sélection du mode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Thèmes disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {displayModes.map((mode, index) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                        selectedMode === mode.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      {/* Aperçu du thème */}
                      <div className={`w-full h-20 rounded-lg mb-4 ${mode.preview} flex items-center justify-center`}>
                        <mode.icon className="w-8 h-8" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {mode.name}
                          </h3>
                          {selectedMode === mode.id && (
                            <Badge variant="default" className="bg-primary">
                              <Check className="w-3 h-3 mr-1" />
                              Actif
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {mode.description}
                        </p>
                        
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {mode.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default DisplayMode;
