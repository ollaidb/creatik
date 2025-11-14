import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SocialNetwork {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon_url?: string;
  color_theme?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  created_at?: string;
}

// Configuration temporaire des réseaux sociaux (en attendant les tables)
const TEMP_SOCIAL_NETWORKS: SocialNetwork[] = [
  { id: 'all', name: 'all', display_name: 'Tout', description: 'Toutes les catégories', icon_url: '/icons/globe.svg', color_theme: '#8B5CF6', is_active: true, created_at: '', updated_at: '' },
  { id: 'tiktok', name: 'tiktok', display_name: 'TikTok', description: 'Vidéos courtes et tendances', icon_url: '/icons/tiktok.svg', color_theme: '#000000', is_active: true, created_at: '', updated_at: '' },
  { id: 'youtube', name: 'youtube', display_name: 'YouTube', description: 'Vidéos longues et chaînes', icon_url: '/icons/youtube.svg', color_theme: '#FF0000', is_active: true, created_at: '', updated_at: '' },
  { id: 'instagram', name: 'instagram', display_name: 'Instagram', description: 'Contenu visuel et stories', icon_url: '/icons/instagram.svg', color_theme: '#E4405F', is_active: true, created_at: '', updated_at: '' },
  { id: 'facebook', name: 'facebook', display_name: 'Facebook', description: 'Posts et groupes', icon_url: '/icons/facebook.svg', color_theme: '#1877F2', is_active: true, created_at: '', updated_at: '' },
  { id: 'twitter', name: 'twitter', display_name: 'Twitter', description: 'Micro-blogging et threads', icon_url: '/icons/twitter.svg', color_theme: '#1DA1F2', is_active: true, created_at: '', updated_at: '' },
  { id: 'linkedin', name: 'linkedin', display_name: 'LinkedIn', description: 'Réseau professionnel', icon_url: '/icons/linkedin.svg', color_theme: '#0077B5', is_active: true, created_at: '', updated_at: '' },
  { id: 'twitch', name: 'twitch', display_name: 'Twitch', description: 'Streaming et gaming', icon_url: '/icons/twitch.svg', color_theme: '#9146FF', is_active: true, created_at: '', updated_at: '' },
  { id: 'snapchat', name: 'snapchat', display_name: 'Snapchat', description: 'Contenu éphémère et visuel', icon_url: '/icons/snapchat.svg', color_theme: '#FFFC00', is_active: true, created_at: '', updated_at: '' },
  { id: 'pinterest', name: 'pinterest', display_name: 'Pinterest', description: 'Inspiration visuelle', icon_url: '/icons/pinterest.svg', color_theme: '#E60023', is_active: true, created_at: '', updated_at: '' },
  { id: 'blog', name: 'blog', display_name: 'Blog', description: 'Articles de blog et contenus longs', icon_url: '/icons/blog.svg', color_theme: '#FF6B35', is_active: true, created_at: '', updated_at: '' },
  { id: 'article', name: 'article', display_name: 'Article', description: 'Articles détaillés et analyses', icon_url: '/icons/article.svg', color_theme: '#2E8B57', is_active: true, created_at: '', updated_at: '' },
  { id: 'podcasts', name: 'podcasts', display_name: 'Podcasts', description: 'Contenu audio et épisodes', icon_url: '/icons/podcast.svg', color_theme: '#8A2BE2', is_active: true, created_at: '', updated_at: '' }
];

// Configuration temporaire des filtres par réseau
const NETWORK_FILTERS: Record<string, { hidden: string[], redirects: Record<string, string> }> = {
  linkedin: {
    hidden: ['entertainment', 'gaming', 'fashion', 'lifestyle', 'sports'],
    redirects: {
      'entertainment': 'business',
      'gaming': 'innovation',
      'fashion': 'marketing',
      'lifestyle': 'leadership',
      'sports': 'innovation'
    }
  },
  twitch: {
    hidden: ['business', 'professional', 'fashion', 'lifestyle', 'marketing'],
    redirects: {
      'business': 'gaming',
      'professional': 'technology',
      'fashion': 'entertainment',
      'lifestyle': 'education',
      'marketing': 'technology'
    }
  }
};

