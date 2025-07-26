-- Script pour créer les tables du système "Quoi poster aujourd'hui"
-- Exécutez ce script dans votre base de données Supabase

-- Table des catégories d'événements
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- couleur hexadécimale
    icon VARCHAR(50) DEFAULT '📅',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements quotidiens
CREATE TABLE IF NOT EXISTS daily_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('birthday', 'death', 'historical_event', 'holiday', 'international_day')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL, -- date de l'événement (jour/mois)
    year INTEGER, -- année de naissance/décès/événement
    country_code VARCHAR(3), -- code pays ISO (FR, US, etc.)
    category_id UUID REFERENCES event_categories(id),
    person_name VARCHAR(100), -- pour anniversaires/décès
    profession VARCHAR(100), -- métier/profession
    image_url VARCHAR(500),
    tags TEXT[], -- hashtags associés
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(date);
CREATE INDEX IF NOT EXISTS idx_daily_events_type ON daily_events(event_type);
CREATE INDEX IF NOT EXISTS idx_daily_events_country ON daily_events(country_code);
CREATE INDEX IF NOT EXISTS idx_daily_events_category ON daily_events(category_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_categories_updated_at 
    BEFORE UPDATE ON event_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_events_updated_at 
    BEFORE UPDATE ON daily_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_events ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access to event_categories" ON event_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to daily_events" ON daily_events
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion/update par les admins
CREATE POLICY "Allow admin insert on event_categories" ON event_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update on event_categories" ON event_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert on daily_events" ON daily_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update on daily_events" ON daily_events
    FOR UPDATE USING (auth.role() = 'authenticated'); 