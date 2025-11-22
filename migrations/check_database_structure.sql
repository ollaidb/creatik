-- Vérifier la structure de la base de données
-- Date: 2024-12-19

-- 1. Vérifier la structure de user_social_accounts
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_social_accounts' 
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes de user_social_accounts
SELECT constraint_name, constraint_type, column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_social_accounts';

-- 3. Vérifier la structure de user_content_playlists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_content_playlists' 
ORDER BY ordinal_position;

-- 4. Vérifier les contraintes de user_content_playlists
SELECT constraint_name, constraint_type, column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_content_playlists';
