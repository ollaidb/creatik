import React from 'react';
import { useVisitHistory, VisitItem } from '@/hooks/useVisitHistory';

import { Card, CardContent } from '@/components/ui/card';
import { Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const History: React.FC = () => {
  const { visits, loading, clearHistory } = useVisitHistory();
  const navigate = useNavigate();

  const getVisitLocation = (visit: VisitItem) => {
    const primaryLabel = visit.title?.trim();
    const description = visit.description?.trim();

    const cleanedDescription = description?.replace(/^Visite de\s+/i, '').trim();

    if (visit.type !== 'search') {
      if (cleanedDescription) {
        return cleanedDescription;
      }
      if (description && description !== visit.url) {
        return description;
      }
    }

    if (primaryLabel && primaryLabel.toLowerCase() !== 'page visitée') {
      return primaryLabel;
    }

    if (description) {
      return description;
    }

    return visit.url;
  };

  const formatVisitDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historique des visites
            </h1>
          </div>
        </div>

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
                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(visit.url)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {getVisitLocation(visit)}
                    </p>
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatVisitDate(visit.timestamp)}
                    </span>
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
