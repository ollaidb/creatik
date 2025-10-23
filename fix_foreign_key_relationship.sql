-- Script pour corriger la relation de clé étrangère entre user_content_playlists et user_social_accounts

-- 1. Vérifier la structure actuelle des tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_content_playlists', 'user_social_accounts')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les contraintes de clé étrangère existantes
SELECT 
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
    AND tc.table_name IN ('user_content_playlists', 'user_social_accounts');

-- 3. Supprimer la contrainte de clé étrangère existante si elle existe
DO $$
BEGIN
    -- Supprimer la contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_content_playlists_social_network_id_fkey'
        AND table_name = 'user_content_playlists'
    ) THEN
        ALTER TABLE public.user_content_playlists 
        DROP CONSTRAINT user_content_playlists_social_network_id_fkey;
        RAISE NOTICE 'Contrainte user_content_playlists_social_network_id_fkey supprimée';
    END IF;
END $$;

-- 4. Recréer la contrainte de clé étrangère correctement
ALTER TABLE public.user_content_playlists 
ADD CONSTRAINT user_content_playlists_social_network_id_fkey 
FOREIGN KEY (social_network_id) 
REFERENCES public.user_social_accounts(id) 
ON DELETE CASCADE;

-- 5. Vérifier que la contrainte a été créée
SELECT 
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
    AND tc.table_name = 'user_content_playlists'
    AND kcu.column_name = 'social_network_id';

-- 6. Tester la relation avec une requête
SELECT 
    p.id as playlist_id,
    p.name as playlist_name,
    p.social_network_id,
    s.platform,
    s.display_name
FROM public.user_content_playlists p
LEFT JOIN public.user_social_accounts s ON p.social_network_id = s.id
LIMIT 5;
