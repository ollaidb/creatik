-- Script pour ajouter du contenu de test dans toutes les tables
-- Exécutez ce script dans votre base de données Supabase

-- 1. Ajouter des comptes de test dans exemplary_accounts
INSERT INTO exemplary_accounts (
  id,
  subcategory_id,
  account_name,
  platform,
  account_url,
  description,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'Influollaid',
  'tiktok',
  'https://www.tiktok.com/@influollaid',
  'Créateur de contenu activiste sur TikTok',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'EcoWarrior',
  'instagram',
  'https://www.instagram.com/ecowarrior',
  'Militant écologiste sur Instagram',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'JusticeVoice',
  'youtube',
  'https://www.youtube.com/@justicevoice',
  'Chaîne YouTube sur la justice sociale',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ClimateActivist',
  'twitter',
  'https://twitter.com/climateactivist',
  'Activiste climatique sur Twitter',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'HumanRightsNow',
  'facebook',
  'https://www.facebook.com/humanrightsnow',
  'Page Facebook pour les droits humains',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  account_name = EXCLUDED.account_name,
  platform = EXCLUDED.platform,
  account_url = EXCLUDED.account_url,
  description = EXCLUDED.description,
  created_at = NOW();

-- 2. Ajouter des sources de test dans sources
INSERT INTO sources (
  id,
  title,
  url,
  description,
  category,
  subcategory,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Guide complet de l''activisme digital',
  'https://www.activisme-digital.com/guide',
  'Un guide complet pour mener des campagnes activistes sur les réseaux sociaux',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Stratégies de mobilisation en ligne',
  'https://www.mobilisation-online.org/strategies',
  'Comment organiser des mouvements sociaux via les plateformes numériques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  'Outils de création de contenu militant',
  'https://www.outils-militants.com/creation',
  'Ressources et outils pour créer du contenu engagé et impactant',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440009',
  'Manuel de communication non-violente',
  'https://www.communication-non-violente.org/manuel',
  'Guide pour communiquer efficacement lors de campagnes sociales',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'Plateforme de coordination des actions',
  'https://www.coordination-actions.org',
  'Site web pour coordonner les actions activistes à travers le monde',
  'Activisme',
  'Campagnes',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  created_at = NOW();

-- 3. Ajouter des challenges de test dans challenges
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
  '550e8400-e29b-41d4-a716-446655440011',
  'Challenge Activisme 30 Jours',
  'Partagez une action activiste chaque jour pendant 30 jours pour sensibiliser votre communauté.',
  'Activisme',
  150,
  'hard',
  30,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  25,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Défi Écologie Quotidienne',
  'Adoptez une nouvelle habitude écologique chaque jour pendant 21 jours.',
  'Environnement',
  120,
  'medium',
  21,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  18,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  'Challenge Solidarité 7 Jours',
  'Effectuez un acte de solidarité chaque jour pendant une semaine.',
  'Social',
  80,
  'easy',
  7,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  12,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440014',
  'Défi Éducation Populaire',
  'Partagez une connaissance ou une compétence avec quelqu\'un chaque jour pendant 14 jours.',
  'Éducation',
  100,
  'medium',
  14,
  false,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  15,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440015',
  'Challenge Justice Sociale',
  'Documentez et partagez une injustice sociale chaque jour pendant 10 jours.',
  'Justice',
  90,
  'medium',
  10,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  22,
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

-- 4. Vérifier que tout a été ajouté
SELECT 'Comptes ajoutés:' as info;
SELECT id, account_name, platform, account_url FROM exemplary_accounts ORDER BY created_at DESC LIMIT 5;

SELECT 'Sources ajoutées:' as info;
SELECT id, title, url, category, subcategory FROM sources ORDER BY created_at DESC LIMIT 5;

SELECT 'Challenges ajoutés:' as info;
SELECT id, title, category, points, difficulty, is_active FROM challenges WHERE is_active = true ORDER BY created_at DESC LIMIT 5; 