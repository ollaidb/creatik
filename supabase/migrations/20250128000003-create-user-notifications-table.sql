-- Migration pour créer la table des notifications utilisateur
-- Date: 2025-01-28

-- Créer la table user_notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('challenge_reminder', 'comment_reaction', 'publication_reply', 'public_challenge')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  related_id TEXT,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_priority ON user_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_user_notifications_timestamp ON user_notifications(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at);

-- Créer un index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_type ON user_notifications(user_id, type);

-- Créer le trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_user_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_notifications_updated_at
  BEFORE UPDATE ON user_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_user_notifications_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
-- Politique pour permettre aux utilisateurs de voir uniquement leurs propres notifications
CREATE POLICY "Users can view their own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres notifications
CREATE POLICY "Users can create their own notifications" ON user_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres notifications
CREATE POLICY "Users can update their own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres notifications
CREATE POLICY "Users can delete their own notifications" ON user_notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Créer des fonctions utilitaires pour les notifications

-- Fonction pour obtenir le nombre de notifications non lues d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_unread_notifications_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM user_notifications
    WHERE user_id = user_uuid AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les notifications d'un utilisateur par type
CREATE OR REPLACE FUNCTION get_user_notifications_by_type(user_uuid UUID, notification_type TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type TEXT,
  title TEXT,
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN,
  priority TEXT,
  related_id TEXT,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT un.id, un.user_id, un.type, un.title, un.message, un.timestamp,
         un.is_read, un.priority, un.related_id, un.related_type,
         un.created_at, un.updated_at
  FROM user_notifications un
  WHERE un.user_id = user_uuid 
    AND un.type = notification_type
  ORDER BY un.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour marquer toutes les notifications d'un utilisateur comme lues
CREATE OR REPLACE FUNCTION mark_all_user_notifications_as_read(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE user_notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE user_id = user_uuid AND is_read = FALSE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insérer des données d'exemple (optionnel)
INSERT INTO user_notifications (user_id, type, title, message, priority, related_id, related_type) VALUES
  ('00000000-0000-0000-0000-000000000000', 'challenge_reminder', 'Bienvenue sur Creatik !', 'Commencez par créer votre premier défi personnel.', 'medium', NULL, NULL),
  ('00000000-0000-0000-0000-000000000000', 'public_challenge', 'Défi de la semaine', 'Participez au défi "Créativité au quotidien" cette semaine !', 'low', 'public_challenge_1', 'public_challenge')
ON CONFLICT DO NOTHING;

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE user_notifications IS 'Table des notifications utilisateur pour les rappels de défis, réactions aux commentaires, réponses aux publications et défis publics';
COMMENT ON COLUMN user_notifications.type IS 'Type de notification: challenge_reminder, comment_reaction, publication_reply, public_challenge';
COMMENT ON COLUMN user_notifications.priority IS 'Priorité de la notification: low, medium, high';
COMMENT ON COLUMN user_notifications.related_id IS 'ID de l''élément lié (défi, commentaire, publication, etc.)';
COMMENT ON COLUMN user_notifications.related_type IS 'Type de l''élément lié pour la navigation';
COMMENT ON COLUMN user_notifications.timestamp IS 'Horodatage de la notification (peut différer de created_at pour les rappels programmés)';
