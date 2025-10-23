import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface CreatorsButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const CreatorsButton: React.FC<CreatorsButtonProps> = ({ 
  children, 
  variant = "outline", 
  size = "default",
  className = "",
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/creators');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 ${className}`}
      {...props}
    >
      <Users className="h-4 w-4 mr-2" />
      {children || 'Créateurs'}
    </Button>
  );
};

export default CreatorsButton;
