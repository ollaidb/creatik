-- Script simple pour supprimer "all" de la table social_networks
-- Sans vérifier les colonnes qui n'existent pas

-- 1. Voir les réseaux sociaux actuels
SELECT 
    id,
    name,
    display_name,
    icon_url,
    color
FROM public.social_networks
ORDER BY name;

-- 2. Supprimer "all" directement
DELETE FROM public.social_networks 
WHERE name = 'all';

-- 3. Vérifier que c'est supprimé
SELECT 
    'Après suppression' as status,
    id,
    name,
    display_name
FROM public.social_networks
ORDER BY name;

-- 4. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Suppression de "all" terminée !';
END $$;
