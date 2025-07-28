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
  { id: 'twitch', name: 'twitch', display_name: 'Twitch', description: 'Streaming et gaming', icon_url: '/icons/twitch.svg', color_theme: '#9146FF', is_active: true, created_at: '', updated_at: '' },
  { id: 'linkedin', name: 'linkedin', display_name: 'LinkedIn', description: 'Réseau professionnel', icon_url: '/icons/linkedin.svg', color_theme: '#0077B5', is_active: true, created_at: '', updated_at: '' }
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
      // Pour l'instant, retourner les données temporaires
      // Plus tard, on utilisera la vraie table
      return TEMP_SOCIAL_NETWORKS;
    },
  });
};

export const useFilterCategoriesByNetwork = (categories: Category[], networkId: string) => {
  if (networkId === 'all') {
    return categories;
  }

  const networkFilter = NETWORK_FILTERS[networkId];
  if (!networkFilter) {
    return categories;
  }

  // Filtrer les catégories masquées
  const filteredCategories = categories.filter(category => {
    return !networkFilter.hidden.includes(category.name.toLowerCase());
  });

  // Appliquer les redirections
  const redirectedCategories = filteredCategories.map(category => {
    const redirectTo = networkFilter.redirects[category.name.toLowerCase()];
    if (redirectTo) {
      const targetCategory = categories.find(c => c.name.toLowerCase() === redirectTo);
      return targetCategory || category;
    }
    return category;
  });

  return redirectedCategories;
};

export const useGetNetworkDisplayName = (networkId: string) => {
  if (networkId === 'all') return 'Tout';
  
  const network = TEMP_SOCIAL_NETWORKS.find(n => n.id === networkId);
  return network?.display_name || 'Réseau';
}; 