import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  user_id: string;
  type: 'challenge_reminder' | 'comment_reaction' | 'publication_reply' | 'public_challenge';
  title: string;
  message: string;
  timestamp: Date;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  related_id?: string;
  related_type?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateNotificationData {
  user_id: string;
  type: Notification['type'];
  title: string;
  message: string;
  priority: Notification['priority'];
  related_id?: string;
  related_type?: string;
}

export interface UpdateNotificationData {
  is_read?: boolean;
  priority?: Notification['priority'];
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer toutes les notifications de l'utilisateur
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map(notification => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
        created_at: new Date(notification.created_at),
        updated_at: new Date(notification.updated_at)
      })) || [];
    },
    enabled: !!user
  });

  // Récupérer le nombre de notifications non lues
  const {
    data: unreadCount = 0
  } = useQuery({
    queryKey: ['notifications', 'unread', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      return count || 0;
    },
    enabled: !!user
  });

  // Marquer une notification comme lue
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', user?.id] });
    }
  });

  // Marquer toutes les notifications comme lues
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_notifications')
        .update({ 
          is_read: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', user?.id] });
    }
  });

  // Supprimer une notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', user?.id] });
    }
  });

  // Créer une nouvelle notification
  const createNotificationMutation = useMutation({
    mutationFn: async (notificationData: CreateNotificationData) => {
      const { data, error } = await supabase
        .from('user_notifications')
        .insert([{
          ...notificationData,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', user?.id] });
    }
  });

  // Filtrer les notifications par type
  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Filtrer les notifications par priorité
  const getNotificationsByPriority = (priority: Notification['priority']) => {
    return notifications.filter(notification => notification.priority === priority);
  };

  // Obtenir les notifications non lues
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.is_read);
  };

  // Obtenir les notifications non lues par type
  const getUnreadCountByType = (type?: Notification['type']) => {
    if (type) {
      return notifications.filter(n => n.type === type && !n.is_read).length;
    }
    return notifications.filter(n => !n.is_read).length;
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    createNotification: createNotificationMutation.mutate,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    getUnreadCountByType,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
    isCreating: createNotificationMutation.isPending
  };
};
