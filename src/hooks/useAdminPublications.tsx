import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface AdminPublication {
  id: string;
  user_id: string;
  content_type: string;
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  platform?: string;
  content_format?: string;
  status: string | null;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}
export const useAdminPublications = () => {
  const [publications, setPublications] = useState<AdminPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('user_publications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Récupérer les informations utilisateur pour chaque publication
      const publicationsWithUserInfo = await Promise.all(
        (data || []).map(async (pub) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, first_name, last_name')
            .eq('id', pub.user_id)
            .single();
          return {
            ...pub,
            user_email: profile?.email,
            user_name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Utilisateur'
          };
        })
      );
      setPublications(publicationsWithUserInfo);
    } catch (error) {
      console.error('Error fetching admin publications:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const addToDatabase = async (publication: AdminPublication) => {
    try {
      // Ajouter une nouvelle catégorie si elle n'existe pas
      if (publication.content_type === 'category' && !publication.category_id) {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: publication.title,
            description: publication.description,
            color: '#3B82F6' // Couleur par défaut
          })
          .select()
          .single();
        if (categoryError) throw categoryError;
        toast({
          title: "Catégorie ajoutée",
          description: `La catégorie "${publication.title}" a été ajoutée à la base de données`
        });
      }
      // Ajouter une nouvelle sous-catégorie si elle n'existe pas
      if (publication.content_type === 'subcategory' && publication.category_id && !publication.subcategory_id) {
        const { data: newSubcategory, error: subcategoryError } = await supabase
          .from('subcategories')
          .insert({
            name: publication.title,
            description: publication.description,
            category_id: publication.category_id
          })
          .select()
          .single();
        if (subcategoryError) throw subcategoryError;
        toast({
          title: "Sous-catégorie ajoutée",
          description: `La sous-catégorie "${publication.title}" a été ajoutée à la base de données`
        });
      }
      // Ajouter du contenu inspirant
      if (publication.content_type === 'inspiring_content' && publication.subcategory_id) {
        const { error: contentError } = await supabase
          .from('inspiring_content')
          .insert({
            title: publication.title,
            subcategory_id: publication.subcategory_id,
            platform: publication.platform,
            format: publication.content_format,
            status: 'active'
          });
        if (contentError) throw contentError;
        toast({
          title: "Contenu ajouté",
          description: `Le contenu "${publication.title}" a été ajouté à la base de données`
        });
      }
      // Ajouter un titre de contenu
      if (publication.content_type === 'content_title' && publication.subcategory_id) {
        const { error: titleError } = await supabase
          .from('content_titles')
          .insert({
            title: publication.title,
            subcategory_id: publication.subcategory_id,
            platform: publication.platform,
            format: publication.content_format
          });
        if (titleError) throw titleError;
        toast({
          title: "Titre ajouté",
          description: `Le titre "${publication.title}" a été ajouté à la base de données`
        });
      }
    } catch (error) {
      console.error('Error adding to database:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout en base de données",
        variant: "destructive"
      });
    }
  };
  const updatePublicationStatus = async (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const updateData: any = { status };
      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      const { error } = await supabase
        .from('user_publications')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      // Si approuvé, ajouter à la base de données
      if (status === 'approved') {
        const publication = publications.find(pub => pub.id === id);
        if (publication) {
          await addToDatabase(publication);
        }
      }
      toast({
        title: "Publication mise à jour",
        description: `Publication ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`
      });
      fetchPublications(); // Refresh the list
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    fetchPublications();
  }, []);
  return {
    publications,
    loading,
    updatePublicationStatus,
    refetch: fetchPublications
  };
};
