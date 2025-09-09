import { supabase } from '@/integrations/supabase/client';

export interface UserProgramSettings {
  id: string;
  user_id: string;
  social_account_id: string;
  playlist_id: string | null;
  duration: string;
  contents_per_day: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramSettingsInput {
  social_account_id: string;
  playlist_id: string | null;
  duration: string;
  contents_per_day: number;
}

export class ProgramSettingsService {
  // Récupérer tous les paramètres de programmation d'un utilisateur
  static async getUserProgramSettings(userId: string): Promise<UserProgramSettings[]> {
    const { data, error } = await supabase
      .from('user_program_settings')
      .select(`
        *,
        social_account:user_social_accounts(platform, display_name, username),
        playlist:user_content_playlists(name, color)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des paramètres de programmation:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les paramètres pour un réseau social et une playlist spécifiques
  static async getProgramSettings(
    userId: string, 
    socialAccountId: string, 
    playlistId: string | null
  ): Promise<UserProgramSettings | null> {
    const { data, error } = await supabase
      .from('user_program_settings')
      .select('*')
      .eq('user_id', userId)
      .eq('social_account_id', socialAccountId)
      .eq('playlist_id', playlistId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur lors de la récupération des paramètres:', error);
      throw error;
    }

    return data;
  }

  // Créer ou mettre à jour les paramètres de programmation
  static async upsertProgramSettings(
    userId: string, 
    settings: ProgramSettingsInput
  ): Promise<UserProgramSettings> {
    const { data, error } = await supabase
      .from('user_program_settings')
      .upsert({
        user_id: userId,
        social_account_id: settings.social_account_id,
        playlist_id: settings.playlist_id,
        duration: settings.duration,
        contents_per_day: settings.contents_per_day,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,social_account_id,playlist_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      throw error;
    }

    return data;
  }

  // Supprimer les paramètres de programmation
  static async deleteProgramSettings(
    userId: string, 
    socialAccountId: string, 
    playlistId: string | null
  ): Promise<void> {
    const { error } = await supabase
      .from('user_program_settings')
      .delete()
      .eq('user_id', userId)
      .eq('social_account_id', socialAccountId)
      .eq('playlist_id', playlistId);

    if (error) {
      console.error('Erreur lors de la suppression des paramètres:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de programmation pour un utilisateur
  static async getProgramStats(userId: string): Promise<{
    total_programs: number;
    active_programs: number;
    total_contents_planned: number;
    completed_contents: number;
  }> {
    // Récupérer tous les paramètres de l'utilisateur
    const settings = await this.getUserProgramSettings(userId);
    
    // Calculer les statistiques
    const totalPrograms = settings.length;
    const activePrograms = settings.length; // Tous les programmes sont considérés comme actifs pour l'instant
    
    // Calculer le total de contenus planifiés
    const totalContentsPlanned = settings.reduce((total, setting) => {
      const durationDays = this.getDurationDays(setting.duration);
      return total + (durationDays * setting.contents_per_day);
    }, 0);

    // Pour l'instant, on retourne 0 pour les contenus complétés
    // Plus tard, on pourra lier avec les défis accomplis
    const completedContents = 0;

    return {
      total_programs: totalPrograms,
      active_programs: activePrograms,
      total_contents_planned: totalContentsPlanned,
      completed_contents: completedContents
    };
  }

  // Fonction utilitaire pour convertir la durée en jours
  private static getDurationDays(duration: string): number {
    switch (duration) {
      case '1month': return 30;
      case '2months': return 60;
      case '3months': return 90;
      case '6months': return 180;
      case '1year': return 365;
      case '2years': return 730;
      case '3years': return 1095;
      default: return 90;
    }
  }
}
