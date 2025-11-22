-- Script de diagnostic pour les tables d'événements
-- Vérifier l'existence et la structure des tables

-- 1. Vérifier si la table daily_events existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%event%';

-- 2. Si la table daily_events existe, vérifier sa structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_events') THEN
        RAISE NOTICE 'Table daily_events existe - Vérification de la structure:';
        
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'daily_events'
        ORDER BY ordinal_position;
        
        -- Compter les enregistrements
        EXECUTE 'SELECT COUNT(*) as total_events FROM daily_events';
        
        -- Vérifier les RLS policies
        SELECT 
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
        FROM pg_policies 
        WHERE tablename = 'daily_events';
        
    ELSE
        RAISE NOTICE 'Table daily_events n''existe PAS';
    END IF;
END $$;

-- 3. Vérifier si la table event_categories existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_categories') THEN
        RAISE NOTICE 'Table event_categories existe - Vérification de la structure:';
        
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event_categories'
        ORDER BY ordinal_position;
        
        -- Compter les enregistrements
        EXECUTE 'SELECT COUNT(*) as total_categories FROM event_categories';
        
    ELSE
        RAISE NOTICE 'Table event_categories n''existe PAS';
    END IF;
END $$;

-- 4. Vérifier les permissions RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE '%event%';

-- 5. Vérifier les contraintes
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