-- Script pour vérifier et corriger la structure de la base de données
-- Vérifier que chaque réseau social a ses propres playlists

-- 1. Vérifier la structure actuelle des tables
SELECT 
    'Structure des tables' as check_type,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('user_social_accounts', 'user_content_playlists', 'user_social_posts')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les contraintes de clé étrangère
SELECT 
    'Contraintes FK' as check_type,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('user_content_playlists', 'user_social_posts')
ORDER BY tc.table_name, tc.constraint_name;

-- 3. Vérifier si la colonne social_network_id existe dans user_content_playlists
SELECT 
    'Colonne social_network_id' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_content_playlists' 
            AND column_name = 'social_network_id'
        ) THEN 'EXISTE' 
        ELSE 'MANQUANTE' 
    END as status;

-- 4. Si la colonne n'existe pas, l'ajouter
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_content_playlists' 
        AND column_name = 'social_network_id'
    ) THEN
        -- Ajouter la colonne social_network_id
        ALTER TABLE public.user_content_playlists 
        ADD COLUMN social_network_id UUID;
        
        RAISE NOTICE 'Colonne social_network_id ajoutée à user_content_playlists';
        
        -- Ajouter la contrainte de clé étrangère
        ALTER TABLE public.user_content_playlists 
        ADD CONSTRAINT user_content_playlists_social_network_id_fkey 
        FOREIGN KEY (social_network_id) 
        REFERENCES public.user_social_accounts(id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE 'Contrainte de clé étrangère ajoutée';
        
        -- Ajouter un index
        CREATE INDEX IF NOT EXISTS idx_user_content_playlists_social_network_id 
        ON public.user_content_playlists(social_network_id);
        
        RAISE NOTICE 'Index ajouté';
    ELSE
        RAISE NOTICE 'Colonne social_network_id existe déjà';
    END IF;
END $$;

-- 5. Mettre à jour les playlists existantes pour les associer à un réseau social
DO $$
DECLARE
    user_record RECORD;
    first_social_account_id UUID;
    updated_count INTEGER;
BEGIN
    -- Pour chaque utilisateur qui a des playlists sans réseau social
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_content_playlists 
        WHERE social_network_id IS NULL
    LOOP
        -- Récupérer le premier réseau social de l'utilisateur
        SELECT id INTO first_social_account_id 
        FROM public.user_social_accounts 
        WHERE user_id = user_record.user_id 
        ORDER BY created_at ASC 
        LIMIT 1;
        
        -- Si l'utilisateur a un réseau social, associer les playlists
        IF first_social_account_id IS NOT NULL THEN
            UPDATE public.user_content_playlists 
            SET social_network_id = first_social_account_id
            WHERE user_id = user_record.user_id 
            AND social_network_id IS NULL;
            
            GET DIAGNOSTICS updated_count = ROW_COUNT;
            RAISE NOTICE 'Utilisateur %: % playlists associées au réseau social %', 
                user_record.user_id, updated_count, first_social_account_id;
        ELSE
            RAISE NOTICE 'Utilisateur %: Aucun réseau social trouvé, playlists non associées', user_record.user_id;
        END IF;
    END LOOP;
END $$;

-- 6. Rendre la colonne social_network_id obligatoire
DO $$
BEGIN
    -- Vérifier s'il y a des playlists sans réseau social
    IF EXISTS (
        SELECT 1 FROM public.user_content_playlists 
        WHERE social_network_id IS NULL
    ) THEN
        RAISE NOTICE 'ATTENTION: Il reste des playlists sans réseau social assigné';
    ELSE
        -- Rendre la colonne NOT NULL
        ALTER TABLE public.user_content_playlists 
        ALTER COLUMN social_network_id SET NOT NULL;
        
        RAISE NOTICE 'Colonne social_network_id rendue obligatoire (NOT NULL)';
    END IF;
END $$;

-- 7. Vérification finale de la structure
SELECT 
    'Vérification finale' as check_type,
    'user_social_accounts' as table_name,
    COUNT(*) as total_records
FROM public.user_social_accounts
UNION ALL
SELECT 
    'Vérification finale' as check_type,
    'user_content_playlists' as table_name,
    COUNT(*) as total_records
FROM public.user_content_playlists
UNION ALL
SELECT 
    'Vérification finale' as check_type,
    'playlists_avec_reseau' as table_name,
    COUNT(*) as total_records
FROM public.user_content_playlists 
WHERE social_network_id IS NOT NULL;

-- 8. Test de la relation
SELECT 
    'Test relation' as check_type,
    s.platform,
    s.display_name,
    COUNT(p.id) as nombre_playlists
FROM public.user_social_accounts s
LEFT JOIN public.user_content_playlists p ON s.id = p.social_network_id
GROUP BY s.id, s.platform, s.display_name
ORDER BY s.platform;
