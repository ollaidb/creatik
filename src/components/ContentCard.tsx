import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentIdea } from '@/types';

interface ContentCardProps {
  idea: ContentIdea;
  onFavorite?: (id: string) => void;
  className?: string;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  idea, 
  onFavorite, 
  className,
  onClick 
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(idea.id);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={onClick}
      data-title={idea.title}
      data-type="content"
      data-content-id={idea.id}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {idea.title}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              {idea.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {idea.platform}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {idea.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{idea.popularity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{idea.type}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="p-1 h-6"
              >
                <Heart className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6"
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
