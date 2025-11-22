import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TitleSelectionCard } from './TitleSelectionCard';

interface Title {
  id: string;
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  platform?: string;
  url?: string;
}

interface TitleSelectionListProps {
  titles: Title[];
  onTitleSelect?: (selectedTitles: string[]) => void;
  onContinue?: (selectedTitles: string[]) => void;
  maxSelections?: number;
  showActions?: boolean;
  className?: string;
}

export const TitleSelectionList: React.FC<TitleSelectionListProps> = ({
  titles,
  onTitleSelect,
  onContinue,
  maxSelections = 3,
  showActions = true,
  className = ''
}) => {
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);

  const handleTitleSelect = (titleId: string) => {
    setSelectedTitles(prev => {
      if (prev.includes(titleId)) {
        // Désélectionner
        const newSelection = prev.filter(id => id !== titleId);
        onTitleSelect?.(newSelection);
        return newSelection;
      } else {
        // Sélectionner (avec limite)
        if (prev.length >= maxSelections) {
          return prev;
        }
        const newSelection = [...prev, titleId];
        onTitleSelect?.(newSelection);
        return newSelection;
      }
    });
  };

  const handleContinue = () => {
    onContinue?.(selectedTitles);
  };

  const selectedTitlesData = titles.filter(title => selectedTitles.includes(title.id));

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white text-center">
            Sélectionnez vos titres
          </h1>
          <p className="text-white/80 text-center mt-2">
            Choisissez jusqu'à {maxSelections} titres qui vous inspirent
          </p>
          {selectedTitles.length > 0 && (
            <div className="mt-3 text-center">
              <span className="text-white/90 text-sm">
                {selectedTitles.length} sur {maxSelections} sélectionnés
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Liste des titres */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {titles.map((title, index) => (
            <TitleSelectionCard
              key={title.id}
              title={title}
              index={index}
              isSelected={selectedTitles.includes(title.id)}
              isFavorite={false} // TODO: Connecter avec le système de favoris
              onSelect={handleTitleSelect}
              onFavorite={() => {}} // TODO: Implémenter
              onCopy={() => {}} // TODO: Implémenter
              onExternalLink={() => {}} // TODO: Implémenter
              showActions={showActions}
            />
          ))}
        </div>
      </div>

      {/* Bouton CONTINUE fixe en bas */}
      {selectedTitles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-md border-t border-white/20"
        >
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-purple-900 font-bold py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                CONTINUER
                <ArrowRight size={20} />
              </span>
            </Button>
            
            {/* Aperçu des titres sélectionnés */}
            {selectedTitlesData.length > 0 && (
              <div className="mt-3 flex items-center gap-2 justify-center">
                <span className="text-white/80 text-sm">Sélectionnés :</span>
                <div className="flex items-center gap-1">
                  {selectedTitlesData.slice(0, 2).map((title, index) => (
                    <span key={title.id} className="text-white/90 text-xs bg-white/20 px-2 py-1 rounded-full">
                      {title.title.slice(0, 15)}...
                    </span>
                  ))}
                  {selectedTitlesData.length > 2 && (
                    <span className="text-white/60 text-xs">
                      +{selectedTitlesData.length - 2} autres
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Espace en bas pour éviter que le contenu soit caché par le bouton */}
      {selectedTitles.length > 0 && <div className="h-32" />}
    </div>
  );
}; 