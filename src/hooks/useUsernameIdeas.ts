import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UsernameIdea {
  id: string;
  pseudo: string;
  social_network_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  network?: {
    id: string;
    name: string;
    display_name: string;
    icon_url: string | null;
    color_theme: string | null;
  };
}

export const useUsernameIdeas = (networkId?: string) => {
  return useQuery({
    queryKey: ['username_ideas', networkId],
    queryFn: async (): Promise<UsernameIdea[]> => {
      try {
        // Récupérer les pseudos et les réseaux sociaux séparément pour éviter les problèmes de jointure
        let query = supabase
          .from('username_ideas')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtrer par réseau social si spécifié
        if (networkId && networkId !== 'all') {
          query = query.eq('social_network_id', networkId);
        }

        const { data: usernameIdeasData, error } = await query;

        if (error) {
          console.error('Erreur lors du chargement des idées de pseudos:', error);
          return [];
        }

        if (!usernameIdeasData || usernameIdeasData.length === 0) {
          return [];
        }

        // Récupérer tous les réseaux sociaux en une seule requête
        const networkIds = [...new Set(usernameIdeasData.map((item: { social_network_id: string }) => item.social_network_id))];
        const { data: networksData } = await supabase
          .from('social_networks')
          .select('id, name, display_name, icon_url, color_theme')
          .in('id', networkIds);

        // Créer un map pour accéder rapidement aux réseaux
        const networksMap = new Map(
          (networksData || []).map((net: { id: string; name: string; display_name: string; icon_url: string | null; color_theme: string | null }) => [net.id, net])
        );

        // Combiner les données
        const result = usernameIdeasData.map((item: { social_network_id: string; [key: string]: unknown }) => ({
          ...item,
          network: networksMap.get(item.social_network_id) || null
        })) as UsernameIdea[];

        return result;
      } catch (error) {
        console.error('Erreur lors du chargement des idées de pseudos:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};

