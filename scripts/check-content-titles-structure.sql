-- Vérifier la structure exacte de content_titles
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'content_titles' 
ORDER BY ordinal_position;

-- Voir quelques exemples de données dans content_titles
SELECT 
    id,
    title,
    type,
    platform,
    subcategory_id,
    created_at
FROM content_titles 
LIMIT 5;

-- Vérifier la structure exacte de exemplary_accounts
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exemplary_accounts' 
ORDER BY ordinal_position;

-- Voir quelques exemples de données dans exemplary_accounts
SELECT 
    id,
    account_name,
    platform,
    subcategory_id,
    created_at
FROM exemplary_accounts 
LIMIT 5; 