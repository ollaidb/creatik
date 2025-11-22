import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationTest: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    createNotification,
    markAsRead,
    deleteNotification
  } = useNotifications();

  const handleCreateTestNotification = () => {
    createNotification({
      user_id: 'test-user-id', // Sera remplacé par l'ID réel de l'utilisateur
      type: 'challenge_reminder',
      title: 'Test - Rappel Défi',
      message: 'Ceci est une notification de test pour vérifier le système',
      priority: 'high',
      related_id: 'test_challenge_1',
      related_type: 'challenge'
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test des Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>Notifications totales: {notifications.length}</p>
          <p>Non lues: {unreadCount}</p>
        </div>
        
        <Button onClick={handleCreateTestNotification}>
          Créer une notification de test
        </Button>

        <div className="space-y-2">
          <h4>Notifications existantes:</h4>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">Aucune notification</p>
          ) : (
            notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="p-2 border rounded">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs">Type: {notification.type} | Priorité: {notification.priority}</p>
                <p className="text-xs">Lu: {notification.is_read ? 'Oui' : 'Non'}</p>
                <div className="flex gap-2 mt-2">
                  {!notification.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Marquer comme lu
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTest;
