import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, X, Clock, User, FileText, Folder, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface PendingPublication {
  id: string;
  user_id: string;
  content_type: string;
  title: string;
  category_name: string;
  subcategory_name: string;
  status: string;
  created_at: string;
  user_email: string;
}
const ApprovePublications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingPublications, setPendingPublications] = useState<PendingPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const fetchPendingPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('user_publications')
        .select(`
          id,
          user_id,
          content_type,
          title,
          category_id,
          subcategory_id,
          status,
          created_at
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Erreur lors de la récupération des publications:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la récupération des publications",
          variant: "destructive"
        });
      } else {
        // Transformer les données pour correspondre à l'interface
        const transformedData: PendingPublication[] = (data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          content_type: item.content_type,
          title: item.title,
          category_name: '', // Sera rempli plus tard
          subcategory_name: '', // Sera rempli plus tard
          status: item.status,
          created_at: item.created_at,
          user_email: 'Utilisateur' // Placeholder
        }));
        setPendingPublications(transformedData);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingPublications();
  }, []);
  const handleApprove = async (publicationId: string) => {
    setApproving(publicationId);
    try {
      // Mettre à jour le statut à 'approved'
      const { error } = await supabase
        .from('user_publications')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', publicationId);
      if (error) {
        console.error('Erreur lors de l\'approbation:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'approbation",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Publication approuvée",
          description: "La publication a été approuvée et le contenu a été ajouté",
        });
        // Rafraîchir la liste
        fetchPendingPublications();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'approbation",
        variant: "destructive"
      });
    } finally {
      setApproving(null);
    }
  };
  const handleReject = async (publicationId: string) => {
    setRejecting(publicationId);
    try {
      // Mettre à jour le statut à 'rejected'
      const { error } = await supabase
        .from('user_publications')
        .update({ 
          status: 'rejected', 
          rejection_reason: 'Rejeté par l\'administrateur',
          updated_at: new Date().toISOString()
        })
        .eq('id', publicationId);
      if (error) {
        console.error('Erreur lors du rejet:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du rejet",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Publication rejetée",
          description: "La publication a été rejetée",
        });
        // Rafraîchir la liste
        fetchPendingPublications();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du rejet",
        variant: "destructive"
      });
    } finally {
      setRejecting(null);
    }
  };
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'category':
        return <Folder className="h-5 w-5" />;
      case 'subcategory':
        return <Tag className="h-5 w-5" />;
      case 'title':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case 'category':
        return 'Catégorie';
      case 'subcategory':
        return 'Sous-catégorie';
      case 'title':
        return 'Titre';
      default:
        return 'Contenu';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Approuver les Publications</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </main>
        <Navigation />
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/admin')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Approuver les Publications</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Publications en attente</h2>
          <p className="text-muted-foreground">
            Approuvez ou rejetez les publications soumises par les utilisateurs
          </p>
        </div>
        {pendingPublications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune publication en attente</h3>
              <p className="text-muted-foreground">
                Toutes les publications ont été traitées
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingPublications.map((publication) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getContentTypeIcon(publication.content_type)}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {getContentTypeLabel(publication.content_type)}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                              En attente
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {publication.title}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {publication.category_name && (
                            <div>Catégorie: {publication.category_name}</div>
                          )}
                          {publication.subcategory_name && (
                            <div>Sous-catégorie: {publication.subcategory_name}</div>
                          )}
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {publication.user_email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(publication.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(publication.id)}
                          disabled={rejecting === publication.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {rejecting === publication.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(publication.id)}
                          disabled={approving === publication.id}
                        >
                          {approving === publication.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
};
export default ApprovePublications; 