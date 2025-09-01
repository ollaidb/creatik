import { supabase } from '@/integrations/supabase/client';
export const addToTrash = async (item: {
  original_publication_id: string;
  publication_type: 'category' | 'subcategory' | 'title';
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  metadata?: Record<string, unknown>;
}) => {
  try {
    const { error } = await supabase
      .from('trash')
      .insert({
        original_publication_id: item.original_publication_id,
        publication_type: item.publication_type,
        title: item.title,
        description: item.description,
        category_id: item.category_id,
        subcategory_id: item.subcategory_id,
        metadata: item.metadata || {},
        deleted_at: new Date().toISOString(),
        will_be_deleted_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
      });
    if (error) {
      throw error;
    }
    return { success: true };
  } catch (err) {
    console.error('Erreur lors de l\'ajout à la corbeille:', err);
    return { error: 'Impossible d\'ajouter à la corbeille' };
  }
}; 