-- Script pour vérifier les réseaux sociaux disponibles dans l'application
-- et ceux déjà ajoutés par un utilisateur

-- 1. Vérifier tous les réseaux sociaux de l'application (sans "all")
SELECT 
    'Réseaux sociaux de l''application' as source,
    name,
    display_name,
    description,
    is_active
FROM social_networks 
WHERE is_active = true 
AND name != 'all'
ORDER BY display_name;

-- 2. Vérifier les réseaux sociaux d'un utilisateur spécifique
-- Remplacez 'USER_ID_HERE' par l'ID d'un utilisateur réel
DO $$
DECLARE
    test_user_id uuid;
    user_exists boolean;
BEGIN
    -- Vérifier s'il y a des utilisateurs
    SELECT EXISTS(SELECT 1 FROM auth.users LIMIT 1) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE NOTICE 'Aucun utilisateur trouvé dans auth.users.';
        RETURN;
    END IF;
    
    -- Récupérer le premier utilisateur
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    RAISE NOTICE 'Vérification pour l''utilisateur ID: %', test_user_id;
    
    -- Afficher les réseaux sociaux de l'utilisateur
    RAISE NOTICE 'Réseaux sociaux de l''utilisateur:';
    FOR rec IN 
        SELECT platform, display_name, username, is_active
        FROM public.user_social_accounts 
        WHERE user_id = test_user_id
        ORDER BY platform
    LOOP
        RAISE NOTICE '  - % (%) - %', rec.display_name, rec.platform, rec.username;
    END LOOP;
    
    -- Afficher les réseaux sociaux disponibles (pas encore ajoutés)
    RAISE NOTICE 'Réseaux sociaux disponibles à ajouter:';
    FOR rec IN 
        SELECT sn.name, sn.display_name, sn.description
        FROM social_networks sn
        WHERE sn.is_active = true
        AND sn.name != 'all'
        AND sn.name NOT IN (
            SELECT platform 
            FROM public.user_social_accounts 
            WHERE user_id = test_user_id
        )
        ORDER BY sn.display_name
    LOOP
        RAISE NOTICE '  - % (%) - %', rec.display_name, rec.name, rec.description;
    END LOOP;
    
    -- Compter les réseaux
    DECLARE
        total_networks integer;
        user_networks integer;
        available_networks integer;
    BEGIN
        SELECT COUNT(*) INTO total_networks FROM social_networks WHERE is_active = true AND name != 'all';
        SELECT COUNT(*) INTO user_networks FROM public.user_social_accounts WHERE user_id = test_user_id;
        available_networks := total_networks - user_networks;
        
        RAISE NOTICE 'Résumé:';
        RAISE NOTICE '  - Total réseaux dans l''app: %', total_networks;
        RAISE NOTICE '  - Réseaux de l''utilisateur: %', user_networks;
        RAISE NOTICE '  - Réseaux disponibles: %', available_networks;
    END;
END $$;
