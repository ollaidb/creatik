import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

interface Source {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  created_at: string;
}

export const useSources = (networkId?: string) => {
  return useQuery({
    queryKey: ['sources', networkId],
    queryFn: async () => {
      let query = (supabase as SupabaseClient)
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filtrer par réseau social si spécifié
      if (networkId && networkId !== 'all') {
        query = query.eq('social_network_id', networkId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors du chargement des sources:', error);
        throw error;
      }
      
      return (data || []) as Source[];
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