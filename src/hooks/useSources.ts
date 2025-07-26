import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Source {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  subcategory?: string;
  created_at: string;
  updated_at: string;
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
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []) as Source[];
    },
    enabled: true,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000
  });
}; 