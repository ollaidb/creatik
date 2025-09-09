-- Script pour mettre à jour les playlists existantes avec des réseaux sociaux
-- et créer des playlists par défaut pour chaque réseau social

DO $$
DECLARE
    user_record RECORD;
    social_account_record RECORD;
    playlist_count integer;
BEGIN
    -- Pour chaque utilisateur
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_social_accounts
    LOOP
        RAISE NOTICE 'Traitement de l''utilisateur: %', user_record.user_id;
        
        -- Pour chaque réseau social de l'utilisateur
        FOR social_account_record IN 
            SELECT id, platform, display_name
            FROM public.user_social_accounts 
            WHERE user_id = user_record.user_id
            ORDER BY created_at ASC
        LOOP
            -- Vérifier si l'utilisateur a déjà des playlists pour ce réseau
            SELECT COUNT(*) INTO playlist_count
            FROM public.user_content_playlists 
            WHERE user_id = user_record.user_id 
            AND social_network_id = social_account_record.id;
            
            -- Si pas de playlists pour ce réseau, en créer une par défaut
            IF playlist_count = 0 THEN
                INSERT INTO public.user_content_playlists (
                    user_id, 
                    social_network_id, 
                    name, 
                    description, 
                    is_public, 
                    color
                ) VALUES (
                    user_record.user_id,
                    social_account_record.id,
                    'Mes ' || (social_account_record.display_name || social_account_record.platform) || ' favoris',
                    'Playlist par défaut pour ' || (social_account_record.display_name || social_account_record.platform),
                    false,
                    '#3B82F6'
                );
                
                RAISE NOTICE '  - Playlist créée pour %', social_account_record.platform;
            ELSE
                RAISE NOTICE '  - % a déjà % playlists', social_account_record.platform, playlist_count;
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Mise à jour des playlists terminée!';
END $$;

-- Vérifier le résultat
SELECT 
    ua.platform,
    ua.display_name,
    COUNT(p.id) as playlist_count
FROM public.user_social_accounts ua
LEFT JOIN public.user_content_playlists p ON ua.id = p.social_network_id
GROUP BY ua.id, ua.platform, ua.display_name
ORDER BY ua.platform;
