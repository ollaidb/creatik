import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  onClick: () => void;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, className }) => {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isLoading } = useFavorites('category');
  const isFavorite = favorites.includes(category.id);

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-blue-500 to-purple-600';
      case 'orange':
        return 'from-orange-400 to-red-500';
      case 'green':
        return 'from-green-400 to-teal-500';
      case 'pink':
        return 'from-pink-400 to-rose-500';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(category.id);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
        className
      )}
      data-title={category.name}
      data-type="category"
      data-category={category.id}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(category.color)} opacity-90`} />
      <div className="relative p-2 sm:p-4 h-full flex flex-col justify-center items-center text-center" onClick={onClick}>
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
          {user && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
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
          <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight text-center break-words">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
