import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
interface ChallengeButtonProps {
  filterLiked?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
const ChallengeButton: React.FC<ChallengeButtonProps> = ({ 
  filterLiked = false, 
  className = "",
  variant = "outline",
  size = "default"
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const url = filterLiked ? '/challenges?filter=liked' : '/challenges';
    navigate(url);
  };
  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <Target className="w-4 h-4" />
      {filterLiked ? 'Mes Challenges' : 'Challenges'}
    </Button>
  );
};
export default ChallengeButton; 