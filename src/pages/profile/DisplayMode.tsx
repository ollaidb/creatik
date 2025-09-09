import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';

const DisplayMode = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  
  const [selectedMode, setSelectedMode] = useState('system');
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

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
    setSelectedMode(modeId);
    // Ici vous pouvez appliquer immédiatement le thème
    console.log('Mode sélectionné:', modeId);
  };

  const handleSave = () => {
    // Ici vous pouvez sauvegarder les préférences
    console.log('Préférences sauvegardées:', {
      mode: selectedMode,
      autoSwitch,
      reduceMotion,
      highContrast
    });
  };

  return (
    <div className="min-h-screen bg-background">
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

          {/* Options avancées */}
          <Card>
            <CardHeader>
              <CardTitle>Options d'affichage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-switch">Changement automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Basculer automatiquement selon l'heure (clair le jour, sombre la nuit)
                  </p>
                </div>
                <Switch
                  id="auto-switch"
                  checked={autoSwitch}
                  onCheckedChange={setAutoSwitch}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Réduire les animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactiver les animations pour améliorer les performances
                  </p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">Contraste élevé</Label>
                  <p className="text-sm text-muted-foreground">
                    Améliorer la lisibilité avec des contrastes plus marqués
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle>Conseils d'utilisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    💡 Mode Clair
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Idéal pour une utilisation en journée ou dans des environnements bien éclairés.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                    🌙 Mode Sombre
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Parfait pour une utilisation nocturne ou dans des environnements sombres.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="px-8">
              Appliquer les paramètres
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default DisplayMode;
