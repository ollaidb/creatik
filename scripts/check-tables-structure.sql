-- Script pour vérifier la structure des tables existantes

-- 1. Vérifier la structure de content_titles
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles' 
ORDER BY ordinal_position;

-- 2. Vérifier la structure de exemplary_accounts
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exemplary_accounts' 
ORDER BY ordinal_position;

-- 3. Vérifier la structure de user_publications (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
ORDER BY ordinal_position;

-- 4. Voir quelques exemples de données dans content_titles
SELECT 
    id,
    title,
    type,
    platform,
    created_at
FROM content_titles 
LIMIT 5;

-- 5. Voir quelques exemples de données dans exemplary_accounts
SELECT 
    id,
    account_name,
    platform,
    created_at
FROM exemplary_accounts 
LIMIT 5;

-- 6. Vérifier s'il y a des colonnes qui pourraient contenir l'ID utilisateur
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'content_titles' 
AND column_name LIKE '%user%' OR column_name LIKE '%author%' OR column_name LIKE '%creator%';

-- 7. Vérifier s'il y a des colonnes qui pourraient contenir l'ID utilisateur dans exemplary_accounts
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'exemplary_accounts' 
AND column_name LIKE '%user%' OR column_name LIKE '%author%' OR column_name LIKE '%creator%'; 