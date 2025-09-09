-- Script pour insérer les réseaux sociaux par défaut pour un utilisateur
-- Remplacez 'YOUR_USER_ID_HERE' par l'ID d'un utilisateur réel

DO $$
DECLARE
    user_exists boolean;
    test_user_id uuid;
BEGIN
    -- Vérifier s'il y a des utilisateurs dans la table auth.users
    SELECT EXISTS(SELECT 1 FROM auth.users LIMIT 1) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE NOTICE 'Aucun utilisateur trouvé dans auth.users. Veuillez créer un utilisateur d''abord.';
        RETURN;
    END IF;
    
    -- Récupérer le premier utilisateur disponible
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    RAISE NOTICE 'Utilisation de l''utilisateur ID: %', test_user_id;
    
    -- Insérer les réseaux sociaux par défaut (TikTok, Instagram, YouTube, Twitter)
    INSERT INTO public.user_social_accounts (user_id, platform, username, display_name, profile_url, is_active) VALUES
    (test_user_id, 'tiktok', '@tiktok_user', 'TikTok', 'https://tiktok.com/@tiktok_user', true),
    (test_user_id, 'instagram', '@instagram_user', 'Instagram', 'https://instagram.com/@instagram_user', true),
    (test_user_id, 'youtube', '@youtube_user', 'YouTube', 'https://youtube.com/@youtube_user', true),
    (test_user_id, 'twitter', '@twitter_user', 'Twitter', 'https://twitter.com/@twitter_user', true)
    ON CONFLICT (user_id, platform, username) DO NOTHING;

    -- Insérer quelques playlists par défaut
    INSERT INTO public.user_content_playlists (user_id, name, description, is_public, color) VALUES
    (test_user_id, 'Mes meilleurs contenus', 'Mes publications qui ont le mieux performé', false, '#10B981'),
    (test_user_id, 'Tutoriels', 'Tous mes tutoriels et guides', false, '#3B82F6'),
    (test_user_id, 'Inspiration quotidienne', 'Contenu motivant pour chaque jour', true, '#F59E0B'),
    (test_user_id, 'Behind the scenes', 'Contenu exclusif sur mon processus créatif', false, '#8B5CF6')
    ON CONFLICT DO NOTHING;

    -- Récupérer les IDs des comptes sociaux créés
    DECLARE
        tiktok_id uuid;
        instagram_id uuid;
        youtube_id uuid;
        twitter_id uuid;
    BEGIN
        SELECT id INTO tiktok_id FROM public.user_social_accounts WHERE user_id = test_user_id AND platform = 'tiktok';
        SELECT id INTO instagram_id FROM public.user_social_accounts WHERE user_id = test_user_id AND platform = 'instagram';
        SELECT id INTO youtube_id FROM public.user_social_accounts WHERE user_id = test_user_id AND platform = 'youtube';
        SELECT id INTO twitter_id FROM public.user_social_accounts WHERE user_id = test_user_id AND platform = 'twitter';

        -- Insérer quelques publications de test
        INSERT INTO public.user_social_posts (user_id, social_account_id, title, content, status, published_date) VALUES
        (test_user_id, tiktok_id, 'Mon premier TikTok viral', 'Contenu de mon premier TikTok qui a bien marché !', 'published', NOW() - INTERVAL '2 days'),
        (test_user_id, instagram_id, 'Photo du jour', 'Une belle photo pour Instagram', 'published', NOW() - INTERVAL '1 day'),
        (test_user_id, youtube_id, 'Tutoriel Creatik', 'Comment utiliser Creatik pour créer du contenu', 'published', NOW() - INTERVAL '3 days'),
        (test_user_id, twitter_id, 'Tweet du jour', 'Un tweet sur mes réflexions du jour', 'published', NOW() - INTERVAL '6 hours'),
        (test_user_id, tiktok_id, 'Tendances 2024', 'Les nouvelles tendances à suivre cette année', 'published', NOW() - INTERVAL '4 days'),
        (test_user_id, instagram_id, 'Behind the scenes', 'Comment je crée mes contenus', 'published', NOW() - INTERVAL '5 days')
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Données par défaut insérées avec succès!';
        RAISE NOTICE 'Réseaux sociaux: TikTok, Instagram, YouTube, Twitter';
        RAISE NOTICE 'Playlists: 4 playlists créées';
        RAISE NOTICE 'Publications: 6 publications de test';
    END;
END $$;
