import { supabase } from '../integrations/supabase/client';

export interface UserNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  color?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  is_pinned?: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  color?: string;
}

export class UserNotesService {
  // Récupérer toutes les notes d'un utilisateur
  static async getNotes(userId: string): Promise<UserNote[]> {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('is_pinned', { ascending: false })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Erreur lors de la récupération des notes:', error);
      throw error;
    }

    return data || [];
  }

  // Créer une nouvelle note
  static async createNote(userId: string, noteData: CreateNoteData): Promise<UserNote> {
    // Calculer le prochain order_index
    const { count } = await supabase
      .from('user_notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false)
      .eq('is_pinned', false);

    const orderIndex = (count || 0) + 1;

    const { data, error } = await supabase
      .from('user_notes')
      .insert({
        user_id: userId,
        title: noteData.title,
        content: noteData.content || '',
        category: noteData.category || 'Général',
        tags: noteData.tags || [],
        color: noteData.color || '#3B82F6',
        is_pinned: false,
        order_index: orderIndex,
        is_favorite: false,
        is_archived: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mettre à jour une note
  static async updateNote(noteId: string, updates: Partial<UserNote>): Promise<UserNote> {
    const { data, error } = await supabase
      .from('user_notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Supprimer une note
  static async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  }

  // Mettre à jour l'ordre des notes
  static async reorderNotes(userId: string, notes: { id: string; order_index: number; is_pinned: boolean }[]): Promise<void> {
    // Mettre à jour toutes les notes en une seule transaction
    const updates = notes.map(note => 
      supabase
        .from('user_notes')
        .update({ order_index: note.order_index, is_pinned: note.is_pinned })
        .eq('id', note.id)
        .eq('user_id', userId)
    );

    const results = await Promise.all(updates);
    
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('❌ Erreur lors de la réorganisation des notes:', errors);
      throw errors[0].error;
    }
  }

  // Épingler/désépingler une note
  static async togglePin(noteId: string, isPinned: boolean): Promise<UserNote> {
    return this.updateNote(noteId, { is_pinned: isPinned });
  }
}

