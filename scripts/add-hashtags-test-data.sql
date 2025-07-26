-- Script pour ajouter des hashtags de test dans la table subcategory_hashtags
-- Exécutez ce script dans votre base de données Supabase

-- Supprimer les anciens hashtags pour éviter les doublons
DELETE FROM subcategory_hashtags WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1
);

-- Ajouter des hashtags de test pour Activisme/Campagnes
INSERT INTO subcategory_hashtags (
  id,
  subcategory_id,
  hashtag,
  hashtag_order,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440031',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Activisme',
  1,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440032',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#JusticeSociale',
  2,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440033',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#DroitsHumains',
  3,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440034',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Écologie',
  4,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440035',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Climat',
  5,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440036',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Égalité',
  6,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440037',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Féminisme',
  7,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440038',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Antiracisme',
  8,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440039',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Pacifisme',
  9,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440040',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  '#Mobilisation',
  10,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  hashtag = EXCLUDED.hashtag,
  hashtag_order = EXCLUDED.hashtag_order,
  created_at = NOW();

-- Vérifier que les hashtags ont été ajoutés
SELECT 'Hashtags ajoutés pour Activisme/Campagnes:' as info;
SELECT id, hashtag, hashtag_order 
FROM subcategory_hashtags 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1)
ORDER BY hashtag_order ASC; 