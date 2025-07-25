import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trash2, Plus, RotateCcw, Trash } from 'lucide-react';
import { usePublications } from '@/hooks/usePublications';
import { useTrash } from '@/hooks/useTrash';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const Publications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { publications, loading, error, deletePublication } = usePublications();
  const { trashItems, loading: trashLoading, restoreFromTrash, permanentlyDelete, getDaysLeft, refresh: refreshTrash } = useTrash();
  // États pour la confirmation de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
    type: 'category' | 'subcategory' | 'title';
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showTrash, setShowTrash] = useState(false);
  // Recharger les données de la corbeille quand les publications changent
  useEffect(() => {
    if (showTrash) {
      refreshTrash();
    }
  }, [publications, showTrash]);
  // Filtrer les publications par type
  const filteredPublications = publications.filter(publication => {
    if (activeTab === 'all') return true;
    return publication.content_type === activeTab;
  });
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Publié</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Rejeté</Badge>;
      default:
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Publié</Badge>;
    }
  };
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };
  // Fonctions pour la suppression
  const handleDeleteClick = (publication: { id: string; title: string; content_type: string }) => {
    setItemToDelete({
      id: publication.id,
      title: publication.title,
      type: publication.content_type as 'category' | 'subcategory' | 'title'
    });
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deletePublication(itemToDelete.id);
      if (result.success) {
        toast({
          title: "Publication supprimée",
          description: `${itemToDelete.title} a été déplacé vers la corbeille`,
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer la publication",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  // Fonctions pour la corbeille
  const handleRestore = async (itemId: string) => {
    try {
      await restoreFromTrash(itemId);
      toast({
        title: "Élément restauré",
        description: "L'élément a été restauré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de restaurer l'élément",
        variant: "destructive"
      });
    }
  };
  const handlePermanentDelete = async (itemId: string) => {
    try {
      await permanentlyDelete(itemId);
      toast({
        title: "Élément supprimé définitivement",
        description: "L'élément a été supprimé définitivement",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer définitivement l'élément",
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Publications</h1>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
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
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Publications</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowTrash(!showTrash)}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Corbeille
            {trashItems.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {trashItems.length}
              </Badge>
            )}
          </Button>
          <Button 
            onClick={() => navigate('/publish')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle
          </Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {/* Menu avec onglets */}
        <div className="mb-6">
          {showTrash ? (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trash className="h-5 w-5" />
                Corbeille
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowTrash(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux publications
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="category">Catégories</TabsTrigger>
                <TabsTrigger value="subcategory">Sous-catégories</TabsTrigger>
                <TabsTrigger value="title">Titres</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        {/* Contenu de la corbeille */}
        {showTrash ? (
          trashLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement de la corbeille...</p>
              </div>
            </div>
          ) : trashItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <Trash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Corbeille vide</h3>
                  <p>Aucun élément dans la corbeille</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {trashItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="capitalize">{item.content_type}</span>
                          <span>•</span>
                          <span>Supprimé le {formatDate(item.deleted_at)}</span>
                          <span>•</span>
                          <span>Expire dans {getDaysLeft(item.deleted_at)} jours</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(item.id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restaurer
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handlePermanentDelete(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )
        ) : (
          /* Contenu des publications normales */
          filteredPublications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'all' ? 'Aucune publication' : 
                     activeTab === 'category' ? 'Aucune catégorie' :
                     activeTab === 'subcategory' ? 'Aucune sous-catégorie' : 'Aucun titre'}
                  </h3>
                  <p>
                    {activeTab === 'all' ? 'Vous n\'avez pas encore publié de contenu.' :
                     activeTab === 'category' ? 'Vous n\'avez pas encore publié de catégorie.' :
                     activeTab === 'subcategory' ? 'Vous n\'avez pas encore publié de sous-catégorie.' :
                     'Vous n\'avez pas encore publié de titre.'}
                  </p>
                </div>
                <Button onClick={() => navigate('/publish')}>
                  Créer ma première publication
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPublications.map((publication) => (
                <Card key={publication.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{publication.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="capitalize">{publication.content_type}</span>
                          <span>•</span>
                          <span>{formatDate(publication.created_at)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(publication)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  {publication.rejection_reason && (
                    <CardContent className="pt-0">
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive font-medium mb-1">Raison du rejet :</p>
                        <p className="text-sm text-destructive/80">{publication.rejection_reason}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )
        )}
      </main>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Supprimer cette publication"
        description="Êtes-vous sûr de vouloir supprimer cette publication ? Elle sera déplacée vers la corbeille et pourra être restaurée ultérieurement."
        itemName={itemToDelete?.title || ''}
        isLoading={isDeleting}
      />
    </div>
  );
};
export default Publications;
