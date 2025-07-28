import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'activism':
        return 'from-red-500 to-orange-500';
      case 'environment':
        return 'from-green-500 to-emerald-500';
      case 'social':
        return 'from-blue-500 to-indigo-500';
      case 'education':
        return 'from-purple-500 to-pink-500';
      case 'health':
        return 'from-pink-500 to-rose-500';
      case 'technology':
        return 'from-cyan-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
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
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        }
        ${isPressed ? 'bg-gray-50 dark:bg-gray-700 shadow-inner transform scale-[0.98]' : ''}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/40 dark:bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Overlay de pression avec animation progressive */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-gray-200/30 via-gray-200/20 to-transparent dark:from-gray-600/30 dark:via-gray-600/20 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isPressed ? 1 : 0,
          scale: isPressed ? 1 : 0.8
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />

      <div className="flex items-center gap-4 relative z-10">
        {/* Icône de catégorie */}
        <motion.div 
          className={`
            w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(title.category)} 
            flex items-center justify-center text-white text-xl flex-shrink-0
          `}
          animate={{ scale: isPressed ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {getCategoryIcon(title.category)}
        </motion.div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="font-medium text-gray-900 dark:text-white text-base leading-relaxed line-clamp-2"
            animate={{ 
              scale: isPressed ? 1.02 : 1,
              x: isPressed ? 2 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {title.title}
          </motion.h3>
          {title.description && (
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1"
              animate={{ scale: isPressed ? 1.01 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {title.description}
            </motion.p>
          )}
          {title.category && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                {title.category}
              </span>
              {title.subcategory && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  {title.subcategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Indicateur de sélection */}
        {isSelected && (
          <motion.div 
            className="flex-shrink-0"
            animate={{ scale: isPressed ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {onFavorite && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(title.id);
                  }}
                  className="p-2 h-8 w-8 rounded-full"
                >
                  <Heart 
                    size={16} 
                    className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                  />
                </Button>
              </motion.div>
            )}
            
            {onCopy && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(title.title);
                  }}
                  className="p-2 h-8 w-8 rounded-full"
                >
                  <Copy size={16} className="text-gray-400" />
                </Button>
              </motion.div>
            )}

            {onExternalLink && title.url && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExternalLink(title.url!);
                  }}
                  className="p-2 h-8 w-8 rounded-full"
                >
                  <ExternalLink size={16} className="text-gray-400" />
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 