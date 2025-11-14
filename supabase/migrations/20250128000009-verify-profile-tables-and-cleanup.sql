-- Script de vérification et nettoyage pour la page de profil
-- Ce script vérifie les tables nécessaires et identifie les tables de défis de la page de profil à supprimer
-- ⚠️ ATTENTION : Ce script NE SUPPRIME PAS les tables des défis communautaires (challenges, challenge_comments, challenge_likes)

-- ============================================================================
-- PARTIE 1 : VÉRIFICATION DES TABLES NÉCESSAIRES POUR LA PAGE DE PROFIL
-- ============================================================================

DO $$
DECLARE
    table_count INTEGER;
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    required_tables TEXT[] := ARRAY[
        'user_social_accounts',
        'user_social_posts',
        'user_content_playlists',
        'playlist_posts',
        'user_notes',
        'user_notifications'
    ];
    table_name TEXT;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VÉRIFICATION DES TABLES DE LA PAGE DE PROFIL';
    RAISE NOTICE '========================================';
    
    FOREACH table_name IN ARRAY required_tables
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = table_name;
        
        IF table_count = 0 THEN
            missing_tables := array_append(missing_tables, table_name);
            RAISE NOTICE '❌ Table manquante: %', table_name;
        ELSE
            RAISE NOTICE '✅ Table présente: %', table_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  ATTENTION : % table(s) manquante(s)', array_length(missing_tables, 1);
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Toutes les tables nécessaires sont présentes !';
    END IF;
END $$;

-- ============================================================================
-- PARTIE 2 : VÉRIFICATION DES TABLES DE DÉFIS DE LA PAGE DE PROFIL
-- ============================================================================

DO $$
DECLARE
    table_count INTEGER;
    profile_challenge_tables TEXT[] := ARRAY[]::TEXT[];
    table_name TEXT;
    tables_to_check TEXT[] := ARRAY[
        'user_challenges',
        'user_challenge_stats',
        'user_rewards',
        'challenge_leaderboard',
        'user_custom_challenges',
        'user_custom_challenges_completed',
        'user_program_settings'
    ];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VÉRIFICATION DES TABLES DE DÉFIS DE LA PAGE DE PROFIL';
    RAISE NOTICE '========================================';
    
    FOREACH table_name IN ARRAY tables_to_check
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = table_name;
        
        IF table_count > 0 THEN
            profile_challenge_tables := array_append(profile_challenge_tables, table_name);
            RAISE NOTICE '⚠️  Table de défi de profil trouvée (à supprimer): %', table_name;
        ELSE
            RAISE NOTICE '✅ Table de défi de profil absente (déjà supprimée): %', table_name;
        END IF;
    END LOOP;
    
    IF array_length(profile_challenge_tables, 1) > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  ATTENTION : % table(s) de défi de profil à supprimer trouvée(s)', array_length(profile_challenge_tables, 1);
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Toutes les tables de défis de profil ont été supprimées !';
    END IF;
END $$;

-- ============================================================================
-- PARTIE 3 : VÉRIFICATION DES TABLES DE DÉFIS COMMUNAUTAIRES (NE PAS SUPPRIMER)
-- ============================================================================

DO $$
DECLARE
    table_count INTEGER;
    community_tables TEXT[] := ARRAY[]::TEXT[];
    table_name TEXT;
    tables_to_protect TEXT[] := ARRAY[
        'challenges',
        'challenge_comments',
        'challenge_likes',
        'public_challenges'
    ];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VÉRIFICATION DES TABLES DE DÉFIS COMMUNAUTAIRES (À CONSERVER)';
    RAISE NOTICE '========================================';
    
    FOREACH table_name IN ARRAY tables_to_protect
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = table_name;
        
        IF table_count > 0 THEN
            community_tables := array_append(community_tables, table_name);
            RAISE NOTICE '✅ Table communautaire trouvée (À CONSERVER): %', table_name;
        ELSE
            RAISE NOTICE 'ℹ️  Table communautaire absente: %', table_name;
        END IF;
    END LOOP;
    
    IF array_length(community_tables, 1) > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ % table(s) communautaire(s) trouvée(s) - Ces tables NE SERONT PAS SUPPRIMÉES', array_length(community_tables, 1);
    END IF;
