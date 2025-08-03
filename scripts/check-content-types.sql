-- Vérifier les types de contenu dans content_titles
SELECT 
    type,
    COUNT(*) as count
FROM content_titles 
GROUP BY type
ORDER BY count DESC;

-- Voir quelques exemples avec type NULL
SELECT 
    id,
    title,
    type,
    platform,
    created_at
FROM content_titles 
WHERE type IS NULL
LIMIT 5;

-- Voir quelques exemples avec type non-NULL
SELECT 
    id,
    title,
    type,
    platform,
    created_at
FROM content_titles 
WHERE type IS NOT NULL
LIMIT 5; 