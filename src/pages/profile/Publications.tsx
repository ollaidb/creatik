import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trash2, Plus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublications } from '@/hooks/usePublications';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navigation from '@/components/Navigation';

const PUBLICATION_TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'category', label: 'Catégories' },
  { key: 'subcategory', label: 'Sous-catégories' },
  { key: 'title', label: 'Titres' },
  { key: 'account', label: 'Comptes' },
  { key: 'source', label: 'Sources' },
  { key: 'challenge', label: 'Challenges' },
];

const Publications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { publications, loading, error, deletePublication } = usePublications();
  
  // États pour la confirmation de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
    type: 'category' | 'subcategory' | 'title' | 'account' | 'source' | 'challenge';
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showTrash, setShowTrash] = useState(false);

  // Recharger les données de la corbeille quand les publications changent
  useEffect(() => {
    if (showTrash) {
      // refreshTrash(); // This line was removed as per the edit hint
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
      type: publication.content_type as 'category' | 'subcategory' | 'title' | 'account' | 'source' | 'challenge'
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
          title: "Supprimé"
        });
      } else {
        toast({
          title: "Erreur",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
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
      // restoreFromTrash(itemId); // This line was removed as per the edit hint
      toast({
        title: "Restauré"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handlePermanentDelete = async (itemId: string) => {
    try {
      // permanentlyDelete(itemId); // This line was removed as per the edit hint
      toast({
        title: "Supprimé"
      });
    } catch (error) {
      toast({
        title: "Erreur",
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
          <h1 className="text-xl font-semibold">Publications</h1>
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
          <h1 className="text-xl font-semibold">Publications</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowTrash(!showTrash)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Corbeille
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Menu avec onglets */}
        <div className="mb-6">
          {showTrash ? (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
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
            <div className="mb-3">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2 min-w-max">
                  {PUBLICATION_TABS.map(tab => {
                    const isActive = activeTab === tab.key;
                    const getTabColor = (tabKey: string) => {
                      switch (tabKey) {
                        case 'all':
                          return 'from-gray-500 to-gray-600';
                        case 'category':
                          return 'from-blue-500 to-cyan-500';
                        case 'subcategory':
                          return 'from-green-500 to-emerald-500';
                        case 'title':
                          return 'from-purple-500 to-pink-500';
                        case 'account':
                          return 'from-orange-500 to-red-500';
                        case 'source':
                          return 'from-indigo-500 to-purple-500';
                        case 'challenge':
                          return 'from-yellow-500 to-orange-500';
                        default:
                          return 'from-gray-500 to-gray-600';
                      }
                    };
                    return (
                      <motion.button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                          px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                          ${isActive
                            ? 'bg-gradient-to-r ' + getTabColor(tab.key) + ' text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isActive ? {
                          scale: [1, 1.1, 1.05],
                          boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          ]
                        } : {}}
                        transition={isActive ? {
                          duration: 0.6,
                          ease: "easeInOut"
                        } : {
                          duration: 0.2
                        }}
                      >
                        <span className={`
                          text-xs font-medium leading-tight
                          ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                        `}>
                          {tab.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Contenu de la corbeille */}
        {showTrash ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de la corbeille...</p>
            </div>
          </div>
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
                     activeTab === 'subcategory' ? 'Aucune sous-catégorie' :
                     activeTab === 'title' ? 'Aucun titre' :
                     activeTab === 'account' ? 'Aucun compte' :
                     activeTab === 'source' ? 'Aucune source' : 'Aucun challenge'}
                  </h3>
                  <p>
                    {activeTab === 'all' ? 'Vous n\'avez pas encore publié de contenu.' :
                     activeTab === 'category' ? 'Vous n\'avez pas encore publié de catégorie.' :
                     activeTab === 'subcategory' ? 'Vous n\'avez pas encore publié de sous-catégorie.' :
                     activeTab === 'title' ? 'Vous n\'avez pas encore publié de titre.' :
                     activeTab === 'account' ? 'Vous n\'avez pas encore publié de compte.' :
                     activeTab === 'source' ? 'Vous n\'avez pas encore publié de source.' : 'Vous n\'avez pas encore publié de challenge.'}
                  </p>
                </div>
                <Button onClick={() => navigate('/publish')}>
                  Créer ma première publication
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPublications.map((publication) => (
                <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{publication.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Badge variant="outline" className="capitalize">
                            {publication.content_type}
                          </Badge>
                          <span>•</span>
                          <span>{formatDate(publication.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(publication.status || 'approved')}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(publication)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {publication.rejection_reason && (
                      <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive font-medium mb-1">Raison du rejet :</p>
                        <p className="text-sm text-destructive/80">{publication.rejection_reason}</p>
                      </div>
                    )}
                  </CardContent>
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
      <Navigation />
    </div>
  );
};

export default Publications;
