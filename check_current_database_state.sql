-- Script pour vérifier l'état actuel de la base de données
-- Sans faire de modifications

-- 1. Vérifier si les tables existent
SELECT 
    'Tables existantes' as check_type,
    table_name,
    'EXISTE' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_social_accounts', 'user_content_playlists', 'user_social_posts', 'playlist_posts')
ORDER BY table_name;

-- 2. Vérifier la structure de user_content_playlists
SELECT 
    'Structure user_content_playlists' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_content_playlists'
ORDER BY ordinal_position;

-- 3. Vérifier les contraintes de clé étrangère
SELECT 
    'Contraintes FK' as check_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'user_content_playlists'
ORDER BY tc.table_name, kcu.column_name;

-- 4. Compter les enregistrements par table
SELECT 
    'Comptage' as check_type,
    'user_social_accounts' as table_name,
    COUNT(*) as total_records
FROM public.user_social_accounts
UNION ALL
SELECT 
    'Comptage' as check_type,
    'user_content_playlists' as table_name,
    COUNT(*) as total_records
FROM public.user_content_playlists
UNION ALL
SELECT 
    'Comptage' as check_type,
    'user_social_posts' as table_name,
    COUNT(*) as total_records
FROM public.user_social_posts;

-- 5. Vérifier les playlists avec et sans réseau social
SELECT 
    'Playlists par statut' as check_type,
    CASE 
        WHEN social_network_id IS NULL THEN 'Sans réseau social'
        ELSE 'Avec réseau social'
    END as statut,
    COUNT(*) as nombre
FROM public.user_content_playlists
GROUP BY (social_network_id IS NULL);

-- 6. Vérifier la relation entre réseaux sociaux et playlists
SELECT 
    'Relation réseaux-playlists' as check_type,
    s.platform,
    s.display_name,
    s.username,
    COUNT(p.id) as nombre_playlists
FROM public.user_social_accounts s
LEFT JOIN public.user_content_playlists p ON s.id = p.social_network_id
GROUP BY s.id, s.platform, s.display_name, s.username
ORDER BY s.platform;

-- 7. Vérifier les utilisateurs et leurs données
SELECT 
    'Données par utilisateur' as check_type,
    u.id as user_id,
    COUNT(DISTINCT s.id) as reseaux_sociaux,
    COUNT(DISTINCT p.id) as playlists,
    COUNT(DISTINCT posts.id) as publications
FROM auth.users u
LEFT JOIN public.user_social_accounts s ON u.id = s.user_id
LEFT JOIN public.user_content_playlists p ON u.id = p.user_id
LEFT JOIN public.user_social_posts posts ON u.id = posts.user_id
GROUP BY u.id
ORDER BY reseaux_sociaux DESC, playlists DESC;
