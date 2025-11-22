-- Migration: Create Social Networks System
-- Description: Add tables for social networks, network configurations, and mappings

-- 1. Table des réseaux sociaux
CREATE TABLE social_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  color_theme VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table de configuration par réseau
CREATE TABLE network_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
  priority_categories TEXT[], -- Array des IDs de catégories prioritaires
  hidden_categories TEXT[], -- Array des IDs de catégories masquées
  redirect_mappings JSONB, -- {"source_category_id": "target_category_id"}
  sort_priority JSONB, -- {"category_id": priority_number}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(network_id)
);

-- 3. Table de mapping réseau-catégories
CREATE TABLE network_category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  redirect_to_category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(network_id, category_id)
);

-- 4. Table de mapping réseau-thèmes
CREATE TABLE network_theme_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  redirect_to_theme_id UUID REFERENCES themes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(network_id, theme_id)
);

-- 5. Table des préférences utilisateur par réseau
CREATE TABLE user_network_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
  sort_order VARCHAR(20) DEFAULT 'priority', -- 'priority', 'alphabetical', 'recent'
  last_selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, network_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_network_category_mappings_network_id ON network_category_mappings(network_id);
CREATE INDEX idx_network_category_mappings_category_id ON network_category_mappings(category_id);
CREATE INDEX idx_network_theme_mappings_network_id ON network_theme_mappings(network_id);
CREATE INDEX idx_network_theme_mappings_theme_id ON network_theme_mappings(theme_id);
CREATE INDEX idx_user_network_preferences_user_id ON user_network_preferences(user_id);
CREATE INDEX idx_user_network_preferences_network_id ON user_network_preferences(network_id);

-- RLS Policies
ALTER TABLE social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_theme_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_network_preferences ENABLE ROW LEVEL SECURITY;

-- Policies pour social_networks (lecture publique)
CREATE POLICY "social_networks_select_policy" ON social_networks
  FOR SELECT USING (true);

-- Policies pour network_configurations (lecture publique)
CREATE POLICY "network_configurations_select_policy" ON network_configurations
  FOR SELECT USING (true);

-- Policies pour network_category_mappings (lecture publique)
CREATE POLICY "network_category_mappings_select_policy" ON network_category_mappings
  FOR SELECT USING (true);

-- Policies pour network_theme_mappings (lecture publique)
CREATE POLICY "network_theme_mappings_select_policy" ON network_theme_mappings
  FOR SELECT USING (true);

-- Policies pour user_network_preferences (lecture/écriture par utilisateur)
CREATE POLICY "user_network_preferences_select_policy" ON user_network_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_network_preferences_insert_policy" ON user_network_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_network_preferences_update_policy" ON user_network_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_network_preferences_delete_policy" ON user_network_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_social_networks_updated_at BEFORE UPDATE ON social_networks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_configurations_updated_at BEFORE UPDATE ON network_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_network_preferences_updated_at BEFORE UPDATE ON user_network_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 