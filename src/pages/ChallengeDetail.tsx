import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, Target, User, Clock, Star, MessageCircle, ThumbsUp, ChevronDown, ChevronUp, Plus, Reply, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  duration_days: number;
  is_daily: boolean;
  is_active: boolean;
  created_by: string;
  likes_count: number;
  challenge_type?: string;
  platform?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
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

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Charger le challenge et ses commentaires
  useEffect(() => {
    if (id) {
      loadChallengeAndComments();
    }
  }, [id]);

  const loadChallengeAndComments = async () => {
    try {
      setLoading(true);
      
      // Charger le challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Charger les commentaires
      const { data: commentsData, error: commentsError } = await supabase
        .from('challenge_comments')
        .select(`
          *,
          user:auth.users(
            id,
            email,
            user_metadata
          )
        `)
        .eq('challenge_id', id)
        .is('parent_comment_id', null) // Seulement les commentaires parents
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Charger les réponses pour chaque commentaire
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
                     const { data: repliesData } = await supabase
             .from('challenge_comments')
             .select(`
               *,
               user:auth.users(
                 id,
                 email,
                 user_metadata
               )
             `)
             .eq('parent_comment_id', comment.id)
             .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: repliesData || []
          };
        })
      );

      setComments(commentsWithReplies);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le challenge",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return 'Moyen';
    }
  };

  const getCreatorName = (creator: any) => {
    if (!creator) return 'Utilisateur';
    const firstName = creator.user_metadata?.first_name;
    const lastName = creator.user_metadata?.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'Utilisateur';
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
      loadChallengeAndComments(); // Recharger les commentaires
      
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
      loadChallengeAndComments(); // Recharger les commentaires
      
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
      // Vérifier si l'utilisateur a déjà liké
      const { data: existingLike } = await supabase
        .from('challenge_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Supprimer le like
        await supabase
          .from('challenge_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        // Ajouter le like
        await supabase
          .from('challenge_comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });
      }

      // Recharger les commentaires pour mettre à jour les compteurs
      loadChallengeAndComments();
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}
    >
      <Card className="mb-3">
        <CardContent className="p-4">
          {/* En-tête du commentaire */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                  {getCreatorName(comment.user).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">
                  {getCreatorName(comment.user)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu du commentaire */}
          <div className="mb-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeComment(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{comment.likes_count || 0}</span>
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600"
                >
                  <Reply className="w-3 h-3" />
                  Répondre
                </Button>
              )}
            </div>

            {/* Afficher les réponses si il y en a */}
            {!isReply && comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCommentExpanded(comment.id)}
                className="text-xs text-muted-foreground"
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
            )}
          </div>

          {/* Formulaire de réponse */}
          {!isReply && replyingTo === comment.id && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Écrire une réponse..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={() => addReply(comment.id)}
                  disabled={!replyContent.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Réponses */}
          {!isReply && comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/public-challenges')} 
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
            onClick={() => navigate('/public-challenges')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Challenge non trouvé</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Challenge introuvable</h3>
              <p className="text-muted-foreground mb-4">
                Le challenge que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => navigate('/public-challenges')}>
                Retour aux challenges
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
          onClick={() => navigate('/public-challenges')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Détails du Challenge</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Challenge principal */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {challenge.challenge_type === 'account' ? 'Compte' : 'Contenu'}
                  </Badge>
                  {challenge.platform && (
                    <Badge variant="outline" className="text-xs">
                      {challenge.platform}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{challenge.title}</CardTitle>
                <p className="text-muted-foreground">{challenge.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Informations du challenge */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{challenge.duration_days} jour{challenge.duration_days > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>{challenge.points} points</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>{getDifficultyText(challenge.difficulty)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>{challenge.likes_count || 0} likes</span>
              </div>
            </div>

            {/* Tags */}
            {challenge.tags && challenge.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {challenge.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Créateur */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Avatar className="w-10 h-10">
                <AvatarImage src={challenge.creator?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">
                  {getCreatorName(challenge.creator)}
                </div>
                <div className="text-xs text-muted-foreground">
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
                <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                  Ajouter un commentaire
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    id="comment"
                    placeholder="Partagez vos pensées sur ce challenge..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={3}
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
                {comments.map(renderComment)}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};

export default ChallengeDetail;
