-- Script pour insérer des données de test pour le système de profil utilisateur
-- À exécuter après avoir créé les tables

-- Insérer des réseaux sociaux par défaut pour un utilisateur de test
-- Remplacez 'USER_ID_HERE' par l'ID d'un utilisateur réel
INSERT INTO public.user_social_accounts (user_id, platform, username, display_name, profile_url, is_active) VALUES
('USER_ID_HERE', 'tiktok', '@creatik_user', 'Creatik User', 'https://tiktok.com/@creatik_user', true),
('USER_ID_HERE', 'instagram', '@creatik_user', 'Creatik User', 'https://instagram.com/creatik_user', true),
('USER_ID_HERE', 'youtube', '@creatik_user', 'Creatik User', 'https://youtube.com/@creatik_user', true),
('USER_ID_HERE', 'twitter', '@creatik_user', 'Creatik User', 'https://twitter.com/creatik_user', true);

-- Insérer quelques publications de test
INSERT INTO public.user_social_posts (user_id, social_account_id, title, content, status, published_date) VALUES
('USER_ID_HERE', (SELECT id FROM public.user_social_accounts WHERE platform = 'tiktok' AND user_id = 'USER_ID_HERE'), 'Mon premier TikTok viral', 'Contenu de mon premier TikTok qui a bien marché !', 'published', NOW() - INTERVAL '2 days'),
('USER_ID_HERE', (SELECT id FROM public.user_social_accounts WHERE platform = 'instagram' AND user_id = 'USER_ID_HERE'), 'Photo du jour', 'Une belle photo pour Instagram', 'published', NOW() - INTERVAL '1 day'),
('USER_ID_HERE', (SELECT id FROM public.user_social_accounts WHERE platform = 'youtube' AND user_id = 'USER_ID_HERE'), 'Tutoriel Creatik', 'Comment utiliser Creatik pour créer du contenu', 'published', NOW() - INTERVAL '3 days'),
('USER_ID_HERE', (SELECT id FROM public.user_social_accounts WHERE platform = 'twitter' AND user_id = 'USER_ID_HERE'), 'Tweet du jour', 'Un tweet sur mes réflexions du jour', 'published', NOW() - INTERVAL '6 hours');

-- Insérer quelques playlists de test
INSERT INTO public.user_content_playlists (user_id, name, description, is_public, color) VALUES
('USER_ID_HERE', 'Mes meilleurs contenus', 'Mes publications qui ont le mieux performé', false, '#10B981'),
('USER_ID_HERE', 'Tutoriels', 'Tous mes tutoriels et guides', false, '#3B82F6'),
('USER_ID_HERE', 'Inspiration quotidienne', 'Contenu motivant pour chaque jour', true, '#F59E0B'),
('USER_ID_HERE', 'Behind the scenes', 'Contenu exclusif sur mon processus créatif', false, '#8B5CF6');

-- Associer des publications aux playlists
INSERT INTO public.playlist_posts (playlist_id, post_id, position) VALUES
((SELECT id FROM public.user_content_playlists WHERE name = 'Mes meilleurs contenus' AND user_id = 'USER_ID_HERE'), (SELECT id FROM public.user_social_posts WHERE title = 'Mon premier TikTok viral' AND user_id = 'USER_ID_HERE'), 1),
((SELECT id FROM public.user_content_playlists WHERE name = 'Tutoriels' AND user_id = 'USER_ID_HERE'), (SELECT id FROM public.user_social_posts WHERE title = 'Tutoriel Creatik' AND user_id = 'USER_ID_HERE'), 1),
((SELECT id FROM public.user_content_playlists WHERE name = 'Inspiration quotidienne' AND user_id = 'USER_ID_HERE'), (SELECT id FROM public.user_social_posts WHERE title = 'Photo du jour' AND user_id = 'USER_ID_HERE'), 1),
((SELECT id FROM public.user_content_playlists WHERE name = 'Behind the scenes' AND user_id = 'USER_ID_HERE'), (SELECT id FROM public.user_social_posts WHERE title = 'Tweet du jour' AND user_id = 'USER_ID_HERE'), 1);
