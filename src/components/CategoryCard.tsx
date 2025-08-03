import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryHexColorByIndex } from '@/utils/categoryColors';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  index: number; // Ajout de l'index de position
  onClick: () => void;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, onClick, className }) => {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isLoading } = useFavorites('category');
  const isFavorite = favorites.includes(category.id);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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

  // Obtenir la couleur selon le mode et l'index de position
  const categoryHexColor = getCategoryHexColorByIndex(index, isDarkMode);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(category.id);
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group touch-manipulation",
        isPressed && "scale-95",
        className
      )}
      data-title={category.name}
      data-type="category"
      data-category={category.id}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundColor: categoryHexColor
        }}
      />
      <div className="relative p-2 sm:p-4 h-full flex flex-col justify-center items-center text-center">
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
          {user && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-1 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none'
              }}
            >
              <Heart 
                className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4 transition-all",
                  isFavorite 
                    ? "text-red-500 fill-red-500" 
                    : "text-white hover:text-red-300"
                )}
              />
            </button>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center px-1 sm:px-2">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight text-center break-words text-white">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
