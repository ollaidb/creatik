import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  color?: string;
}

export interface UpdateNoteData {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  color?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
}

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer toutes les notes de l'utilisateur
  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async (): Promise<Note[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Créer une nouvelle note
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: CreateNoteData): Promise<Note> => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          tags: noteData.tags,
          color: noteData.color || '#3B82F6',
          is_favorite: false,
          is_archived: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la note:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Mettre à jour une note
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: UpdateNoteData): Promise<Note> => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('user_notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          tags: noteData.tags,
          color: noteData.color,
          is_favorite: noteData.is_favorite,
          is_archived: noteData.is_archived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la note:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Supprimer une note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Basculer le statut favori
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ noteId, isFavorite }: { noteId: string; isFavorite: boolean }): Promise<Note> => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('user_notes')
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du favori:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Basculer le statut d'archivage
  const toggleArchiveMutation = useMutation({
    mutationFn: async ({ noteId, isArchived }: { noteId: string; isArchived: boolean }): Promise<Note> => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('user_notes')
        .update({
          is_archived: isArchived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'archivage:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Rechercher dans les notes
  const searchNotes = (query: string, filters: {
    category?: string;
    tags?: string[];
    showArchived?: boolean;
  } = {}) => {
    let filtered = notes;

    // Filtre par texte de recherche
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par catégorie
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(note => note.category === filters.category);
    }

    // Filtre par tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(note =>
        filters.tags!.some(tag => note.tags.includes(tag))
      );
    }

    // Filtre par statut d'archivage
    if (filters.showArchived !== undefined) {
      filtered = filtered.filter(note => note.is_archived === filters.showArchived);
    }

    return filtered;
  };

  // Trier les notes
  const sortNotes = (notes: Note[], sortBy: 'date' | 'title' | 'favorite') => {
    const sorted = [...notes];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'favorite':
        return sorted.sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0));
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  };

  // Obtenir les statistiques des notes
  const getNotesStats = () => {
    const total = notes.length;
    const favorites = notes.filter(note => note.is_favorite).length;
    const archived = notes.filter(note => note.is_archived).length;
    const categories = Array.from(new Set(notes.map(note => note.category)));
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    return {
      total,
      favorites,
      archived,
      active: total - archived,
      categories: categories.length,
      tags: allTags.length,
    };
  };

  return {
    // Données
    notes,
    isLoading,
    error,
    
    // Mutations
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    toggleArchive: toggleArchiveMutation.mutate,
    
    // États des mutations
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    isTogglingArchive: toggleArchiveMutation.isPending,
    
    // Fonctions utilitaires
    searchNotes,
    sortNotes,
    getNotesStats,
  };
};
