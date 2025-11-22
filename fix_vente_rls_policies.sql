-- Correction des politiques RLS pour les tables de configuration
-- Date: 2025-08-03

-- 1. Supprimer les politiques existantes sur category_hierarchy_config
DROP POLICY IF EXISTS "Enable read access for all users" ON public.category_hierarchy_config;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.category_hierarchy_config;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.category_hierarchy_config;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.category_hierarchy_config;

-- 2. Supprimer les politiques existantes sur subcategory_hierarchy_config
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subcategory_hierarchy_config;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.subcategory_hierarchy_config;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.subcategory_hierarchy_config;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.subcategory_hierarchy_config;

-- 3. Créer de nouvelles politiques pour category_hierarchy_config
CREATE POLICY "Enable read access for all users" ON public.category_hierarchy_config
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.category_hierarchy_config
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.category_hierarchy_config
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.category_hierarchy_config
    FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Créer de nouvelles politiques pour subcategory_hierarchy_config
CREATE POLICY "Enable read access for all users" ON public.subcategory_hierarchy_config
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.subcategory_hierarchy_config
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.subcategory_hierarchy_config
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.subcategory_hierarchy_config
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. S'assurer que RLS est activé sur les tables
ALTER TABLE public.category_hierarchy_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategory_hierarchy_config ENABLE ROW LEVEL SECURITY; 