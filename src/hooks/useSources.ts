import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Source {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  created_at: string;
}

export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors du chargement des sources:', error);
        throw error;
      }
      
      return (data || []) as Source[];
    },
    enabled: true,
    // Optimisation des performances
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false
  });
}; 