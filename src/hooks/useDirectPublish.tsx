import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PublishData {
  content_type: string;
  title: string;
  category_id?: string;
  subcategory_id?: string;
}

export const useDirectPublish = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const publishContent = async (data: PublishData) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour publier du contenu",
        variant: "destructive"
      });
      return null;
    }

    setIsPublishing(true);
    
    try {
      console.log('=== DÉBUT PUBLICATION DIRECTE ===');
      console.log('Utilisateur:', user.id, user.email);
      console.log('Données:', data);

      let result;

      // Insérer directement selon le type de contenu
      if (data.content_type === 'category') {
        console.log('📝 Tentative d\'insertion dans categories...');
        const { data: insertData, error } = await supabase
          .from('categories')
          .insert({
            name: data.title,
            description: 'Catégorie publiée',
            color: '#3B82F6'
          })
          .select()
          .single();

        console.log('📊 Résultat categories:', { insertData, error });

        if (error) {
          console.error('❌ Erreur categories:', error);
          throw error;
        }
        result = { success: true, message: 'Catégorie publiée avec succès', data: insertData };

      } else if (data.content_type === 'subcategory') {
        console.log('📝 Tentative d\'insertion dans subcategories...');
        const { data: insertData, error } = await supabase
          .from('subcategories')
          .insert({
            name: data.title,
            description: 'Sous-catégorie publiée',
            category_id: data.category_id
          })
          .select()
          .single();

        console.log('📊 Résultat subcategories:', { insertData, error });

        if (error) {
          console.error('❌ Erreur subcategories:', error);
          throw error;
        }
        result = { success: true, message: 'Sous-catégorie publiée avec succès', data: insertData };

      } else if (data.content_type === 'title') {
        console.log('📝 Tentative d\'insertion dans content_titles...');
        const { data: insertData, error } = await supabase
          .from('content_titles')
          .insert({
            title: data.title,
            subcategory_id: data.subcategory_id,
            type: 'title',
            platform: 'all'
          })
          .select()
          .single();

        console.log('📊 Résultat content_titles:', { insertData, error });

        if (error) {
          console.error('❌ Erreur content_titles:', error);
          throw error;
        }
        result = { success: true, message: 'Titre publié avec succès', data: insertData };

      } else {
        throw new Error('Type de contenu invalide');
      }

      console.log('✅ Publication réussie:', result);
      
      toast({
        title: "Contenu publié !",
        description: result.message
      });

      return result;

    } catch (error) {
      console.error('=== ERREUR PUBLICATION ===');
      console.error('Erreur complète:', error);
      console.error('Type d\'erreur:', typeof error);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.code);
      console.error('Détails d\'erreur:', error.details);
      
      toast({
        title: "Erreur",
        description: `Erreur lors de la publication: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishContent,
    isPublishing
  };
}; 