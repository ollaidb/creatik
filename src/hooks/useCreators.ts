import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Creator {
  id: string;
  name: string;
  display_name: string | null;
  avatar: string | null;
  bio: string | null;
  category: string | null;
  subcategory: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorSocialNetwork {
  id: string;
  creator_id: string;
  social_network_id: string;
  username: string | null;
  profile_url: string | null;
  followers_count: number;
  is_primary: boolean;
  created_at: string;
  network: {
    id: string;
    name: string;
    display_name: string;
    icon_url: string | null;
    color_theme: string | null;
  };
}

export interface CreatorWithNetworks extends Creator {
  social_networks: CreatorSocialNetwork[];
}

export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async (): Promise<Creator[]> => {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Erreur lors de la récupération des créateurs:', error);
        return [];
      }
      
      return data || [];
    },
  });
};

export const useCreator = (creatorId: string) => {
  return useQuery({
    queryKey: ['creator', creatorId],
    queryFn: async (): Promise<CreatorWithNetworks | null> => {
      // Récupérer le créateur
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('id', creatorId)
        .single();
      
      if (creatorError) {
        console.error('Erreur lors de la récupération du créateur:', creatorError);
        return null;
      }
      
      // Récupérer ses réseaux sociaux
      const { data: socialNetworks, error: networksError } = await supabase
        .from('creator_social_networks')
        .select(`
          *,
          network:social_networks(id, name, display_name, icon_url, color_theme)
        `)
        .eq('creator_id', creatorId)
        .order('is_primary', { ascending: false });
      
      if (networksError) {
        console.error('Erreur lors de la récupération des réseaux sociaux:', networksError);
        return { ...creator, social_networks: [] };
      }
      
      return { ...creator, social_networks: socialNetworks || [] };
    },
    enabled: !!creatorId,
  });
};

export const useCreatorChallenges = (creatorId: string) => {
  return useQuery({
    queryKey: ['creator-challenges', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_challenges')
        .select(`
          *,
          challenge:challenges(title, description, category),
          network:social_networks(name, display_name)
        `)
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des défis:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!creatorId,
  });
};
