import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Plus, X } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useSubcategoryLevel2 } from '@/hooks/useSubcategoryLevel2';
import { useExemplesMedia, type ExempleMedia } from '@/hooks/useExemplesMedia';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileService, type UserSocialAccount, type UserSocialPost, type UserContentPlaylist } from '@/services/userProfileService';
import Navigation from '@/components/Navigation';
import { SelectNetworkPlaylistModal } from '@/components/modals/SelectNetworkPlaylistModal';

const Exemples = () => {
  const { subcategoryId, categoryId, subcategoryLevel2Id } = useParams();
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'all';
  const { toast } = useToast();
  const { user } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedExemple, setSelectedExemple] = useState<{ title: string; id: string } | null>(null);
  const [viewingExemple, setViewingExemple] = useState<ExempleMedia | null>(null);
  
  // Détecter si nous sommes dans un contexte de niveau 2
  const isLevel2 = !!subcategoryLevel2Id;
  
  // Utiliser les hooks appropriés selon le niveau
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const { data: subcategoryLevel2, isLoading: subcategoryLevel2Loading } = useSubcategoryLevel2(subcategoryLevel2Id);
  
  const detectedNetwork = selectedNetwork;
  
  // Récupérer les exemples avec médias (images et vidéos)
  const { 
    data: exemplesMedia, 
    isLoading: exemplesMediaLoading,
    error: exemplesMediaError
  } = useExemplesMedia(
    isLevel2 ? undefined : subcategoryId,
    isLevel2 ? subcategoryLevel2Id : undefined,
    detectedNetwork
  );

  // Utiliser les données appropriées selon le niveau
  const currentSubcategory = isLevel2 ? subcategoryLevel2 : subcategory;
  
  // Hooks pour les favoris
  const { favorites: exempleMediaFavorites, toggleFavorite: toggleExempleMediaFavorite, isFavorite: isExempleMediaFavorite } = useFavorites('exemple-media');

  // Charger les comptes sociaux et les playlists de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setSocialAccounts([]);
        setPlaylists([]);
        return;
      }
      
      try {
        const [accounts, userPlaylists] = await Promise.all([
          UserProfileService.getSocialAccounts(user.id),
          UserProfileService.getPlaylists(user.id)
        ]);
        setSocialAccounts(accounts);
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    
    loadUserData();
  }, [user]);

  const handleLikeExempleMedia = async (exempleMediaId: string) => {
    try {
      const wasFavorite = isExempleMediaFavorite(exempleMediaId);
      await toggleExempleMediaFavorite(exempleMediaId);
      toast({
        title: wasFavorite ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleAddExempleMediaToPublications = (exemple: ExempleMedia) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des publications",
        variant: "destructive",
      });
      return;
    }

    if (socialAccounts.length === 0) {
      toast({
        title: "Aucun réseau social",
        description: "Vous devez d'abord ajouter un réseau social dans votre profil",
        variant: "destructive",
      });
      return;
    }

    const titleWithMedia = `${exemple.title}${exemple.media_type === 'video' ? ' [Vidéo]' : ' [Image]'}`;
    setSelectedExemple({ title: titleWithMedia, id: exemple.id });
    setIsSelectModalOpen(true);
  };

  const handleConfirmAddToPublications = async (socialAccountId: string, playlistId?: string) => {
    if (!user || !selectedExemple) return;

    try {
      const publicationData: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        social_account_id: socialAccountId,
        title: selectedExemple.title,
        content: undefined,
        status: 'draft',
        scheduled_date: undefined,
        published_date: undefined,
        engagement_data: null
      };

      const newPost = await UserProfileService.addSocialPost(publicationData);
      
      if (playlistId) {
        await UserProfileService.addPostToPlaylist(playlistId, newPost.id);
      }

      toast({
        title: "Ajouté",
        description: "L'exemple a été ajouté à vos publications",
      });
      
      setSelectedExemple(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'exemple aux publications",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (isLevel2) {
      navigate(`/category/${categoryId}/subcategory/${subcategoryId}/subcategory-level2/${subcategoryLevel2Id}?network=${selectedNetwork}`);
    } else {
      navigate(`/category/${categoryId}/subcategory/${subcategoryId}?network=${selectedNetwork}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (subcategoryLoading || subcategoryLevel2Loading || exemplesMediaLoading) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack} 
              className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Chargement...
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header fixe */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack} 
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Exemples de contenu
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentSubcategory?.name || 'Sous-catégorie'}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-4">
        {exemplesMediaError && (
          <div className="mb-6 text-center text-sm text-destructive py-4">
            Erreur lors du chargement des exemples. Vérifiez que la table content_exemples_media existe.
            <br />
            <span className="text-xs text-muted-foreground">
              Erreur: {exemplesMediaError.message || 'Inconnue'}
            </span>
          </div>
        )}

        {!exemplesMediaLoading && !exemplesMediaError && exemplesMedia && exemplesMedia.images.length === 0 && exemplesMedia.videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun exemple disponible pour cette sous-catégorie
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Ajoutez des exemples dans la base de données pour les voir ici.
            </p>
          </div>
        )}

        {exemplesMedia && (exemplesMedia.images.length > 0 || exemplesMedia.videos.length > 0) && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Images */}
            {exemplesMedia.images.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Images ({exemplesMedia.images.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {exemplesMedia.images.map((exemple) => (
                    <motion.div
                      key={exemple.id}
                      variants={itemVariants}
                      className="relative group cursor-pointer"
                      onClick={() => setViewingExemple(exemple)}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                        <div className="aspect-square relative">
                          <img
                            src={exemple.media_data 
                              ? `data:${exemple.media_mime_type || 'image/jpeg'};base64,${exemple.media_data}` 
                              : exemple.media_url || 'https://via.placeholder.com/300x300?text=Image'}
                            alt={exemple.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2 mb-1">
                            {exemple.title}
                          </p>
                          {exemple.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                              {exemple.description}
                            </p>
                          )}
                          {exemple.creator_name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {exemple.creator_name}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeExempleMedia(exemple.id);
                            }}
                            className={`p-1.5 h-7 w-7 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 ${
                              isExempleMediaFavorite(exemple.id) 
                                ? 'text-red-500' 
                                : 'text-gray-400'
                            }`}
                            title="Ajouter aux favoris"
                          >
                            <Heart 
                              size={14} 
                              className={isExempleMediaFavorite(exemple.id) ? 'fill-current' : ''}
                            />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Vidéos */}
            {exemplesMedia.videos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Vidéos ({exemplesMedia.videos.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {exemplesMedia.videos.map((exemple) => (
                    <motion.div
                      key={exemple.id}
                      variants={itemVariants}
                      className="relative group cursor-pointer"
                      onClick={() => setViewingExemple(exemple)}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                        <div className="aspect-square relative">
                          {exemple.thumbnail_data || exemple.thumbnail_url ? (
                            <img
                              src={exemple.thumbnail_data 
                                ? `data:image/jpeg;base64,${exemple.thumbnail_data}` 
                                : exemple.thumbnail_url || 'https://via.placeholder.com/300x300?text=Video'}
                              alt={exemple.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Video';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-4xl">▶️</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center">
                                <span className="text-xl">▶</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2 mb-1">
                            {exemple.title}
                          </p>
                          {exemple.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                              {exemple.description}
                            </p>
                          )}
                          {exemple.creator_name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {exemple.creator_name}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeExempleMedia(exemple.id);
                            }}
                            className={`p-1.5 h-7 w-7 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 ${
                              isExempleMediaFavorite(exemple.id) 
                                ? 'text-red-500' 
                                : 'text-gray-400'
                            }`}
                            title="Ajouter aux favoris"
                          >
                            <Heart 
                              size={14} 
                              className={isExempleMediaFavorite(exemple.id) ? 'fill-current' : ''}
                            />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal de visualisation d'exemple */}
      {viewingExemple && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setViewingExemple(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {viewingExemple.title}
                </h3>
                {viewingExemple.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {viewingExemple.description}
                  </p>
                )}
                {viewingExemple.creator_name && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Par {viewingExemple.creator_name}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingExemple(null)}
                className="ml-4"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Contenu média */}
            <div className="relative bg-black flex items-center justify-center" style={{ minHeight: '60vh' }}>
              {viewingExemple.media_type === 'image' ? (
                <img
                  src={viewingExemple.media_data 
                    ? `data:${viewingExemple.media_mime_type || 'image/jpeg'};base64,${viewingExemple.media_data}` 
                    : viewingExemple.media_url || ''}
                  alt={viewingExemple.title}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
                  }}
                />
              ) : (
                <video
                  src={viewingExemple.media_data 
                    ? `data:${viewingExemple.media_mime_type || 'video/mp4'};base64,${viewingExemple.media_data}` 
                    : viewingExemple.media_url || ''}
                  controls
                  className="max-w-full max-h-[70vh]"
                  onError={(e) => {
                    console.error('Erreur de chargement de la vidéo');
                  }}
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeExempleMedia(viewingExemple.id);
                  }}
                  className={isExempleMediaFavorite(viewingExemple.id) ? 'text-red-500' : ''}
                >
                  <Heart 
                    size={16} 
                    className={isExempleMediaFavorite(viewingExemple.id) ? 'fill-current mr-2' : 'mr-2'}
                  />
                  {isExempleMediaFavorite(viewingExemple.id) ? 'Retirer' : 'Ajouter aux favoris'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de sélection réseau/playlist */}
      {selectedExemple && user && (
        <SelectNetworkPlaylistModal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedExemple(null);
          }}
          onConfirm={handleConfirmAddToPublications}
          userId={user.id}
          socialAccounts={socialAccounts}
          playlists={playlists}
          title={selectedExemple.title}
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default Exemples;

