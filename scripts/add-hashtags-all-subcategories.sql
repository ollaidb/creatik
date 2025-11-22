-- Script pour ajouter des hashtags spécifiques pour toutes les sous-catégories
-- Exécutez ce script dans votre base de données Supabase

-- Supprimer tous les anciens hashtags pour éviter les doublons
DELETE FROM subcategory_hashtags;

-- Ajouter des hashtags pour Activisme/Campagnes
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440031', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Activisme', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440032', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#JusticeSociale', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440033', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#DroitsHumains', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440034', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Écologie', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440035', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Climat', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440036', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Égalité', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440037', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Féminisme', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440038', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Antiracisme', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440039', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Pacifisme', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440040', (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1), '#Mobilisation', 10, NOW());

-- Ajouter des hashtags pour Informations relationnelles
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440041', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Relations', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440042', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Communication', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440043', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Empathie', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440044', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Écoute', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440045', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Confiance', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440046', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Respect', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440047', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Bienveillance', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440048', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Ouverture', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440049', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Authenticité', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440050', (SELECT id FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1), '#Connexion', 10, NOW());

-- Ajouter des hashtags pour Peinture
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440051', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Art', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440052', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Créativité', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440053', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Expression', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440054', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Couleurs', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440055', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Inspiration', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440056', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Technique', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440057', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Style', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440058', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Composition', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440059', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Émotion', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440060', (SELECT id FROM subcategories WHERE name = 'Peinture' LIMIT 1), '#Beauté', 10, NOW());

-- Ajouter des hashtags pour International
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440061', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Monde', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440062', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Culture', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440063', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Diversité', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440064', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Voyage', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440065', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Découverte', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440066', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Échange', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440067', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Ouverture', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440068', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Tolérance', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440069', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Solidarité', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440070', (SELECT id FROM subcategories WHERE name = 'International' LIMIT 1), '#Unité', 10, NOW());

-- Ajouter des hashtags pour Technologie
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440071', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Innovation', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440072', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Digital', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440073', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Futur', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440074', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#IA', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440075', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Robotique', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440076', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Connectivité', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440077', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Automatisation', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440078', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Transformation', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440079', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Efficacité', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440080', (SELECT id FROM subcategories WHERE name = 'Technologie' LIMIT 1), '#Progrès', 10, NOW());

-- Ajouter des hashtags pour Santé
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440081', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Bienêtre', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440082', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Médecine', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440083', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Prévention', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440084', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Nutrition', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440085', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Sport', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440086', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Mentale', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440087', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Physique', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440088', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Équilibre', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440089', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Vitalité', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440090', (SELECT id FROM subcategories WHERE name = 'Santé' LIMIT 1), '#Guérison', 10, NOW());

-- Ajouter des hashtags pour Éducation
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440091', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Apprentissage', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440092', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Formation', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440093', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Connaissance', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440094', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Développement', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440095', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Compétences', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440096', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Excellence', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440097', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Innovation', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440098', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Pédagogie', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440099', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Excellence', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440100', (SELECT id FROM subcategories WHERE name = 'Éducation' LIMIT 1), '#Réussite', 10, NOW());

-- Ajouter des hashtags pour Environnement
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Écologie', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440102', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Durabilité', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440103', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Climat', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440104', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Biodiversité', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440105', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Protection', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440106', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Renouvelable', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440107', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#ZéroDéchet', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440108', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Conservation', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440109', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Nature', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440110', (SELECT id FROM subcategories WHERE name = 'Environnement' LIMIT 1), '#Planète', 10, NOW());

-- Ajouter des hashtags pour Économie
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440111', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Finance', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440112', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Marché', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440113', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Investissement', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440114', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Croissance', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440115', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Entrepreneuriat', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440116', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Innovation', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440117', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Stratégie', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440118', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Performance', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440119', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Développement', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440120', (SELECT id FROM subcategories WHERE name = 'Économie' LIMIT 1), '#Prospérité', 10, NOW());

-- Ajouter des hashtags pour Culture
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440121', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Art', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440122', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Histoire', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440123', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Tradition', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440124', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Patrimoine', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440125', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Expression', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440126', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Créativité', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440127', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Diversité', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440128', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Identité', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440129', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Valeurs', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440130', (SELECT id FROM subcategories WHERE name = 'Culture' LIMIT 1), '#Transmission', 10, NOW());

-- Ajouter des hashtags pour Sport
INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440131', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Performance', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440132', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Compétition', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440133', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Dépassement', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440134', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Équipe', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440135', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Victoire', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440136', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Entraînement', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440137', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Motivation', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440138', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Excellence', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440139', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Passion', 9, NOW()),
('550e8400-e29b-41d4-a716-446655440140', (SELECT id FROM subcategories WHERE name = 'Sport' LIMIT 1), '#Défi', 10, NOW());

-- Vérifier que tous les hashtags ont été ajoutés
SELECT 'Hashtags ajoutés pour toutes les sous-catégories:' as info;
SELECT 
  s.name as subcategory_name,
  COUNT(sh.hashtag) as hashtag_count
FROM subcategories s
LEFT JOIN subcategory_hashtags sh ON s.id = sh.subcategory_id
GROUP BY s.id, s.name
ORDER BY s.name; 