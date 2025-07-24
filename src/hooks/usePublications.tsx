import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Publication {
  id: string;
  user_id: string;
  content_type: 'category' | 'subcategory' | 'title';
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const usePublications = () => {
  const { user } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les publications de l'utilisateur
  const loadPublications = async () => {
    if (!user) {
      setPublications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPublications((data as Publication[]) || []);
    } catch (err) {
      console.error('Erreur lors du chargement des publications:', err);
      setError('Impossible de charger les publications');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une publication
  const deletePublication = async (publicationId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      // Récupérer la publication avant de la supprimer
      const { data: publication, error: fetchError } = await supabase
        .from('user_publications')
        .select('*')
        .eq('id', publicationId)
        .single();

      if (fetchError || !publication) {
        throw new Error('Publication non trouvée');
      }

      // Ajouter à la corbeille avec gestion des doublons
      const { error: trashError } = await (supabase as any)
        .from('deleted_content')
        .upsert({
          original_id: publication.id,
          content_type: publication.content_type,
          title: publication.title,
          description: publication.description,
          category_id: publication.category_id,
          subcategory_id: publication.subcategory_id,
          user_id: user.id,
          deleted_at: new Date().toISOString(),
          metadata: {
            status: publication.status,
            rejection_reason: publication.rejection_reason,
            created_at: publication.created_at,
            updated_at: publication.updated_at
          }
        }, {
          onConflict: 'original_id,content_type,user_id'
        });

      if (trashError) {
        throw new Error(`Erreur lors de l'ajout à la corbeille: ${trashError.message}`);
      }

      // Supprimer de la table user_publications
      const { error: deleteError } = await supabase
        .from('user_publications')
        .delete()
        .eq('id', publicationId);

      if (deleteError) {
        throw new Error(`Erreur lors de la suppression: ${deleteError.message}`);
      }

      // Recharger les publications
      await loadPublications();
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      return { error: err instanceof Error ? err.message : 'Impossible de supprimer la publication' };
    }
  };

  useEffect(() => {
    loadPublications();
  }, [user]);

  return {
    publications,
    loading,
    error,
    deletePublication,
    refresh: loadPublications
  };
}; 