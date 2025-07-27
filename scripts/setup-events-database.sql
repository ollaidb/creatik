-- Script de configuration des tables d'événements
-- Exécutez ce script dans votre base de données Supabase

-- 1. Créer la table event_categories si elle n'existe pas
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT '📅',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table daily_events si elle n'existe pas
CREATE TABLE IF NOT EXISTS daily_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    year INTEGER,
    country_code VARCHAR(3),
    category_id UUID REFERENCES event_categories(id),
    person_name VARCHAR(100),
    profession VARCHAR(100),
    image_url VARCHAR(500),
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Colonnes Wikipédia
    wikipedia_title VARCHAR(500),
    wikipedia_url TEXT,
    wikipedia_extract TEXT,
    wikipedia_page_id VARCHAR(50),
    is_from_wikipedia BOOLEAN DEFAULT FALSE,
    last_wikipedia_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_daily_events_date ON daily_events(date);
CREATE INDEX IF NOT EXISTS idx_daily_events_type ON daily_events(event_type);
CREATE INDEX IF NOT EXISTS idx_daily_events_active ON daily_events(is_active);

-- 4. Insérer les catégories d'événements par défaut
INSERT INTO event_categories (name, color, icon) VALUES
    ('Personnalités', '#3B82F6', '👤'),
    ('Événements historiques', '#EF4444', '📜'),
    ('Fériés', '#10B981', '🎉'),
    ('Journées internationales', '#8B5CF6', '🌍'),
    ('Musiciens', '#F59E0B', '🎵'),
    ('Acteurs', '#EC4899', '🎬'),
    ('Écrivains', '#06B6D4', '📚'),
    ('Scientifiques', '#84CC16', '🔬'),
    ('Sportifs', '#F97316', '⚽'),
    ('Politiciens', '#6366F1', '🏛️'),
    ('Artistes', '#A855F7', '🎨')
ON CONFLICT (name) DO NOTHING;

-- 5. Insérer quelques événements d'exemple
INSERT INTO daily_events (event_type, title, description, date, year, person_name, profession, category_id, is_active) VALUES
    ('birthday', 'Anniversaire de Mick Jagger', 'Chanteur et musicien britannique, membre des Rolling Stones', CURRENT_DATE, 1943, 'Mick Jagger', 'Musicien', (SELECT id FROM event_categories WHERE name = 'Musiciens'), true),
    ('birthday', 'Anniversaire de Kate Beckinsale', 'Actrice britannique célèbre pour ses rôles dans Underworld', CURRENT_DATE, 1973, 'Kate Beckinsale', 'Actrice', (SELECT id FROM event_categories WHERE name = 'Acteurs'), true),
    ('death', 'Décès de Jimi Hendrix', 'Guitariste et chanteur américain, légende du rock', CURRENT_DATE, 1970, 'Jimi Hendrix', 'Guitariste', (SELECT id FROM event_categories WHERE name = 'Musiciens'), true),
    ('international_day', 'Journée internationale de la paix', 'Journée dédiée à la promotion de la paix dans le monde', CURRENT_DATE, NULL, NULL, NULL, (SELECT id FROM event_categories WHERE name = 'Journées internationales'), true)
ON CONFLICT (title, date) DO NOTHING;

-- 6. Créer une fonction pour mettre à jour les événements avec des données Wikipédia
CREATE OR REPLACE FUNCTION update_event_with_wikipedia(
    p_event_id UUID,
    p_wikipedia_title VARCHAR(500),
    p_wikipedia_url TEXT,
    p_wikipedia_extract TEXT,
    p_wikipedia_page_id VARCHAR(50)
) RETURNS VOID AS $$
BEGIN
    UPDATE daily_events 
    SET 
        wikipedia_title = p_wikipedia_title,
        wikipedia_url = p_wikipedia_url,
        wikipedia_extract = p_wikipedia_extract,
        wikipedia_page_id = p_wikipedia_page_id,
        is_from_wikipedia = TRUE,
        last_wikipedia_update = NOW()
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer une vue pour les événements avec données Wikipédia
CREATE OR REPLACE VIEW popular_wikipedia_events AS
SELECT 
    de.*,
    ec.name as category_name,
    ec.color as category_color,
    ec.icon as category_icon
FROM daily_events de
LEFT JOIN event_categories ec ON de.category_id = ec.id
WHERE de.is_from_wikipedia = TRUE
ORDER BY de.date DESC, de.title;

-- 8. Créer une fonction pour synchroniser les événements avec Wikipédia
CREATE OR REPLACE FUNCTION sync_events_with_wikipedia() RETURNS INTEGER AS $$
DECLARE
    event_count INTEGER := 0;
BEGIN
    -- Cette fonction sera appelée par le script Node.js
    -- Pour l'instant, elle retourne juste le nombre d'événements actifs
    SELECT COUNT(*) INTO event_count FROM daily_events WHERE is_active = TRUE;
    RETURN event_count;
END;
$$ LANGUAGE plpgsql;

-- 9. Créer des politiques RLS (Row Level Security) si nécessaire
ALTER TABLE daily_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des événements actifs
CREATE POLICY "Allow public read access to active events" ON daily_events
    FOR SELECT USING (is_active = TRUE);

-- Politique pour permettre la lecture publique des catégories
CREATE POLICY "Allow public read access to event categories" ON event_categories
    FOR SELECT USING (TRUE);

-- 10. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_events_updated_at BEFORE UPDATE ON daily_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON event_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Configuration des tables d''événements terminée avec succès!';
    RAISE NOTICE 'Tables créées: event_categories, daily_events';
    RAISE NOTICE 'Index créés pour optimiser les performances';
    RAISE NOTICE 'Catégories par défaut insérées';
    RAISE NOTICE 'Événements d''exemple insérés';
    RAISE NOTICE 'Fonctions et vues créées pour l''intégration Wikipédia';
END $$; 