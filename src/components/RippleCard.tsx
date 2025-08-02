import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RippleCardProps {
  title: {
    id: string;
    title: string;
  };
  index: number;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
  onAddToChallenge?: (id: string) => void;
}

export const RippleCard: React.FC<RippleCardProps> = ({
  title,
  index,
  isFavorite,
  onFavorite,
  onAddToChallenge
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
        bg-white rounded-lg p-4 border border-gray-200 dark:border-gray-700 
        hover:shadow-md relative overflow-hidden cursor-pointer
        ${isPressed ? 'bg-gray-50 shadow-inner transform scale-[0.98]' : ''}
      `}
      style={{
        ...(window.matchMedia('(prefers-color-scheme: dark)').matches && !isPressed && {
          backgroundColor: '#0f0f10'
        })
      }}
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

      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.span 
            className="text-xs text-gray-500 font-mono flex-shrink-0"
            animate={{ scale: isPressed ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {(index + 1).toString().padStart(2, '0')}
          </motion.span>
          <motion.h3 
            className="font-medium text-gray-900 dark:text-white text-base leading-relaxed"
            animate={{ 
              scale: isPressed ? 1.02 : 1,
              x: isPressed ? 2 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {title.title}
          </motion.h3>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
              className="p-2 h-10 w-10 rounded-full"
            >
              <Heart size={18} className={isFavorite ? 'text-red-500 fill-red-500' : ''} />
            </Button>
          </motion.div>
          {onAddToChallenge && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToChallenge(title.id);
                }}
                className="p-2 h-10 w-10 rounded-full text-blue-600 hover:text-blue-700"
                title="Ajouter aux défis"
              >
                <Plus size={18} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 