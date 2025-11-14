import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  FileText, 
  Plus,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateContentForm from '@/components/forms/CreateContentForm';
import Navigation from '@/components/Navigation';

interface Content {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  readingTime: number;
  status: 'draft' | 'published' | 'archived';
  content: string;
  socialNetworks: string[];
  playlist: string;
  category: string;
}

const Contenu = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);

  const handleBack = () => {
    navigateBack();
  };

  const handleCreateContent = () => {
    setShowCreateForm(true);
  };

  const handleContentCreated = (contentData: { title: string; [key: string]: unknown }) => {
    const newContent: Content = {
      id: Date.now().toString(),
      title: contentData.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      readingTime: 0,
      status: 'draft',
      content: '',
      socialNetworks: [],
      playlist: '',
      category: ''
    };
    setContents([...contents, newContent]);
    setShowCreateForm(false);
  };

  const handleViewContent = (content: Content) => {
    navigate(`/content/${content.id}`);
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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Écrire du contenu</h1>
                <p className="text-sm text-muted-foreground">Créez et organisez vos contenus</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Menu de navigation */}
        <div className="mb-6">
          <Tabs value="contenus" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="contenus" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Mes contenus
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu principal */}
        {contents.length === 0 ? (
          /* Seulement le bouton quand il n'y a pas de contenu */
          <div className="flex justify-center py-12">
            <Button 
              onClick={handleCreateContent}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Plus className="w-6 h-6 mr-3" />
              Nouveau contenu
            </Button>
          </div>
        ) : (
          /* Bouton + liste des contenus quand il y a du contenu */
          <>
            <div className="flex justify-end mb-6">
              <Button 
                onClick={handleCreateContent}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau contenu
              </Button>
            </div>

            <div className="space-y-3">
              {contents.map((content) => (
                <div 
                  key={content.id}
                  className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewContent(content)}
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

export default Contenu;