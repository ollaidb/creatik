import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users2, 
  Target, 
  FileText, 
  Tag, 
  Layers, 
  BookOpen,
  Heart,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSubcategoriesLevel2 } from '@/hooks/useSubcategoriesLevel2';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useHooks } from '@/hooks/useHooks';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import Navigation from '@/components/Navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ContributorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Hooks pour récupérer les données
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(null);
  const { data: subcategoriesLevel2, isLoading: subcategoriesLevel2Loading } = useSubcategoriesLevel2(null);
  const { data: contentTitles, isLoading: contentTitlesLoading } = useContentTitles();
  const { data: hooks, isLoading: hooksLoading } = useHooks();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: sources, isLoading: sourcesLoading } = useSources();
  const { data: challenges, isLoading: challengesLoading } = usePublicChallenges();

  // Données du profil utilisateur
  const userProfile = {
    name: user?.user_metadata?.full_name || "Contributeur",
    profilePicture: user?.user_metadata?.avatar_url || null
  };

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Statistiques des contributions
  const contributions = {
    categories: categories?.length || 0,
    subcategories: subcategories?.length || 0,
    subcategoriesLevel2: subcategoriesLevel2?.length || 0,
    contentTitles: contentTitles?.length || 0,
    hooks: hooks?.length || 0,
    accounts: accounts?.length || 0,
    sources: sources?.length || 0,
    challenges: challenges?.length || 0
  };

  const totalContributions = Object.values(contributions).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header du profil */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback className="text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
              
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{totalContributions}</div>
              <div className="text-sm text-muted-foreground">Contributions totales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
              onClick={() => navigate('/public-challenges')}
            >
              <Target className="w-5 h-5 text-orange-500" />
              <span className="text-xs">Communauté</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
              onClick={() => navigate('/my-contributions')}
            >
              <Users2 className="w-5 h-5 text-indigo-500" />
              <span className="text-xs">Mes Contributions</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="contributions">Mes Contributions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistiques des contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Statistiques des Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{contributions.categories}</div>
                    <div className="text-sm text-muted-foreground">Catégories</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{contributions.subcategories}</div>
                    <div className="text-sm text-muted-foreground">Sous-catégories</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{contributions.contentTitles}</div>
                    <div className="text-sm text-muted-foreground">Titres</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{contributions.hooks}</div>
                    <div className="text-sm text-muted-foreground">Hooks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dernières contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Dernières Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span>Nouvelle catégorie ajoutée</span>
                    </div>
                    <Badge variant="secondary">Aujourd'hui</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>Nouveau titre de contenu</span>
                    </div>
                    <Badge variant="secondary">Hier</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Hook ajouté</span>
                    </div>
                    <Badge variant="secondary">Il y a 2 jours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            {/* Menu des contributions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => navigate('/categories')}
              >
                <Tag className="w-6 h-6 text-blue-500" />
                <span className="text-sm">Catégories</span>
                <Badge variant="secondary">{contributions.categories}</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => navigate('/subcategories')}
              >
                <Layers className="w-6 h-6 text-green-500" />
                <span className="text-sm">Sous-catégories</span>
                <Badge variant="secondary">{contributions.subcategories}</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => navigate('/titles')}
              >
                <FileText className="w-6 h-6 text-purple-500" />
                <span className="text-sm">Titres</span>
                <Badge variant="secondary">{contributions.contentTitles}</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => navigate('/hooks')}
              >
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-sm">Hooks</span>
                <Badge variant="secondary">{contributions.hooks}</Badge>
              </Button>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3"
                    onClick={() => navigate('/publish')}
                  >
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Publier du contenu</div>
                      <div className="text-sm text-muted-foreground">Ajouter une nouvelle contribution</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3"
                    onClick={() => navigate('/public-challenges')}
                  >
                    <Target className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Rejoindre la communauté</div>
                      <div className="text-sm text-muted-foreground">Participer aux discussions</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContributorProfile;
