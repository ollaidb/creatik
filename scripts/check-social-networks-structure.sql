-- Script pour vérifier la structure de la table social_networks
-- Voir quelles colonnes existent

-- 1. Vérifier la structure de la table social_networks
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'social_networks'
ORDER BY ordinal_position;

-- 2. Voir les données existantes
SELECT * FROM social_networks LIMIT 5; 