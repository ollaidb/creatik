import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubcategoryCollaboration } from '@/types';

export const useSubcategoryCollaboration = (subcategoryId: string | undefined) => {
  const [collaboration, setCollaboration] = useState<SubcategoryCollaboration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subcategoryId) {
      setLoading(false);
      return;
    }

    const fetchCollaboration = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('subcategory_collaborations')
          .select('*')
          .eq('subcategory_id', subcategoryId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Aucune collaboration trouvée pour cette sous-catégorie
            setCollaboration(null);
          } else {
            throw fetchError;
          }
        } else {
          // Si collaboration_types est une chaîne JSON, le parser
          if (data.collaboration_types && typeof data.collaboration_types === 'string') {
            data.collaboration_types = JSON.parse(data.collaboration_types);
          }
          setCollaboration(data);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la collaboration:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaboration();
  }, [subcategoryId]);

  return { collaboration, loading, error };
};

