import React from 'react';
import { useVisitHistory } from '@/hooks/useVisitHistory';
import StickyHeader from '@/components/StickyHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const History: React.FC = () => {
  const { visits, loading, clearHistory } = useVisitHistory();
  const navigate = useNavigate();

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const visitTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - visitTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'category':
        return 'Catégorie';
      case 'subcategory':
        return 'Sous-catégorie';
      case 'challenge':
        return 'Défi';
      case 'content':
        return 'Contenu';
      case 'title':
        return 'Titre';
      default:
        return 'Élément';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'category':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'subcategory':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'challenge':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'content':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'title':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <StickyHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Clock className="w-6 h-6 animate-spin" />
              <span>Chargement de l'historique...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <StickyHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historique des visites
            </h1>
          </div>
          
          {visits.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Effacer tout
            </Button>
          )}
        </div>

        {/* Liste des visites */}
        {visits.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun historique
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vos visites et clics apparaîtront ici
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Commencer à explorer
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <Card 
                key={visit.id} 
                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(visit.url)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-2xl">
                        {visit.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {visit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {visit.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getTypeColor(visit.type)}`}>
                        {getTypeLabel(visit.type)}
                      </Badge>
                      
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(visit.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default History;
