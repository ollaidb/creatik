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
      // Convertir le nom du réseau en ID si nécessaire
      let socialNetworkId: string | null = null;
      if (networkId && networkId !== 'all') {
        // Si networkId est déjà un UUID, l'utiliser directement
        // Sinon, chercher l'ID correspondant au nom
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(networkId);
        if (!isUUID) {
          const { data: network } = await supabase
            .from('social_networks')
            .select('id')
            .eq('name', networkId.toLowerCase())
            .single();
          socialNetworkId = network?.id || null;
        } else {
          socialNetworkId = networkId;
        }
      }

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
      if (socialNetworkId) {
        hooksQuery = hooksQuery.eq('social_network_id', socialNetworkId);
      }

      const { data: hooksData, error: hooksError } = await hooksQuery;

      if (hooksError) {
        console.error('Erreur lors de la récupération des hooks:', hooksError);
        throw hooksError;
      }

      // Récupérer les hooks publiés par les utilisateurs depuis content_titles
      // On récupère aussi la subcategory pour obtenir le category_id si nécessaire
      let contentTitlesQuery = supabase
        .from('content_titles')
        .select(`
          *,
          subcategories(category_id)
        `)
        .eq('type', 'hook')
        .order('created_at', { ascending: false });

      // Filtrer par subcategoryId si spécifié
      if (subcategoryId) {
        contentTitlesQuery = contentTitlesQuery.eq('subcategory_id', subcategoryId);
      }

      // Filtrer par plateforme si spécifié
      if (networkId && networkId !== 'all') {
        contentTitlesQuery = contentTitlesQuery.eq('platform', networkId);
      }

      const { data: contentTitlesData, error: contentTitlesError } = await contentTitlesQuery;
      
      // Filtrer par categoryId après récupération si nécessaire (pour les cas où category_id n'est pas dans content_titles)
      let filteredContentTitles = contentTitlesData || [];
      if (categoryId) {
        filteredContentTitles = filteredContentTitles.filter((item: any) => {
          // Si category_id est présent dans content_titles, l'utiliser
          if (item.category_id) {
            return item.category_id === categoryId;
          }
          // Sinon, utiliser le category_id de la subcategory
          const subcategory = item.subcategories;
          if (subcategory) {
            // subcategory peut être un objet ou un tableau selon la structure Supabase
            const subcategoryObj = Array.isArray(subcategory) ? subcategory[0] : subcategory;
            if (subcategoryObj && subcategoryObj.category_id) {
              return subcategoryObj.category_id === categoryId;
            }
          }
          // Si on ne peut pas déterminer, inclure l'élément si on ne filtre pas strictement
          return true;
        });
      }
      
      console.log('Debug useHooks - contentTitlesData:', contentTitlesData);
      console.log('Debug useHooks - networkId:', networkId);
      console.log('Debug useHooks - subcategoryId:', subcategoryId);
      console.log('Debug useHooks - categoryId:', categoryId);

      if (contentTitlesError) {
        console.error('Erreur lors de la récupération des hooks depuis content_titles:', contentTitlesError);
        throw contentTitlesError;
      }

      // Optimisation: récupérer tous les réseaux sociaux en une seule requête
      const platforms = [...new Set((contentTitlesData || []).map(item => item.platform).filter(Boolean))];
      const socialNetworksMap = new Map<string, string | null>();
      
      if (platforms.length > 0) {
        const { data: socialNetworks } = await supabase
          .from('social_networks')
          .select('id, name');
        
        if (socialNetworks) {
          platforms.forEach(platform => {
            const network = socialNetworks.find(n => n.name.toLowerCase() === platform?.toLowerCase());
            socialNetworksMap.set(platform, network?.id || null);
          });
        }
      }

      // Convertir les content_titles en format Hook (plus rapide, sans Promise.all inutile)
      const userHooks: Hook[] = filteredContentTitles.map((item: any) => {
        // Déterminer le category_id
        let finalCategoryId = item.category_id;
        if (!finalCategoryId) {
          // Récupérer depuis la subcategory si disponible
          const subcategory = item.subcategories;
          if (subcategory) {
            // subcategory peut être un objet ou un tableau selon la structure Supabase
            const subcategoryObj = Array.isArray(subcategory) ? subcategory[0] : subcategory;
            if (subcategoryObj && subcategoryObj.category_id) {
              finalCategoryId = subcategoryObj.category_id;
            } else {
              finalCategoryId = categoryId || null;
            }
          } else {
            finalCategoryId = categoryId || null;
          }
        }
        
        return {
          id: item.id,
          title: item.title,
          description: item.description || '',
          category_id: finalCategoryId,
          subcategory_id: item.subcategory_id,
          social_network_id: item.platform ? socialNetworksMap.get(item.platform) || null : null,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });

      // Combiner les deux sources et trier par date de création
      const allHooks = [...(hooksData || []), ...userHooks];
      console.log('Debug useHooks - hooksData:', hooksData);
      console.log('Debug useHooks - userHooks:', userHooks);
      console.log('Debug useHooks - allHooks:', allHooks);
      
      return allHooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
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