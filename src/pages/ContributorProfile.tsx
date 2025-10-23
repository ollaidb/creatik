import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  MoreHorizontal,
  Settings,
  LogOut,
  Share2,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePublications } from '@/hooks/usePublications';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navigation from '@/components/Navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PUBLICATION_TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'category', label: 'Catégories' },
  { key: 'subcategory', label: 'Sous-catégories' },
  { key: 'title', label: 'Titres' },
  { key: 'account', label: 'Comptes' },
  { key: 'source', label: 'Sources' },
  { key: 'challenge', label: 'Challenges' },
];

const ContributorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { publications, loading: publicationsLoading, deletePublication } = usePublications();
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<'creator' | 'contributor'>('contributor');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
    type: 'category' | 'subcategory' | 'title' | 'account' | 'source' | 'challenge';
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Détecter le type de profil sauvegardé au chargement
  useEffect(() => {
    const savedProfileType = localStorage.getItem('userProfileType') as 'creator' | 'contributor' | null;
    if (savedProfileType) {
      setProfileType(savedProfileType);
      if (savedProfileType === 'creator') {
        navigate('/profile');
      }
    }
  }, [navigate]);

  // Rediriger vers la page appropriée selon le type de profil
  const handleProfileTypeChange = (newType: 'creator' | 'contributor') => {
    setProfileType(newType);
    if (newType === 'creator') {
      navigate('/profile');
    } else {
      navigate('/contributor-profile');
    }
  };

  // Fonction de déconnexion
  const handleLogoutClick = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: "Impossible de se déconnecter. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        // Marquer la déconnexion pour afficher le message
        localStorage.setItem('just_logged_out', 'true');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  // Données du profil utilisateur
  const userProfile = {
    name: user?.user_metadata?.full_name || "Contributeur",
    profilePicture: user?.user_metadata?.avatar_url || null
  };

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header du profil */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback className="text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
              
            </div>
            <div className="flex gap-2 relative" ref={menuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="flex items-center gap-2 z-10 relative"
                title="Menu"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              
              {/* Menu déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        // Ajouter la logique de partage si nécessaire
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager le profil</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate('/compte');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres et confidentialité</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
              onClick={() => navigate('/public-challenges')}
            >
              <Target className="w-5 h-5 text-orange-500" />
              <span className="text-xs">Communauté</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Section des publications */}
      <div className="bg-card border-t">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">Mes Publications</h2>
          
          {/* Menu avec onglets */}
          <div className="mb-6">
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

          {/* Contenu des publications */}
          {publicationsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPublications.length === 0 ? (
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
          )}
        </div>
      </div>

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

export default ContributorProfile;






