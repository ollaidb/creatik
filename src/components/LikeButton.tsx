import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showToast?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  isLiked, 
  onToggle, 
  size = 'md',
  className,
  showToast = false
}) => {
  const sizeClasses = {
    sm: 'p-2 h-8 w-8',
    md: 'p-2 h-10 w-10',
    lg: 'p-3 h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        sizeClasses[size],
        'rounded-full transition-all duration-200',
        isLiked 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-gray-400 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
    >
      <Heart 
        size={iconSizes[size]} 
        className={cn(
          'transition-all duration-200',
          isLiked 
            ? 'fill-red-500 text-red-500' 
            : 'fill-transparent text-current'
        )}
      />
    </Button>
  );
};

export default LikeButton; 