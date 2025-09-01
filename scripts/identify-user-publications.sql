-- Script pour identifier comment distinguer les publications de l'utilisateur

-- 1. Voir toutes les colonnes disponibles dans content_titles
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles' 
ORDER BY ordinal_position;

-- 2. Voir toutes les colonnes disponibles dans exemplary_accounts
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exemplary_accounts' 
ORDER BY ordinal_position;

-- 3. Voir quelques exemples de publications récentes dans content_titles
SELECT 
    id,
    title,
    type,
    platform,
    created_at
FROM content_titles 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Voir quelques exemples de comptes récents dans exemplary_accounts
SELECT 
    id,
    account_name,
    platform,
    created_at
FROM exemplary_accounts 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Voir les publications dans user_publications avec plus de détails
SELECT 
    id,
    user_id,
    content_type,
    title,
    platform,
    created_at
FROM user_publications 
ORDER BY created_at DESC 
LIMIT 20; 