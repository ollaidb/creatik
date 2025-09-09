import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Search, 
  Grid3X3, 
  Target, 
  Hash, 
  FileText,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VisitItem } from '@/hooks/useVisitHistory';

interface VisitHistoryItemProps {
  visit: VisitItem;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const VisitHistoryItem: React.FC<VisitHistoryItemProps> = ({ 
  visit, 
  onFavorite, 
  isFavorite = false 
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (visit.type) {
      case 'category':
        return <Grid3X3 className="w-5 h-5" />;
      case 'subcategory':
        return <Hash className="w-5 h-5" />;
      case 'challenge':
        return <Target className="w-5 h-5" />;
      case 'content':
        return <FileText className="w-5 h-5" />;
      case 'search':
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const getIconColor = () => {
    switch (visit.type) {
      case 'category':
        return 'text-purple-500';
      case 'subcategory':
        return 'text-blue-500';
      case 'challenge':
        return 'text-orange-500';
      case 'content':
        return 'text-green-500';
      case 'search':
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const visitTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - visitTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    return visitTime.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const handleClick = () => {
    navigate(visit.url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-creatik-secondary border-creatik">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icône */}
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 ${getIconColor()}`}>
              {getIcon()}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-creatik-primary text-base truncate">
                    {visit.title}
                  </h3>
                  {visit.description && (
                    <p className="text-creatik-secondary text-sm mt-1 line-clamp-2">
                      {visit.description}
                    </p>
                  )}
                </div>

                {/* Bouton favori */}
                {onFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(visit.id);
                    }}
                    className="ml-2 flex-shrink-0"
                  >
                    <Heart 
                      className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    />
                  </Button>
                )}
              </div>

              {/* Métadonnées */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-creatik-muted text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(visit.timestamp)}
                </div>

                {/* Bouton d'action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClick}
                  className="text-creatik-primary hover:text-creatik-icon-active transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VisitHistoryItem; 