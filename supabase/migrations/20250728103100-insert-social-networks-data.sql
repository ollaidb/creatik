-- Migration: Insert Social Networks Data
-- Description: Insert initial data for social networks and their configurations

-- Insérer les réseaux sociaux
INSERT INTO social_networks (id, name, display_name, description, icon_url, color_theme) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'all', 'Tout', 'Toutes les catégories', '/icons/globe.svg', '#8B5CF6'),
  ('550e8400-e29b-41d4-a716-446655440002', 'tiktok', 'TikTok', 'Vidéos courtes et tendances', '/icons/tiktok.svg', '#000000'),
  ('550e8400-e29b-41d4-a716-446655440003', 'youtube', 'YouTube', 'Vidéos longues et chaînes', '/icons/youtube.svg', '#FF0000'),
  ('550e8400-e29b-41d4-a716-446655440004', 'instagram', 'Instagram', 'Contenu visuel et stories', '/icons/instagram.svg', '#E4405F'),
  ('550e8400-e29b-41d4-a716-446655440005', 'facebook', 'Facebook', 'Posts et groupes', '/icons/facebook.svg', '#1877F2'),
  ('550e8400-e29b-41d4-a716-446655440006', 'twitter', 'Twitter', 'Micro-blogging et threads', '/icons/twitter.svg', '#1DA1F2'),
  ('550e8400-e29b-41d4-a716-446655440007', 'twitch', 'Twitch', 'Streaming et gaming', '/icons/twitch.svg', '#9146FF'),
  ('550e8400-e29b-41d4-a716-446655440008', 'linkedin', 'LinkedIn', 'Réseau professionnel', '/icons/linkedin.svg', '#0077B5');

-- Insérer les configurations par réseau
INSERT INTO network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
  -- LinkedIn (catégories business seulement)
  ('550e8400-e29b-41d4-a716-446655440008', 
   ARRAY['business', 'leadership', 'marketing', 'innovation'], 
   ARRAY['entertainment', 'gaming', 'fashion', 'lifestyle', 'sports'],
   '{"entertainment": "business", "gaming": "innovation", "fashion": "marketing", "lifestyle": "leadership", "sports": "innovation"}',
   '{"business": 1, "leadership": 2, "marketing": 3, "innovation": 4}'),
  
  -- Twitch (catégories gaming seulement)
  ('550e8400-e29b-41d4-a716-446655440007',
   ARRAY['gaming', 'entertainment', 'technology', 'education'],
   ARRAY['business', 'professional', 'fashion', 'lifestyle', 'marketing'],
   '{"business": "gaming", "professional": "technology", "fashion": "entertainment", "lifestyle": "education", "marketing": "technology"}',
   '{"gaming": 1, "entertainment": 2, "technology": 3, "education": 4}'),
  
  -- TikTok (toutes les catégories, priorité entertainment)
  ('550e8400-e29b-41d4-a716-446655440002',
   ARRAY['entertainment', 'trends', 'challenges', 'education'],
   ARRAY[],
   '{}',
   '{"entertainment": 1, "trends": 2, "challenges": 3, "education": 4}'),
  
  -- YouTube (toutes les catégories, priorité entertainment)
  ('550e8400-e29b-41d4-a716-446655440003',
   ARRAY['entertainment', 'education', 'gaming', 'technology'],
   ARRAY[],
   '{}',
   '{"entertainment": 1, "education": 2, "gaming": 3, "technology": 4}'),
  
  -- Instagram (toutes les catégories, priorité lifestyle)
  ('550e8400-e29b-41d4-a716-446655440004',
   ARRAY['lifestyle', 'fashion', 'entertainment', 'art'],
   ARRAY[],
   '{}',
   '{"lifestyle": 1, "fashion": 2, "entertainment": 3, "art": 4}'),
  
  -- Facebook (toutes les catégories)
  ('550e8400-e29b-41d4-a716-446655440005',
   ARRAY['social', 'entertainment', 'news'],
   ARRAY[],
   '{}',
   '{"social": 1, "entertainment": 2, "news": 3}'),
  
  -- Twitter (toutes les catégories)
  ('550e8400-e29b-41d4-a716-446655440006',
   ARRAY['news', 'technology', 'politics'],
   ARRAY[],
   '{}',
   '{"news": 1, "technology": 2, "politics": 3}'),
  
  -- Tout (toutes les catégories)
  ('550e8400-e29b-41d4-a716-446655440001',
   ARRAY[],
   ARRAY[],
   '{}',
   '{}');

