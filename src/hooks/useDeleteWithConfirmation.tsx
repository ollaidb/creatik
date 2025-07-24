import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DeleteItem {
  id: string;
  title: string;
  type: 'category' | 'subcategory' | 'title';
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  metadata?: Record<string, unknown>;
}

export const useDeleteWithConfirmation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteItem = async (item: DeleteItem) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer des éléments",
        variant: "destructive"
      });
      return { success: false };
    }

    setIsDeleting(true);

    try {
      // 1. Ajouter à la corbeille
      const { error: trashError } = await (supabase as any)
        .from('trash')
        .insert({
          user_id: user.id,
          original_publication_id: item.id,
          publication_type: item.type,
          title: item.title,
          description: item.description,
          category_id: item.category_id,
          subcategory_id: item.subcategory_id,
          metadata: item.metadata || {},
          deleted_at: new Date().toISOString(),
          will_be_deleted_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        });

      if (trashError) {
        throw new Error(`Erreur lors de l'ajout à la corbeille: ${trashError.message}`);
      }

      // 2. Supprimer de la table d'origine selon le type
      let deleteError = null;

      switch (item.type) {
        case 'category': {
          const { error: catError } = await supabase
            .from('categories')
            .delete()
            .eq('id', item.id);
          deleteError = catError;
          break;
        }

        case 'subcategory': {
          const { error: subError } = await supabase
            .from('subcategories')
            .delete()
            .eq('id', item.id);
          deleteError = subError;
          break;
        }

        case 'title': {
          const { error: titleError } = await supabase
            .from('content_titles')
            .delete()
            .eq('id', item.id);
          deleteError = titleError;
          break;
        }

        default:
          throw new Error('Type de publication non supporté');
      }

      if (deleteError) {
        throw new Error(`Erreur lors de la suppression: ${deleteError.message}`);
      }

      toast({
        title: "Élément supprimé",
        description: `${item.title} a été déplacé vers la corbeille`,
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer l'élément",
        variant: "destructive"
      });

      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteItem,
    isDeleting
  };
}; 