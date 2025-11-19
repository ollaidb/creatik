import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExempleMedia {
  id: string;
  subcategory_id?: string;
  subcategory_level2_id?: string;
  title: string;
  description?: string;
  media_type: 'image' | 'video';
  media_url?: string | null;
  media_data?: string | null; // Données base64
  thumbnail_url?: string | null;
  thumbnail_data?: string | null; // Données base64 de la miniature
  media_mime_type?: string | null; // Type MIME (ex: image/jpeg, video/mp4)
  creator_name?: string;
  creator_url?: string;
  platform?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useExemplesMedia(
  subcategoryId?: string,
  subcategoryLevel2Id?: string,
  platform?: string
) {
  return useQuery({
    queryKey: ['exemples-media', subcategoryId, subcategoryLevel2Id, platform],
    queryFn: async () => {
      console.log('🔍 Chargement des exemples média:', { 
        subcategoryId, 
        subcategoryLevel2Id, 
        platform 
      });
      
      let query = supabase
        .from('content_exemples_media')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      // Filtrer par sous-catégorie niveau 1 ou niveau 2
      if (subcategoryLevel2Id) {
        query = query.eq('subcategory_level2_id', subcategoryLevel2Id);
      } else if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }

      if (platform && platform !== 'all') {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors du chargement des exemples média:', error);
        // Si la table n'existe pas encore, retourner un objet vide au lieu de throw
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('⚠️ La table content_exemples_media n\'existe pas encore. Exécutez le script SQL create-exemples-media-table.sql');
          return {
            all: [],
            images: [],
            videos: [],
          };
        }
        throw error;
      }

      console.log('✅ Exemples média chargés:', data?.length || 0, data);
      
      // Séparer les images et vidéos
      const images = (data || []).filter((item) => item.media_type === 'image');
      const videos = (data || []).filter((item) => item.media_type === 'video');
      
      return {
        all: data as ExempleMedia[] || [],
        images: images as ExempleMedia[] || [],
        videos: videos as ExempleMedia[] || [],
      };
    },
    enabled: !!(subcategoryId || subcategoryLevel2Id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
}

