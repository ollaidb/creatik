import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Instagram, Twitter, Youtube } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  followers: number;
  category: string;
  isPublic: boolean;
  profileUrl: string;
}

interface CreatorCardProps {
  creator: Creator;
  onFollow?: (creatorId: string) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onFollow }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="bg-creatik-secondary border-creatik hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="bg-creatik-primary text-white">
              {creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-creatik-primary text-lg font-semibold">
              {creator.name}
            </CardTitle>
            <p className="text-creatik-secondary text-sm">
              @{creator.username}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-creatik-muted">
            {getPlatformIcon(creator.platform)}
            <span className="text-xs">{formatFollowers(creator.followers)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-creatik-secondary text-sm mb-4 line-clamp-2">
          {creator.bio}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-1 bg-creatik-button-secondary text-creatik-primary text-xs rounded-full">
            {creator.category}
          </span>
          
          <div className="flex space-x-2">
            {creator.isPublic && (
              <Button
                variant="outline"
                size="sm"
                className="border-creatik text-creatik-primary hover:bg-creatik-hover"
                onClick={() => window.open(creator.profileUrl, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Profil
              </Button>
            )}
            
            {onFollow && (
              <Button
                size="sm"
                className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
                onClick={() => onFollow(creator.id)}
              >
                Suivre
              </Button>
            )}
          </div>
        </div>
        
        {/* Disclaimer légal */}
        <p className="text-creatik-muted text-xs mt-3 italic">
          * Profil public - Informations disponibles publiquement
        </p>
      </CardContent>
    </Card>
  );
};

export default CreatorCard; 