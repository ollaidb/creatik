-- Script pour configurer le système de playlists et publications
-- Vérifier et corriger la structure pour que les publications changent selon la playlist

-- 1. Vérifier la structure des tables existantes
SELECT 
    'Structure des tables' as check_type,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_content_playlists', 'user_social_posts', 'playlist_posts')
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
    AND tc.table_name = 'playlist_posts'
ORDER BY tc.table_name, tc.constraint_name;

-- 3. Vérifier les données existantes
SELECT 
    'Données existantes' as check_type,
    'user_content_playlists' as table_name,
    COUNT(*) as total_records
FROM public.user_content_playlists
UNION ALL
SELECT 
    'Données existantes' as check_type,
    'user_social_posts' as table_name,
    COUNT(*) as total_records
FROM public.user_social_posts
UNION ALL
SELECT 
    'Données existantes' as check_type,
    'playlist_posts' as table_name,
    COUNT(*) as total_records
FROM public.playlist_posts;

-- 4. Créer des données de test si nécessaire
DO $$
DECLARE
    test_user_id uuid;
    test_playlist_id uuid;
    test_post_id uuid;
    test_social_account_id uuid;
BEGIN
    -- Récupérer un utilisateur de test
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé, création de données de test ignorée';
        RETURN;
    END IF;
    
    -- Vérifier s'il y a déjà des données
    IF NOT EXISTS (SELECT 1 FROM public.user_content_playlists WHERE user_id = test_user_id) THEN
        -- Créer un compte social de test
        INSERT INTO public.user_social_accounts (user_id, platform, username, display_name, is_active)
        VALUES (test_user_id, 'instagram', '@test_user', 'Test User', true)
        RETURNING id INTO test_social_account_id;
        
        -- Créer une playlist de test
        INSERT INTO public.user_content_playlists (user_id, social_network_id, name, description, is_public)
        VALUES (test_user_id, test_social_account_id, 'Ma première playlist', 'Playlist de test', false)
        RETURNING id INTO test_playlist_id;
        
        -- Créer des publications de test
        INSERT INTO public.user_social_posts (user_id, social_account_id, title, content, status)
        VALUES 
            (test_user_id, test_social_account_id, 'Publication 1', 'Contenu de la première publication', 'published'),
            (test_user_id, test_social_account_id, 'Publication 2', 'Contenu de la deuxième publication', 'published'),
            (test_user_id, test_social_account_id, 'Publication 3', 'Contenu de la troisième publication', 'published')
        RETURNING id INTO test_post_id;
        
        -- Associer les publications à la playlist
        INSERT INTO public.playlist_posts (playlist_id, post_id, position)
        VALUES 
            (test_playlist_id, test_post_id, 1),
            (test_playlist_id, test_post_id, 2),
            (test_playlist_id, test_post_id, 3);
        
        RAISE NOTICE 'Données de test créées pour l''utilisateur %', test_user_id;
    ELSE
        RAISE NOTICE 'Données existantes trouvées, pas de création de données de test';
    END IF;
END $$;

-- 5. Vérifier la relation playlist-publications
SELECT 
    'Relation playlist-publications' as check_type,
    p.name as playlist_name,
    p.description,
    COUNT(pp.post_id) as nombre_publications,
    STRING_AGG(sp.title, ', ') as titres_publications
FROM public.user_content_playlists p
LEFT JOIN public.playlist_posts pp ON p.id = pp.playlist_id
LEFT JOIN public.user_social_posts sp ON pp.post_id = sp.id
GROUP BY p.id, p.name, p.description
ORDER BY p.name;

-- 6. Vérifier les publications par playlist
SELECT 
    'Publications par playlist' as check_type,
    p.name as playlist_name,
    sp.title as publication_title,
    sp.content,
    sp.status,
    pp.position,
    pp.added_at
FROM public.user_content_playlists p
JOIN public.playlist_posts pp ON p.id = pp.playlist_id
JOIN public.user_social_posts sp ON pp.post_id = sp.id
ORDER BY p.name, pp.position;

-- 7. Créer des fonctions utiles pour l'application
CREATE OR REPLACE FUNCTION get_playlist_posts(playlist_uuid UUID)
RETURNS TABLE (
    post_id UUID,
    title VARCHAR,
    content TEXT,
    status VARCHAR,
    position INTEGER,
    added_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.id,
        sp.title,
        sp.content,
        sp.status,
        pp.position,
        pp.added_at
    FROM public.playlist_posts pp
    JOIN public.user_social_posts sp ON pp.post_id = sp.id
    WHERE pp.playlist_id = playlist_uuid
    ORDER BY pp.position, pp.added_at;
END;
$$ LANGUAGE plpgsql;

-- 8. Créer une fonction pour ajouter une publication à une playlist
CREATE OR REPLACE FUNCTION add_post_to_playlist(
    playlist_uuid UUID,
    post_uuid UUID,
    position_value INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    next_position INTEGER;
BEGIN
    -- Si pas de position spécifiée, prendre la prochaine position
    IF position_value IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1 INTO next_position
        FROM public.playlist_posts
        WHERE playlist_id = playlist_uuid;
    ELSE
        next_position := position_value;
    END IF;
    
    -- Insérer la relation
    INSERT INTO public.playlist_posts (playlist_id, post_id, position)
    VALUES (playlist_uuid, post_uuid, next_position)
    ON CONFLICT (playlist_id, post_id) DO NOTHING;
    
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 9. Créer une fonction pour retirer une publication d'une playlist
CREATE OR REPLACE FUNCTION remove_post_from_playlist(
    playlist_uuid UUID,
    post_uuid UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM public.playlist_posts
    WHERE playlist_id = playlist_uuid AND post_id = post_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 10. Vérification finale
SELECT 
    'Système configuré' as status,
    'Fonctions créées' as info,
    'get_playlist_posts, add_post_to_playlist, remove_post_from_playlist' as functions;

RAISE NOTICE 'Système de playlists et publications configuré avec succès !';
