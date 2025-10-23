import React, { useState } from 'react';
import { useSocialTrends, type TrendingTopic } from '@/hooks/useSocialTrends';
import TrendingCard from '@/components/TrendingCard';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, TrendingUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import Navigation from '@/components/Navigation';

const TrendingIdeas: React.FC = () => {
  const { trends, loading, error, fetchTrends, filterByPlatform, filterByCategory, getTopTrends } = useSocialTrends();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  const platforms = ['all', 'twitter', 'reddit', 'instagram', 'tiktok', 'blog', 'article'];
  const categories = ['all', 'technology', 'lifestyle', 'entertainment', 'business'];

  const filteredTrends = trends.filter(trend => {
    const platformMatch = selectedPlatform === 'all' || trend.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'all' || trend.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  const handleUseTrend = (trend: TrendingTopic) => {
    // Naviguer vers la page de création avec les données de la tendance
    navigate('/publish', { 
      state: { 
        title: trend.title,
        hashtags: trend.hashtags,
        description: trend.description 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-creatik-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-creatik-primary">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Chargement des tendances...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-creatik-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-creatik-error mb-4">{error}</p>
            <Button 
              onClick={fetchTrends}
              className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creatik-primary">
      <div className="container mx-auto px-4 py-6">
        {/* En-tête avec statistiques */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-creatik-primary" />
            <h1 className="text-2xl font-bold text-creatik-primary">
              Tendances Sociales
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-creatik-button-primary text-white">
              {trends.length} tendances
            </Badge>
            <Badge className="bg-creatik-button-secondary text-creatik-primary">
              {getTopTrends(5).length} populaires
            </Badge>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-creatik-muted" />
            <span className="text-creatik-secondary text-sm">Filtrer par :</span>
          </div>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40 bg-creatik-secondary border-creatik">
              <SelectValue placeholder="Plateforme" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>
                  {platform === 'all' ? 'Toutes' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 bg-creatik-secondary border-creatik">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'Toutes' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={fetchTrends}
            variant="outline"
            size="sm"
            className="border-creatik text-creatik-primary hover:bg-creatik-hover"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Grille des tendances */}
        {filteredTrends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-creatik-muted mb-4">
              Aucune tendance trouvée avec ces filtres
            </p>
            <Button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedCategory('all');
              }}
              className="bg-creatik-button-primary text-white hover:bg-creatik-hover"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map(trend => (
              <TrendingCard
                key={trend.id}
                trend={trend}
                onUseTrend={handleUseTrend}
              />
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default TrendingIdeas; 