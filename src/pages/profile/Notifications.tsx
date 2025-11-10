import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Bell, 
  Target, 
  MessageCircle,
  Heart, 
  Reply, 
  AtSign,
  Info,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  useNotifications,
  categorizeNotification,
  type Notification as NotificationItem,
  type NotificationCategory,
  type NotificationMetadata
} from '@/hooks/useNotifications';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { navigateBack, navigateWithReturn } = useSmartNavigation();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const { toast } = useToast();

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationCategory, { total: number; unread: number }> = {
      all: { total: 0, unread: 0 },
      comments: { total: 0, unread: 0 },
      likes: { total: 0, unread: 0 },
      mentions: { total: 0, unread: 0 },
      others: { total: 0, unread: 0 }
    };

    notifications.forEach((notification) => {
      counts.all.total += 1;
      if (!notification.is_read) {
        counts.all.unread += 1;
      }

      const category = categorizeNotification(notification);
      counts[category].total += 1;
      if (!notification.is_read) {
        counts[category].unread += 1;
      }
    });

    return counts;
  }, [notifications]);

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') {
      return sortedNotifications;
    }
    return sortedNotifications.filter(
      (notification) => categorizeNotification(notification) === activeCategory
    );
  }, [sortedNotifications, activeCategory]);

  const tabConfig = useMemo(
    () => [
      { key: 'all' as NotificationCategory, label: 'Tout', icon: <Bell className="w-4 h-4" />, unread: categoryCounts.all.unread },
      { key: 'comments' as NotificationCategory, label: 'Commentaires', icon: <MessageCircle className="w-4 h-4" />, unread: categoryCounts.comments.unread },
      { key: 'likes' as NotificationCategory, label: 'Likes', icon: <Heart className="w-4 h-4" />, unread: categoryCounts.likes.unread },
      { key: 'mentions' as NotificationCategory, label: 'Mentions', icon: <AtSign className="w-4 h-4" />, unread: categoryCounts.mentions.unread },
      { key: 'others' as NotificationCategory, label: 'Autres', icon: <Info className="w-4 h-4" />, unread: categoryCounts.others.unread }
    ],
    [categoryCounts]
  );

  const emptyStateByCategory: Record<NotificationCategory, { title: string; description: string }> = {
    all: {
      title: 'Aucune notification',
      description: 'Vous serez notifié ici de toutes vos activités importantes.'
    },
    comments: {
      title: 'Aucun commentaire',
      description: 'Lorsque quelqu’un laissera un commentaire sur vos contenus, il apparaîtra ici.'
    },
    likes: {
      title: 'Aucun like',
      description: 'Vos notifications de likes apparaîtront ici dès que vos contenus seront appréciés.'
    },
    mentions: {
      title: 'Aucune mention',
      description: 'Les notifications de mentions (par ex. @votreNom) seront regroupées dans cette section.'
    },
    others: {
      title: 'Aucune autre notification',
      description: 'Retrouvez ici les mises à jour, rappels et autres informations importantes.'
    }
  };

  const emptyState = emptyStateByCategory[activeCategory];

  const handleOpenDetail = (notification: NotificationItem) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  const resolveTargetRoute = (notification: NotificationItem) => {
    const metadata = notification.metadata ?? ({} as NotificationMetadata);
    const relatedType = notification.related_type ?? metadata.target_type ?? metadata.type;
    const relatedId = notification.related_id ?? metadata.target_id ?? metadata.id;
    const directUrl = (metadata as Record<string, unknown>)?.target_url;

    if (typeof directUrl === 'string' && directUrl.length > 0) {
      return {
        path: directUrl,
        label: 'Ouvrir le lien'
      };
    }

    if (!relatedType || !relatedId) {
      return null;
    }

    switch (relatedType) {
      case 'community_content':
      case 'publication':
      case 'content':
        return { path: `/community/content/${relatedId}`, label: 'Voir la publication' };
      case 'community_account':
      case 'account':
        return { path: `/community/account/${relatedId}`, label: 'Voir le compte' };
      case 'creator':
        return { path: `/creator/${relatedId}`, label: 'Voir le créateur' };
      case 'challenge':
      case 'public_challenge':
        return { path: `/challenge/${relatedId}`, label: 'Voir le défi' };
      case 'profile_publication':
        return { path: `/profile/publications?focus=${relatedId}`, label: 'Voir la publication' };
      case 'profile_resource':
        return { path: `/profile/resources?focus=${relatedId}`, label: 'Voir la ressource' };
      default:
        return null;
    }
  };

  const navigationTarget = useMemo(
    () => (selectedNotification ? resolveTargetRoute(selectedNotification) : null),
    [selectedNotification]
  );

  const handleNavigateToTarget = () => {
    if (!navigationTarget) {
      toast({
        title: 'Navigation indisponible',
        description: 'Impossible de déterminer la page associée à cette notification.',
      });
      return;
    }

    navigateWithReturn(navigationTarget.path);
    setSelectedNotification(null);
  };

  const handleBackClick = () => {
    navigateBack();
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'comment':
      case 'publication_reply':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'comment_reaction':
      case 'like':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-600" />;
      case 'system_update':
      case 'other':
        return <Info className="w-5 h-5 text-emerald-600" />;
      case 'challenge_reminder':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'public_challenge':
        return <Reply className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };



  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackClick} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
              <CheckCircle className="w-4 h-4 mr-1" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="flex items-center justify-center h-40 mb-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des notifications...</p>
            </div>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>Erreur lors du chargement des notifications</p>
              </div>
            </CardContent>
          </Card>
        )}

                {/* Contenu principal (affiché seulement si pas de chargement) */}
        {!isLoading && (
          <>

        <Tabs
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as NotificationCategory)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2 text-sm">
                {tab.icon}
                {tab.label}
                {tab.unread > 0 && (
                  <Badge variant="secondary" className="ml-1">{tab.unread}</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <NotificationList 
          notifications={filteredNotifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          onOpenDetail={handleOpenDetail}
          getNotificationIcon={getNotificationIcon}
          getPriorityColor={getPriorityColor}
          getTimeAgo={getTimeAgo}
        />

        {/* Message si aucune notification */}
        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12 mt-6">
            <CardContent>
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">{emptyState.title}</h3>
              <p className="text-muted-foreground">{emptyState.description}</p>
            </CardContent>
          </Card>
        )}
          </>
        )}
      </main>
      <NotificationDetailSheet
        notification={selectedNotification}
        onClose={handleCloseDetail}
        getNotificationIcon={getNotificationIcon}
        getPriorityColor={getPriorityColor}
        getTimeAgo={getTimeAgo}
        navigationTarget={navigationTarget}
        onNavigate={handleNavigateToTarget}
      />
    </div>
  );
};

