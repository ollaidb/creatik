-- Script de diagnostic pour les tables d'événements (CORRIGÉ)
-- Vérifier l'existence et la structure des tables

-- 1. Vérifier si les tables d'événements existent
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%event%';

-- 2. Vérifier la structure de daily_events si elle existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'daily_events'
ORDER BY ordinal_position;

-- 3. Compter les événements dans daily_events
SELECT COUNT(*) as total_events FROM public.daily_events;

-- 4. Vérifier la structure de event_categories si elle existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'event_categories'
ORDER BY ordinal_position;

-- 5. Compter les catégories dans event_categories
SELECT COUNT(*) as total_categories FROM public.event_categories;

-- 6. Vérifier les permissions RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE '%event%';

-- 7. Vérifier les politiques RLS pour daily_events
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_events';

-- 8. Vérifier les politiques RLS pour event_categories
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'event_categories';

-- 9. Vérifier les contraintes
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name LIKE '%event%';

-- 10. Vérifier les index
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE '%event%';

-- 11. Afficher quelques exemples d'événements (si la table existe)
SELECT 
    id,
    event_type,
    title,
    date,
    category,
    is_active
FROM public.daily_events 
LIMIT 5;

-- 12. Afficher les catégories (si la table existe)
SELECT 
    id,
    name,
    color,
    icon
FROM public.event_categories 
ORDER BY name; 