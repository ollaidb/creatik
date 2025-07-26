-- Script pour ajouter des challenges de test
-- Exécutez ce script dans votre base de données Supabase

-- Insérer des challenges de test
INSERT INTO challenges (
  id,
  title,
  description,
  category,
  points,
  difficulty,
  duration_days,
  is_daily,
  is_active,
  created_by,
  likes_count,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Challenge Créativité Quotidienne',
  'Publiez une création originale chaque jour pendant 30 jours. Peut être une photo, une vidéo, un texte ou une œuvre d''art.',
  'Créativité',
  100,
  'medium',
  30,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  5,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Défi Fitness 21 Jours',
  'Faites au moins 30 minutes d''exercice par jour pendant 21 jours consécutifs.',
  'Santé',
  150,
  'hard',
  21,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  12,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Challenge Lecture Mensuel',
  'Lisez un livre par semaine pendant un mois et partagez vos réflexions.',
  'Éducation',
  80,
  'easy',
  28,
  false,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  8,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Défi Cuisine Internationale',
  'Préparez un plat d''une cuisine différente chaque semaine pendant 2 mois.',
  'Cuisine',
  120,
  'medium',
  56,
  false,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  15,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Challenge Écologie 7 Jours',
  'Adoptez une nouvelle habitude écologique chaque jour pendant une semaine.',
  'Environnement',
  60,
  'easy',
  7,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  20,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  points = EXCLUDED.points,
  difficulty = EXCLUDED.difficulty,
  duration_days = EXCLUDED.duration_days,
  is_daily = EXCLUDED.is_daily,
  is_active = EXCLUDED.is_active,
  likes_count = EXCLUDED.likes_count,
  updated_at = NOW();

-- Vérifier que les challenges ont été ajoutés
SELECT id, title, category, points, difficulty, is_active FROM challenges WHERE is_active = true ORDER BY created_at DESC; 