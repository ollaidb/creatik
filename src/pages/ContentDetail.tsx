import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  FileText, 
  Edit3, 
  Trash2, 
  Share2,
  Calendar,
  Clock,
  Eye,
  Target,
  Hash,
  Tag,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navigation from '@/components/Navigation';

interface Content {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  wordCount: number;
  readingTime: number;
  content?: string;
  socialNetworks?: string[];
  playlist?: string;
  category?: string;
}

const ContentDetail = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('texte');

  // Données d'exemple - dans une vraie app, on récupérerait depuis l'API
  const content: Content = {
    id: id || '1',
    title: '10 conseils pour améliorer votre présence Instagram',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'draft',
    wordCount: 1200,
    readingTime: 6,
    content: 'Voici un contenu détaillé sur les conseils Instagram...',
    socialNetworks: ['Instagram', 'Facebook'],
    playlist: 'Marketing Digital',
    category: 'Réseaux sociaux'
  };

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    // TODO: Ouvrir l'éditeur
    console.log('Éditer le contenu');
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      // TODO: Supprimer le contenu
      navigateBack();
    }
  };

  const handleShare = () => {
    // TODO: Ouvrir les options de partage
    console.log('Partager le contenu');
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
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-xl font-semibold flex-1">{content.title}</h1>
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
                    <div className="text-lg font-medium">{content.title}</div>
                    <Separator />
                    
                    {/* Informations du contenu */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Créé le {formatDate(content.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Modifié le {formatDate(content.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{content.wordCount} mots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{content.readingTime} min de lecture</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(content.status)} text-white text-xs`}>
                          {getStatusLabel(content.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Idée du contenu */}
                    {content.content && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Contenu</h4>
                          <p className="text-sm text-muted-foreground">{content.content}</p>
                        </div>
                      </>
                    )}

                    {/* Réseaux sociaux */}
                    {content.socialNetworks && content.socialNetworks.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Réseaux sociaux</h4>
                          <div className="flex flex-wrap gap-1">
                            {content.socialNetworks.map((network, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {network}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Playlist */}
                    {content.playlist && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Playlist</h4>
                          <Badge variant="outline" className="text-xs">
                            {content.playlist}
                          </Badge>
                        </div>
                      </>
                    )}

                    {/* Catégorie */}
                    {content.category && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Catégorie</h4>
                          <Badge variant="outline" className="text-xs">
                            {content.category}
                          </Badge>
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
              <TabsTrigger value="texte" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Texte
              </TabsTrigger>
              <TabsTrigger value="source" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Source
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
          {activeTab === 'texte' ? (
            /* Onglet Texte - Éditeur de texte */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Éditeur de texte - {content.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Contenu de votre article
                    </label>
                    <textarea
                      className="w-full min-h-[400px] p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Commencez à écrire votre contenu ici..."
                      defaultValue={content.content || ''}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Mots: {content.wordCount}</span>
                    <span>Temps de lecture: {content.readingTime} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Onglet Source - Sources du contenu */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-500" />
                  Sources - {content.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Réseaux sociaux */}
                  {content.socialNetworks && content.socialNetworks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-green-500" />
                        Réseaux sociaux ciblés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {content.socialNetworks.map((network, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                            {network}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Playlist */}
                  {content.playlist && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-purple-500" />
                        Playlist associée
                      </h3>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {content.playlist}
                      </Badge>
                    </div>
                  )}

                  {/* Catégorie */}
                  {content.category && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-orange-500" />
                        Catégorie
                      </h3>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {content.category}
                      </Badge>
                    </div>
                  )}

                  {/* Informations de création */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Informations de création
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Créé le {formatDate(content.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Modifié le {formatDate(content.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(content.status)} text-white text-xs`}>
                          {getStatusLabel(content.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Zone pour ajouter des sources externes */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-500" />
                      Sources externes
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                        <p>Aucune source externe ajoutée</p>
                        <p className="text-xs mt-1">Cliquez pour ajouter des liens, références ou sources</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};

export default ContentDetail;
