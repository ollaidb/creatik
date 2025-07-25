import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
interface DeletedContent {
  id: string;
  original_id: string;
  content_type: 'category' | 'subcategory' | 'title' | 'challenge';
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  user_id: string;
  deleted_at: string;
  metadata?: any;
}
export const useTrash = () => {
  const [trashItems, setTrashItems] = useState<DeletedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const loadTrashItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('deleted_content')
        .select('*')
        .eq('user_id', user.id)
        .order('deleted_at', { ascending: false });
      if (error) {
        console.error('Erreur chargement corbeille:', error);
        setError(error.message);
      } else {
        setTrashItems(data || []);
      }
    } catch (error) {
      console.error('Exception chargement corbeille:', error);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };
  const restoreFromTrash = async (itemId: string) => {
    try {
      const item = trashItems.find(item => item.id === itemId);
      if (!item) {
        return { success: false, error: 'Élément non trouvé' };
      }
      // Restaurer le contenu selon son type
      let insertResult;
      if (item.content_type === 'category') {
        const { data, error } = await (supabase as any)
          .from('categories')
          .insert({
            id: item.original_id,
            name: item.title,
            description: item.description || 'Catégorie restaurée',
            color: item.metadata?.color || 'primary'
          })
          .select()
          .single();
        insertResult = { data, error };
      } else if (item.content_type === 'subcategory') {
        const { data, error } = await (supabase as any)
          .from('subcategories')
          .insert({
            id: item.original_id,
            name: item.title,
            description: item.description || 'Sous-catégorie restaurée',
            category_id: item.category_id
          })
          .select()
          .single();
        insertResult = { data, error };
      } else if (item.content_type === 'title') {
        const { data, error } = await (supabase as any)
          .from('content_titles')
          .insert({
            id: item.original_id,
            title: item.title,
            subcategory_id: item.subcategory_id,
            type: 'title',
            platform: 'all'
          })
          .select()
          .single();
        insertResult = { data, error };
      } else if (item.content_type === 'challenge') {
        const { data, error } = await (supabase as any)
          .from('challenges')
          .insert({
            id: item.original_id,
            title: item.title,
            description: item.description || 'Challenge restauré',
            category: 'Challenge',
            points: item.metadata?.points || 50,
            difficulty: item.metadata?.difficulty || 'medium',
            duration_days: 1,
            is_daily: false,
            is_active: true,
            created_by: item.user_id
          })
          .select()
          .single();
        insertResult = { data, error };
      }
      if (insertResult?.error) {
        return { success: false, error: insertResult.error.message };
      }
      // Supprimer de la corbeille
      const { error: deleteError } = await (supabase as any)
        .from('deleted_content')
        .delete()
        .eq('id', itemId);
      if (deleteError) {
        return { success: false, error: deleteError.message };
      }
      // Recharger la corbeille
      await loadTrashItems();
      return { success: true };
    } catch (error) {
      console.error('Erreur restauration:', error);
      return { success: false, error: 'Erreur lors de la restauration' };
    }
  };
  const permanentlyDelete = async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('deleted_content')
        .delete()
        .eq('id', itemId);
      if (error) {
        return { success: false, error: error.message };
      }
      // Recharger la corbeille
      await loadTrashItems();
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression définitive:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };
  const getDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysDiff); // 30 jours pour supprimer définitivement
  };
  useEffect(() => {
    loadTrashItems();
  }, [user]);
  return {
    trashItems,
    loading,
    error,
    restoreFromTrash,
    permanentlyDelete,
    getDaysLeft,
    refresh: loadTrashItems
  };
}; 