
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Clock, Search, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
import { useAuth } from '@/hooks/useAuth';
import { useSearchHistory } from '@/hooks/useSearchHistory';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, clearHistory } = useSearchHistory();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <StickyHeader showSearchBar={false} />
        
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/profile')} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Historique</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center h-60">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
          <p className="text-muted-foreground text-center mb-4">
            Connectez-vous pour voir votre historique de recherche
          </p>
          <Button onClick={() => navigate('/profile')}>
            Se connecter
          </Button>
        </main>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <StickyHeader showSearchBar={false} />
      
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Historique</h1>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Effacer
            </Button>
          )}
          <Button 
            size="sm"
            onClick={() => navigate('/publish')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Publier
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {history.length > 0 ? (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {history.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Search className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.query}</h3>
                        <p className="text-muted-foreground text-sm">Recherche effectuée</p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Aucun historique</h3>
            <p className="text-muted-foreground mt-2">
              Votre historique de recherche apparaîtra ici
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4"
              variant="outline"
            >
              Commencer à explorer
            </Button>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default History;