export const useSocialNetworks = () => {
  return useQuery({
    queryKey: ['social-networks'],
    queryFn: async (): Promise<SocialNetwork[]> => {
      // Utiliser les vraies données de la base de données
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Erreur lors de la récupération des réseaux sociaux:', error);
        // Fallback vers les données temporaires si la table n'existe pas encore
        return TEMP_SOCIAL_NETWORKS;
      }
      
      // Ordonner les réseaux selon un ordre spécifique
      const orderMap: Record<string, number> = {
        'all': 0,
        'tiktok': 1,
        'youtube': 2,
        'instagram': 3,
        'facebook': 4,
        'twitter': 5,
        'linkedin': 6,
        'twitch': 7,
        'snapchat': 8,
        'pinterest': 9,
        'blog': 10,
        'article': 11,
        'podcasts': 12
      };
      
      const sortedData = (data || TEMP_SOCIAL_NETWORKS).sort((a, b) => {
        const orderA = orderMap[a.name] ?? 999;
        const orderB = orderMap[b.name] ?? 999;
        return orderA - orderB;
      });
      
      return sortedData;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - les réseaux changent rarement
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useFilterCategoriesByNetwork = (categories: Category[], networkId: string) => {
  // Utiliser les vraies données de la base de données
  const { data: networkConfig } = useQuery({
    queryKey: ['network-config', networkId],
    queryFn: async () => {
      if (networkId === 'all') return null;
      
      try {
        // D'abord récupérer l'ID du réseau à partir de son name
        const { data: networkData, error: networkError } = await supabase
          .from('social_networks')
          .select('id')
          .eq('name', networkId)
          .single();
        
        if (networkError || !networkData) {
          console.error('Erreur lors de la récupération du réseau:', networkError);
          return null;
        }
        
        // Ensuite récupérer la configuration avec l'ID du réseau
        const { data, error } = await supabase
          .from('network_configurations')
          .select('*')
          .eq('network_id', networkData.id)
          .single();
        
        if (error) {
          console.error('Erreur lors de la récupération de la config réseau:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Table network_configurations non trouvée, utilisation du fallback');
        return null;
      }
    },
    enabled: networkId !== 'all'
  });

  if (networkId === 'all' || !networkConfig) {
    return categories;
  }

  // NOUVELLE LOGIQUE : Si allowed_categories existe, filtrer par cette liste
  if (networkConfig.allowed_categories && networkConfig.allowed_categories.length > 0) {
    const allowedIds = networkConfig.allowed_categories;
    const filteredCategories = categories.filter(category => 
      allowedIds.includes(category.id)
    );
    
    // Appliquer le tri par priorité
    const sortPriority = networkConfig.sort_priority || {};
    const sortedCategories = filteredCategories.sort((a, b) => {
      const priorityA = sortPriority[a.name.toLowerCase()] || 999;
      const priorityB = sortPriority[b.name.toLowerCase()] || 999;
      return priorityA - priorityB;
    });
    
    return sortedCategories;
  }

  // ANCIENNE LOGIQUE : Filtrer les catégories masquées (pour compatibilité)
  const hiddenCategories = networkConfig.hidden_categories || [];
  const filteredCategories = categories.filter(category => {
    return !hiddenCategories.includes(category.name.toLowerCase());
  });

  // Appliquer les redirections
  const redirectMappings = networkConfig.redirect_mappings || {};
  const redirectedCategories = filteredCategories.map(category => {
    const redirectTo = redirectMappings[category.name.toLowerCase()];
    if (redirectTo) {
      const targetCategory = categories.find(c => c.name.toLowerCase() === redirectTo);
      return targetCategory || category;
    }
    return category;
  });

  // Appliquer le tri par priorité
  const sortPriority = networkConfig.sort_priority || {};
  const sortedCategories = redirectedCategories.sort((a, b) => {
    const priorityA = sortPriority[a.name.toLowerCase()] || 999;
    const priorityB = sortPriority[b.name.toLowerCase()] || 999;
    return priorityA - priorityB;
  });

  return sortedCategories;
};

export const useGetNetworkDisplayName = (networkId: string) => {
  if (networkId === 'all') return 'Tout';
  
  const network = TEMP_SOCIAL_NETWORKS.find(n => n.id === networkId);
  return network?.display_name || 'Réseau';
}; 