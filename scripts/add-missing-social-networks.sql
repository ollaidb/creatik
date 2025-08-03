-- Script pour ajouter les réseaux sociaux manquants
-- Vérifier et ajouter tous les réseaux sociaux nécessaires

-- 1. Vérifier les réseaux sociaux existants
SELECT name, display_name FROM social_networks ORDER BY display_name;

-- 2. Ajouter les réseaux sociaux manquants
INSERT INTO social_networks (id, name, display_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'all', 'Tout'),
  ('550e8400-e29b-41d4-a716-446655440002', 'tiktok', 'TikTok'),
  ('550e8400-e29b-41d4-a716-446655440003', 'youtube', 'YouTube'),
  ('550e8400-e29b-41d4-a716-446655440004', 'instagram', 'Instagram'),
  ('550e8400-e29b-41d4-a716-446655440005', 'facebook', 'Facebook'),
  ('550e8400-e29b-41d4-a716-446655440006', 'twitter', 'Twitter'),
  ('550e8400-e29b-41d4-a716-446655440007', 'twitch', 'Twitch'),
  ('550e8400-e29b-41d4-a716-446655440008', 'linkedin', 'LinkedIn'),
  ('550e8400-e29b-41d4-a716-446655440009', 'blog', 'Blog'),
  ('550e8400-e29b-41d4-a716-446655440010', 'article', 'Article')
ON CONFLICT (name) DO NOTHING;

-- 3. Vérifier le résultat
SELECT name, display_name FROM social_networks ORDER BY display_name;

-- 4. Vérifier que tous les réseaux sont présents
SELECT 
  CASE 
    WHEN COUNT(*) = 10 THEN 'Tous les réseaux sont présents'
    ELSE 'Il manque des réseaux: ' || COUNT(*) || '/10'
  END as status
FROM social_networks; 