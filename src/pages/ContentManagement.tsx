import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import CreateContentForm from '@/components/forms/CreateContentForm';

interface Content {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  wordCount: number;
  readingTime: number;
}

const ContentManagement = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      title: '10 conseils pour améliorer votre présence Instagram',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      status: 'draft',
      wordCount: 1200,
      readingTime: 6
    },
    {
      id: '2',
      title: 'Guide complet du marketing TikTok pour les débutants',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      status: 'published',
      wordCount: 2500,
      readingTime: 12
    },
    {
      id: '3',
      title: 'Comment créer du contenu engageant sur LinkedIn',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      status: 'draft',
      wordCount: 1800,
      readingTime: 9
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const handleCreateContent = (contentData: { title: string }) => {
    const newContent: Content = {
      id: Date.now().toString(),
      title: contentData.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      wordCount: 0,
      readingTime: 0
    };
    setContents(prev => [newContent, ...prev]);
  };

  const handleEditContent = (content: Content) => {
    // TODO: Ouvrir l'éditeur de contenu
    console.log('Éditer le contenu:', content);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      setContents(prev => prev.filter(content => content.id !== contentId));
    }
  };

  const handleViewContent = (content: Content) => {
    navigate(`/content/${content.id}`);
  };

  const filteredContents = contents.filter(content => {
    if (!showArchived && content.status === 'archived') return false;
    if (filterStatus !== 'all' && content.status !== filterStatus) return false;
    if (searchQuery && !content.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: Content['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'published': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Content['status']) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Gestion du contenu</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez tous vos contenus créés
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau contenu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un contenu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="draft">Brouillons</TabsTrigger>
                <TabsTrigger value="published">Publiés</TabsTrigger>
                <TabsTrigger value="archived">Archivés</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label className="text-sm">Afficher les archivés</Label>
            </div>
          </div>
        </div>

        {/* Contents List */}
        {filteredContents.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
          )}>
            <AnimatePresence>
              {filteredContents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="hover:shadow-md transition-shadow group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewContent(content)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(content)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48" align="end">
                                <div className="space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditContent(content)}
                                    className="w-full justify-start"
                                  >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewContent(content)}
                                    className="w-full justify-start"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir
                                  </Button>
                                  <Separator />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteContent(content.id)}
                                    className="w-full justify-start text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{content.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(content.status)} text-white text-xs`}>
                              {getStatusLabel(content.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{content.wordCount} mots</span>
                            <span>{content.readingTime} min</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Modifié le {formatDate(content.updatedAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{content.title}</h3>
                          <Badge className={`${getStatusColor(content.status)} text-white text-xs`}>
                            {getStatusLabel(content.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{content.wordCount} mots</span>
                          <span>{content.readingTime} min de lecture</span>
                          <span>Modifié le {formatDate(content.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContent(content)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContent(content)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContent(content.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun contenu trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Aucun contenu ne correspond à votre recherche'
                : 'Commencez par créer votre premier contenu'
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer du contenu
            </Button>
          </div>
        )}
      </main>

      {/* Create Content Form */}
      <CreateContentForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleCreateContent}
      />

      <Navigation />
    </div>
  );
};

export default ContentManagement;