-- Insérer les mappings réseau-catégories pour LinkedIn
INSERT INTO network_category_mappings (network_id, category_id, priority, is_featured, is_hidden, redirect_to_category_id) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440008' as network_id,
  id as category_id,
  CASE 
    WHEN name = 'Business' THEN 1
    WHEN name = 'Leadership' THEN 2
    WHEN name = 'Marketing' THEN 3
    WHEN name = 'Innovation' THEN 4
    ELSE 0
  END as priority,
  CASE 
    WHEN name IN ('Business', 'Leadership', 'Marketing', 'Innovation') THEN true
    ELSE false
  END as is_featured,
  CASE 
    WHEN name IN ('Entertainment', 'Gaming', 'Fashion', 'Lifestyle', 'Sports') THEN true
    ELSE false
  END as is_hidden,
  CASE 
    WHEN name = 'Entertainment' THEN (SELECT id FROM categories WHERE name = 'Business' LIMIT 1)
    WHEN name = 'Gaming' THEN (SELECT id FROM categories WHERE name = 'Innovation' LIMIT 1)
    WHEN name = 'Fashion' THEN (SELECT id FROM categories WHERE name = 'Marketing' LIMIT 1)
    WHEN name = 'Lifestyle' THEN (SELECT id FROM categories WHERE name = 'Leadership' LIMIT 1)
    WHEN name = 'Sports' THEN (SELECT id FROM categories WHERE name = 'Innovation' LIMIT 1)
    ELSE NULL
  END as redirect_to_category_id
FROM categories;

-- Insérer les mappings réseau-catégories pour Twitch
INSERT INTO network_category_mappings (network_id, category_id, priority, is_featured, is_hidden, redirect_to_category_id) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440007' as network_id,
  id as category_id,
  CASE 
    WHEN name = 'Gaming' THEN 1
    WHEN name = 'Entertainment' THEN 2
    WHEN name = 'Technology' THEN 3
    WHEN name = 'Education' THEN 4
    ELSE 0
  END as priority,
  CASE 
    WHEN name IN ('Gaming', 'Entertainment', 'Technology', 'Education') THEN true
    ELSE false
  END as is_featured,
  CASE 
    WHEN name IN ('Business', 'Professional', 'Fashion', 'Lifestyle', 'Marketing') THEN true
    ELSE false
  END as is_hidden,
  CASE 
    WHEN name = 'Business' THEN (SELECT id FROM categories WHERE name = 'Gaming' LIMIT 1)
    WHEN name = 'Professional' THEN (SELECT id FROM categories WHERE name = 'Technology' LIMIT 1)
    WHEN name = 'Fashion' THEN (SELECT id FROM categories WHERE name = 'Entertainment' LIMIT 1)
    WHEN name = 'Lifestyle' THEN (SELECT id FROM categories WHERE name = 'Education' LIMIT 1)
    WHEN name = 'Marketing' THEN (SELECT id FROM categories WHERE name = 'Technology' LIMIT 1)
    ELSE NULL
  END as redirect_to_category_id
FROM categories;

-- Insérer les mappings pour les autres réseaux (toutes les catégories visibles)
INSERT INTO network_category_mappings (network_id, category_id, priority, is_featured, is_hidden) 
SELECT 
  network_id,
  c.id as category_id,
  0 as priority,
  false as is_featured,
  false as is_hidden
FROM (
  SELECT '550e8400-e29b-41d4-a716-446655440002' as network_id UNION ALL -- TikTok
  SELECT '550e8400-e29b-41d4-a716-446655440003' UNION ALL -- YouTube
  SELECT '550e8400-e29b-41d4-a716-446655440004' UNION ALL -- Instagram
  SELECT '550e8400-e29b-41d4-a716-446655440005' UNION ALL -- Facebook
  SELECT '550e8400-e29b-41d4-a716-446655440006' UNION ALL -- Twitter
  SELECT '550e8400-e29b-41d4-a716-446655440001' -- Tout
) networks
CROSS JOIN categories c; 