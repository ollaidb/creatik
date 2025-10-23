-- Script pour nettoyer les comptes sociaux en doublon
-- et corriger les contraintes

-- 1. Identifier les doublons
SELECT 
    user_id,
    platform,
    username,
    COUNT(*) as count
FROM public.user_social_accounts 
GROUP BY user_id, platform, username
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. Supprimer les doublons en gardant le plus récent
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, platform, username 
            ORDER BY created_at DESC
        ) as rn
    FROM public.user_social_accounts
)
DELETE FROM public.user_social_accounts 
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- 3. Vérifier qu'il n'y a plus de doublons
SELECT 
    'Après nettoyage' as status,
    COUNT(*) as total_accounts,
    COUNT(DISTINCT CONCAT(user_id, '-', platform, '-', username)) as unique_combinations
FROM public.user_social_accounts;

-- 4. Afficher les comptes restants par utilisateur
SELECT 
    user_id,
    platform,
    username,
    display_name,
    is_active,
    created_at
FROM public.user_social_accounts 
ORDER BY user_id, platform;
