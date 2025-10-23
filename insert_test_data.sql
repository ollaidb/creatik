-- Script pour insérer des données de test pour le système de profil utilisateur
-- IMPORTANT: Remplacez 'YOUR_USER_ID_HERE' par l'ID d'un utilisateur réel de votre base de données

-- Vérifier qu'un utilisateur existe
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
    
    -- Insérer des réseaux sociaux par défaut
    INSERT INTO public.user_social_accounts (user_id, platform, username, display_name, profile_url, is_active) VALUES
    (test_user_id, 'tiktok', '@creatik_user', 'Creatik User', 'https://tiktok.com/@creatik_user', true),
    (test_user_id, 'instagram', '@creatik_user', 'Creatik User', 'https://instagram.com/creatik_user', true),
    (test_user_id, 'youtube', '@creatik_user', 'Creatik User', 'https://youtube.com/@creatik_user', true),
    (test_user_id, 'twitter', '@creatik_user', 'Creatik User', 'https://twitter.com/creatik_user', true)
    ON CONFLICT (user_id, platform, username) DO NOTHING;

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

        -- Insérer quelques playlists de test
        INSERT INTO public.user_content_playlists (user_id, name, description, is_public, color) VALUES
        (test_user_id, 'Mes meilleurs contenus', 'Mes publications qui ont le mieux performé', false, '#10B981'),
        (test_user_id, 'Tutoriels', 'Tous mes tutoriels et guides', false, '#3B82F6'),
        (test_user_id, 'Inspiration quotidienne', 'Contenu motivant pour chaque jour', true, '#F59E0B'),
        (test_user_id, 'Behind the scenes', 'Contenu exclusif sur mon processus créatif', false, '#8B5CF6'),
        (test_user_id, 'Tendances 2024', 'Tout ce qui est tendance cette année', true, '#EC4899')
        ON CONFLICT DO NOTHING;

        -- Récupérer les IDs des playlists créées
        DECLARE
            best_content_id uuid;
            tutorials_id uuid;
            daily_inspiration_id uuid;
            behind_scenes_id uuid;
            trends_2024_id uuid;
        BEGIN
            SELECT id INTO best_content_id FROM public.user_content_playlists WHERE user_id = test_user_id AND name = 'Mes meilleurs contenus';
            SELECT id INTO tutorials_id FROM public.user_content_playlists WHERE user_id = test_user_id AND name = 'Tutoriels';
            SELECT id INTO daily_inspiration_id FROM public.user_content_playlists WHERE user_id = test_user_id AND name = 'Inspiration quotidienne';
            SELECT id INTO behind_scenes_id FROM public.user_content_playlists WHERE user_id = test_user_id AND name = 'Behind the scenes';
            SELECT id INTO trends_2024_id FROM public.user_content_playlists WHERE user_id = test_user_id AND name = 'Tendances 2024';

            -- Récupérer les IDs des posts créés
            DECLARE
                tiktok_post1_id uuid;
                instagram_post1_id uuid;
                youtube_post1_id uuid;
                twitter_post1_id uuid;
                tiktok_post2_id uuid;
                instagram_post2_id uuid;
            BEGIN
                SELECT id INTO tiktok_post1_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Mon premier TikTok viral';
                SELECT id INTO instagram_post1_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Photo du jour';
                SELECT id INTO youtube_post1_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Tutoriel Creatik';
                SELECT id INTO twitter_post1_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Tweet du jour';
                SELECT id INTO tiktok_post2_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Tendances 2024';
                SELECT id INTO instagram_post2_id FROM public.user_social_posts WHERE user_id = test_user_id AND title = 'Behind the scenes';

                -- Associer des publications aux playlists
                INSERT INTO public.playlist_posts (playlist_id, post_id, position) VALUES
                (best_content_id, tiktok_post1_id, 1),
                (best_content_id, instagram_post1_id, 2),
                (tutorials_id, youtube_post1_id, 1),
                (daily_inspiration_id, instagram_post1_id, 1),
                (daily_inspiration_id, twitter_post1_id, 2),
                (behind_scenes_id, instagram_post2_id, 1),
                (trends_2024_id, tiktok_post2_id, 1)
                ON CONFLICT (playlist_id, post_id) DO NOTHING;

                RAISE NOTICE 'Données de test insérées avec succès!';
            END;
        END;
    END;
END $$;
