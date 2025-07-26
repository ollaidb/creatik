-- Script pour ajouter des événements quotidiens d'exemple
-- Exécutez ce script dans votre base de données Supabase

-- Supprimer les anciens événements pour éviter les doublons
DELETE FROM daily_events;

-- ANNIVERSAIRES DE CÉLÉBRITÉS (Janvier)
INSERT INTO daily_events (id, event_type, title, description, date, year, person_name, profession, category_id, tags, country_code) VALUES
-- 1er janvier
('550e8400-e29b-41d4-a716-446655440301', 'birthday', 'Anniversaire de J.D. Salinger', 'Auteur américain, créateur de "L\'Attrape-cœurs"', '1900-01-01', 1919, 'J.D. Salinger', 'Écrivain', '550e8400-e29b-41d4-a716-446655440205', ARRAY['#Littérature', '#Écrivain', '#Amérique'], 'US'),

-- 2 janvier
('550e8400-e29b-41d4-a716-446655440302', 'birthday', 'Anniversaire de Kate Bosworth', 'Actrice américaine', '1983-01-02', 1983, 'Kate Bosworth', 'Actrice', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Cinéma', '#Actrice', '#Hollywood'], 'US'),

-- 3 janvier
('550e8400-e29b-41d4-a716-446655440303', 'birthday', 'Anniversaire de J.R.R. Tolkien', 'Auteur britannique, créateur du "Seigneur des Anneaux"', '1892-01-03', 1892, 'J.R.R. Tolkien', 'Écrivain', '550e8400-e29b-41d4-a716-446655440205', ARRAY['#Fantasy', '#Littérature', '#Tolkien'], 'GB'),

-- 4 janvier
('550e8400-e29b-41d4-a716-446655440304', 'birthday', 'Anniversaire d\'Isaac Newton', 'Physicien et mathématicien britannique', '1643-01-04', 1643, 'Isaac Newton', 'Scientifique', '550e8400-e29b-41d4-a716-446655440206', ARRAY['#Science', '#Physique', '#Gravité'], 'GB'),

-- 5 janvier
('550e8400-e29b-41d4-a716-446655440305', 'birthday', 'Anniversaire de Bradley Cooper', 'Acteur et réalisateur américain', '1975-01-05', 1975, 'Bradley Cooper', 'Acteur', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Cinéma', '#Acteur', '#Hollywood'], 'US'),

-- 6 janvier
('550e8400-e29b-41d4-a716-446655440306', 'birthday', 'Anniversaire de Rowan Atkinson', 'Acteur britannique, Mr. Bean', '1955-01-06', 1955, 'Rowan Atkinson', 'Acteur', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Comédie', '#MrBean', '#Humoriste'], 'GB'),

-- 7 janvier
('550e8400-e29b-41d4-a716-446655440307', 'birthday', 'Anniversaire de Nicolas Cage', 'Acteur américain', '1964-01-07', 1964, 'Nicolas Cage', 'Acteur', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Cinéma', '#Acteur', '#Hollywood'], 'US'),

-- 8 janvier
('550e8400-e29b-41d4-a716-446655440308', 'birthday', 'Anniversaire de David Bowie', 'Musicien et acteur britannique', '1947-01-08', 1947, 'David Bowie', 'Musicien', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Rock', '#Musique', '#Glam'], 'GB'),

-- 9 janvier
('550e8400-e29b-41d4-a716-446655440309', 'birthday', 'Anniversaire de Simone de Beauvoir', 'Philosophe et écrivaine française', '1908-01-09', 1908, 'Simone de Beauvoir', 'Philosophe', '550e8400-e29b-41d4-a716-446655440205', ARRAY['#Féminisme', '#Philosophie', '#Littérature'], 'FR'),

-- 10 janvier
('550e8400-e29b-41d4-a716-446655440310', 'birthday', 'Anniversaire de Rod Stewart', 'Chanteur britannique', '1945-01-10', 1945, 'Rod Stewart', 'Musicien', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Rock', '#Musique', '#Chanteur'], 'GB');

-- DÉCÈS CÉLÈBRES (Janvier)
INSERT INTO daily_events (id, event_type, title, description, date, year, person_name, profession, category_id, tags, country_code) VALUES
-- 1er janvier
('550e8400-e29b-41d4-a716-446655440401', 'death', 'Décès de Hank Williams', 'Chanteur country américain', '1953-01-01', 1953, 'Hank Williams', 'Musicien', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Country', '#Musique', '#Décès'], 'US'),

-- 2 janvier
('550e8400-e29b-41d4-a716-446655440402', 'death', 'Décès de Tex Ritter', 'Acteur et chanteur country', '1974-01-02', 1974, 'Tex Ritter', 'Acteur', '550e8400-e29b-41d4-a716-446655440204', ARRAY['#Western', '#Country', '#Cinéma'], 'US'),

-- 3 janvier
('550e8400-e29b-41d4-a716-446655440403', 'death', 'Décès de Joy Adamson', 'Naturaliste et écrivaine', '1980-01-03', 1980, 'Joy Adamson', 'Naturaliste', '550e8400-e29b-41d4-a716-446655440206', ARRAY['#Nature', '#Conservation', '#Kenya'], 'KE'),

-- 4 janvier
('550e8400-e29b-41d4-a716-446655440404', 'death', 'Décès d\'Albert Camus', 'Écrivain et philosophe français', '1960-01-04', 1960, 'Albert Camus', 'Écrivain', '550e8400-e29b-41d4-a716-446655440205', ARRAY['#Littérature', '#Philosophie', '#Nobel'], 'FR'),

-- 5 janvier
('550e8400-e29b-41d4-a716-446655440405', 'death', 'Décès de Charles Mingus', 'Jazzman américain', '1979-01-05', 1979, 'Charles Mingus', 'Musicien', '550e8400-e29b-41d4-a716-446655440203', ARRAY['#Jazz', '#Musique', '#Contrebasse'], 'US');

-- ÉVÉNEMENTS HISTORIQUES (Janvier)
INSERT INTO daily_events (id, event_type, title, description, date, year, category_id, tags, country_code) VALUES
-- 1er janvier
('550e8400-e29b-41d4-a716-446655440501', 'historical_event', 'Entrée en vigueur de l\'euro', 'L\'euro devient la monnaie officielle de 12 pays européens', '2002-01-01', 2002, '550e8400-e29b-41d4-a716-446655440211', ARRAY['#Euro', '#Europe', '#Monnaie'], 'EU'),

-- 2 janvier
('550e8400-e29b-41d4-a716-446655440502', 'historical_event', 'Première émission de télévision en couleur', 'Première diffusion en couleur aux États-Unis', '1954-01-02', 1954, '550e8400-e29b-41d4-a716-446655440219', ARRAY['#Télévision', '#Couleur', '#Innovation'], 'US'),

-- 3 janvier
('550e8400-e29b-41d4-a716-446655440503', 'historical_event', 'Indépendance de la Slovaquie', 'La Slovaquie devient indépendante de la Tchécoslovaquie', '1993-01-03', 1993, '550e8400-e29b-41d4-a716-446655440217', ARRAY['#Indépendance', '#Slovaquie', '#Europe'], 'SK'),

-- 4 janvier
('550e8400-e29b-41d4-a716-446655440504', 'historical_event', 'Premier vol commercial de la Concorde', 'Premier vol commercial supersonique', '1976-01-04', 1976, '550e8400-e29b-41d4-a716-446655440218', ARRAY['#Concorde', '#Aviation', '#Supersonique'], 'FR'),

-- 5 janvier
('550e8400-e29b-41d4-a716-446655440505', 'historical_event', 'Première émission de radio', 'Première émission radio publique', '1922-01-05', 1922, '550e8400-e29b-41d4-a716-446655440219', ARRAY['#Radio', '#Médias', '#Innovation'], 'GB');

-- FÉRIÉS FRANÇAIS (Janvier)
INSERT INTO daily_events (id, event_type, title, description, date, category_id, tags, country_code) VALUES
-- 1er janvier
('550e8400-e29b-41d4-a716-446655440601', 'holiday', 'Jour de l\'An', 'Premier jour de l\'année civile', '1900-01-01', '550e8400-e29b-41d4-a716-446655440221', ARRAY['#NouvelAn', '#Férié', '#Célébration'], 'FR'),

-- 6 janvier (Épiphanie)
('550e8400-e29b-41d4-a716-446655440602', 'holiday', 'Épiphanie', 'Fête chrétienne célébrant la visite des Rois mages', '1900-01-06', '550e8400-e29b-41d4-a716-446655440223', ARRAY['#Épiphanie', '#Galette', '#RoisMages'], 'FR');

-- JOURNÉES INTERNATIONALES (Janvier)
INSERT INTO daily_events (id, event_type, title, description, date, category_id, tags) VALUES
-- 1er janvier
('550e8400-e29b-41d4-a716-446655440701', 'international_day', 'Journée mondiale de la paix', 'Journée dédiée à la promotion de la paix dans le monde', '1900-01-01', '550e8400-e29b-41d4-a716-446655440226', ARRAY['#Paix', '#Monde', '#Solidarité']),

-- 4 janvier
('550e8400-e29b-41d4-a716-446655440702', 'international_day', 'Journée mondiale du braille', 'Journée de sensibilisation à l\'écriture braille', '1900-01-04', '550e8400-e29b-41d4-a716-446655440229', ARRAY['#Braille', '#Handicap', '#Accessibilité']),

-- 6 janvier
('550e8400-e29b-41d4-a716-446655440703', 'international_day', 'Journée mondiale des orphelins de guerre', 'Journée de sensibilisation aux enfants victimes de guerre', '1900-01-06', '550e8400-e29b-41d4-a716-446655440226', ARRAY['#Orphelins', '#Guerre', '#Enfants']),

-- 8 janvier
('550e8400-e29b-41d4-a716-446655440704', 'international_day', 'Journée mondiale de la typographie', 'Journée célébrant l\'art de la typographie', '1900-01-08', '550e8400-e29b-41d4-a716-446655440230', ARRAY['#Typographie', '#Design', '#Art']),

-- 10 janvier
('550e8400-e29b-41d4-a716-446655440705', 'international_day', 'Journée mondiale des zones humides', 'Journée de sensibilisation à la protection des zones humides', '1900-01-10', '550e8400-e29b-41d4-a716-446655440227', ARRAY['#Environnement', '#ZonesHumides', '#Biodiversité']);

-- Vérifier que les événements ont été ajoutés
SELECT 'Événements quotidiens ajoutés:' as info;
SELECT 
  event_type,
  COUNT(*) as count
FROM daily_events 
GROUP BY event_type 
ORDER BY event_type; 