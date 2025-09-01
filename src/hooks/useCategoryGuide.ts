import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryGuide } from '@/types';

export const useCategoryGuide = (categoryId: string | undefined) => {
  const [guide, setGuide] = useState<CategoryGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchGuide = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('category_guides')
          .select('*')
          .eq('category_id', categoryId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Aucun guide trouvé pour cette catégorie
            setGuide(null);
          } else {
            throw fetchError;
          }
        } else {
          setGuide(data);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du guide:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [categoryId]);

  return { guide, loading, error };
};
