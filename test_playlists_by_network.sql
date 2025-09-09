-- Script pour tester le système de playlists par réseau social

-- 1. Vérifier la structure des tables
SELECT 
    'user_content_playlists' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_content_playlists' 
AND column_name IN ('social_network_id', 'name', 'user_id')
ORDER BY ordinal_position;

-- 2. Vérifier les données existantes
SELECT 
    ua.platform,
    ua.display_name,
    COUNT(p.id) as playlist_count,
    STRING_AGG(p.name, ', ') as playlist_names
FROM public.user_social_accounts ua
LEFT JOIN public.user_content_playlists p ON ua.id = p.social_network_id
GROUP BY ua.id, ua.platform, ua.display_name
ORDER BY ua.platform;

-- 3. Tester la création d'une playlist pour un réseau spécifique
DO $$
DECLARE
    test_user_id uuid;
    tiktok_account_id uuid;
    instagram_account_id uuid;
BEGIN
    -- Récupérer un utilisateur de test
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé';
        RETURN;
    END IF;
    
    -- Récupérer les comptes TikTok et Instagram
    SELECT id INTO tiktok_account_id FROM public.user_social_accounts 
    WHERE user_id = test_user_id AND platform = 'tiktok' LIMIT 1;
    
    SELECT id INTO instagram_account_id FROM public.user_social_accounts 
    WHERE user_id = test_user_id AND platform = 'instagram' LIMIT 1;
    
    -- Créer des playlists de test pour TikTok
    IF tiktok_account_id IS NOT NULL THEN
        INSERT INTO public.user_content_playlists (user_id, social_network_id, name, color) VALUES
        (test_user_id, tiktok_account_id, 'TikTok Favoris', '#000000'),
        (test_user_id, tiktok_account_id, 'TikTok Viral', '#FF0050')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Playlists TikTok créées pour l''utilisateur %', test_user_id;
    END IF;
    
    -- Créer des playlists de test pour Instagram
    IF instagram_account_id IS NOT NULL THEN
        INSERT INTO public.user_content_playlists (user_id, social_network_id, name, color) VALUES
        (test_user_id, instagram_account_id, 'Instagram Stories', '#E4405F'),
        (test_user_id, instagram_account_id, 'Instagram Reels', '#833AB4')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Playlists Instagram créées pour l''utilisateur %', test_user_id;
    END IF;
    
    -- Afficher le résultat
    RAISE NOTICE 'Résultat final:';
    FOR rec IN 
        SELECT ua.platform, p.name as playlist_name
        FROM public.user_social_accounts ua
        LEFT JOIN public.user_content_playlists p ON ua.id = p.social_network_id
        WHERE ua.user_id = test_user_id
        ORDER BY ua.platform, p.name
    LOOP
        RAISE NOTICE '  % - %', rec.platform, COALESCE(rec.playlist_name, 'Aucune playlist');
    END LOOP;
END $$;
