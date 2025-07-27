-- Script pour corriger les politiques RLS et permettre l'insertion d'événements
-- Exécutez ce script dans votre dashboard Supabase

-- 1. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access to active events" ON daily_events;
DROP POLICY IF EXISTS "Allow public read access to event categories" ON event_categories;

-- 2. Créer de nouvelles politiques plus permissives
-- Politique pour permettre la lecture publique de tous les événements
CREATE POLICY "Allow public read access to all events" ON daily_events
    FOR SELECT USING (TRUE);

-- Politique pour permettre l'insertion publique (pour la synchronisation)
CREATE POLICY "Allow public insert events" ON daily_events
    FOR INSERT WITH CHECK (TRUE);

-- Politique pour permettre la mise à jour publique
CREATE POLICY "Allow public update events" ON daily_events
    FOR UPDATE USING (TRUE);

-- Politique pour permettre la lecture publique des catégories
CREATE POLICY "Allow public read access to event categories" ON event_categories
    FOR SELECT USING (TRUE);

-- Politique pour permettre l'insertion publique des catégories
CREATE POLICY "Allow public insert categories" ON event_categories
    FOR INSERT WITH CHECK (TRUE);

-- 3. Vérifier que les politiques sont actives
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('daily_events', 'event_categories');

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Politiques RLS mises à jour avec succès!';
    RAISE NOTICE 'Vous pouvez maintenant insérer de nouveaux événements.';
END $$; 