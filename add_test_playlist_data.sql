-- Script pour ajouter des données de test pour le système de playlists
-- Créer des playlists avec des publications associées

DO $$
DECLARE
    test_user_id uuid;
    instagram_account_id uuid;
    tiktok_account_id uuid;
    youtube_account_id uuid;
    
    playlist_1_id uuid;
    playlist_2_id uuid;
    playlist_3_id uuid;
    
    post_1_id uuid;
    post_2_id uuid;
    post_3_id uuid;
    post_4_id uuid;
    post_5_id uuid;
    post_6_id uuid;
BEGIN
    -- Récupérer un utilisateur de test
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Configuration des données de test pour l''utilisateur: %', test_user_id;
    
    -- Créer des comptes sociaux de test
    INSERT INTO public.user_social_accounts (user_id, platform, username, display_name, is_active)
    VALUES 
        (test_user_id, 'instagram', '@test_instagram', 'Instagram Test', true),
        (test_user_id, 'tiktok', '@test_tiktok', 'TikTok Test', true),
        (test_user_id, 'youtube', '@test_youtube', 'YouTube Test', true)
    ON CONFLICT (user_id, platform, username) DO NOTHING;
    
    -- Récupérer les IDs des comptes créés
    SELECT id INTO instagram_account_id FROM public.user_social_accounts 
    WHERE user_id = test_user_id AND platform = 'instagram' LIMIT 1;
    
    SELECT id INTO tiktok_account_id FROM public.user_social_accounts 
    WHERE user_id = test_user_id AND platform = 'tiktok' LIMIT 1;
    
    SELECT id INTO youtube_account_id FROM public.user_social_accounts 
    WHERE user_id = test_user_id AND platform = 'youtube' LIMIT 1;
    
    -- Créer des playlists
    INSERT INTO public.user_content_playlists (user_id, social_network_id, name, description, color, is_public)
    VALUES 
        (test_user_id, instagram_account_id, 'Photos de voyage', 'Mes plus belles photos de voyage sur Instagram', '#FF6B6B', false),
        (test_user_id, tiktok_account_id, 'Tendances TikTok', 'Vidéos tendances et danses', '#FF0050', false),
        (test_user_id, youtube_account_id, 'Tutoriels tech', 'Mes tutoriels de programmation', '#00D4AA', false)
    ON CONFLICT DO NOTHING
    RETURNING id INTO playlist_1_id;
    
    -- Récupérer les IDs des playlists
    SELECT id INTO playlist_1_id FROM public.user_content_playlists 
    WHERE user_id = test_user_id AND name = 'Photos de voyage' LIMIT 1;
    
    SELECT id INTO playlist_2_id FROM public.user_content_playlists 
    WHERE user_id = test_user_id AND name = 'Tendances TikTok' LIMIT 1;
    
    SELECT id INTO playlist_3_id FROM public.user_content_playlists 
    WHERE user_id = test_user_id AND name = 'Tutoriels tech' LIMIT 1;
    
    -- Créer des publications
    INSERT INTO public.user_social_posts (user_id, social_account_id, title, content, status, published_date)
    VALUES 
        -- Publications Instagram
        (test_user_id, instagram_account_id, 'Coucher de soleil à Paris', 'Magnifique coucher de soleil depuis la Tour Eiffel', 'published', NOW() - INTERVAL '2 days'),
        (test_user_id, instagram_account_id, 'Street art à Berlin', 'Découverte de l''art urbain berlinois', 'published', NOW() - INTERVAL '5 days'),
        
        -- Publications TikTok
        (test_user_id, tiktok_account_id, 'Dance challenge viral', 'J''ai essayé le nouveau challenge de danse', 'published', NOW() - INTERVAL '1 day'),
        (test_user_id, tiktok_account_id, 'Life hack cuisine', 'Astuce géniale pour éplucher les pommes', 'published', NOW() - INTERVAL '3 days'),
        
        -- Publications YouTube
        (test_user_id, youtube_account_id, 'Apprendre React en 30 minutes', 'Tutoriel complet pour débuter avec React', 'published', NOW() - INTERVAL '1 week'),
        (test_user_id, youtube_account_id, 'Déploiement avec Vercel', 'Comment déployer son site en 5 minutes', 'published', NOW() - INTERVAL '2 weeks')
    ON CONFLICT DO NOTHING;
    
    -- Récupérer les IDs des publications
    SELECT id INTO post_1_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Coucher de soleil à Paris' LIMIT 1;
    
    SELECT id INTO post_2_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Street art à Berlin' LIMIT 1;
    
    SELECT id INTO post_3_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Dance challenge viral' LIMIT 1;
    
    SELECT id INTO post_4_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Life hack cuisine' LIMIT 1;
    
    SELECT id INTO post_5_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Apprendre React en 30 minutes' LIMIT 1;
    
    SELECT id INTO post_6_id FROM public.user_social_posts 
    WHERE user_id = test_user_id AND title = 'Déploiement avec Vercel' LIMIT 1;
    
    -- Associer les publications aux playlists
    INSERT INTO public.playlist_posts (playlist_id, post_id, position)
    VALUES 
        -- Playlist Instagram
        (playlist_1_id, post_1_id, 1),
        (playlist_1_id, post_2_id, 2),
        
        -- Playlist TikTok
        (playlist_2_id, post_3_id, 1),
        (playlist_2_id, post_4_id, 2),
        
        -- Playlist YouTube
        (playlist_3_id, post_5_id, 1),
        (playlist_3_id, post_6_id, 2)
    ON CONFLICT (playlist_id, post_id) DO NOTHING;
    
    RAISE NOTICE 'Données de test créées avec succès !';
    RAISE NOTICE 'Playlists créées: Photos de voyage, Tendances TikTok, Tutoriels tech';
    RAISE NOTICE 'Publications associées aux playlists';
    
END $$;

-- Vérifier les données créées
SELECT 
    'Données créées' as status,
    p.name as playlist_name,
    p.color,
    COUNT(pp.post_id) as nombre_publications,
    STRING_AGG(sp.title, ' | ') as titres
FROM public.user_content_playlists p
LEFT JOIN public.playlist_posts pp ON p.id = pp.playlist_id
LEFT JOIN public.user_social_posts sp ON pp.post_id = sp.id
GROUP BY p.id, p.name, p.color
ORDER BY p.name;
