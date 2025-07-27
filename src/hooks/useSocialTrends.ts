import { useState, useEffect } from 'react';

export interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  platform: 'twitter' | 'reddit' | 'instagram' | 'tiktok';
  hashtags: string[];
  engagement: number;
  category: string;
}

export const useSocialTrends = () => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Données de test au lieu d'appeler les APIs
      const mockTrends: TrendingTopic[] = [
        {
          id: '1',
          title: 'Conseils bien-être',
          description: 'Tendances bien-être et lifestyle',
          platform: 'instagram',
          hashtags: ['#bienêtre', '#lifestyle', '#santé'],
          engagement: 15000,
          category: 'lifestyle'
        },
        {
          id: '2',
          title: 'Recettes rapides',
          description: 'Idées de recettes faciles et rapides',
          platform: 'tiktok',
          hashtags: ['#cuisine', '#recettes', '#rapide'],
          engagement: 12000,
          category: 'cuisine'
        },
        {
          id: '3',
          title: 'Astuces tech',
          description: 'Conseils et astuces technologiques',
          platform: 'twitter',
          hashtags: ['#tech', '#astuces', '#innovation'],
          engagement: 8000,
          category: 'technology'
        },
        {
          id: '4',
          title: 'Humour quotidien',
          description: 'Contenu humoristique du quotidien',
          platform: 'tiktok',
          hashtags: ['#humour', '#quotidien', '#fun'],
          engagement: 25000,
          category: 'entertainment'
        },
        {
          id: '5',
          title: 'Conseils business',
          description: 'Astuces pour entrepreneurs',
          platform: 'twitter',
          hashtags: ['#business', '#entrepreneur', '#conseils'],
          engagement: 6000,
          category: 'business'
        }
      ];
      
      setTrends(mockTrends);
    } catch (err) {
      setError('Erreur lors du chargement des tendances');
      console.error('Erreur useSocialTrends:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterByPlatform = (platform: string) => {
    return trends.filter(trend => trend.platform === platform);
  };

  const filterByCategory = (category: string) => {
    return trends.filter(trend => trend.category === category);
  };

  const getTopTrends = (limit: number = 10) => {
    return trends
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, limit);
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return {
    trends,
    loading,
    error,
    fetchTrends,
    filterByPlatform,
    filterByCategory,
    getTopTrends
  };
}; 