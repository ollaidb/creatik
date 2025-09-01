-- Script pour ajouter les catégories d'événements
-- Exécutez ce script dans votre base de données Supabase

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

-- Vérifier que les catégories ont été ajoutées
SELECT 'Catégories d\'événements ajoutées:' as info;
SELECT name, color, icon FROM event_categories ORDER BY name; 