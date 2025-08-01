import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryHexColorByIndex } from '@/utils/categoryColors';

interface FavoriteCardProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  index: number; // Ajout de l'index de position
  onClick: () => void;
  className?: string;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ category, index, onClick, className }) => {
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

  // Obtenir la couleur selon le mode et l'index de position
  const categoryHexColor = getCategoryHexColorByIndex(index, isDarkMode);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
        className
      )}
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundColor: categoryHexColor
        }}
      />
      <div className="relative p-4 h-full flex flex-col justify-center items-center text-center min-h-[100px]">
        <div className="absolute top-2 right-2">
          <Heart 
            className="w-4 h-4 text-white fill-red-500"
          />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <h3 className="font-semibold text-lg leading-tight text-center break-words text-white">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
