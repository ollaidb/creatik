import { supabase } from '../integrations/supabase/client';

export interface UserSocialAccount {
  id: string;
  user_id: string;
  platform: string;
  username?: string;
  display_name?: string;
  profile_url?: string;
  is_active: boolean;
  custom_name?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSocialPost {
  id: string;
  user_id: string;
  social_account_id: string;
  title: string;
  content?: string;
  scheduled_date?: string;
  published_date?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  engagement_data?: any;
  created_at: string;
  updated_at: string;
}

export interface UserContentPlaylist {
  id: string;
  user_id: string;
  social_network_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  color: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PlaylistPost {
  id: string;
  playlist_id: string;
  post_id: string;
  position: number;
  added_at: string;
}

export class UserProfileService {
  // ===== RÉSEAUX SOCIAUX =====
  
  static async getSocialAccounts(userId: string): Promise<UserSocialAccount[]> {
    console.log('🔍 Récupération des comptes sociaux pour l\'utilisateur:', userId);
    
    const { data, error } = await supabase
      .from('user_social_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('❌ Erreur lors de la récupération des comptes sociaux:', error);
      throw error;
    }
    
    console.log('✅ Comptes sociaux récupérés:', data?.length || 0, data);
    return data || [];
  }

  static async addSocialAccount(account: Omit<UserSocialAccount, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<UserSocialAccount> {
    // Récupérer le nombre de comptes existants pour calculer l'ordre
    const { count } = await supabase
      .from('user_social_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', account.user_id)
      .eq('is_active', true);

    const newOrder = (count || 0) + 1;

    const { data, error } = await supabase
      .from('user_social_accounts')
      .insert({
        ...account,
        order: newOrder
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSocialAccount(id: string, updates: Partial<UserSocialAccount>): Promise<UserSocialAccount> {
    const { data, error } = await supabase
      .from('user_social_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSocialAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_social_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ===== PUBLICATIONS =====
  
  static async getSocialPosts(userId: string): Promise<UserSocialPost[]> {
    const { data, error } = await supabase
      .from('user_social_posts')
      .select(`
        *,
        user_social_accounts!inner(platform, username, display_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }



  static async addSocialPost(post: Omit<UserSocialPost, 'id' | 'created_at' | 'updated_at'>): Promise<UserSocialPost> {
    const { data, error } = await supabase
      .from('user_social_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSocialPost(id: string, updates: Partial<UserSocialPost>): Promise<UserSocialPost> {
    const { data, error } = await supabase
      .from('user_social_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSocialPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_social_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ===== PLAYLISTS =====
  
  static async getPlaylists(userId: string): Promise<UserContentPlaylist[]> {
    try {
      // Récupérer les playlists sans jointure pour éviter les conflits de colonnes
      const { data, error } = await supabase
        .from('user_content_playlists')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des playlists:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists:', error);
      return [];
    }
  }

  static async getPlaylistsBySocialNetwork(userId: string, socialNetworkId: string): Promise<UserContentPlaylist[]> {
    try {
      // Récupérer les playlists sans jointure pour éviter les conflits de colonnes
      const { data, error } = await supabase
        .from('user_content_playlists')
        .select('*')
        .eq('user_id', userId)
        .eq('social_network_id', socialNetworkId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des playlists par réseau:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists par réseau:', error);
      return [];
    }
  }

  static async addPlaylist(playlist: Omit<UserContentPlaylist, 'id' | 'created_at' | 'updated_at'>): Promise<UserContentPlaylist> {
    const { data, error } = await supabase
      .from('user_content_playlists')
      .insert(playlist)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePlaylist(id: string, updates: Partial<UserContentPlaylist>): Promise<UserContentPlaylist> {
    const { data, error } = await supabase
      .from('user_content_playlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePlaylist(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_content_playlists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ===== GESTION PLAYLIST-POSTS =====
  
  static async addPostToPlaylist(playlistId: string, postId: string, position?: number): Promise<PlaylistPost> {
    const { data, error } = await supabase
      .from('playlist_posts')
      .insert({
        playlist_id: playlistId,
        post_id: postId,
        position: position || 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removePostFromPlaylist(playlistId: string, postId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_posts')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('post_id', postId);

    if (error) throw error;
  }

  static async getPlaylistPosts(playlistId: string): Promise<(PlaylistPost & { user_social_posts: UserSocialPost })[]> {
    const { data, error } = await supabase
      .from('playlist_posts')
      .select(`
        *,
        user_social_posts!inner(*)
      `)
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // ===== DONNÉES AGGREGÉES =====
  
  static async getUserProfileData(userId: string) {
    const [socialAccounts, socialPosts, playlists] = await Promise.all([
      this.getSocialAccounts(userId),
      this.getSocialPosts(userId),
      this.getPlaylists(userId)
    ]);

    return {
      socialAccounts,
      socialPosts,
      playlists,
      stats: {
        totalPosts: socialPosts.length,
        totalPlaylists: playlists.length,
        totalSocialAccounts: socialAccounts.length
      }
    };
  }
}
