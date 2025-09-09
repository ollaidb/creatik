-- Script corrigé pour supprimer la colonne "all" de la table social_networks
-- Vérification de la structure réelle de la table

-- 1. Vérifier la structure réelle de la table social_networks
SELECT 
    'Structure de social_networks' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'social_networks'
ORDER BY ordinal_position;

-- 2. Vérifier l'état actuel de la table social_networks (avec les bonnes colonnes)
SELECT 
    'État actuel' as check_type,
    id,
    name,
    display_name,
    icon_url,
    color
FROM public.social_networks
ORDER BY name;

-- 3. Vérifier les références à "all" dans d'autres tables
SELECT 
    'Références à "all"' as check_type,
    'title_templates' as table_name,
    COUNT(*) as count
FROM public.title_templates 
WHERE platform = 'all'
UNION ALL
SELECT 
    'Références à "all"' as check_type,
    'generated_titles' as table_name,
    COUNT(*) as count
FROM public.generated_titles 
WHERE platform = 'all'
UNION ALL
SELECT 
    'Références à "all"' as check_type,
    'search_suggestions' as table_name,
    COUNT(*) as count
FROM public.search_suggestions 
WHERE platform = 'all';

-- 4. Supprimer les références à "all" dans les tables liées
-- Mettre à jour les title_templates
UPDATE public.title_templates 
SET platform = 'general' 
WHERE platform = 'all';

-- Mettre à jour les generated_titles
UPDATE public.generated_titles 
SET platform = 'general' 
WHERE platform = 'all';

-- Mettre à jour les search_suggestions
UPDATE public.search_suggestions 
SET platform = 'general' 
WHERE platform = 'all';

-- 5. Supprimer l'entrée "all" de la table social_networks
DELETE FROM public.social_networks 
WHERE name = 'all';

-- 6. Vérifier que la suppression a bien eu lieu
SELECT 
    'Après suppression' as check_type,
    id,
    name,
    display_name,
    icon_url,
    color
FROM public.social_networks
ORDER BY name;

-- 7. Vérifier qu'il n'y a plus de références à "all"
SELECT 
    'Vérification finale' as check_type,
    'title_templates' as table_name,
    COUNT(*) as count
FROM public.title_templates 
WHERE platform = 'all'
UNION ALL
SELECT 
    'Vérification finale' as check_type,
    'generated_titles' as table_name,
    COUNT(*) as count
FROM public.generated_titles 
WHERE platform = 'all'
UNION ALL
SELECT 
    'Vérification finale' as check_type,
    'search_suggestions' as table_name,
    COUNT(*) as count
FROM public.search_suggestions 
WHERE platform = 'all';

-- 8. Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Suppression de la colonne "all" terminée avec succès !';
    RAISE NOTICE 'Toutes les références ont été mises à jour vers "general"';
END $$;
