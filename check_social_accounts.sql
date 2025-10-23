-- Script pour vérifier les comptes sociaux dans la base de données

-- 1. Vérifier tous les comptes sociaux
SELECT 
    'Tous les comptes' as type,
    user_id,
    platform,
    username,
    display_name,
    is_active,
    created_at
FROM public.user_social_accounts 
ORDER BY created_at DESC;

-- 2. Compter par utilisateur
SELECT 
    user_id,
    COUNT(*) as total_accounts,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_accounts,
    STRING_AGG(platform, ', ') as platforms
FROM public.user_social_accounts 
GROUP BY user_id
ORDER BY total_accounts DESC;

-- 3. Vérifier les contraintes
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.user_social_accounts'::regclass
AND contype = 'u';

-- 4. Vérifier les index
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'user_social_accounts';

-- 5. Test d'insertion pour un utilisateur spécifique
DO $$
DECLARE
    test_user_id uuid;
    test_platform varchar(50) := 'test_platform';
    test_username varchar(255) := '@test_user_' || extract(epoch from now());
BEGIN
    -- Récupérer le premier utilisateur
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Test d''insertion pour l''utilisateur: %', test_user_id;
    
    -- Essayer d'insérer un compte de test
    BEGIN
        INSERT INTO public.user_social_accounts (
            user_id, 
            platform, 
            username, 
            display_name, 
            is_active
        ) VALUES (
            test_user_id,
            test_platform,
            test_username,
            'Test Platform',
            true
        );
        
        RAISE NOTICE '✅ Insertion réussie: % - %', test_platform, test_username;
        
        -- Vérifier que l'insertion a fonctionné
        IF EXISTS (
            SELECT 1 FROM public.user_social_accounts 
            WHERE user_id = test_user_id 
            AND platform = test_platform 
            AND username = test_username
        ) THEN
            RAISE NOTICE '✅ Vérification: Le compte est bien en base';
        ELSE
            RAISE NOTICE '❌ Vérification: Le compte n''est pas en base';
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur lors de l''insertion: %', SQLERRM;
    END;
END $$;