// Composant pour la liste des notifications
interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (notification: NotificationItem) => void;
  getNotificationIcon: (type: NotificationItem['type']) => React.ReactNode;
  getPriorityColor: (priority: NotificationItem['priority']) => string;
  getTimeAgo: (timestamp: Date) => string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onOpenDetail,
  getNotificationIcon,
  getPriorityColor,
  getTimeAgo
}) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          role="button"
          tabIndex={0}
          onClick={() => onOpenDetail(notification)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenDetail(notification);
            }
          }}
          className={`transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            !notification.is_read ? 'border border-primary/40 bg-primary/5' : 'border border-border/60 bg-card/60'
          }`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex items-center gap-3">
                {/* Icône / Avatar */}
                <div className="hidden sm:flex">
                  {getNotificationIcon(notification.type)}
                </div>
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-border/60 bg-background">
                  {notification.actor_avatar_url ? (
                    <AvatarImage src={notification.actor_avatar_url} alt={notification.actor_name ?? 'Utilisateur'} />
                  ) : (
                    <AvatarFallback className="bg-muted text-xs sm:text-sm">
                      {notification.actor_name
                        ? notification.actor_name.slice(0, 2).toUpperCase()
                        : (
                          <Bell className="h-4 w-4" />
                        )}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              {/* Contenu de la notification */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    {notification.actor_name && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground leading-tight">
                        {notification.actor_name}
                      </p>
                    )}
                    <h3 className={`font-semibold text-sm sm:text-base ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'} line-clamp-2`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-2 sm:line-clamp-3">
                      {notification.message}
                    </p>
                  </div>

                  <Badge 
                    variant="secondary" 
                    className={`self-start text-[10px] sm:text-xs ${getPriorityColor(notification.priority)}`}
                  >
                    {notification.priority === 'high' ? 'Haute' : 
                     notification.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    {getNotificationIcon(notification.type)}
                    {notification.type.replace('_', ' ')}
                  </span>
                  {typeof notification.metadata?.target_title === 'string' && notification.metadata.target_title.trim().length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                      <Info className="w-3 h-3" />
                      {notification.metadata.target_title}
                    </span>
                  )}
                </div>

                {typeof notification.metadata?.comment_content === 'string' && notification.metadata.comment_content.trim().length > 0 && (
                  <div className="rounded-md border border-border/40 bg-muted/60 px-3 py-2 text-xs sm:text-sm italic text-muted-foreground">
                    « {notification.metadata.comment_content} »
                  </div>
                )}

                {/* Métadonnées */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-[11px] sm:text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(notification.timestamp)}
                    </span>
                    {!notification.is_read && (
                      <span className="flex items-center gap-1 text-primary">
                        <AlertCircle className="w-3 h-3" />
                        Non lue
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        className="text-[11px] sm:text-xs h-8 px-2"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Marquer comme lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="text-[11px] sm:text-xs h-8 px-2 text-destructive hover:text-destructive"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface NotificationDetailSheetProps {
  notification: NotificationItem | null;
  onClose: () => void;
  onNavigate: () => void;
  navigationTarget: { path: string; label: string } | null;
  getNotificationIcon: (type: NotificationItem['type']) => React.ReactNode;
  getPriorityColor: (priority: NotificationItem['priority']) => string;
  getTimeAgo: (timestamp: Date) => string;
}

const NotificationDetailSheet: React.FC<NotificationDetailSheetProps> = ({
  notification,
  onClose,
  onNavigate,
  navigationTarget,
  getNotificationIcon,
  getPriorityColor,
  getTimeAgo
}) => {
  if (!notification) return null;

  const metadata = notification.metadata ?? {};
  const commentContent =
    typeof metadata.comment_content === 'string' && metadata.comment_content.trim().length > 0
      ? metadata.comment_content.trim()
      : undefined;
  const targetTitle =
    typeof metadata.target_title === 'string' && metadata.target_title.trim().length > 0
      ? metadata.target_title.trim()
      : undefined;
  const targetExcerpt =
    typeof metadata.target_excerpt === 'string' && metadata.target_excerpt.trim().length > 0
      ? metadata.target_excerpt.trim()
      : undefined;
  const highlights = Array.isArray(metadata.highlights) ? metadata.highlights.filter(Boolean) : [];

  return (
    <Sheet open={!!notification} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-auto sm:max-w-xl sm:rounded-t-3xl">
        <SheetHeader className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border border-border/60 bg-background">
              {notification.actor_avatar_url ? (
                <AvatarImage src={notification.actor_avatar_url} alt={notification.actor_name ?? 'Utilisateur'} />
              ) : (
                <AvatarFallback className="bg-muted">
                  {notification.actor_name ? notification.actor_name.slice(0, 2).toUpperCase() : <Bell className="h-5 w-5" />}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-base sm:text-lg">
                {notification.title}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {notification.actor_name && (
                  <span className="font-semibold">{notification.actor_name}</span>
                )}
                <span className="text-muted-foreground">
                  {' '}
                  • {notification.type.replace('_', ' ')} • {getTimeAgo(notification.timestamp)}
                </span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-5 overflow-y-auto pb-6">
          <div className="rounded-lg border border-border/60 bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getNotificationIcon(notification.type)}
              <span className="capitalize">{notification.type.replace('_', ' ')}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {notification.message}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(notification.priority)}>
                Priorité {notification.priority === 'high' ? 'haute' : notification.priority === 'medium' ? 'moyenne' : 'basse'}
              </Badge>
              {!notification.is_read && (
                <Badge variant="outline" className="border-primary/60 text-primary">
                  Non lue
                </Badge>
              )}
            </div>
          </div>

          {targetTitle && (
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contenu associé
              </h4>
              <p className="text-sm font-medium text-foreground">
                {targetTitle}
              </p>
              {targetExcerpt && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {targetExcerpt}
                </p>
              )}
            </div>
          )}

          {commentContent && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Commentaire
              </h4>
              <p className="text-sm italic leading-relaxed text-foreground">
                « {commentContent} »
              </p>
            </div>
          )}

          {highlights.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Informations supplémentaires
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                    <span>{String(highlight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Reçue</span>
              <span>{notification.timestamp.toLocaleString('fr-FR')}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Dernière mise à jour</span>
              <span>{notification.updated_at.toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={onNavigate}
            disabled={!navigationTarget}
          >
            {navigationTarget?.label ?? 'Ouvrir le détail'}
          </Button>
          <Button variant="ghost" size="lg" className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
