import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Bell, 
  Target, 
  Heart, 
  Reply, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface Notification {
  id: string;
  type: 'challenge_reminder' | 'comment_reaction' | 'publication_reply' | 'public_challenge';
  title: string;
  message: string;
  timestamp: Date;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  related_id?: string;
  related_type?: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  // Utiliser le hook personnalisé pour les notifications
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [notifications]
  );

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'challenge_reminder':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'comment_reaction':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'publication_reply':
        return <Reply className="w-5 h-5 text-green-600" />;
      case 'public_challenge':
        return <Bell className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
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

        <NotificationList 
          notifications={sortedNotifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          getNotificationIcon={getNotificationIcon}
          getPriorityColor={getPriorityColor}
          getTimeAgo={getTimeAgo}
        />

        {/* Message si aucune notification */}
        {sortedNotifications.length === 0 && (
          <Card className="text-center py-12 mt-6">
            <CardContent>
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Aucune notification</h3>
              <p className="text-muted-foreground">
                Vous serez notifié ici de toutes vos activités importantes.
              </p>
            </CardContent>
          </Card>
        )}
          </>
        )}
      </main>
    </div>
  );
};

// Composant pour la liste des notifications
interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
  getPriorityColor: (priority: string) => string;
  getTimeAgo: (timestamp: Date) => string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityColor,
  getTimeAgo
}) => {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`transition-all duration-200 hover:shadow-md ${
            !notification.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icône de notification */}
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Contenu de la notification */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  
                  {/* Badge de priorité */}
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 text-xs ${getPriorityColor(notification.priority)}`}
                  >
                    {notification.priority === 'high' ? 'Haute' : 
                     notification.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </Badge>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-xs h-7 px-2"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Marquer comme lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(notification.id)}
                      className="text-xs h-7 px-2 text-destructive hover:text-destructive"
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

export default Notifications;
