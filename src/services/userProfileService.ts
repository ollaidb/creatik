import { supabase } from '../integrations/supabase/client';

export interface UserSocialAccount {
  id: string;
  user_id: string;
  platform: string;
  username?: string;
  display_name?: string;
  profile_url?: string;
  is_active: boolean;
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
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Erreur lors de la récupération des comptes sociaux:', error);
      throw error;
    }
    
    console.log('✅ Comptes sociaux récupérés:', data?.length || 0, data);
    return data || [];
  }

  static async addSocialAccount(account: Omit<UserSocialAccount, 'id' | 'created_at' | 'updated_at'>): Promise<UserSocialAccount> {
    const { data, error } = await supabase
      .from('user_social_accounts')
      .insert(account)
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

  // Récupérer les publications d'une playlist spécifique
  static async getPlaylistPosts(playlistId: string): Promise<UserSocialPost[]> {
    const { data, error } = await supabase
      .from('playlist_posts')
      .select(`
        position,
        added_at,
        user_social_posts!inner(
          *,
          user_social_accounts!inner(platform, username, display_name)
        )
      `)
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (error) throw error;
    
    // Extraire les publications de la structure de réponse
    return data?.map(item => item.user_social_posts) || [];
  }

  // Ajouter une publication à une playlist
  static async addPostToPlaylist(playlistId: string, postId: string, position?: number): Promise<void> {
    const { error } = await supabase
      .from('playlist_posts')
      .insert({
        playlist_id: playlistId,
        post_id: postId,
        position: position || 0
      });

    if (error) throw error;
  }

  // Retirer une publication d'une playlist
  static async removePostFromPlaylist(playlistId: string, postId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_posts')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('post_id', postId);

    if (error) throw error;
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
      const { data, error } = await supabase
        .from('user_content_playlists')
        .select(`
          *,
          user_social_accounts!inner(platform, display_name, username)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des playlists avec jointure:', error);
        // Fallback: récupérer les playlists sans la jointure
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_content_playlists')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        
        if (fallbackError) throw fallbackError;
        return fallbackData || [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists:', error);
      return [];
    }
  }

  static async getPlaylistsBySocialNetwork(userId: string, socialNetworkId: string): Promise<UserContentPlaylist[]> {
    try {
      const { data, error } = await supabase
        .from('user_content_playlists')
        .select(`
          *,
          user_social_accounts!inner(platform, display_name, username)
        `)
        .eq('user_id', userId)
        .eq('social_network_id', socialNetworkId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des playlists par réseau avec jointure:', error);
        // Fallback: récupérer les playlists sans la jointure
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_content_playlists')
          .select('*')
          .eq('user_id', userId)
          .eq('social_network_id', socialNetworkId)
          .order('created_at', { ascending: true });
        
        if (fallbackError) throw fallbackError;
        return fallbackData || [];
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
