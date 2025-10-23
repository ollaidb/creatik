import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useHashtags } from '@/hooks/useHashtags';
import { useToast } from '@/hooks/use-toast';

interface HashtagsSectionProps {
  subcategoryId?: string;
  subcategoryName?: string;
}

const HashtagsSection: React.FC<HashtagsSectionProps> = ({ 
  subcategoryId, 
  subcategoryName 
}) => {
  const { toast } = useToast();
  const { hashtags, loading: hashtagsLoading } = useHashtags(subcategoryId);
  
  // Hashtags généraux
  const generalHashtags = [
    '#Viral', '#Trending', '#FYP', '#ForYou', '#Shorts',
    '#Reels', '#TikTok', '#Instagram', '#YouTube', '#Content',
    '#Creator', '#Influencer', '#SocialMedia', '#Digital', '#Online'
  ];
  
  // États de sélection
  const [selectedGeneral, setSelectedGeneral] = useState<string[]>([]);
  const [selectedSpecific, setSelectedSpecific] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Fonctions de sélection
  const toggleGeneral = (hashtag: string) => {
    setSelectedGeneral((prev) =>
      prev.includes(hashtag) ? prev.filter(h => h !== hashtag) : [...prev, hashtag]
    );
  };

  const toggleSpecific = (hashtag: string) => {
    setSelectedSpecific((prev) =>
      prev.includes(hashtag) ? prev.filter(h => h !== hashtag) : [...prev, hashtag]
    );
  };

  const selectAllGeneral = () => setSelectedGeneral(generalHashtags);
  const deselectAllGeneral = () => setSelectedGeneral([]);
  const selectAllSpecific = () => setSelectedSpecific(hashtags.map(h => h.hashtag));
  const deselectAllSpecific = () => setSelectedSpecific([]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Les hashtags ont été copiés dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier les hashtags",
        variant: "destructive",
      });
    }
  };

  const handleCopySelection = () => {
    if (!isSelectionMode) {
      // Activer le mode sélection
      setIsSelectionMode(true);
    } else {
      // Copier la sélection
      const all = [...selectedGeneral, ...selectedSpecific].join(' ');
      handleCopy(all);
      // Réinitialiser
      setIsSelectionMode(false);
      setSelectedGeneral([]);
      setSelectedSpecific([]);
    }
  };

  if (hashtagsLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mode sélection activé */}
      {isSelectionMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6"
        >
          <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            ✨ Cochez ce que vous voulez copier, puis cliquez à nouveau sur "Copier la sélection"
          </p>
        </motion.div>
      )}

      {/* Section Hashtags généraux */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Hashtags généraux
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Hashtags qui fonctionnent pour tout type de contenu
        </p>
        <div className="flex flex-wrap gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 items-center">
          {generalHashtags.map((hashtag, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => isSelectionMode && toggleGeneral(hashtag)}
              className={`text-xs font-medium px-2 py-1 rounded-full border transition-all duration-200 ${
                isSelectionMode 
                  ? selectedGeneral.includes(hashtag)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                    : 'bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                  : 'bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
              }`}
            >
              {hashtag}
            </motion.button>
          ))}
          {isSelectionMode && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-xs"
              onClick={selectedGeneral.length === generalHashtags.length ? deselectAllGeneral : selectAllGeneral}
            >
              {selectedGeneral.length === generalHashtags.length ? 'Tout décocher' : 'Tout sélectionner'}
            </Button>
          )}
        </div>
      </div>

      {/* Section Hashtags spécifiques à la sous-catégorie */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Hashtags spécifiques
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Hashtags adaptés à {subcategoryName || 'cette sous-catégorie'}
        </p>
        {hashtags && hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 items-center">
            {hashtags.map((hashtag, index) => (
              <motion.button
                key={hashtag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => isSelectionMode && toggleSpecific(hashtag.hashtag)}
                className={`text-xs font-medium px-2 py-1 rounded-full border transition-all duration-200 ${
                  isSelectionMode 
                    ? selectedSpecific.includes(hashtag.hashtag)
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                      : 'bg-white dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                    : 'bg-white dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700'
                }`}
              >
                {hashtag.hashtag}
              </motion.button>
            ))}
            {isSelectionMode && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-xs"
                onClick={selectedSpecific.length === hashtags.length ? deselectAllSpecific : selectAllSpecific}
              >
                {selectedSpecific.length === hashtags.length ? 'Tout décocher' : 'Tout sélectionner'}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun hashtag spécifique disponible pour cette sous-catégorie.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Utilisez les hashtags généraux ci-dessus.
            </p>
          </div>
        )}
      </div>

      {/* Section Copier la sélection */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Copier la sélection
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSelectionMode 
                ? `Sélectionné : ${selectedGeneral.length + selectedSpecific.length} hashtag(s)`
                : 'Cliquez pour sélectionner les hashtags à copier'
              }
            </p>
          </div>
          <Button
            onClick={handleCopySelection}
            disabled={isSelectionMode && selectedGeneral.length + selectedSpecific.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {isSelectionMode ? 'Copier la sélection' : 'Copier la sélection'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HashtagsSection; 