END $$;

-- ============================================================================
-- PARTIE 4 : VÉRIFICATION DES COLONNES DES TABLES DE PROFIL
-- ============================================================================

DO $$
DECLARE
    column_count INTEGER;
    missing_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VÉRIFICATION DES COLONNES IMPORTANTES';
    RAISE NOTICE '========================================';
    
    -- Vérifier la colonne order dans user_content_playlists
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_content_playlists'
    AND column_name = 'order';
    
    IF column_count = 0 THEN
        missing_columns := array_append(missing_columns, 'user_content_playlists.order');
        RAISE NOTICE '⚠️  Colonne manquante: user_content_playlists.order';
    ELSE
        RAISE NOTICE '✅ Colonne présente: user_content_playlists.order';
    END IF;
    
    -- Vérifier la colonne social_network_id dans user_content_playlists
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_content_playlists'
    AND column_name = 'social_network_id';
    
    IF column_count = 0 THEN
        missing_columns := array_append(missing_columns, 'user_content_playlists.social_network_id');
        RAISE NOTICE '⚠️  Colonne manquante: user_content_playlists.social_network_id';
    ELSE
        RAISE NOTICE '✅ Colonne présente: user_content_playlists.social_network_id';
    END IF;
    
    -- Vérifier la colonne order_index dans user_notes
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_notes'
    AND column_name = 'order_index';
    
    IF column_count = 0 THEN
        missing_columns := array_append(missing_columns, 'user_notes.order_index');
        RAISE NOTICE '⚠️  Colonne manquante: user_notes.order_index';
    ELSE
        RAISE NOTICE '✅ Colonne présente: user_notes.order_index';
    END IF;
    
    -- Vérifier la colonne is_pinned dans user_notes
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_notes'
    AND column_name = 'is_pinned';
    
    IF column_count = 0 THEN
        missing_columns := array_append(missing_columns, 'user_notes.is_pinned');
        RAISE NOTICE '⚠️  Colonne manquante: user_notes.is_pinned';
    ELSE
        RAISE NOTICE '✅ Colonne présente: user_notes.is_pinned';
    END IF;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  ATTENTION : % colonne(s) manquante(s)', array_length(missing_columns, 1);
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Toutes les colonnes importantes sont présentes !';
    END IF;
END $$;

-- ============================================================================
-- PARTIE 5 : RÉSUMÉ FINAL
-- ============================================================================

DO $$
DECLARE
    profile_challenge_count INTEGER;
    community_challenge_count INTEGER;
    required_tables_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RÉSUMÉ FINAL';
    RAISE NOTICE '========================================';
    
    -- Compter les tables de défis de profil
    SELECT COUNT(*) INTO profile_challenge_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'user_challenges',
        'user_challenge_stats',
        'user_rewards',
        'challenge_leaderboard',
        'user_custom_challenges',
        'user_custom_challenges_completed',
        'user_program_settings'
    );
    
    -- Compter les tables de défis communautaires
    SELECT COUNT(*) INTO community_challenge_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'challenges',
        'challenge_comments',
        'challenge_likes',
        'public_challenges'
    );
    
    -- Compter les tables nécessaires pour le profil
    SELECT COUNT(*) INTO required_tables_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'user_social_accounts',
        'user_social_posts',
        'user_content_playlists',
        'playlist_posts',
        'user_notes',
        'user_notifications'
    );
    
    RAISE NOTICE '📊 Statistiques :';
    RAISE NOTICE '   - Tables nécessaires pour le profil: %/6', required_tables_count;
    RAISE NOTICE '   - Tables de défis de profil (à supprimer): %', profile_challenge_count;
    RAISE NOTICE '   - Tables de défis communautaires (à conserver): %', community_challenge_count;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Ce script de vérification est terminé.';
    RAISE NOTICE '⚠️  Pour supprimer les tables de défis de profil, exécutez la migration:';
    RAISE NOTICE '    20250128000007-remove-challenges-tables.sql';
    RAISE NOTICE '';
END $$;

