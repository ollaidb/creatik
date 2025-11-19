import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, User, Clock, MessageCircle, ThumbsUp, ChevronDown, ChevronUp, Reply, Send, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileService, type UserSocialAccount, type UserSocialPost, type UserContentPlaylist } from '@/services/userProfileService';
import { SelectNetworkPlaylistModal } from '@/components/modals/SelectNetworkPlaylistModal';
import Navigation from '@/components/Navigation';

interface Challenge {
  id: string;
  title: string;
  description: string;
  created_by: string;
  likes_count: number;
  created_at: string;
  challenge_type?: string;
  platform?: string;
  creator?: {
    id: string;
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    };
  };
}

interface Comment {
  id: string;
  challenge_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  created_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    };
  };
  replies?: Comment[];
}

const CommunityContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [isLiked, setIsLiked] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    commentId: string;
  } | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<{
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    email?: string;
  } | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<UserSocialAccount[]>([]);
  const [playlists, setPlaylists] = useState<UserContentPlaylist[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<{ title: string; challengeId: string } | null>(null);

  // Charger le challenge et ses commentaires
  useEffect(() => {
    if (id) {
      loadChallengeAndComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  // Changer le titre de la page
  useEffect(() => {
    document.title = 'Contenu';
  }, []);

  // Fermer le menu contextuel quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const loadChallengeAndComments = async () => {
    try {
      setLoading(true);
      setChallenge(null); // Réinitialiser le challenge
      
      // Charger le challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();

      if (challengeError) {
        // Si le défi n'existe pas (code PGRST116), définir challenge à null
        if (challengeError.code === 'PGRST116' || challengeError.message?.includes('No rows')) {
          setChallenge(null);
          setComments([]);
          return; // Sortir de la fonction, loading sera défini à false dans finally
        }
        throw challengeError;
      }

      if (!challengeData) {
        setChallenge(null);
        setComments([]);
        return;
      }

      setChallenge(challengeData);

      // Charger les informations du créateur depuis la table profiles
      if (challengeData.created_by) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, avatar_url')
            .eq('id', challengeData.created_by)
            .single();
          
          if (!profileError && profileData) {
            setCreatorInfo({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              avatar_url: profileData.avatar_url || undefined,
              email: profileData.email || undefined
            });
          } else {
            console.error('Erreur lors du chargement du profil:', profileError);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du créateur:', error);
        }
      }

      // Charger les commentaires seulement si le défi existe
      const { data: commentsData, error: commentsError } = await supabase
        .from('challenge_comments')
        .select('*')
        .eq('challenge_id', id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Erreur lors du chargement des commentaires:', commentsError);
        setComments([]); // Continuer même si les commentaires ne peuvent pas être chargés
      } else {
        // Charger les réponses pour chaque commentaire
        const commentsWithReplies = await Promise.all(
          (commentsData || []).map(async (comment) => {
            const { data: repliesData } = await supabase
              .from('challenge_comments')
              .select('*')
              .eq('parent_comment_id', comment.id)
              .order('created_at', { ascending: true });

            return {
              ...comment,
              replies: repliesData || []
            };
          })
        );

        setComments(commentsWithReplies);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setChallenge(null);
      setComments([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger le contenu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCreatorName = (userId: string) => {
    // Si c'est le créateur du challenge et qu'on a les infos
    if (challenge && challenge.created_by === userId && creatorInfo) {
      const firstName = creatorInfo.first_name;
      const lastName = creatorInfo.last_name;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      return creatorInfo.email?.split('@')[0] || 'Utilisateur';
    }
    
    // Si c'est l'utilisateur connecté
    if (user && user.id === userId) {
      const firstName = user.user_metadata?.first_name;
      const lastName = user.user_metadata?.last_name;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      return user.email?.split('@')[0] || 'Utilisateur';
    }
    
    return 'Utilisateur';
  };

  const getCreatorAvatar = (userId: string) => {
    // Si c'est le créateur du challenge et qu'on a les infos
    if (challenge && challenge.created_by === userId && creatorInfo) {
      return creatorInfo.avatar_url;
    }
    
    // Si c'est l'utilisateur connecté
    if (user && user.id === userId) {
      return user.user_metadata?.avatar_url;
    }
    
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleCommentExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const addComment = async () => {
    if (!user || !challenge || !commentContent.trim()) return;

    try {
      const { error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challenge.id,
          user_id: user.id,
          content: commentContent.trim()
        });

      if (error) throw error;

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès"
      });

      setCommentContent('');
      loadChallengeAndComments();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    }
  };

  const addReply = async (parentCommentId: string) => {
    if (!user || !replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challenge!.id,
          user_id: user.id,
          content: replyContent.trim(),
          parent_comment_id: parentCommentId
        });

      if (error) throw error;

      toast({
        title: "Réponse ajoutée",
        description: "Votre réponse a été publiée avec succès"
      });

      setReplyContent('');
      setReplyingTo(null);
      loadChallengeAndComments();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réponse",
        variant: "destructive"
      });
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { data: existingLike } = await supabase
        .from('challenge_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('challenge_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('challenge_comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });
      }

      loadChallengeAndComments();
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { data: comment } = await supabase
        .from('challenge_comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

      if (!comment || comment.user_id !== user.id) {
        toast({
          title: "Erreur",
          description: "Vous ne pouvez supprimer que vos propres commentaires",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('challenge_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Commentaire supprimé",
        description: "Votre commentaire a été supprimé avec succès"
      });

      setContextMenu(null);
      loadChallengeAndComments();
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire",
        variant: "destructive"
      });
    }
  };

  const handleCommentLongPress = (event: React.MouseEvent, commentId: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      commentId
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleReplyFromContextMenu = (commentId: string) => {
    setReplyingTo(commentId);
    setContextMenu(null);
  };

  // Fonction pour ouvrir la modale de sélection réseau/playlist
  const handleAddToPublications = () => {
    if (!challenge) return;
    
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

    // Ouvrir la modale de sélection
    setSelectedTitle({ title: challenge.title, challengeId: challenge.id });
    setIsSelectModalOpen(true);
  };

  // Fonction pour confirmer l'ajout avec réseau et playlist sélectionnés
  const handleConfirmAddToPublications = async (socialAccountId: string, playlistId?: string) => {
    if (!user || !selectedTitle) return;

    try {
      const publicationData: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        social_account_id: socialAccountId,
        title: selectedTitle.title,
        content: undefined,
        status: 'draft',
        scheduled_date: undefined,
        published_date: undefined,
        engagement_data: null
      };

      const newPost = await UserProfileService.addSocialPost(publicationData);
      
      // Ajouter à la playlist si sélectionnée
      if (playlistId) {
        await UserProfileService.addPostToPlaylist(playlistId, newPost.id);
      }

      toast({
        title: "Ajouté",
        description: "Le contenu a été ajouté à vos publications",
      });
      
      setSelectedTitle(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contenu aux publications",
        variant: "destructive",
      });
    }
  };

  const renderComment = (comment: Comment, isReply: boolean = false, level: number = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-6 border-l border-gray-200 dark:border-gray-700 pl-3' : 'mb-4'}`}
    >
      <div 
        className="flex gap-3"
        onContextMenu={(e) => {
          e.preventDefault();
          handleCommentLongPress(e, comment.id);
        }}
      >
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={getCreatorAvatar(comment.user_id)} />
          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
            {getCreatorName(comment.user_id).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {getCreatorName(comment.user_id)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
          </div>
          
          <div className="flex items-start justify-between gap-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
              {comment.content}
            </p>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                likeComment(comment.id);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 p-1 h-auto flex-shrink-0"
            >
              <ThumbsUp className="w-3 h-3" />
              <span className="ml-1">{comment.likes_count || 0}</span>
            </Button>
          </div>
        
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCommentExpanded(comment.id);
                }}
                className="text-xs text-muted-foreground p-1 h-auto"
              >
                {expandedComments.has(comment.id) ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Masquer {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Voir {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
          
          {replyingTo === comment.id && level < 5 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Écrire une réponse..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={() => addReply(comment.id)}
                  disabled={!replyContent.trim()}
                  size="sm"
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => renderComment(reply, true, level + 1))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateBack()} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Chargement...</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateBack()} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Contenu non trouvé</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">Contenu introuvable</h3>
              <p className="text-muted-foreground mb-4">
                Le contenu que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => navigateBack()}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigateBack()} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Contenu</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Contenu principal */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{challenge.title}</CardTitle>
                <p className="text-muted-foreground text-lg leading-relaxed">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToPublications();
                    }}
                    className="text-primary hover:text-primary/80"
                    title="Ajouter aux publications"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Créateur et date */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Avatar className="w-10 h-10">
                <AvatarImage src={getCreatorAvatar(challenge.created_by) || challenge.creator?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                  {getCreatorName(challenge.created_by).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {getCreatorName(challenge.created_by)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(challenge.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section commentaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Commentaires ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Formulaire d'ajout de commentaire */}
            {user && (
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ajouter un commentaire"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={1}
                    className="flex-1"
                  />
                  <Button
                    onClick={addComment}
                    disabled={!commentContent.trim()}
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Liste des commentaires */}
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun commentaire pour le moment</p>
                <p className="text-sm">Soyez le premier à commenter !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => renderComment(comment, false, 0))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Menu contextuel */}
      {contextMenu && (
        <div 
          className="fixed inset-0 z-50"
          onClick={closeContextMenu}
        >
          <div 
            className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[200px]"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 220),
              top: Math.min(contextMenu.y, window.innerHeight - 120)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleReplyFromContextMenu(contextMenu.commentId)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <Reply className="w-4 h-4" />
              Répondre
            </button>
            
            {user && contextMenu.commentId && (
              <button
                onClick={() => deleteComment(contextMenu.commentId)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modale de sélection réseau/playlist */}
      {selectedTitle && user && (
        <SelectNetworkPlaylistModal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedTitle(null);
          }}
          onConfirm={handleConfirmAddToPublications}
          userId={user.id}
          socialAccounts={socialAccounts}
          playlists={playlists}
          title={selectedTitle.title}
        />
      )}

      <Navigation />
    </div>
  );
};

export default CommunityContentDetail;

