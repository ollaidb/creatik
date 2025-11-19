import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExempleMedia } from './useExemplesMedia';

export function useAllExemplesMedia() {
  return useQuery({
    queryKey: ['all-exemples-media'],
    queryFn: async () => {
      console.log('🔍 Chargement de tous les exemples média...');
      
      const { data, error } = await supabase
        .from('content_exemples_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors du chargement des exemples média:', error);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('⚠️ La table content_exemples_media n\'existe pas encore.');
          return {
            all: [],
            images: [],
            videos: [],
          };
        }
        throw error;
      }

      console.log('✅ Tous les exemples média chargés:', data?.length || 0);
      
      // Séparer les images et vidéos
      const images = (data || []).filter((item) => item.media_type === 'image');
      const videos = (data || []).filter((item) => item.media_type === 'video');
      
      return {
        all: data as ExempleMedia[] || [],
        images: images as ExempleMedia[] || [],
        videos: videos as ExempleMedia[] || [],
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
}

