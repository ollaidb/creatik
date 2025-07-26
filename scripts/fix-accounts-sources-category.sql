-- Script pour corriger les colonnes category et subcategory
-- Exécutez ce script dans votre base de données Supabase

-- 1. Ajouter les colonnes category et subcategory à exemplary_accounts
DO $$
BEGIN
    -- Ajouter la colonne category si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exemplary_accounts' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE exemplary_accounts ADD COLUMN category TEXT;
    END IF;

    -- Ajouter la colonne subcategory si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exemplary_accounts' 
        AND column_name = 'subcategory'
    ) THEN
        ALTER TABLE exemplary_accounts ADD COLUMN subcategory TEXT;
    END IF;
END $$;

-- 2. Mettre à jour les données existantes dans exemplary_accounts
UPDATE exemplary_accounts 
SET 
    category = 'Activisme',
    subcategory = 'Campagnes'
WHERE subcategory_id = (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1);

-- 3. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_exemplary_accounts_category ON exemplary_accounts(category);
CREATE INDEX IF NOT EXISTS idx_exemplary_accounts_subcategory ON exemplary_accounts(subcategory);

-- 4. Vérifier que les données ont été mises à jour
SELECT 'Comptes mis à jour:' as info;
SELECT id, account_name, platform, category, subcategory 
FROM exemplary_accounts 
WHERE category = 'Activisme' AND subcategory = 'Campagnes'
ORDER BY created_at DESC;

-- 5. Vérifier les sources existantes
SELECT 'Sources existantes:' as info;
SELECT id, title, category, subcategory 
FROM sources 
WHERE category = 'Activisme' AND subcategory = 'Campagnes'
ORDER BY created_at DESC; 