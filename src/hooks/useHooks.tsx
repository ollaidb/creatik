import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hook {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  social_network_id?: string;
  created_at: string;
  updated_at: string;
}

export const useHooks = (categoryId?: string, subcategoryId?: string, networkId?: string) => {
  return useQuery({
    queryKey: ['hooks', categoryId, subcategoryId, networkId],
    queryFn: async (): Promise<Hook[]> => {
      // Récupérer les hooks de la table hooks
      let hooksQuery = supabase
        .from('hooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryId) {
        hooksQuery = hooksQuery.eq('category_id', categoryId);
      }

      if (subcategoryId) {
        hooksQuery = hooksQuery.eq('subcategory_id', subcategoryId);
      }

      // Filtrer par réseau social si spécifié
      if (networkId && networkId !== 'all') {
        hooksQuery = hooksQuery.eq('social_network_id', networkId);
      }

      const { data: hooksData, error: hooksError } = await hooksQuery;

      if (hooksError) {
        console.error('Erreur lors de la récupération des hooks:', hooksError);
        throw hooksError;
      }

      // Récupérer les hooks publiés par les utilisateurs depuis content_titles
      let contentTitlesQuery = supabase
        .from('content_titles')
        .select('*')
        .eq('type', 'hook')
        .order('created_at', { ascending: false });

      // CORRECTION : Filtrer par categoryId si spécifié
      if (categoryId) {
        contentTitlesQuery = contentTitlesQuery.eq('category_id', categoryId);
      }

      if (subcategoryId) {
        contentTitlesQuery = contentTitlesQuery.eq('subcategory_id', subcategoryId);
      }

      // Filtrer par plateforme si spécifié
      if (networkId && networkId !== 'all') {
        contentTitlesQuery = contentTitlesQuery.eq('platform', networkId);
      }

      const { data: contentTitlesData, error: contentTitlesError } = await contentTitlesQuery;
      
      console.log('Debug useHooks - contentTitlesData:', contentTitlesData);
      console.log('Debug useHooks - networkId:', networkId);
      console.log('Debug useHooks - subcategoryId:', subcategoryId);
      console.log('Debug useHooks - categoryId:', categoryId);

      if (contentTitlesError) {
        console.error('Erreur lors de la récupération des hooks depuis content_titles:', contentTitlesError);
        throw contentTitlesError;
      }

      // Convertir les content_titles en format Hook
      const userHooks: Hook[] = await Promise.all(
        (contentTitlesData || []).map(async (item) => {
          const socialNetworkId = item.platform ? await getSocialNetworkIdByName(item.platform) : null;
          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            category_id: item.category_id || categoryId || null,
            subcategory_id: item.subcategory_id,
            social_network_id: socialNetworkId,
            created_at: item.created_at,
            updated_at: item.updated_at
          };
        })
      );

      // Combiner les deux sources et trier par date de création
      const allHooks = [...(hooksData || []), ...userHooks];
      console.log('Debug useHooks - hooksData:', hooksData);
      console.log('Debug useHooks - userHooks:', userHooks);
      console.log('Debug useHooks - allHooks:', allHooks);
      
      return allHooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: true
  });
};

// Fonction helper pour obtenir l'ID du réseau social par nom
const getSocialNetworkIdByName = async (platformName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('social_networks')
      .select('id')
      .eq('name', platformName.toLowerCase())
      .single();
    
    if (error || !data) {
      console.warn(`Réseau social non trouvé: ${platformName}`);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.warn(`Erreur lors de la récupération du réseau social ${platformName}:`, error);
    return null;
  }
}; 