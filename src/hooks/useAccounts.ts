import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

export interface Account {
  id: string;
  account_name: string;
  description?: string;
  platform?: string;
  account_url?: string;
  avatar_url?: string;
  category?: string;
  subcategory?: string;
  created_at?: string;
  updated_at?: string;
}

// Fonction pour générer un avatar par défaut basé sur la plateforme
const getDefaultAvatar = (platform: string, name: string): string => {
  const PLATFORM_COLORS: Record<string, string> = {
    'TikTok': '#000000',
    'Instagram': '#E4405F',
    'YouTube': '#FF0000',
    'Twitter': '#1DA1F2',
    'Facebook': '#1877F2',
    'LinkedIn': '#0077B5',
    'Twitch': '#9146FF',
    'Blog': '#FF6B35',
    'Article': '#2E8B57'
  };

  const color = PLATFORM_COLORS[platform] || '#6B7280';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${color}" rx="20"/>
      <text x="20" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
            text-anchor="middle" fill="white">${initials}</text>
    </svg>
  `)}`;
};

export const useAccounts = (networkId?: string) => {
  return useQuery({
    queryKey: ['exemplary_accounts', networkId],
    queryFn: async (): Promise<Account[]> => {
      try {
        let query = (supabase as SupabaseClient)
          .from('exemplary_accounts')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtrer par réseau social si spécifié
        if (networkId && networkId !== 'all') {
          query = query.eq('social_network_id', networkId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erreur lors du chargement des comptes:', error);
          return [];
        }

        // Transformer les données pour correspondre à notre interface Account
        const accountsWithAvatars = (data || []).map((account: { id: string; account_name: string; description?: string; platform?: string; account_url?: string; avatar_url?: string; category?: string; subcategory?: string; created_at?: string; updated_at?: string }) => ({
          id: account.id,
          account_name: account.account_name,
          description: account.description,
          platform: account.platform,
          account_url: account.account_url,
          avatar_url: account.avatar_url || getDefaultAvatar(account.platform || 'Autre', account.account_name),
          category: account.category,
          subcategory: account.subcategory,
          created_at: account.created_at,
          updated_at: account.updated_at
        }));

        return accountsWithAvatars as Account[];
      } catch (error) {
        console.error('Erreur lors du chargement des comptes:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}; 