-- Script simple pour désactiver temporairement le RLS sur daily_events
-- Exécutez ce script dans votre base de données Supabase

-- Désactiver RLS temporairement
ALTER TABLE daily_events DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est désactivé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'daily_events';

-- Message de confirmation
SELECT 'RLS désactivé temporairement sur daily_events' as status;

-- Pour réactiver plus tard, utilisez :
-- ALTER TABLE daily_events ENABLE ROW LEVEL SECURITY;
