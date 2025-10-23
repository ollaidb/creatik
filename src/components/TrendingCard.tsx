import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Hash, Share2 } from 'lucide-react';
import type { TrendingTopic } from '@/hooks/useSocialTrends';

interface TrendingCardProps {
  trend: TrendingTopic;
  onUseTrend?: (trend: TrendingTopic) => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({ trend, onUseTrend }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-500';
      case 'reddit':
        return 'bg-orange-500';
      case 'instagram':
        return 'bg-pink-500';
      case 'tiktok':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter';
      case 'reddit':
        return 'Reddit';
      case 'instagram':
        return 'Instagram';
      case 'tiktok':
        return 'TikTok';
      default:
        return platform;
    }
  };

  const formatEngagement = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="bg-creatik-secondary border-creatik hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-creatik-primary text-lg font-semibold line-clamp-2">
            {trend.title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${getPlatformColor(trend.platform)} text-white text-xs`}>
              {getPlatformName(trend.platform)}
            </Badge>
            <div className="flex items-center space-x-1 text-creatik-muted">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">{formatEngagement(trend.engagement)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-creatik-secondary text-sm mb-4 line-clamp-3">
          {trend.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {trend.hashtags.slice(0, 3).map((hashtag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-creatik-primary border-creatik text-xs"
            >
              <Hash className="w-3 h-3 mr-1" />
              {hashtag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="bg-creatik-button-secondary text-creatik-primary text-xs">
            {trend.category}
          </Badge>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-creatik text-creatik-primary hover:bg-creatik-hover"
              onClick={() => {
                const text = `${trend.title}\n\n${trend.hashtags.join(' ')}`;
                navigator.clipboard.writeText(text);
              }}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Copier
            </Button>
            
            {onUseTrend && (
              <Button
                size="sm"
                className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
                onClick={() => onUseTrend(trend)}
              >
                Utiliser
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingCard; 