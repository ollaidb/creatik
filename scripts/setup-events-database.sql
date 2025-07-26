-- Script complet pour configurer la base de données des événements
-- Exécutez ce script dans votre base de données Supabase

-- 1. Créer les tables
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

-- 2. Ajouter les catégories
-- Supprimer les anciennes catégories pour éviter les doublons
DELETE FROM event_categories;

-- Insérer les catégories d'événements
INSERT INTO event_categories (id, name, color, icon, created_at) VALUES
-- Célébrités et personnalités
('550e8400-e29b-41d4-a716-446655440201', 'Célébrités', '#FF6B6B', '⭐', NOW()),
('550e8400-e29b-41d4-a716-446655440202', 'Artistes', '#4ECDC4', '🎨', NOW()),
('550e8400-e29b-41d4-a716-446655440203', 'Musiciens', '#45B7D1', '🎵', NOW()),
('550e8400-e29b-41d4-a716-446655440204', 'Acteurs', '#96CEB4', '🎭', NOW()),
('550e8400-e29b-41d4-a716-446655440205', 'Écrivains', '#FFEAA7', '📚', NOW()),
('550e8400-e29b-41d4-a716-446655440206', 'Scientifiques', '#DDA0DD', '🔬', NOW()),
('550e8400-e29b-41d4-a716-446655440207', 'Politiciens', '#98D8C8', '🏛️', NOW()),
('550e8400-e29b-41d4-a716-446655440208', 'Sportifs', '#F7DC6F', '⚽', NOW()),
('550e8400-e29b-41d4-a716-446655440209', 'Entrepreneurs', '#BB8FCE', '💼', NOW()),
('550e8400-e29b-41d4-a716-446655440210', 'Chefs cuisiniers', '#85C1E9', '👨‍🍳', NOW()),

-- Histoire et événements
('550e8400-e29b-41d4-a716-446655440211', 'Histoire', '#E74C3C', '📜', NOW()),
('550e8400-e29b-41d4-a716-446655440212', 'Guerres', '#8E44AD', '⚔️', NOW()),
('550e8400-e29b-41d4-a716-446655440213', 'Découvertes', '#27AE60', '🔍', NOW()),
('550e8400-e29b-41d4-a716-446655440214', 'Inventions', '#F39C12', '💡', NOW()),
('550e8400-e29b-41d4-a716-446655440215', 'Révolution', '#E67E22', '🔥', NOW()),
('550e8400-e29b-41d4-a716-446655440216', 'Traité', '#3498DB', '📋', NOW()),
('550e8400-e29b-41d4-a716-446655440217', 'Indépendance', '#2ECC71', '🏁', NOW()),
('550e8400-e29b-41d4-a716-446655440218', 'Premier vol', '#9B59B6', '✈️', NOW()),
('550e8400-e29b-41d4-a716-446655440219', 'Première émission', '#1ABC9C', '📺', NOW()),
('550e8400-e29b-41d4-a716-446655440220', 'Premier film', '#34495E', '🎬', NOW()),

-- Fériés et célébrations
('550e8400-e29b-41d4-a716-446655440221', 'Fériés français', '#E74C3C', '🇫🇷', NOW()),
('550e8400-e29b-41d4-a716-446655440222', 'Fériés internationaux', '#3498DB', '🌍', NOW()),
('550e8400-e29b-41d4-a716-446655440223', 'Religieux', '#F1C40F', '⛪', NOW()),
('550e8400-e29b-41d4-a716-446655440224', 'Civiques', '#2ECC71', '🏛️', NOW()),
('550e8400-e29b-41d4-a716-446655440225', 'Commerciales', '#E67E22', '🛒', NOW()),

-- Journées internationales
('550e8400-e29b-41d4-a716-446655440226', 'Droits humains', '#E74C3C', '🤝', NOW()),
('550e8400-e29b-41d4-a716-446655440227', 'Environnement', '#27AE60', '🌱', NOW()),
('550e8400-e29b-41d4-a716-446655440228', 'Santé', '#3498DB', '🏥', NOW()),
('550e8400-e29b-41d4-a716-446655440229', 'Éducation', '#F39C12', '📚', NOW()),
('550e8400-e29b-41d4-a716-446655440230', 'Culture', '#9B59B6', '🎭', NOW()),
('550e8400-e29b-41d4-a716-446655440231', 'Science', '#34495E', '🔬', NOW()),
('550e8400-e29b-41d4-a716-446655440232', 'Sport', '#2ECC71', '⚽', NOW()),
('550e8400-e29b-41d4-a716-446655440233', 'Technologie', '#1ABC9C', '💻', NOW()),
('550e8400-e29b-41d4-a716-446655440234', 'Médias', '#E67E22', '📰', NOW()),
('550e8400-e29b-41d4-a716-446655440235', 'Alimentation', '#F1C40F', '🍽️', NOW());

