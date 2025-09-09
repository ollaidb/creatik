import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Language = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const languages = [
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      description: 'Langue par défaut de l\'application'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'Default application language'
    }
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Ici vous pouvez sauvegarder la préférence de langue
    console.log('Langue sélectionnée:', languageCode);
  };

  const handleSave = () => {
    // Ici vous pouvez implémenter la logique de sauvegarde
    console.log('Langue sauvegardée:', selectedLanguage);
    // Optionnel: rediriger ou afficher un message de confirmation
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
            <h1 className="text-2xl font-bold text-foreground">Langue</h1>
            <p className="text-muted-foreground">Choisissez votre langue préférée</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Sélection de langue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Langues disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((language, index) => (
                <motion.div
                  key={language.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedLanguage === language.code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{language.flag}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {language.nativeName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {language.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedLanguage === language.code && (
                          <Badge variant="default" className="bg-primary">
                            <Check className="w-3 h-3 mr-1" />
                            Sélectionné
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>À propos des langues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Français :</strong> Interface complète en français avec tous les textes traduits.
                </p>
                <p>
                  <strong>English :</strong> Complete interface in English with all texts translated.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Note :</strong> Le changement de langue prend effet immédiatement. 
                  Vous pouvez changer de langue à tout moment dans les paramètres.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="px-8">
              Sauvegarder la langue
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Language;
