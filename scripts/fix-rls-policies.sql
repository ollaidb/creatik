-- Script pour corriger les politiques RLS de la table daily_events
-- Exécutez ce script dans votre base de données Supabase

-- ========================================
-- 1. VÉRIFICATION DES POLITIQUES ACTUELLES
-- ========================================

-- Voir les politiques existantes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_events';

-- ========================================
-- 2. SUPPRESSION DES ANCIENNES POLITIQUES
-- ========================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access to daily_events" ON daily_events;
DROP POLICY IF EXISTS "Allow admin insert on daily_events" ON daily_events;
DROP POLICY IF EXISTS "Allow admin update on daily_events" ON daily_events;

-- ========================================
-- 3. CRÉATION DE NOUVELLES POLITIQUES
-- ========================================

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access to daily_events" ON daily_events
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion par n'importe qui (pour les scripts d'API)
CREATE POLICY "Allow insert on daily_events" ON daily_events
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour par n'importe qui
CREATE POLICY "Allow update on daily_events" ON daily_events
    FOR UPDATE USING (true);

-- Politique pour permettre la suppression par n'importe qui
CREATE POLICY "Allow delete on daily_events" ON daily_events
    FOR DELETE USING (true);

-- ========================================
-- 4. VÉRIFICATION DES NOUVELLES POLITIQUES
-- ========================================

-- Vérifier que les nouvelles politiques sont en place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_events';

-- ========================================
-- 5. TEST D'INSERTION
-- ========================================

-- Test d'insertion d'un événement de test
INSERT INTO daily_events (
    event_type,
    title,
    description,
    date,
    category_id,
    tags,
    is_active
) VALUES (
    'holiday',
    'Test RLS',
    'Test des politiques RLS',
    CURRENT_DATE,
    '550e8400-e29b-41d4-a716-446655440221',
    ARRAY['#Test', '#RLS'],
    true
);

-- Vérifier que l'insertion a fonctionné
SELECT * FROM daily_events WHERE title = 'Test RLS';

-- Nettoyer le test
DELETE FROM daily_events WHERE title = 'Test RLS';

-- ========================================
-- 6. ALTERNATIVE : DÉSACTIVER TEMPORAIREMENT RLS
-- ========================================

-- Si les politiques ne fonctionnent pas, vous pouvez temporairement désactiver RLS
-- ALTER TABLE daily_events DISABLE ROW LEVEL SECURITY;

-- Pour réactiver plus tard :
-- ALTER TABLE daily_events ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 7. VÉRIFICATION FINALE
-- ========================================

-- Vérifier que la table est accessible
SELECT COUNT(*) as total_events FROM daily_events;

-- Vérifier que les catégories sont accessibles
SELECT COUNT(*) as total_categories FROM event_categories;

-- Afficher un exemple d'événement
SELECT 
    event_type,
    title,
    date,
    category_id
FROM daily_events 
LIMIT 5;
