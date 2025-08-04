-- Script pour sécuriser toutes les tables "Unrestricted"
-- Date: 2025-08-04

-- 1. ACTIVER RLS SUR TOUTES LES TABLES "UNRESTRICTED" QUI EXISTENT
ALTER TABLE social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_blocks ENABLE ROW LEVEL SECURITY;

-- 2. CRÉER DES POLITIQUES RLS SÉCURISÉES

-- Social Networks - Lecture publique, écriture utilisateurs authentifiés
DROP POLICY IF EXISTS "social_networks_select_policy" ON social_networks;
CREATE POLICY "social_networks_select_policy" ON social_networks
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "social_networks_insert_policy" ON social_networks;
CREATE POLICY "social_networks_insert_policy" ON social_networks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "social_networks_update_policy" ON social_networks;
CREATE POLICY "social_networks_update_policy" ON social_networks
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Subcategories - Lecture publique, écriture utilisateurs authentifiés
DROP POLICY IF EXISTS "subcategories_select_policy" ON subcategories;
CREATE POLICY "subcategories_select_policy" ON subcategories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "subcategories_insert_policy" ON subcategories;
CREATE POLICY "subcategories_insert_policy" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "subcategories_update_policy" ON subcategories;
CREATE POLICY "subcategories_update_policy" ON subcategories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- User Challenges - Accès personnel uniquement
DROP POLICY IF EXISTS "user_challenges_personal_policy" ON user_challenges;
CREATE POLICY "user_challenges_personal_policy" ON user_challenges
    FOR ALL USING (auth.uid() = user_id);

-- Word Blocks - Lecture publique, écriture utilisateurs authentifiés
DROP POLICY IF EXISTS "word_blocks_select_policy" ON word_blocks;
CREATE POLICY "word_blocks_select_policy" ON word_blocks
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "word_blocks_insert_policy" ON word_blocks;
CREATE POLICY "word_blocks_insert_policy" ON word_blocks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "word_blocks_update_policy" ON word_blocks;
CREATE POLICY "word_blocks_update_policy" ON word_blocks
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. VÉRIFIER QUE LES TABLES SONT SÉCURISÉES
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ SÉCURISÉ'
        ELSE '❌ NON SÉCURISÉ'
    END as status
FROM pg_tables 
WHERE tablename IN ('social_networks', 'subcategories', 'user_challenges', 'word_blocks')
ORDER BY tablename;

-- 4. VÉRIFIER LES POLITIQUES RLS
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
WHERE tablename IN ('social_networks', 'subcategories', 'user_challenges', 'word_blocks')
ORDER BY tablename, policyname; 