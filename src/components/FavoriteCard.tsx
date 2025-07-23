
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteCardProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  onClick: () => void;
  className?: string;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ category, onClick, className }) => {
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

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
        className
      )}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(category.color)} opacity-90`} />
      <div className="relative p-4 h-full flex flex-col justify-center items-center text-center min-h-[100px]">
        <div className="absolute top-2 right-2">
          <Heart 
            className="w-4 h-4 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <h3 className="text-white font-semibold text-sm leading-tight">
          {category.name}
        </h3>
      </div>
    </div>
  );
};

export default FavoriteCard;
