import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubcategoryCardProps {
  subcategory: {
    id: string;
    name: string;
    description: string;
    contentCount?: number;
  };
  className?: string;
  onClick?: () => void;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ 
  subcategory, 
  className, 
  onClick 
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={onClick}
      data-title={subcategory.name}
      data-type="subcategory"
      data-subcategory-id={subcategory.id}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
            {subcategory.name}
          </h3>
          {subcategory.contentCount && (
            <Badge variant="outline" className="text-xs">
              {subcategory.contentCount} contenus
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {subcategory.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SubcategoryCard;
