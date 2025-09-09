import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    category: string;
    timeRemaining?: string;
    participants?: number;
    creator?: {
      user_metadata?: {
        first_name?: string;
        last_name?: string;
      };
    };
  };
  className?: string;
  onClick?: () => void;
  onTakeChallenge?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  className, 
  onClick,
  onTakeChallenge 
}) => {
  const getCreatorName = (creator: { user_metadata?: { first_name?: string; last_name?: string } } | null) => {
    if (!creator) return 'Utilisateur';
    const firstName = creator.user_metadata?.first_name;
    const lastName = creator.user_metadata?.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'Utilisateur';
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
        className
      )}
      onClick={onClick}
      data-title={challenge.title}
      data-type="challenge"
      data-challenge-id={challenge.id}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {challenge.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {challenge.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {challenge.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {challenge.timeRemaining && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{challenge.timeRemaining}</span>
              </div>
            )}
            {challenge.participants && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{challenge.participants}</span>
              </div>
            )}
            {challenge.creator && (
              <div className="text-xs">
                par {getCreatorName(challenge.creator)}
              </div>
            )}
          </div>
          
          {onTakeChallenge && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTakeChallenge();
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Target className="w-3 h-3 mr-1" />
              Relever
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
