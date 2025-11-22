-- ============================================================================
-- SCRIPT DE VÉRIFICATION POUR LA PAGE DE PROFIL
-- ============================================================================
-- Ce script vérifie :
-- 1. Les tables nécessaires pour la page de profil
-- 2. Les tables de défis de la page de profil (à supprimer)
-- 3. Les tables de défis communautaires (À CONSERVER - ne pas supprimer)
-- 4. Les colonnes importantes des tables de profil
--
-- ⚠️ ATTENTION : Ce script NE SUPPRIME RIEN, il vérifie uniquement !
-- ============================================================================

-- ============================================================================
-- 1. VÉRIFICATION DES TABLES NÉCESSAIRES POUR LA PAGE DE PROFIL
-- ============================================================================

SELECT 
    'TABLES NÉCESSAIRES POUR LE PROFIL' as section,
    table_name as table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ PRÉSENTE'
        ELSE '❌ MANQUANTE'
    END as statut
FROM (
    VALUES 
        ('user_social_accounts'),
        ('user_social_posts'),
        ('user_content_playlists'),
        ('playlist_posts'),
        ('user_notes'),
        ('user_notifications')
) AS required_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = required_tables.table_name
ORDER BY statut DESC, table_name;

-- ============================================================================
-- 2. VÉRIFICATION DES TABLES DE DÉFIS DE LA PAGE DE PROFIL (À SUPPRIMER)
-- ============================================================================

SELECT 
    'DÉFIS DE PROFIL (À SUPPRIMER)' as section,
    table_name as table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '⚠️ PRÉSENTE - À SUPPRIMER'
        ELSE '✅ ABSENTE - Déjà supprimée'
    END as statut
FROM (
    VALUES 
        ('user_challenges'),
        ('user_challenge_stats'),
        ('user_rewards'),
        ('challenge_leaderboard'),
        ('user_custom_challenges'),
        ('user_custom_challenges_completed'),
        ('user_program_settings')
) AS profile_challenge_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = profile_challenge_tables.table_name
ORDER BY statut DESC, table_name;

-- ============================================================================
-- 3. VÉRIFICATION DES TABLES DE DÉFIS COMMUNAUTAIRES (À CONSERVER)
-- ============================================================================

SELECT 
    'DÉFIS COMMUNAUTAIRES (À CONSERVER)' as section,
    table_name as table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ PRÉSENTE - À CONSERVER'
        ELSE 'ℹ️ ABSENTE'
    END as statut
FROM (
    VALUES 
        ('challenges'),
        ('challenge_comments'),
        ('challenge_comment_likes'),
        ('challenge_likes'),
        ('public_challenges')
) AS community_challenge_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = community_challenge_tables.table_name
ORDER BY statut DESC, table_name;

-- ============================================================================
-- 4. VÉRIFICATION DES COLONNES IMPORTANTES
-- ============================================================================

SELECT 
    'COLONNES IMPORTANTES' as section,
    table_name || '.' || column_name as colonne,
    CASE 
        WHEN column_name IS NOT NULL THEN '✅ PRÉSENTE'
        ELSE '⚠️ MANQUANTE'
    END as statut
FROM (
    VALUES 
        ('user_content_playlists', 'order'),
        ('user_content_playlists', 'social_network_id'),
        ('user_notes', 'order_index'),
        ('user_notes', 'is_pinned')
) AS required_columns(table_name, column_name)
LEFT JOIN information_schema.columns c
    ON c.table_schema = 'public' 
    AND c.table_name = required_columns.table_name
    AND c.column_name = required_columns.column_name
ORDER BY statut DESC, colonne;

-- ============================================================================
-- 5. RÉSUMÉ GLOBAL
-- ============================================================================

SELECT 
    'RÉSUMÉ' as section,
    COUNT(*) as total,
    COUNT(CASE WHEN table_name IS NOT NULL THEN 1 END) as presentes,
    COUNT(CASE WHEN table_name IS NULL THEN 1 END) as manquantes
FROM (
    VALUES 
        ('user_social_accounts'),
        ('user_social_posts'),
        ('user_content_playlists'),
        ('playlist_posts'),
        ('user_notes'),
        ('user_notifications')
) AS required_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = required_tables.table_name;

-- Compter les tables de défis de profil à supprimer
SELECT 
    'DÉFIS DE PROFIL À SUPPRIMER' as section,
    COUNT(*) as total_tables,
    COUNT(CASE WHEN table_name IS NOT NULL THEN 1 END) as a_supprimer,
    COUNT(CASE WHEN table_name IS NULL THEN 1 END) as deja_supprimees
FROM (
    VALUES 
        ('user_challenges'),
        ('user_challenge_stats'),
        ('user_rewards'),
        ('challenge_leaderboard'),
        ('user_custom_challenges'),
        ('user_custom_challenges_completed'),
        ('user_program_settings')
) AS profile_challenge_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = profile_challenge_tables.table_name;

-- Compter les tables de défis communautaires à conserver
SELECT 
    'DÉFIS COMMUNAUTAIRES À CONSERVER' as section,
    COUNT(*) as total_tables,
    COUNT(CASE WHEN table_name IS NOT NULL THEN 1 END) as presentes
FROM (
    VALUES 
        ('challenges'),
        ('challenge_comments'),
        ('challenge_comment_likes'),
        ('challenge_likes'),
        ('public_challenges')
) AS community_challenge_tables(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' 
    AND t.table_name = community_challenge_tables.table_name;

-- ============================================================================
-- FIN DU SCRIPT DE VÉRIFICATION
-- ============================================================================
-- 
-- INTERPRÉTATION DES RÉSULTATS :
-- 
-- ✅ PRÉSENTE : La table/colonne existe
-- ❌ MANQUANTE : La table/colonne n'existe pas et doit être créée
-- ⚠️ À SUPPRIMER : La table existe et doit être supprimée (défis de profil)
-- ✅ ABSENTE - Déjà supprimée : La table n'existe pas (c'est bien)
-- ℹ️ ABSENTE : La table n'existe pas (normal si pas utilisée)
--
-- Si vous voyez des tables "À SUPPRIMER" dans la section "DÉFIS DE PROFIL",
-- exécutez la migration : 20250128000007-remove-challenges-tables.sql
-- ============================================================================

