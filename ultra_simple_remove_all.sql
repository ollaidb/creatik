-- Script ultra-simple pour supprimer "all"
-- Utilise seulement SELECT * pour éviter les erreurs de colonnes

-- 1. Voir tout le contenu de la table
SELECT 'Avant suppression' as status, * FROM public.social_networks ORDER BY name;

-- 2. Supprimer "all"
DELETE FROM public.social_networks WHERE name = 'all';

-- 3. Voir le résultat
SELECT 'Après suppression' as status, * FROM public.social_networks ORDER BY name;

-- 4. Confirmation
DO $$
BEGIN
    RAISE NOTICE 'Suppression de "all" terminée !';
END $$;
