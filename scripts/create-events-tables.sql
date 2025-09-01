-- Script pour créer les tables d'événements
-- Création des tables daily_events et event_categories

-- 1. Créer la table daily_events
CREATE TABLE IF NOT EXISTS public.daily_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    year INTEGER,
    person_name VARCHAR(255),
    profession VARCHAR(255),
    category VARCHAR(100),
    wikipedia_title VARCHAR(255),
    wikipedia_url TEXT,
    wikipedia_extract TEXT,
    is_from_wikipedia BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table event_categories
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT '📅',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_daily_events_date ON public.daily_events(date);
CREATE INDEX IF NOT EXISTS idx_daily_events_category ON public.daily_events(category);
CREATE INDEX IF NOT EXISTS idx_daily_events_active ON public.daily_events(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_events_person ON public.daily_events(person_name);

-- 4. Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_events_updated_at 
    BEFORE UPDATE ON public.daily_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_categories_updated_at 
    BEFORE UPDATE ON public.event_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Activer RLS
ALTER TABLE public.daily_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- 6. Créer les politiques RLS
-- Politique pour daily_events : lecture publique, écriture pour utilisateurs authentifiés
DROP POLICY IF EXISTS "daily_events_read_policy" ON public.daily_events;
CREATE POLICY "daily_events_read_policy" ON public.daily_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "daily_events_insert_policy" ON public.daily_events;
CREATE POLICY "daily_events_insert_policy" ON public.daily_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "daily_events_update_policy" ON public.daily_events;
CREATE POLICY "daily_events_update_policy" ON public.daily_events
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "daily_events_delete_policy" ON public.daily_events;
CREATE POLICY "daily_events_delete_policy" ON public.daily_events
    FOR DELETE USING (auth.role() = 'authenticated');

-- Politique pour event_categories : lecture publique, écriture pour utilisateurs authentifiés
DROP POLICY IF EXISTS "event_categories_read_policy" ON public.event_categories;
CREATE POLICY "event_categories_read_policy" ON public.event_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "event_categories_insert_policy" ON public.event_categories;
CREATE POLICY "event_categories_insert_policy" ON public.event_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "event_categories_update_policy" ON public.event_categories;
CREATE POLICY "event_categories_update_policy" ON public.event_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "event_categories_delete_policy" ON public.event_categories;
CREATE POLICY "event_categories_delete_policy" ON public.event_categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Insérer des données d'exemple pour event_categories
INSERT INTO public.event_categories (name, color, icon) VALUES
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

-- 8. Insérer quelques événements d'exemple
INSERT INTO public.daily_events (event_type, title, description, date, year, person_name, profession, category, is_active) VALUES
    ('naissance', 'Naissance de Marie Curie', 'Physicienne et chimiste polonaise naturalisée française, pionnière de l''étude de la radioactivité', '1867-11-07', 1867, 'Marie Curie', 'Scientifique', 'Scientifiques', true),
    ('naissance', 'Naissance de Claude Monet', 'Peintre français, l''un des fondateurs de l''impressionnisme', '1840-11-14', 1840, 'Claude Monet', 'Artiste', 'Artistes', true),
    ('naissance', 'Naissance de Victor Hugo', 'Écrivain français, auteur de "Les Misérables" et "Notre-Dame de Paris"', '1802-02-26', 1802, 'Victor Hugo', 'Écrivain', 'Écrivains', true),
    ('evenement', 'Armistice de 1918', 'Signature de l''armistice mettant fin à la Première Guerre mondiale', '1918-11-11', 1918, NULL, NULL, 'Événements historiques', true),
    ('naissance', 'Naissance de Louis Pasteur', 'Scientifique français, fondateur de la microbiologie', '1822-12-27', 1822, 'Louis Pasteur', 'Scientifique', 'Scientifiques', true)
ON CONFLICT DO NOTHING;

-- 9. Vérifier que tout fonctionne
SELECT 'Tables créées avec succès' as status;
SELECT COUNT(*) as total_events FROM public.daily_events;
SELECT COUNT(*) as total_categories FROM public.event_categories; 