-- 3. Ajouter des événements d'exemple pour aujourd'hui et les prochains jours
-- Supprimer les anciens événements pour éviter les doublons
DELETE FROM daily_events;

-- Événements pour aujourd'hui (26 juillet 2024)
INSERT INTO daily_events (id, event_type, title, description, date, year, person_name, profession, category_id, tags, country_code) VALUES
-- Anniversaires
('550e8400-e29b-41d4-a716-446655440801', 'birthday', 'Anniversaire de Mick Jagger', 'Chanteur et musicien britannique, membre des Rolling Stones', '1943-07-26', 1943, 'Mick Jagger', 'Musicien', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Rock', '#RollingStones', '#Musique'], 'GB'),
('550e8400-e29b-41d4-a716-446655440802', 'birthday', 'Anniversaire de Kate Beckinsale', 'Actrice britannique', '1973-07-26', 1973, 'Kate Beckinsale', 'Actrice', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Cinéma', '#Actrice', '#Hollywood'], 'GB'),
('550e8400-e29b-41d4-a716-446655440803', 'birthday', 'Anniversaire de Sandra Bullock', 'Actrice américaine', '1964-07-26', 1964, 'Sandra Bullock', 'Actrice', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Cinéma', '#Actrice', '#Hollywood'], 'US'),

-- Décès
('550e8400-e29b-41d4-a716-446655440804', 'death', 'Décès de Jimi Hendrix', 'Guitariste et chanteur américain', '1970-07-26', 1970, 'Jimi Hendrix', 'Guitariste', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Rock', '#Guitare', '#Musique'], 'US'),

-- Événements historiques
('550e8400-e29b-41d4-a716-446655440805', 'historical_event', 'Déclaration d\'indépendance du Libéria', 'Le Libéria devient le premier pays africain indépendant', '1847-07-26', 1847, '550e8400-e29b-41d4-a716-446655440217', ARRAY['#Indépendance', '#Afrique', '#Libéria'], 'LR'),

-- Journées internationales
('550e8400-e29b-41d4-a716-446655440806', 'international_day', 'Journée internationale de la paix', 'Journée dédiée à la promotion de la paix dans le monde', '1900-07-26', '550e8400-e29b-41d4-a716-446655440226', ARRAY['#Paix', '#Monde', '#Solidarité']);

-- Événements pour demain (27 juillet 2024)
INSERT INTO daily_events (id, event_type, title, description, date, year, person_name, profession, category_id, tags, country_code) VALUES
-- Anniversaires
('550e8400-e29b-41d4-a716-446655440807', 'birthday', 'Anniversaire de Maya Angelou', 'Poétesse et écrivaine américaine', '1928-07-27', 1928, 'Maya Angelou', 'Écrivaine', '550e8400-e29b-41d4-a716-446655440205', ARRAY['#Poésie', '#Littérature', '#Féminisme'], 'US'),
('550e8400-e29b-41d4-a716-446655440808', 'birthday', 'Anniversaire de Don Mattingly', 'Joueur de baseball américain', '1961-07-27', 1961, 'Don Mattingly', 'Sportif', '550e8400-e29b-41d4-a716-446655440208', ARRAY['#Baseball', '#Sport', '#MLB'], 'US'),

-- Événements historiques
('550e8400-e29b-41d4-a716-446655440809', 'historical_event', 'Premier vol commercial', 'Premier vol commercial de l\'histoire', '1914-07-27', 1914, '550e8400-e29b-41d4-a716-446655440218', ARRAY['#Aviation', '#Transport', '#Innovation'], 'US');

-- Événements pour après-demain (28 juillet 2024)
INSERT INTO daily_events (id, event_type, title, description, date, year, person_name, profession, category_id, tags, country_code) VALUES
-- Anniversaires
('550e8400-e29b-41d4-a716-446655440810', 'birthday', 'Anniversaire de Jacqueline Kennedy Onassis', 'Première dame américaine', '1929-07-28', 1929, 'Jacqueline Kennedy Onassis', 'Première dame', '550e8400-e29b-41d4-a716-446655440207', ARRAY['#Politique', '#PremièreDame', '#Histoire'], 'US'),

-- Événements historiques
('550e8400-e29b-41d4-a716-446655440811', 'historical_event', 'Première guerre mondiale', 'Déclaration de guerre de l\'Autriche-Hongrie à la Serbie', '1914-07-28', 1914, '550e8400-e29b-41d4-a716-446655440212', ARRAY['#Guerre', '#Histoire', '#Europe'], 'AT');

-- Vérifier que tout a été configuré correctement
SELECT 'Configuration terminée!' as info;
SELECT 'Catégories créées:' as info, COUNT(*) as count FROM event_categories;
SELECT 'Événements créés:' as info, COUNT(*) as count FROM daily_events;
SELECT 'Événements pour aujourd\'hui:' as info, COUNT(*) as count FROM daily_events WHERE date = CURRENT_DATE; 