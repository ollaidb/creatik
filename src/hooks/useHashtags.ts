import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Hashtag {
  id: string;
  subcategory_id: string;
  hashtag: string;
  hashtag_order: number;
  created_at: string;
}

export const useHashtags = (subcategoryId?: string) => {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subcategoryId) {
      setHashtags([]);
      setLoading(false);
      return;
    }

    const fetchHashtags = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('subcategory_hashtags')
          .select('*')
          .eq('subcategory_id', subcategoryId)
          .order('hashtag_order', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setHashtags(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des hashtags:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, [subcategoryId]);

  const addHashtag = async (hashtag: string, order?: number) => {
    if (!subcategoryId) return { error: 'ID de sous-catégorie manquant' };

    try {
      const newOrder = order ?? Math.max(...hashtags.map(h => h.hashtag_order), 0) + 1;
      
      const { data, error: insertError } = await supabase
        .from('subcategory_hashtags')
        .insert({
          subcategory_id: subcategoryId,
          hashtag,
          hashtag_order: newOrder
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setHashtags(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de l\'ajout du hashtag:', err);
      return { error: err instanceof Error ? err.message : 'Erreur inconnue' };
    }
  };

  const updateHashtag = async (id: string, updates: Partial<Hashtag>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('subcategory_hashtags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setHashtags(prev => prev.map(h => h.id === id ? data : h));
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du hashtag:', err);
      return { error: err instanceof Error ? err.message : 'Erreur inconnue' };
    }
  };

  const deleteHashtag = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('subcategory_hashtags')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setHashtags(prev => prev.filter(h => h.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression du hashtag:', err);
      return { error: err instanceof Error ? err.message : 'Erreur inconnue' };
    }
  };

  const reorderHashtags = async (newOrder: { id: string; order: number }[]) => {
    try {
      // Mettre à jour l'ordre de tous les hashtags
      const updates = newOrder.map(({ id, order }) => 
        supabase
          .from('subcategory_hashtags')
          .update({ hashtag_order: order })
          .eq('id', id)
      );

      await Promise.all(updates);

      // Mettre à jour l'état local
      setHashtags(prev => 
        prev.map(hashtag => {
          const newOrderItem = newOrder.find(item => item.id === hashtag.id);
          return newOrderItem 
            ? { ...hashtag, hashtag_order: newOrderItem.order }
            : hashtag;
        }).sort((a, b) => a.hashtag_order - b.hashtag_order)
      );

      return { success: true };
    } catch (err) {
      console.error('Erreur lors du réordonnancement des hashtags:', err);
      return { error: err instanceof Error ? err.message : 'Erreur inconnue' };
    }
  };

  return {
    hashtags,
    loading,
    error,
    addHashtag,
    updateHashtag,
    deleteHashtag,
    reorderHashtags
  };
}; 