import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Bell, 
  Target, 
  MessageCircle, 
  Heart, 
  Reply, 
  Calendar,
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
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Utiliser le hook personnalisé pour les notifications
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadCountByType
  } = useNotifications();



  // Filtrer les notifications
  useEffect(() => {
    let filtered = notifications;

    // Filtre par type d'onglet
    if (activeTab !== 'all') {
      filtered = filtered.filter(notification => notification.type === activeTab);
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab]);

  const handleBackClick = () => {
    navigate('/profile');
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

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Toutes
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="challenge_reminder" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Défis
              {getUnreadCountByType('challenge_reminder') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getUnreadCountByType('challenge_reminder')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comment_reaction" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Réactions
              {getUnreadCountByType('comment_reaction') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getUnreadCountByType('comment_reaction')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="publication_reply" className="flex items-center gap-2">
              <Reply className="w-4 h-4" />
              Réponses
              {getUnreadCountByType('publication_reply') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getUnreadCountByType('publication_reply')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="public_challenge" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Défis Publics
              {getUnreadCountByType('public_challenge') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getUnreadCountByType('public_challenge')}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <TabsContent value="all" className="mt-6">
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              getNotificationIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              getTimeAgo={getTimeAgo}
            />
          </TabsContent>

          <TabsContent value="challenge_reminder" className="mt-6">
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              getNotificationIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              getTimeAgo={getTimeAgo}
            />
          </TabsContent>

          <TabsContent value="comment_reaction" className="mt-6">
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              getNotificationIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              getTimeAgo={getTimeAgo}
            />
          </TabsContent>

          <TabsContent value="publication_reply" className="mt-6">
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              getNotificationIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              getTimeAgo={getTimeAgo}
            />
          </TabsContent>

          <TabsContent value="public_challenge" className="mt-6">
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              getNotificationIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              getTimeAgo={getTimeAgo}
            />
          </TabsContent>
        </Tabs>

        {/* Message si aucune notification */}
        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12 mt-6">
            <CardContent>
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">
                {activeTab !== 'all' ? 'Aucune notification trouvée' : 'Aucune notification'}
              </h3>
              <p className="text-muted-foreground">
                {activeTab !== 'all'
                  ? 'Essayez de changer d\'onglet'
                  : 'Vous serez notifié ici de toutes vos activités importantes'
                }
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
