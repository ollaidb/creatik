import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type PublicationContentType =
  | 'category'
  | 'subcategory'
  | 'subcategory_level2'
  | 'title'
  | 'hooks'
  | 'content'
  | 'account'
  | 'source'
  | 'pseudo'
  | 'creator';

export interface Publication {
  id: string;
  user_id: string | null;
  content_type: PublicationContentType;
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  platform?: string;
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

  // Charger les publications de l'utilisateur depuis la table user_publications
  const loadPublications = useCallback(async () => {
    if (!user) {
      setPublications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('=== DÉBUT CHARGEMENT PUBLICATIONS ===');
      console.log('User ID:', user.id);
      
      // Récupérer les publications de l'utilisateur depuis user_publications
      console.log('Récupération des publications utilisateur...');
      
      const { data: userPublications, error: publicationsError } = await supabase
        .from('user_publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Publications utilisateur récupérées:', userPublications);
      console.log('Erreur publications:', publicationsError);

      if (publicationsError) {
        console.error('Erreur publications:', publicationsError);
        setError('Impossible de charger les publications');
      } else if (userPublications) {
        // Convertir les données de user_publications au format Publication
        const formattedPublications: Publication[] = userPublications.map(pub => ({
          id: pub.id,
          user_id: pub.user_id,
          content_type: pub.content_type as PublicationContentType,
          title: pub.title,
          description: pub.description,
          category_id: pub.category_id,
          subcategory_id: pub.subcategory_id,
          platform: pub.platform,
          status: pub.status || 'approved',
          rejection_reason: pub.rejection_reason,
          created_at: pub.created_at,
          updated_at: pub.updated_at
        }));
        
        console.log('=== FIN CHARGEMENT PUBLICATIONS ===');
        console.log('Total publications:', formattedPublications.length);
        console.log('Publications formatées:', formattedPublications);
        
        setPublications(formattedPublications);
      } else {
        setPublications([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des publications:', err);
      setError('Impossible de charger les publications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Supprimer une publication
  const deletePublication = async (publicationId: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };
    
    try {
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
  }, [loadPublications]);

  return {
    publications,
    loading,
    error,
    deletePublication,
    refresh: loadPublications
  };
}; 

export const useUserPublicationsById = (userId: string | null) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!userId) {
        if (isMounted) {
          setPublications([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('user_publications')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          const formatted: Publication[] = (data || []).map((pub) => ({
            id: pub.id,
            user_id: pub.user_id,
            content_type: pub.content_type as PublicationContentType,
            title: pub.title,
            description: pub.description ?? undefined,
            category_id: pub.category_id ?? undefined,
            subcategory_id: pub.subcategory_id ?? undefined,
            subcategory_level2_id: pub.subcategory_level2_id ?? undefined,
            platform: pub.platform ?? undefined,
            url: pub.url ?? undefined,
            status: (pub.status as Publication['status']) || 'approved',
            rejection_reason: pub.rejection_reason ?? undefined,
            created_at: pub.created_at,
            updated_at: pub.updated_at,
          }));
          setPublications(formatted);
        }
      } catch (err) {
        console.error('Erreur chargement publications publiques:', err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de charger les publications publiques."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    publications,
    loading,
    error,
  };
};