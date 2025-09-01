import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Heart, ExternalLink } from 'lucide-react';
import { useSources } from '@/hooks/useSources';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
const Sources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: sources = [], isLoading } = useSources();
  const { favorites, toggleFavorite, isFavorite } = useFavorites('source');
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
  const handleFavorite = (sourceId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise"
      });
      return;
    }
    toggleFavorite(sourceId);
    toast({
      title: isFavorite(sourceId) ? "Retiré" : "Ajouté"
    });
  };
  const handleVisitSource = (url: string) => {
    window.open(url, '_blank');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Sources</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des sources...</p>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Sources</h1>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Globe className="w-4 h-4" />
          {sources.length} sources
        </Badge>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {sources.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sources.map((source) => (
              <motion.div key={source.id} variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {source.description?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavorite(source.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Heart 
                          className={`w-5 h-5 ${isFavorite(source.id) ? 'text-red-500 fill-red-500' : ''}`} 
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {source.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Source
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVisitSource(source.url)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visiter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <Globe className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Aucune source trouvée</h3>
            <p className="text-muted-foreground mt-2">
              Aucune source n'est disponible pour le moment
            </p>
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
};
export default Sources; 