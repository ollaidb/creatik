-- Créer la table pour les paramètres de programmation par réseau/playlist
CREATE TABLE IF NOT EXISTS user_program_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES user_social_accounts(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES user_content_playlists(id) ON DELETE CASCADE,
  duration VARCHAR(20) NOT NULL DEFAULT '3months',
  contents_per_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, social_account_id, playlist_id)
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_program_settings_user_id ON user_program_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_program_settings_social_account ON user_program_settings(social_account_id);
CREATE INDEX IF NOT EXISTS idx_user_program_settings_playlist ON user_program_settings(playlist_id);

-- Activer RLS
ALTER TABLE user_program_settings ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour que les utilisateurs ne voient que leurs propres paramètres
CREATE POLICY "Users can view their own program settings" ON user_program_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own program settings" ON user_program_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own program settings" ON user_program_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own program settings" ON user_program_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_user_program_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_user_program_settings_updated_at
  BEFORE UPDATE ON user_program_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_program_settings_updated_at();

-- Commentaires sur la table
COMMENT ON TABLE user_program_settings IS 'Paramètres de programmation des défis par réseau social et playlist';
COMMENT ON COLUMN user_program_settings.duration IS 'Durée du programme (1month, 2months, 3months, 6months, 1year, 2years, 3years)';
COMMENT ON COLUMN user_program_settings.contents_per_day IS 'Nombre de contenus à créer par jour';
