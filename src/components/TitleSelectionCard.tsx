import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryHexColor } from '@/utils/categoryColors';

interface TitleSelectionCardProps {
  title: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    subcategory?: string;
    platform?: string;
    url?: string;
  };
  index: number;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect?: (titleId: string) => void;
  onFavorite?: (titleId: string) => void;
  onCopy?: (text: string) => void;
  onExternalLink?: (url: string) => void;
  showActions?: boolean;
}

export const TitleSelectionCard: React.FC<TitleSelectionCardProps> = ({
  title,
  index,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onFavorite,
  onCopy,
  onExternalLink,
  showActions = true
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Détecter le mode sombre/clair
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    
    // Observer les changements de classe
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Supprimer le ripple après l'animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onSelect?.(title.id);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPressed(false), 200);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'activism':
        return '✊';
      case 'environment':
        return '🌱';
      case 'social':
        return '🤝';
      case 'education':
        return '📚';
      case 'health':
        return '🏥';
      case 'technology':
        return '💻';
      default:
        return '📝';
    }
  };

  // Nouvelle fonction pour obtenir la couleur de catégorie basée sur l'ID et le mode
  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return '#6B7280'; // Gris par défaut
    
    return getCategoryHexColor(categoryId, isDarkMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.2
      }}
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer overflow-hidden
        ${isSelected 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
        }
        transition-all duration-200 ease-out
        ${isPressed ? 'scale-95' : ''}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute inset-0 bg-purple-500/20 rounded-xl"
          initial={{ 
            scale: 0, 
            opacity: 1,
            x: ripple.x - 50,
            y: ripple.y - 50
          }}
          animate={{ 
            scale: 4, 
            opacity: 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-purple-500 text-white rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Category badge */}
      {title.category && (
        <div className="absolute top-2 left-2 z-10">
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{
              backgroundColor: getCategoryColor(title.category)
            }}
          >
            <span className="mr-1">{getCategoryIcon(title.category)}</span>
            {title.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {title.title}
        </h3>
        
          {title.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
              {title.description}
          </p>
        )}

        {/* Platform badge */}
        {title.platform && (
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full mb-3">
            {title.platform}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
        <div className="absolute bottom-2 right-2 flex gap-1">
            {onFavorite && (
            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(title.id);
                  }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Heart 
                className={cn(
                  "w-4 h-4",
                  isFavorite 
                    ? "text-red-500 fill-red-500" 
                    : "text-gray-400 hover:text-red-400"
                )}
              />
            </button>
            )}
            
            {onCopy && (
            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(title.title);
                  }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
              <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
            )}

            {onExternalLink && title.url && (
            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExternalLink(title.url!);
                  }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
            )}
          </div>
        )}
    </motion.div>
  );
}; 