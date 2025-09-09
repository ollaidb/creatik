import { supabase } from '../integrations/supabase/client';

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

export class SocialNetworksService {
  // Récupérer tous les réseaux sociaux de l'application
  static async getAllSocialNetworks(): Promise<SocialNetwork[]> {
    try {
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .eq('is_active', true)
        .neq('name', 'all')
        .order('display_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réseaux sociaux:', error);
      // Retourner la liste par défaut en cas d'erreur
      return this.getDefaultSocialNetworks();
    }
  }

  // Liste par défaut des réseaux sociaux (fallback)
  static getDefaultSocialNetworks(): SocialNetwork[] {
    return [
      { id: 'tiktok', name: 'tiktok', display_name: 'TikTok', description: 'Vidéos courtes et tendances', is_active: true, created_at: '', updated_at: '' },
      { id: 'youtube', name: 'youtube', display_name: 'YouTube', description: 'Vidéos longues et chaînes', is_active: true, created_at: '', updated_at: '' },
      { id: 'instagram', name: 'instagram', display_name: 'Instagram', description: 'Contenu visuel et stories', is_active: true, created_at: '', updated_at: '' },
      { id: 'facebook', name: 'facebook', display_name: 'Facebook', description: 'Posts et groupes', is_active: true, created_at: '', updated_at: '' },
      { id: 'twitter', name: 'twitter', display_name: 'Twitter', description: 'Micro-blogging et threads', is_active: true, created_at: '', updated_at: '' },
      { id: 'twitch', name: 'twitch', display_name: 'Twitch', description: 'Streaming et gaming', is_active: true, created_at: '', updated_at: '' },
      { id: 'linkedin', name: 'linkedin', display_name: 'LinkedIn', description: 'Réseau professionnel', is_active: true, created_at: '', updated_at: '' },
      { id: 'blog', name: 'blog', display_name: 'Blog', description: 'Articles de blog et contenus longs', is_active: true, created_at: '', updated_at: '' },
      { id: 'article', name: 'article', display_name: 'Article', description: 'Articles et contenus rédactionnels', is_active: true, created_at: '', updated_at: '' }
    ];
  }
}
