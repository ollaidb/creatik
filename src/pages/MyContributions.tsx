import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Layers, 
  FileText, 
  Heart, 
  Users, 
  BookOpen,
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSubcategoriesLevel2 } from '@/hooks/useSubcategoriesLevel2';
import { useContentTitles } from '@/hooks/useContentTitles';
import { useHooks } from '@/hooks/useHooks';
import { useAccounts } from '@/hooks/useAccounts';
import { useSources } from '@/hooks/useSources';
import { usePublicChallenges } from '@/hooks/usePublicChallenges';
import Navigation from '@/components/Navigation';

const MyContributions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');

  // Hooks pour récupérer les données
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(null);
  const { data: subcategoriesLevel2, isLoading: subcategoriesLevel2Loading } = useSubcategoriesLevel2(null);
  const { data: contentTitles, isLoading: contentTitlesLoading } = useContentTitles();
  const { data: hooks, isLoading: hooksLoading } = useHooks();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: sources, isLoading: sourcesLoading } = useSources();
  const { data: challenges, isLoading: challengesLoading } = usePublicChallenges();

  // Données de test pour les contributions de l'utilisateur
  const userContributions = {
    categories: categories?.slice(0, 5) || [],
    subcategories: subcategories?.slice(0, 8) || [],
    subcategoriesLevel2: subcategoriesLevel2?.slice(0, 6) || [],
    contentTitles: contentTitles?.slice(0, 10) || [],
    hooks: hooks?.slice(0, 7) || [],
    accounts: accounts?.slice(0, 4) || [],
    sources: sources?.slice(0, 3) || [],
    challenges: challenges?.slice(0, 5) || []
  };

  const contributionTabs = [
    { key: 'categories', label: 'Catégories', icon: Tag, count: userContributions.categories.length, color: 'text-blue-500' },
    { key: 'subcategories', label: 'Sous-catégories', icon: Layers, count: userContributions.subcategories.length, color: 'text-green-500' },
    { key: 'subcategoriesLevel2', label: 'Sous-catégories Niveau 2', icon: Layers, count: userContributions.subcategoriesLevel2.length, color: 'text-emerald-500' },
    { key: 'contentTitles', label: 'Titres', icon: FileText, count: userContributions.contentTitles.length, color: 'text-purple-500' },
    { key: 'hooks', label: 'Hooks', icon: Heart, count: userContributions.hooks.length, color: 'text-red-500' },
    { key: 'accounts', label: 'Comptes', icon: Users, count: userContributions.accounts.length, color: 'text-orange-500' },
    { key: 'sources', label: 'Sources', icon: BookOpen, count: userContributions.sources.length, color: 'text-indigo-500' },
    { key: 'challenges', label: 'Communauté', icon: Target, count: userContributions.challenges.length, color: 'text-pink-500' }
  ];

  const renderContributionList = (contributions: unknown[], type: string) => {
    if (contributions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            Aucune contribution trouvée
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une contribution
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {contributions.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {(() => {
                  const tab = contributionTabs.find(tab => tab.key === type);
                  const IconComponent = tab?.icon;
                  return IconComponent ? <IconComponent className="w-5 h-5 text-primary" /> : null;
                })()}
              </div>
              <div>
                <div className="font-medium">{item.name || item.title || item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description || item.content || 'Aucune description'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {new Date(item.created_at || Date.now()).toLocaleDateString()}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mes Contributions</h1>
              <p className="text-muted-foreground">Gérez toutes vos contributions à la communauté</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle contribution
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contributionTabs.slice(0, 4).map((tab) => (
              <div key={tab.key} className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{tab.count}</div>
                <div className="text-sm text-muted-foreground">{tab.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
            {contributionTabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="flex flex-col gap-1 h-auto py-2">
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                <span className="text-xs">{tab.label}</span>
                <Badge variant="secondary" className="text-xs">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {contributionTabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className={`w-5 h-5 ${tab.color}`} />
                    {tab.label} ({tab.count})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderContributionList(userContributions[tab.key as keyof typeof userContributions], tab.key)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MyContributions;
