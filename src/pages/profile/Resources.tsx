import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  PlayCircle,
  Download,
  Star,
  Users,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Resources = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  const resourceCategories = [
    {
      title: 'Guides de démarrage',
      icon: PlayCircle,
      color: 'bg-blue-500',
      resources: [
        {
          title: 'Comment créer votre premier contenu',
          description: 'Guide complet pour débuter sur les réseaux sociaux',
          type: 'Guide',
          duration: '15 min',
          difficulty: 'Débutant'
        },
        {
          title: 'Optimiser vos publications',
          description: 'Techniques pour maximiser l\'engagement',
          type: 'Tutoriel',
          duration: '20 min',
          difficulty: 'Intermédiaire'
        },
        {
          title: 'Stratégie de contenu 30 jours',
          description: 'Plan complet pour un mois de contenu',
          type: 'Plan',
          duration: '30 min',
          difficulty: 'Avancé'
        }
      ]
    },
    {
      title: 'Templates et modèles',
      icon: FileText,
      color: 'bg-green-500',
      resources: [
        {
          title: 'Templates Instagram Stories',
          description: '50+ modèles prêts à utiliser',
          type: 'Template',
          duration: 'Téléchargement',
          difficulty: 'Tous niveaux'
        },
        {
          title: 'Calendrier éditorial',
          description: 'Modèle Excel pour planifier votre contenu',
          type: 'Fichier',
          duration: 'Téléchargement',
          difficulty: 'Tous niveaux'
        },
        {
          title: 'Captions prêtes à utiliser',
          description: '100+ légendes pour tous types de contenu',
          type: 'Texte',
          duration: 'Téléchargement',
          difficulty: 'Tous niveaux'
        }
      ]
    },
    {
      title: 'Formations vidéo',
      icon: Video,
      color: 'bg-purple-500',
      resources: [
        {
          title: 'Maîtrisez TikTok en 7 jours',
          description: 'Formation complète sur l\'algorithme TikTok',
          type: 'Formation',
          duration: '2h 30min',
          difficulty: 'Intermédiaire'
        },
        {
          title: 'Instagram Reels : Le guide complet',
          description: 'Tout savoir sur les Reels Instagram',
          type: 'Formation',
          duration: '1h 45min',
          difficulty: 'Débutant'
        },
        {
          title: 'YouTube : De 0 à 1000 abonnés',
          description: 'Stratégies pour développer votre chaîne',
          type: 'Formation',
          duration: '3h 15min',
          difficulty: 'Avancé'
        }
      ]
    },
    {
      title: 'Outils et ressources',
      icon: Lightbulb,
      color: 'bg-orange-500',
      resources: [
        {
          title: 'Générateur d\'idées de contenu',
          description: 'IA pour générer des idées personnalisées',
          type: 'Outil',
          duration: 'En ligne',
          difficulty: 'Tous niveaux'
        },
        {
          title: 'Analyseur de hashtags',
          description: 'Trouvez les meilleurs hashtags pour vos posts',
          type: 'Outil',
          duration: 'En ligne',
          difficulty: 'Tous niveaux'
        },
        {
          title: 'Bibliothèque d\'images libres',
          description: '10,000+ images haute qualité gratuites',
          type: 'Ressource',
          duration: 'En ligne',
          difficulty: 'Tous niveaux'
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Guide': return BookOpen;
      case 'Tutoriel': return PlayCircle;
      case 'Formation': return Video;
      case 'Template': return FileText;
      case 'Outil': return Target;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ressources</h1>
            <p className="text-muted-foreground">Guides, templates et outils pour créer du contenu</p>
          </div>
        </div>

        <div className="space-y-8">
          {resourceCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.resources.map((resource, resourceIndex) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <motion.div
                          key={resource.title}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (categoryIndex * 0.1) + (resourceIndex * 0.05) }}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg ${category.color} bg-opacity-20`}>
                                  <TypeIcon className="w-4 h-4" style={{ color: category.color.replace('bg-', '') }} />
                                </div>
                                <Badge className={getDifficultyColor(resource.difficulty)}>
                                  {resource.difficulty}
                                </Badge>
                              </div>
                              
                              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                                {resource.title}
                              </h3>
                              
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {resource.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  {resource.type}
                                </span>
                                <span>{resource.duration}</span>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  // Ici vous pouvez ajouter la logique pour ouvrir la ressource
                                  console.log('Ouvrir:', resource.title);
                                }}
                              >
                                <ExternalLink className="w-3 h-3 mr-2" />
                                Accéder
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Section recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recommandations pour vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rejoignez notre communauté</h3>
                    <p className="text-sm text-muted-foreground">
                      Échangez avec d'autres créateurs de contenu
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Téléchargez l'app mobile</h3>
                    <p className="text-sm text-muted-foreground">
                      Créez du contenu où que vous soyez
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Resources;