-- Script pour vérifier la structure réelle de la table social_networks
-- Avant de supprimer "all"

-- 1. Vérifier la structure exacte de la table social_networks
SELECT 
    'Structure de social_networks' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'social_networks'
ORDER BY ordinal_position;

-- 2. Voir le contenu actuel avec seulement les colonnes qui existent
SELECT 
    'Contenu actuel' as info,
    *
FROM public.social_networks
ORDER BY name;
