import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DeleteContentParams {
  content_type: 'category' | 'subcategory' | 'title' | 'challenge';
  content_id: string;
}

export const useDeleteContent = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const deleteContent = async ({ content_type, content_id }: DeleteContentParams) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour supprimer du contenu",
        variant: "destructive"
      });
      return false;
    }

    setIsDeleting(true);
    
    try {
      console.log('🗑️ Suppression de contenu:', { content_type, content_id, user_id: user.id });

      const { data, error } = await (supabase as any)
        .rpc('delete_user_content', {
          p_content_type: content_type,
          p_content_id: content_id,
          p_user_id: user.id
        });

      if (error) {
        console.error('❌ Erreur suppression:', error);
        toast({
          title: "Erreur",
          description: `Erreur lors de la suppression: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      if (data && data.success) {
        console.log('✅ Contenu supprimé:', data);
        toast({
          title: "Contenu supprimé",
          description: "Le contenu a été supprimé avec succès"
        });
        return true;
      } else {
        console.error('❌ Échec suppression:', data);
        toast({
          title: "Erreur",
          description: data?.message || "Échec de la suppression",
          variant: "destructive"
        });
        return false;
      }

    } catch (error) {
      console.error('❌ Exception suppression:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteContent,
    isDeleting
  };
}; 