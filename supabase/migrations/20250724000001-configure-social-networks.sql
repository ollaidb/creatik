-- Migration: Configure Social Networks and Category Filters
-- Description: Configure social networks with their category filters and mappings

-- Insérer les réseaux sociaux
INSERT INTO social_networks (id, name, display_name, icon_url, color_theme) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'all', 'Tout', '/icons/globe.svg', '#8B5CF6'),
  ('550e8400-e29b-41d4-a716-446655440002', 'tiktok', 'TikTok', '/icons/tiktok.svg', '#000000'),
  ('550e8400-e29b-41d4-a716-446655440003', 'youtube', 'YouTube', '/icons/youtube.svg', '#FF0000'),
  ('550e8400-e29b-41d4-a716-446655440004', 'instagram', 'Instagram', '/icons/instagram.svg', '#E4405F'),
  ('550e8400-e29b-41d4-a716-446655440005', 'facebook', 'Facebook', '/icons/facebook.svg', '#1877F2'),
  ('550e8400-e29b-41d4-a716-446655440006', 'twitter', 'Twitter', '/icons/twitter.svg', '#1DA1F2'),
  ('550e8400-e29b-41d4-a716-446655440007', 'twitch', 'Twitch', '/icons/twitch.svg', '#9146FF'),
  ('550e8400-e29b-41d4-a716-446655440008', 'linkedin', 'LinkedIn', '/icons/linkedin.svg', '#0077B5'),
  ('550e8400-e29b-41d4-a716-446655440009', 'blog', 'Blog', '/icons/blog.svg', '#FF6B35'),
  ('550e8400-e29b-41d4-a716-446655440010', 'article', 'Article', '/icons/article.svg', '#2E8B57');

-- 2. Configurer les filtres par réseau social
-- LinkedIn : Masquer les catégories divertissantes, rediriger vers business/professionnel
INSERT INTO public.network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
((SELECT id FROM public.social_networks WHERE name = 'linkedin'), 
 ARRAY['business', 'professional', 'marketing', 'leadership', 'innovation'],
 ARRAY['entertainment', 'gaming', 'fashion', 'lifestyle', 'sports', 'humour', 'prank', 'meme'],
 '{"entertainment": "business", "gaming": "innovation", "fashion": "marketing", "lifestyle": "leadership", "sports": "innovation", "humour": "professional", "prank": "business", "meme": "marketing"}',
 '{"business": 1, "professional": 2, "marketing": 3, "leadership": 4, "innovation": 5}');

-- Twitch : Masquer les catégories professionnelles, rediriger vers gaming/entertainment
INSERT INTO public.network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
((SELECT id FROM public.social_networks WHERE name = 'twitch'), 
 ARRAY['gaming', 'entertainment', 'technology', 'education', 'community'],
 ARRAY['business', 'professional', 'fashion', 'lifestyle', 'marketing', 'leadership'],
 '{"business": "gaming", "professional": "technology", "fashion": "entertainment", "lifestyle": "education", "marketing": "technology", "leadership": "community"}',
 '{"gaming": 1, "entertainment": 2, "technology": 3, "education": 4, "community": 5}');

-- YouTube : Prioriser l'éducation et l'information
INSERT INTO public.network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
((SELECT id FROM public.social_networks WHERE name = 'youtube'), 
 ARRAY['education', 'information', 'tutorial', 'documentary', 'analysis'],
 ARRAY[],
 '{}',
 '{"education": 1, "information": 2, "tutorial": 3, "documentary": 4, "analysis": 5}');

-- TikTok : Prioriser le divertissement et les tendances
INSERT INTO public.network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
((SELECT id FROM public.social_networks WHERE name = 'tiktok'), 
 ARRAY['entertainment', 'trending', 'humour', 'dance', 'lifestyle'],
 ARRAY['business', 'professional', 'documentary'],
 '{"business": "lifestyle", "professional": "entertainment", "documentary": "trending"}',
 '{"entertainment": 1, "trending": 2, "humour": 3, "dance": 4, "lifestyle": 5}');

-- Instagram : Prioriser le visuel et le lifestyle
INSERT INTO public.network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
((SELECT id FROM public.social_networks WHERE name = 'instagram'), 
 ARRAY['lifestyle', 'fashion', 'beauty', 'photography', 'travel'],
 ARRAY['gaming', 'technology', 'business'],
 '{"gaming": "lifestyle", "technology": "photography", "business": "fashion"}',
 '{"lifestyle": 1, "fashion": 2, "beauty": 3, "photography": 4, "travel": 5}');

-- 3. Créer les mappings réseau-catégories pour les réseaux principaux
-- YouTube
INSERT INTO public.network_category_mappings (network_id, category_id, priority, is_featured) 
SELECT 
  (SELECT id FROM public.social_networks WHERE name = 'youtube'),
  c.id,
  CASE 
    WHEN c.name IN ('Éducation', 'Information', 'Tutorial', 'Documentaire', 'Analyse') THEN 1
    WHEN c.name IN ('Science', 'Technologie', 'Histoire', 'Politique') THEN 2
    ELSE 3
  END,
  c.name IN ('Éducation', 'Information', 'Tutorial')
FROM public.categories c;

-- TikTok
INSERT INTO public.network_category_mappings (network_id, category_id, priority, is_featured) 
SELECT 
  (SELECT id FROM public.social_networks WHERE name = 'tiktok'),
  c.id,
  CASE 
    WHEN c.name IN ('Divertissement', 'Humour', 'Danse', 'Lifestyle', 'Tendance') THEN 1
    WHEN c.name IN ('Vlog', 'Beauty', 'Fashion', 'Musique') THEN 2
    ELSE 3
  END,
  c.name IN ('Divertissement', 'Humour', 'Danse', 'Lifestyle')
FROM public.categories c;

-- LinkedIn
INSERT INTO public.network_category_mappings (network_id, category_id, priority, is_featured) 
SELECT 
  (SELECT id FROM public.social_networks WHERE name = 'linkedin'),
  c.id,
  CASE 
    WHEN c.name IN ('Business', 'Professional', 'Marketing', 'Leadership', 'Innovation') THEN 1
    WHEN c.name IN ('Carrière', 'Entrepreneuriat', 'Management') THEN 2
    ELSE 3
  END,
  c.name IN ('Business', 'Professional', 'Marketing')
FROM public.categories c;

-- 4. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Réseaux sociaux configurés avec succès';
    RAISE NOTICE 'Filtres par réseau configurés';
    RAISE NOTICE 'Mappings réseau-catégories créés';
    RAISE NOTICE 'Configuration LinkedIn, Twitch, YouTube, TikTok, Instagram terminée';
END $$; 