-- Script pour appliquer la migration des plateformes
-- Exécuter ce script dans Supabase SQL Editor

-- 1. Mettre à jour les titres existants pour qu'ils soient compatibles avec toutes les plateformes
UPDATE content_titles 
SET platform = 'all' 
WHERE platform IS NULL;

-- 2. Ajouter des titres spécifiques à TikTok
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('🎵 Comment créer du contenu viral sur TikTok en 2024', '550e8400-e29b-41d4-a716-446655440001', 'tiktok', NOW()),
('🔥 Les 5 tendances TikTok que tu dois connaître', '550e8400-e29b-41d4-a716-446655440001', 'tiktok', NOW()),
('⚡ TikTok : Comment passer de 0 à 100k followers', '550e8400-e29b-41d4-a716-446655440001', 'tiktok', NOW()),
('💃 TikTok Dance Challenge : Le guide complet', '550e8400-e29b-41d4-a716-446655440001', 'tiktok', NOW()),
('📱 TikTok : Les algorithmes secrets révélés', '550e8400-e29b-41d4-a716-446655440001', 'tiktok', NOW());

-- 3. Ajouter des titres spécifiques à Instagram
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('📸 Instagram Reels : Comment créer du contenu engageant', '550e8400-e29b-41d4-a716-446655440001', 'instagram', NOW()),
('✨ Instagram Stories : Les meilleures pratiques 2024', '550e8400-e29b-41d4-a716-446655440001', 'instagram', NOW()),
('🎨 Instagram : Comment optimiser sa bio pour plus de followers', '550e8400-e29b-41d4-a716-446655440001', 'instagram', NOW()),
('📱 Instagram Algorithm : Comment être visible en 2024', '550e8400-e29b-41d4-a716-446655440001', 'instagram', NOW()),
('💎 Instagram : Les hashtags qui marchent vraiment', '550e8400-e29b-41d4-a716-446655440001', 'instagram', NOW());

-- 4. Ajouter des titres spécifiques à YouTube
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('📺 YouTube : Comment créer une chaîne qui cartonne', '550e8400-e29b-41d4-a716-446655440001', 'youtube', NOW()),
('🎬 YouTube Shorts : Le guide complet pour débuter', '550e8400-e29b-41d4-a716-446655440001', 'youtube', NOW()),
('⚡ YouTube Algorithm : Comment être recommandé en 2024', '550e8400-e29b-41d4-a716-446655440001', 'youtube', NOW()),
('📈 YouTube Analytics : Les métriques qui comptent vraiment', '550e8400-e29b-41d4-a716-446655440001', 'youtube', NOW()),
('🎯 YouTube SEO : Comment optimiser ses titres et descriptions', '550e8400-e29b-41d4-a716-446655440001', 'youtube', NOW());

-- 5. Ajouter des titres spécifiques à LinkedIn
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('💼 LinkedIn : Comment construire sa marque personnelle', '550e8400-e29b-41d4-a716-446655440001', 'linkedin', NOW()),
('🚀 LinkedIn Content : Les posts qui génèrent du trafic', '550e8400-e29b-41d4-a716-446655440001', 'linkedin', NOW()),
('📊 LinkedIn Analytics : Mesurer son impact professionnel', '550e8400-e29b-41d4-a716-446655440001', 'linkedin', NOW()),
('🎯 LinkedIn Networking : Comment se connecter efficacement', '550e8400-e29b-41d4-a716-446655440001', 'linkedin', NOW()),
('💡 LinkedIn : Les tendances du contenu B2B en 2024', '550e8400-e29b-41d4-a716-446655440001', 'linkedin', NOW());

-- 6. Ajouter des titres pour Twitter/X
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('🐦 Twitter : Comment écrire des threads viraux', '550e8400-e29b-41d4-a716-446655440001', 'twitter', NOW()),
('📱 Twitter Algorithm : Comment être visible en 2024', '550e8400-e29b-41d4-a716-446655440001', 'twitter', NOW()),
('⚡ Twitter : Les hashtags qui boostent l''engagement', '550e8400-e29b-41d4-a716-446655440001', 'twitter', NOW()),
('🎯 Twitter Marketing : Stratégies pour augmenter ses followers', '550e8400-e29b-41d4-a716-446655440001', 'twitter', NOW()),
('💬 Twitter : Comment créer des conversations engageantes', '550e8400-e29b-41d4-a716-446655440001', 'twitter', NOW());

-- 7. Ajouter des titres pour Facebook
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('📘 Facebook : Comment créer du contenu qui engage', '550e8400-e29b-41d4-a716-446655440001', 'facebook', NOW()),
('📱 Facebook Groups : Comment animer une communauté', '550e8400-e29b-41d4-a716-446655440001', 'facebook', NOW()),
('🎯 Facebook Ads : Les meilleures pratiques 2024', '550e8400-e29b-41d4-a716-446655440001', 'facebook', NOW()),
('📊 Facebook Insights : Analyser ses performances', '550e8400-e29b-41d4-a716-446655440001', 'facebook', NOW()),
('💡 Facebook : Les tendances du contenu en 2024', '550e8400-e29b-41d4-a716-446655440001', 'facebook', NOW());

-- 8. Ajouter des titres pour Twitch
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('🎮 Twitch : Comment démarrer son stream en 2024', '550e8400-e29b-41d4-a716-446655440001', 'twitch', NOW()),
('🎯 Twitch : Comment construire sa communauté gaming', '550e8400-e29b-41d4-a716-446655440001', 'twitch', NOW()),
('⚡ Twitch Algorithm : Comment être découvert', '550e8400-e29b-41d4-a716-446655440001', 'twitch', NOW()),
('💰 Twitch : Comment monétiser son contenu gaming', '550e8400-e29b-41d4-a716-446655440001', 'twitch', NOW()),
('🎪 Twitch : Les meilleures pratiques pour streamer', '550e8400-e29b-41d4-a716-446655440001', 'twitch', NOW());

-- 9. Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_content_titles_platform ON content_titles(platform);
CREATE INDEX IF NOT EXISTS idx_content_titles_subcategory_platform ON content_titles(subcategory_id, platform);

-- 10. Vérifier les données insérées
SELECT 
  platform,
  COUNT(*) as total_titles,
  COUNT(CASE WHEN platform = 'all' THEN 1 END) as generic_titles,
  COUNT(CASE WHEN platform != 'all' THEN 1 END) as specific_titles
FROM content_titles 
WHERE subcategory_id = '550e8400-e29b-41d4-a716-446655440001'
GROUP BY platform
ORDER BY platform; 