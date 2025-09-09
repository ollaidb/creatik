-- Script pour ajouter des événements d'exemple pour aujourd'hui (26 juillet)
-- Exécutez ce script dans votre base de données Supabase

-- Supprimer les anciens événements du 26 juillet pour éviter les doublons
DELETE FROM daily_events WHERE date = '1900-07-26';

-- Ajouter des événements pour chaque type du menu pour le 26 juillet

-- 1. ANNIVERSAIRE (Birthday)
INSERT INTO daily_events (
  id, event_type, title, description, date, year, person_name, profession, 
  category_id, tags, country_code, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'birthday',
  'Anniversaire de Mick Jagger',
  'Anniversaire de Mick Jagger',
  '1900-07-26',
  1943,
  'Mick Jagger',
  'Chanteur',
  '550e8400-e29b-41d4-a716-446655440201',
  ARRAY['#Musique', '#Rock'],
  'GB',
  true,
  NOW(),
  NOW()
);

-- 2. DÉCÈS (Death)
INSERT INTO daily_events (
  id, event_type, title, description, date, year, person_name, profession, 
  category_id, tags, country_code, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'death',
  'Décès de Stanley Kubrick',
  'Décès de Stanley Kubrick',
  '1900-07-26',
  1999,
  'Stanley Kubrick',
  'Réalisateur',
  '550e8400-e29b-41d4-a716-446655440202',
  ARRAY['#Cinéma', '#Hollywood'],
  'US',
  true,
  NOW(),
  NOW()
);

-- 3. ÉVÉNEMENT HISTORIQUE (Historical Event)
INSERT INTO daily_events (
  id, event_type, title, description, date, year, 
  category_id, tags, country_code, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'historical_event',
  'Indépendance du Libéria',
  'Indépendance du Libéria',
  '1900-07-26',
  1847,
  '550e8400-e29b-41d4-a716-446655440203',
  ARRAY['#Histoire', '#Indépendance'],
  'LR',
  true,
  NOW(),
  NOW()
);

-- 4. FÉRIÉ (Holiday)
INSERT INTO daily_events (
  id, event_type, title, description, date, year, 
  category_id, tags, country_code, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'holiday',
  'Jour férié aux Maldives',
  'Jour férié aux Maldives',
  '1900-07-26',
  1965,
  '550e8400-e29b-41d4-a716-446655440204',
  ARRAY['#Férié', '#Célébration'],
  'MV',
  true,
  NOW(),
  NOW()
);

-- 5. JOURNÉE INTERNATIONALE (International Day)
INSERT INTO daily_events (
  id, event_type, title, description, date, year, 
  category_id, tags, country_code, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'international_day',
  'Journée de la mangrove',
  'Journée de la mangrove',
  '1900-07-26',
  null,
  '550e8400-e29b-41d4-a716-446655440205',
  ARRAY['#Environnement', '#Biodiversité'],
  null,
  true,
  NOW(),
  NOW()
);

-- Vérification
SELECT 'Événements ajoutés pour le 26 juillet:' as info;
SELECT event_type, description FROM daily_events WHERE date = '1900-07-26' ORDER BY event_type; 