import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Creator {
  id: string;
  name: string;
  display_name: string | null;
  avatar: string | null;
  bio: string | null;
  public_bio: string | null;
  category: string | null;
  subcategory: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  is_verified: boolean;
  owner_user_id: string | null;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorSocialPostPreview {
  id: string;
  title: string;
  hook?: string | null;
  published_at?: string | null;
}

export interface CreatorSocialNetwork {
  id: string;
  creator_id: string;
  platform: string;
  profile_url: string | null;
  handle: string | null;
  followers_count: number | null;
  avg_engagement_rate: number | null;
  activity_score: number | null;
  is_primary: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
  platform_info?: {
    code: string;
    label: string;
    icon_name: string | null;
  } | null;
  recent_posts?: CreatorSocialPostPreview[];
  content_summary?: string | null;
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
      
      return (data || []).map((creator: Creator) => ({
        ...creator,
        avatar: creator.avatar ?? creator.avatar_url ?? null,
        public_bio: creator.public_bio ?? creator.bio ?? null,
        is_public: creator.is_public ?? false,
      }));
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

      // Récupérer ses profils sociaux (nouvelle table)
      const { data: socialProfiles, error: profilesError } = await supabase
        .from('creator_social_profiles')
        .select(`
          *,
          platform_info:social_platforms(code, label, icon_name)
        `)
        .eq('creator_id', creatorId);

      if (profilesError) {
        console.error('Erreur lors de la récupération des réseaux sociaux:', profilesError);
        return { ...creator, social_networks: [] };
      }

      const sortedProfiles = (socialProfiles || []).sort((a, b) => {
        const activityDiff = (b.activity_score ?? 0) - (a.activity_score ?? 0);
        if (activityDiff !== 0) {
          return activityDiff;
        }

        const followersDiff = (b.followers_count ?? 0) - (a.followers_count ?? 0);
        if (followersDiff !== 0) {
          return followersDiff;
        }

        if (a.is_primary === b.is_primary) {
          return 0;
        }

        return a.is_primary ? -1 : 1;
      });

      const normalizedCreator: Creator = {
        ...creator,
        avatar: creator.avatar ?? (creator as Creator & { avatar_url?: string }).avatar_url ?? null,
        public_bio: creator.public_bio ?? creator.bio ?? null,
        is_public: creator.is_public ?? false,
      };

      return { ...normalizedCreator, social_networks: sortedProfiles.slice(0, 4) };
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

export interface CreatorPublication {
  id: string;
  title: string;
  description?: string;
  url?: string;
  published_at: string;
  network_name: string;
}

export const useCreatorPublications = (creatorId: string, networkName: string | null) => {
  return useQuery({
    queryKey: ['creator-publications', creatorId, networkName],
    queryFn: async (): Promise<CreatorPublication[]> => {
      // Pour l'instant, on retourne des données mockées
      // TODO: Créer une table creator_publications dans la base de données
      if (!networkName) return [];
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Retourner des données mockées selon le réseau
      const mockPublications: CreatorPublication[] = [];
      
      // Pour YouTube, on peut avoir un titre de vidéo
      if (networkName === 'youtube') {
        mockPublications.push({
          id: '1',
          title: 'Dernière vidéo YouTube',
          description: 'Contenu de la dernière vidéo publiée sur YouTube',
          url: '#',
          published_at: new Date().toISOString(),
          network_name: 'youtube'
        });
      }
      // Pour les autres réseaux, on retourne un tableau vide (sera géré par le texte descriptif)
      
      return mockPublications;
    },
    enabled: !!creatorId && !!networkName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
