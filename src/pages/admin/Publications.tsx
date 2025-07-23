
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, CheckCircle, XCircle, Check, X, Tag, Folder, FolderOpen, Hash, Zap } from 'lucide-react';
import { useAdminPublications } from '@/hooks/useAdminPublications';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminPublications = () => {
  const navigate = useNavigate();
  const { publications, loading, updatePublicationStatus } = useAdminPublications();
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);

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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <Folder className="w-4 h-4 text-blue-500" />;
      case 'subcategory':
        return <FolderOpen className="w-4 h-4 text-green-500" />;
      case 'content_title':
        return <Hash className="w-4 h-4 text-purple-500" />;
      case 'inspiring_content':
        return <Zap className="w-4 h-4 text-orange-500" />;
      default:
        return <Tag className="w-4 h-4 text-gray-500" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'category':
        return 'Catégorie';
      case 'subcategory':
        return 'Sous-catégorie';
      case 'content_title':
        return 'Titre de contenu';
      case 'inspiring_content':
        return 'Contenu inspirant';
      default:
        return type;
    }
  };

  const getContentTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'category':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'subcategory':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'content_title':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspiring_content':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApprove = async (id: string) => {
    await updatePublicationStatus(id, 'approved');
  };

  const handleReject = async (id: string, reason: string) => {
    await updatePublicationStatus(id, 'rejected', reason);
    setRejectionReason('');
    setSelectedPublicationId(null);
  };

  const pendingPublications = publications.filter(pub => pub.status === 'pending' || !pub.status);
  const reviewedPublications = publications.filter(pub => pub.status === 'approved' || pub.status === 'rejected');

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
          <h1 className="text-xl font-semibold">Administration - Publications</h1>
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
      <header className="bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Administration - Publications</h1>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Publications en attente */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Publications en attente ({pendingPublications.length})
          </h2>
          
          {pendingPublications.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">Aucune publication en attente</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingPublications.map((publication) => (
                <Card key={publication.id} className="border-orange-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getContentTypeIcon(publication.content_type)}
                          <Badge className={`${getContentTypeBadgeColor(publication.content_type)} font-medium`}>
                            {getContentTypeLabel(publication.content_type)}
                          </Badge>
                          {getStatusBadge(publication.status)}
                        </div>
                        
                        <CardTitle className="text-lg mb-2">{publication.title}</CardTitle>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Soumis par:</span>
                            <div>{publication.user_name} ({publication.user_email})</div>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <div>{format(new Date(publication.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</div>
                          </div>
                          {publication.platform && (
                            <div>
                              <span className="font-medium">Plateforme:</span>
                              <div className="capitalize">{publication.platform}</div>
                            </div>
                          )}
                          {publication.content_format && (
                            <div>
                              <span className="font-medium">Format:</span>
                              <div className="capitalize">{publication.content_format}</div>
                            </div>
                          )}
                        </div>

                        {publication.description && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <span className="font-medium text-sm text-muted-foreground">Description:</span>
                            <p className="text-sm mt-1">{publication.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleApprove(publication.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          size="sm"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedPublicationId(publication.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rejeter la publication</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="rejection-reason">Raison du rejet</Label>
                                <Textarea
                                  id="rejection-reason"
                                  placeholder="Expliquez pourquoi cette publication est rejetée..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => {
                                  setRejectionReason('');
                                  setSelectedPublicationId(null);
                                }}>
                                  Annuler
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => selectedPublicationId && handleReject(selectedPublicationId, rejectionReason)}
                                  disabled={!rejectionReason.trim()}
                                >
                                  Confirmer le rejet
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Publications traitées */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Publications traitées ({reviewedPublications.length})
          </h2>
          
          {reviewedPublications.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">Aucune publication traitée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviewedPublications.map((publication) => (
                <Card key={publication.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getContentTypeIcon(publication.content_type)}
                          <Badge className={`${getContentTypeBadgeColor(publication.content_type)} font-medium`}>
                            {getContentTypeLabel(publication.content_type)}
                          </Badge>
                          {getStatusBadge(publication.status)}
                        </div>
                        
                        <CardTitle className="text-lg mb-2">{publication.title}</CardTitle>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Soumis par:</span>
                            <div>{publication.user_name}</div>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <div>{format(new Date(publication.created_at), 'dd MMM yyyy', { locale: fr })}</div>
                          </div>
                          {publication.platform && (
                            <div>
                              <span className="font-medium">Plateforme:</span>
                              <div className="capitalize">{publication.platform}</div>
                            </div>
                          )}
                          {publication.content_format && (
                            <div>
                              <span className="font-medium">Format:</span>
                              <div className="capitalize">{publication.content_format}</div>
                            </div>
                          )}
                        </div>

                        {publication.description && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <span className="font-medium text-sm text-muted-foreground">Description:</span>
                            <p className="text-sm mt-1">{publication.description}</p>
                          </div>
                        )}

                        {publication.status === 'rejected' && publication.rejection_reason && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm text-destructive font-medium mb-1">Raison du rejet :</p>
                            <p className="text-sm text-destructive/80">{publication.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPublications;
