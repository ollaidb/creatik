
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserPublication {
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
}

export const useUserPublications = () => {
  const [publications, setPublications] = useState<UserPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPublications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPublication = async (publicationData: Omit<UserPublication, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_publications')
        .insert({
          ...publicationData,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Publication créée",
        description: "Votre publication est en attente de validation"
      });

      fetchPublications(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating publication:', error);
      toast({
        title: "Erreur de publication",
        description: "Erreur lors de la création de la publication",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePublication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_publications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Publication supprimée",
        description: "La publication a été supprimée avec succès"
      });

      fetchPublications(); // Refresh the list
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [user]);

  return {
    publications,
    loading,
    createPublication,
    deletePublication,
    refetch: fetchPublications
  };
};
