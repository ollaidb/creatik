import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import CreateContentForm from '@/components/forms/CreateContentForm';
import { 
  ArrowLeft, 
  Lightbulb, 
  Edit3, 
  Trash2, 
  Share2,
  Calendar,
  Target,
  Tag,
  Hash,
  Users,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Clock,
  FileText,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navigation from '@/components/Navigation';

interface Account {
  id: string;
  name: string;
  theme: string;
  network: string;
  category: string;
  subcategory: string;
  subSubcategory?: string;
  objective: string;
  subject: string;
  keywords: string[];
  values: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'archived';
}

const AccountDetail = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('informations');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contents, setContents] = useState([]);

  // Données d'exemple - dans une vraie app, on récupérerait depuis l'API
  const account: Account = {
    id: id || '1',
    name: 'Mon compte mode féminine',
    theme: 'Mode & Beauté',
    network: 'Instagram',
    category: 'Mode',
    subcategory: 'Femme',
    subSubcategory: 'Accessoires',
    objective: 'Partager des looks tendance et inspirer les femmes',
    subject: 'Mode féminine tendance',
    keywords: ['mode', 'fashion', 'style', 'looks', 'tendance'],
    values: ['authenticité', 'confiance', 'élégance', 'créativité'],
    description: 'Un compte dédié à la mode féminine avec des looks inspirants et des conseils style.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active'
  };

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Account['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    // TODO: Ouvrir l'éditeur
    console.log('Éditer le compte');
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      // TODO: Supprimer le compte
      navigateBack();
    }
  };

  const handleCreateContent = () => {
    setShowCreateForm(true);
  };

  const handleContentCreated = (contentData: any) => {
    const newContent = {
      id: Date.now().toString(),
      title: contentData.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      readingTime: 0,
      status: 'draft' as const,
      content: '',
      socialNetworks: [],
      playlist: '',
      category: ''
    };
    setContents([...contents, newContent]);
    setShowCreateForm(false);
  };

  const handleViewContent = (contentId: string) => {
    navigate(`/content/${contentId}`);
  };

  const handleShare = () => {
    // TODO: Ouvrir les options de partage
    console.log('Partager le compte');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec titre et 3 points */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Lightbulb className="w-5 h-5 text-green-500" />
              </div>
              <h1 className="text-xl font-semibold flex-1">{account.name}</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">{account.name}</div>
                    <Separator />
                    
                    {/* Informations du compte */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Créé le {formatDate(account.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Modifié le {formatDate(account.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{account.theme}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>{account.category}</span>
                      </div>
                      {account.network && (
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          <span>{account.network}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(account.status)} text-white text-xs`}>
                          {getStatusLabel(account.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    {account.description && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{account.description}</p>
                        </div>
                      </>
                    )}

                    {/* Objectif */}
                    {account.objective && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Objectif</h4>
                          <p className="text-sm text-muted-foreground">{account.objective}</p>
                        </div>
                      </>
                    )}

                    {/* Sujet */}
                    {account.subject && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Sujet</h4>
                          <p className="text-sm text-muted-foreground">{account.subject}</p>
                        </div>
                      </>
                    )}

                    {/* Mots-clés */}
                    {account.keywords.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Mots-clés</h4>
                          <div className="flex flex-wrap gap-1">
                            {account.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Valeurs */}
                    {account.values.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Valeurs</h4>
                          <div className="flex flex-wrap gap-1">
                            {account.values.map((value, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="flex-1"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="flex-1"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Menu de navigation */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="informations" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="contenu" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contenu
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu principal selon l'onglet actif */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[60vh]"
        >
          {activeTab === 'informations' ? (
            /* Onglet Informations - Toutes les données du formulaire */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Informations du compte - {account.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Informations générales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nom du compte</label>
                          <p className="text-sm font-medium">{account.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Thème</label>
                          <Badge variant="outline" className="mt-1">{account.theme}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Réseau</label>
                          <Badge variant="outline" className="mt-1">{account.network}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                          <Badge variant="outline" className="mt-1">{account.category}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Sous-catégorie</label>
                          <Badge variant="outline" className="mt-1">{account.subcategory}</Badge>
                        </div>
                        {account.subSubcategory && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Sous-sous-catégorie</label>
                            <Badge variant="outline" className="mt-1">{account.subSubcategory}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {account.description}
                    </p>
                  </div>

                  {/* Objectif */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      Objectif
                    </h3>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {account.objective}
                    </p>
                  </div>

                  {/* Sujet */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-purple-500" />
                      Sujet principal
                    </h3>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {account.subject}
                    </p>
                  </div>

                  {/* Mots-clés */}
                  {account.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-purple-500" />
                        Mots-clés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {account.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Valeurs */}
                  {account.values.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-500" />
                        Valeurs du compte
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {account.values.map((value, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Informations de création */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Informations de création
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Créé le:</span>
                          <span>{formatDate(account.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Modifié le:</span>
                          <span>{formatDate(account.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(account.status)} text-white text-xs`}>
                          {getStatusLabel(account.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Onglet Contenu - Blocs de contenu créés pour ce compte */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Contenu créé pour - {account.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contents.length === 0 ? (
                    /* Seulement le bouton quand il n'y a pas de contenu */
                    <div className="flex justify-center py-12">
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                        onClick={handleCreateContent}
                      >
                        <Plus className="w-6 h-6 mr-3" />
                        Créer du contenu
                      </Button>
                    </div>
                  ) : (
                    /* Bouton + liste des contenus quand il y a du contenu */
                    <>
                      <div className="flex justify-end mb-6">
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          onClick={handleCreateContent}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Créer du contenu
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {contents.map((content) => (
                          <div 
                            key={content.id}
                            className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleViewContent(content.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{content.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Créé le {formatDate(content.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      <Navigation />

      {/* Formulaire de création de contenu */}
      <CreateContentForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleContentCreated}
      />
    </div>
  );
};

export default AccountDetail;
