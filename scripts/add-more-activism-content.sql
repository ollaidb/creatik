-- Script pour ajouter plus d'exemples dans Activisme/Campagnes
-- Exécutez ce script dans votre base de données Supabase

-- 1. Ajouter plus de comptes de test dans exemplary_accounts pour Activisme/Campagnes
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
  '550e8400-e29b-41d4-a716-446655440016',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ClimateStrike',
  'tiktok',
  'https://www.tiktok.com/@climatestrike',
  'Mouvement de grève pour le climat sur TikTok',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440017',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'BlackLivesMatter',
  'instagram',
  'https://www.instagram.com/blacklivesmatter',
  'Mouvement pour les droits civiques sur Instagram',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440018',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'MeTooMovement',
  'twitter',
  'https://twitter.com/metoomvmt',
  'Mouvement contre les violences sexuelles sur Twitter',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440019',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ExtinctionRebellion',
  'youtube',
  'https://www.youtube.com/@extinctionrebellion',
  'Mouvement de désobéissance civile pour le climat',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440020',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'FridaysForFuture',
  'facebook',
  'https://www.facebook.com/fridaysforfuture',
  'Mouvement de grève scolaire pour le climat',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440021',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'AmnestyInternational',
  'instagram',
  'https://www.instagram.com/amnesty',
  'Organisation de défense des droits humains',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440022',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'Greenpeace',
  'tiktok',
  'https://www.tiktok.com/@greenpeace',
  'Organisation écologiste internationale',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440023',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ACLU',
  'twitter',
  'https://twitter.com/aclu',
  'Union américaine pour les libertés civiles',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440024',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'HumanRightsWatch',
  'youtube',
  'https://www.youtube.com/@humanrightswatch',
  'Surveillance des droits humains dans le monde',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440025',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'Oxfam',
  'facebook',
  'https://www.facebook.com/oxfam',
  'Organisation de lutte contre la pauvreté',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  account_name = EXCLUDED.account_name,
  platform = EXCLUDED.platform,
  account_url = EXCLUDED.account_url,
  description = EXCLUDED.description,
  created_at = NOW();

-- 2. Ajouter plus de sources de test dans sources pour Activisme/Campagnes
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
  '550e8400-e29b-41d4-a716-446655440026',
  'Manuel de désobéissance civile',
  'https://www.desobeissance-civile.org/manuel',
  'Guide pratique pour organiser des actions de désobéissance civile non-violente',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440027',
  'Stratégies de communication militante',
  'https://www.communication-militante.com/strategies',
  'Comment communiquer efficacement lors de campagnes sociales et politiques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440028',
  'Outils de mobilisation numérique',
  'https://www.mobilisation-numerique.org/outils',
  'Plateformes et outils pour mobiliser des communautés en ligne',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440029',
  'Guide de l''action directe',
  'https://www.action-directe.org/guide',
  'Méthodes et techniques pour mener des actions directes pacifiques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440030',
  'Ressources pour l''éducation populaire',
  'https://www.education-populaire.org/ressources',
  'Matériaux et méthodes pour l''éducation populaire et la conscientisation',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440031',
  'Plateforme de coordination internationale',
  'https://www.coordination-internationale.org',
  'Site web pour coordonner les actions activistes à l''échelle mondiale',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440032',
  'Base de données des mouvements sociaux',
  'https://www.mouvements-sociaux.org/database',
  'Répertoire des mouvements sociaux et organisations activistes',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440033',
  'Centre de formation militant',
  'https://www.formation-militante.org',
  'Formations et ateliers pour développer les compétences militantes',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440034',
  'Bibliothèque de slogans et chants',
  'https://www.slogans-chants.org/bibliotheque',
  'Collection de slogans, chants et expressions militantes',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440035',
  'Guide de sécurité numérique',
  'https://www.securite-numerique.org/guide',
  'Protection de la vie privée et sécurité en ligne pour militants',
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

-- 3. Vérifier que tout a été ajouté
SELECT 'Comptes ajoutés pour Activisme/Campagnes:' as info;
SELECT id, account_name, platform, account_url, description 
FROM exemplary_accounts 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1)
ORDER BY created_at DESC;

SELECT 'Sources ajoutées pour Activisme/Campagnes:' as info;
SELECT id, title, url, description 
FROM sources 
WHERE category = 'Activisme' AND subcategory = 'Campagnes'
ORDER BY created_at DESC; 