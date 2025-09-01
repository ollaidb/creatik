-- Script pour mettre à jour la table daily_events avec les champs Wikipédia
-- Ajouter les colonnes pour les informations Wikipédia

-- Ajouter les nouvelles colonnes à la table daily_events
ALTER TABLE daily_events 
ADD COLUMN IF NOT EXISTS wikipedia_title VARCHAR(500),
ADD COLUMN IF NOT EXISTS wikipedia_url TEXT,
ADD COLUMN IF NOT EXISTS wikipedia_extract TEXT,
ADD COLUMN IF NOT EXISTS wikipedia_page_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_from_wikipedia BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_wikipedia_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_daily_events_wikipedia ON daily_events(wikipedia_title, is_from_wikipedia);

-- Créer une fonction pour mettre à jour les événements avec les données Wikipédia
CREATE OR REPLACE FUNCTION update_event_with_wikipedia(
  event_id UUID,
  wiki_title VARCHAR(500),
  wiki_url TEXT,
  wiki_extract TEXT,
  wiki_page_id VARCHAR(50)
) RETURNS VOID AS $$
BEGIN
  UPDATE daily_events 
  SET 
    wikipedia_title = wiki_title,
    wikipedia_url = wiki_url,
    wikipedia_extract = wiki_extract,
    wikipedia_page_id = wiki_page_id,
    is_from_wikipedia = TRUE,
    last_wikipedia_update = NOW()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour récupérer les événements avec données Wikipédia
CREATE OR REPLACE FUNCTION get_events_with_wikipedia(
  target_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE (
  id UUID,
  event_type VARCHAR(50),
  title VARCHAR(500),
  description TEXT,
  date DATE,
  year INTEGER,
  person_name VARCHAR(200),
  profession VARCHAR(200),
  category VARCHAR(100),
  tags TEXT[],
  wikipedia_title VARCHAR(500),
  wikipedia_url TEXT,
  wikipedia_extract TEXT,
  is_from_wikipedia BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    de.id,
    de.event_type,
    de.title,
    de.description,
    de.date,
    de.year,
    de.person_name,
    de.profession,
    de.category,
    de.tags,
    de.wikipedia_title,
    de.wikipedia_url,
    de.wikipedia_extract,
    de.is_from_wikipedia
  FROM daily_events de
  WHERE de.date = target_date
  AND de.is_active = TRUE
  ORDER BY de.year DESC NULLS LAST, de.title;
END;
$$ LANGUAGE plpgsql;

-- Créer une vue pour les événements populaires avec Wikipédia
CREATE OR REPLACE VIEW popular_wikipedia_events AS
SELECT 
  id,
  event_type,
  title,
  description,
  date,
  year,
  person_name,
  profession,
  category,
  wikipedia_title,
  wikipedia_url,
  wikipedia_extract,
  is_from_wikipedia
FROM daily_events 
WHERE is_from_wikipedia = TRUE 
  AND is_active = TRUE
  AND (event_type = 'birthday' OR event_type = 'death' OR event_type = 'historical_event')
ORDER BY year DESC NULLS LAST;

-- Insérer quelques exemples d'événements avec données Wikipédia
INSERT INTO daily_events (
  event_type, 
  title, 
  description, 
  date, 
  year, 
  person_name, 
  profession, 
  category,
  wikipedia_title,
  wikipedia_url,
  is_from_wikipedia
) VALUES 
(
  'birthday',
  'Anniversaire de Mick Jagger',
  'Chanteur et musicien britannique, membre des Rolling Stones',
  CURRENT_DATE,
  1943,
  'Mick Jagger',
  'Musicien',
  'Musiciens',
  'Mick Jagger',
  'https://fr.wikipedia.org/wiki/Mick_Jagger',
  TRUE
),
(
  'death',
  'Décès de Jimi Hendrix',
  'Guitariste et chanteur américain, légende du rock',
  CURRENT_DATE,
  1970,
  'Jimi Hendrix',
  'Guitariste',
  'Musiciens',
  'Jimi Hendrix',
  'https://fr.wikipedia.org/wiki/Jimi_Hendrix',
  TRUE
),
(
  'historical_event',
  'Premier vol commercial',
  'Premier vol commercial de l''histoire de l''aviation',
  CURRENT_DATE,
  1914,
  NULL,
  NULL,
  'Premier vol',
  'Histoire de l''aviation',
  'https://fr.wikipedia.org/wiki/Histoire_de_l%27aviation',
  TRUE
)
ON CONFLICT (date, title) DO NOTHING;

-- Créer une fonction pour synchroniser avec Wikipédia
CREATE OR REPLACE FUNCTION sync_events_with_wikipedia() RETURNS INTEGER AS $$
DECLARE
  event_record RECORD;
  updated_count INTEGER := 0;
BEGIN
  -- Cette fonction sera appelée par un processus externe (Node.js/Python)
  -- pour synchroniser les événements avec Wikipédia
  -- Pour l'instant, elle retourne juste le nombre d'événements à mettre à jour
  
  SELECT COUNT(*) INTO updated_count
  FROM daily_events 
  WHERE is_from_wikipedia = FALSE 
    AND is_active = TRUE
    AND date >= CURRENT_DATE - INTERVAL '30 days';
    
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN daily_events.wikipedia_title IS 'Titre de l''article Wikipédia correspondant';
COMMENT ON COLUMN daily_events.wikipedia_url IS 'URL de l''article Wikipédia';
COMMENT ON COLUMN daily_events.wikipedia_extract IS 'Extrait de l''article Wikipédia';
COMMENT ON COLUMN daily_events.wikipedia_page_id IS 'ID de la page Wikipédia';
COMMENT ON COLUMN daily_events.is_from_wikipedia IS 'Indique si l''événement provient de Wikipédia';
COMMENT ON COLUMN daily_events.last_wikipedia_update IS 'Date de la dernière mise à jour depuis Wikipédia'; 