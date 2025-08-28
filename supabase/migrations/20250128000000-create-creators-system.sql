-- Migration: Create Creators System
-- Description: Add tables for creators and their social networks

-- 1. Table des créateurs
CREATE TABLE creators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des réseaux sociaux des créateurs
CREATE TABLE creator_social_networks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    social_network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
    username VARCHAR(100),
    profile_url TEXT,
    followers_count INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, social_network_id)
);

-- 3. Table des défis taguant les créateurs
CREATE TABLE creator_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    social_network_id UUID REFERENCES social_networks(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id, creator_id, user_id)
);

-- 4. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_creators_category ON creators(category);
CREATE INDEX IF NOT EXISTS idx_creators_subcategory ON creators(subcategory);
CREATE INDEX IF NOT EXISTS idx_creator_social_networks_creator_id ON creator_social_networks(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_social_networks_network_id ON creator_social_networks(social_network_id);
CREATE INDEX IF NOT EXISTS idx_creator_challenges_creator_id ON creator_challenges(creator_id);

-- 5. Activer RLS
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_challenges ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS pour creators
CREATE POLICY "Creators are viewable by everyone" ON creators
    FOR SELECT USING (true);

CREATE POLICY "Creators are insertable by authenticated users" ON creators
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Creators are updatable by authenticated users" ON creators
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 7. Politiques RLS pour creator_social_networks
CREATE POLICY "Creator social networks are viewable by everyone" ON creator_social_networks
    FOR SELECT USING (true);

CREATE POLICY "Creator social networks are insertable by authenticated users" ON creator_social_networks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 8. Politiques RLS pour creator_challenges
CREATE POLICY "Creator challenges are viewable by everyone" ON creator_challenges
    FOR SELECT USING (true);

CREATE POLICY "Creator challenges are insertable by authenticated users" ON creator_challenges
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 9. Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_creators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_creators_updated_at 
    BEFORE UPDATE ON creators 
    FOR EACH ROW EXECUTE FUNCTION update_creators_updated_at();
