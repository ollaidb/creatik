-- Script de vérification pour les publications
-- Vérifier la structure des tables et les données

-- 1. Vérifier la structure de la table content_titles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_titles' 
ORDER BY ordinal_position;

-- 2. Vérifier la structure de la table exemplary_accounts
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'exemplary_accounts' 
ORDER BY ordinal_position;

-- 3. Vérifier la structure de la table user_publications
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
ORDER BY ordinal_position;

-- 4. Vérifier si la colonne user_id existe dans user_publications
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
AND column_name = 'user_id';

-- 5. Compter le nombre total de publications dans content_titles
SELECT 
    COUNT(*) as total_content_titles,
    COUNT(CASE WHEN type = 'title' THEN 1 END) as titles,
    COUNT(CASE WHEN type = 'hook' THEN 1 END) as hooks
FROM content_titles;

-- 6. Compter le nombre total de comptes dans exemplary_accounts
SELECT 
    COUNT(*) as total_accounts
FROM exemplary_accounts;

-- 7. Compter le nombre total de publications utilisateur
SELECT 
    COUNT(*) as total_user_publications,
    COUNT(DISTINCT user_id) as unique_users
FROM user_publications;

-- 8. Voir les 5 dernières publications de content_titles
SELECT 
    id,
    title,
    type,
    platform,
    created_at
FROM content_titles 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Voir les 5 derniers comptes de exemplary_accounts
SELECT 
    id,
    account_name,
    platform,
    created_at
FROM exemplary_accounts 
ORDER BY created_at DESC 
LIMIT 5;

-- 10. Voir les 5 dernières publications utilisateur
SELECT 
    id,
    title,
    content_type,
    user_id,
    platform,
    created_at
FROM user_publications 
ORDER BY created_at DESC 
LIMIT 5;

-- 11. Vérifier les types de contenu dans content_titles
SELECT 
    type,
    COUNT(*) as count
FROM content_titles 
GROUP BY type;

-- 12. Vérifier les types de contenu dans user_publications
SELECT 
    content_type,
    COUNT(*) as count
FROM user_publications 
GROUP BY content_type;

-- 13. Vérifier les plateformes dans content_titles
SELECT 
    platform,
    COUNT(*) as count
FROM content_titles 
WHERE platform IS NOT NULL
GROUP BY platform;

-- 14. Vérifier les plateformes dans exemplary_accounts
SELECT 
    platform,
    COUNT(*) as count
FROM exemplary_accounts 
WHERE platform IS NOT NULL
GROUP BY platform;

-- 15. Vérifier les plateformes dans user_publications
SELECT 
    platform,
    COUNT(*) as count
FROM user_publications 
WHERE platform IS NOT NULL
GROUP BY platform;

-- 16. Voir un exemple de publication complète de user_publications
SELECT 
    'user_publications' as table_name,
    id,
    title,
    content_type,
    user_id,
    platform,
    created_at
FROM user_publications 
ORDER BY created_at DESC 
LIMIT 1;

-- 17. Vérifier les utilisateurs qui ont des publications
SELECT 
    user_id,
    COUNT(*) as publication_count
FROM user_publications 
GROUP BY user_id 
ORDER BY publication_count DESC; 