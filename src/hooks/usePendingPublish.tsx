import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface PublishData {
  content_type: 'category' | 'subcategory' | 'title' | 'challenge' | 'source' | 'account' | 'hooks' | 'inspiration';
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  url?: string;
  platform?: string;
  social_network_id?: string; // Ajouter ce champ
}

interface DuplicateCheckResult {
  success: boolean;
  error?: string;
}

export const usePendingPublish = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  const publishContent = async (data: PublishData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier du contenu",
        variant: "destructive"
      });
      return { success: false, error: "Utilisateur non connecté" };
    }

    setIsPublishing(true);
    try {
      // Vérifier les doublons avant publication
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: duplicateCheck, error: checkError } = await (supabase as any)
        .rpc('check_duplicate_content', {
          p_content_type: data.content_type,
          p_name: data.title,
          p_title: data.title
        });

      if (checkError) {
        console.error('Erreur lors de la vérification des doublons:', checkError);
      } else {
        const result = duplicateCheck as DuplicateCheckResult;
        if (result && !result.success) {
          toast({
            title: "Contenu déjà existant",
            description: result.error || "Ce contenu existe déjà dans l'application",
            variant: "destructive"
          });
          return { success: false, error: result.error };
        }
      }

      // Si pas de doublon, procéder à la publication
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertData: any = {
        user_id: user.id,
        content_type: data.content_type,
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        url: data.url,
        platform: data.platform,
        status: 'pending'
      };

      // Ajouter social_network_id seulement s'il est défini
      if (data.social_network_id) {
        insertData.social_network_id = data.social_network_id;
      }

      const { data: publication, error } = await (supabase as any)
        .from('pending_publications')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la publication:', error);
        toast({
          title: "Erreur",
          description: "Impossible de publier le contenu",
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Publication en cours",
        description: "Votre contenu a été soumis et sera publié dans quelques secondes",
      });

      // Traitement automatique après 5 secondes
      setTimeout(async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).rpc('process_user_publications');
        } catch (processError) {
          console.error('Erreur lors du traitement automatique:', processError);
        }
      }, 5000);

      return { success: true, data: publication };
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      toast({
        title: "Erreur",
        description: "Impossible de publier le contenu",
        variant: "destructive"
      });
      return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishContent,
    isPublishing
  };
}; 