
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trash2, Plus } from 'lucide-react';
import { useUserPublications } from '@/hooks/useUserPublications';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Publications = () => {
  const navigate = useNavigate();
  const { publications, loading, deletePublication } = useUserPublications();

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status || 'En attente'}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      await deletePublication(id);
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
        <Button 
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {publications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucune publication</h3>
                <p>Vous n'avez pas encore créé de publication.</p>
              </div>
              <Button onClick={() => navigate('/publish')}>
                Créer ma première publication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {publications.map((publication) => (
              <Card key={publication.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{publication.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="capitalize">{publication.content_type}</span>
                        {publication.platform && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{publication.platform}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{format(new Date(publication.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                      {getStatusBadge(publication.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(publication.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {(publication.description || publication.rejection_reason) && (
                  <CardContent className="pt-0">
                    {publication.description && (
                      <p className="text-sm text-muted-foreground mb-3">{publication.description}</p>
                    )}
                    {publication.status === 'rejected' && publication.rejection_reason && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive font-medium mb-1">Raison du rejet :</p>
                        <p className="text-sm text-destructive/80">{publication.rejection_reason}</p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Publications;
