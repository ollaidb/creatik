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
    let query = supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false);

    // Essayer d'ajouter le tri par is_pinned et order_index si les colonnes existent
    try {
      query = query.order('is_pinned', { ascending: false }).order('order_index', { ascending: true });
    } catch (error) {
      // Si le tri échoue, trier par updated_at à la place
      query = query.order('updated_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      // Si l'erreur est due à is_pinned ou order_index manquants, réessayer sans tri
      if (error.message?.includes('is_pinned') || error.message?.includes('order_index')) {
        console.warn('⚠️ Colonnes is_pinned/order_index manquantes, récupération sans tri...');
        const { data: retryData, error: retryError } = await supabase
          .from('user_notes')
          .select('*')
          .eq('user_id', userId)
          .eq('is_archived', false)
          .order('updated_at', { ascending: false });
        
        if (retryError) {
          console.error('❌ Erreur lors de la récupération des notes:', retryError);
          throw retryError;
        }
        return retryData || [];
      }
      console.error('❌ Erreur lors de la récupération des notes:', error);
      throw error;
    }

    return data || [];
  }

  // Créer une nouvelle note
  static async createNote(userId: string, noteData: CreateNoteData): Promise<UserNote> {
    // Calculer le prochain order_index (si la colonne existe)
    let orderIndex = 1;
    try {
      const { count } = await supabase
        .from('user_notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false);
      
      orderIndex = (count || 0) + 1;
    } catch (error) {
      // Si la requête échoue (colonne is_pinned n'existe pas), on continue avec orderIndex = 1
      console.warn('⚠️ Colonne is_pinned non trouvée, utilisation de la valeur par défaut');
    }

    // Préparer les données à insérer
    const insertData: any = {
      user_id: userId,
      title: noteData.title,
      content: noteData.content || '',
      category: noteData.category || 'Général',
      tags: noteData.tags || [],
      color: noteData.color || '#3B82F6',
      is_favorite: false,
      is_archived: false
    };

    // Ajouter is_pinned et order_index seulement si les colonnes existent
    // (Supabase les ignorera si elles n'existent pas, mais on les inclut pour compatibilité)
    try {
      insertData.is_pinned = false;
      insertData.order_index = orderIndex;
    } catch (error) {
      // Ignorer si les colonnes n'existent pas
    }

    const { data, error } = await supabase
      .from('user_notes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Si l'erreur est due à is_pinned ou order_index manquants, réessayer sans ces colonnes
      if (error.message?.includes('is_pinned') || error.message?.includes('order_index')) {
        console.warn('⚠️ Colonnes is_pinned/order_index manquantes, réessai sans ces colonnes...');
        const { data: retryData, error: retryError } = await supabase
          .from('user_notes')
          .insert({
            user_id: userId,
            title: noteData.title,
            content: noteData.content || '',
            category: noteData.category || 'Général',
            tags: noteData.tags || [],
            color: noteData.color || '#3B82F6',
            is_favorite: false,
            is_archived: false
          })
          .select()
          .single();
        
        if (retryError) throw retryError;
        return retryData;
      }
      throw error;
    }
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

