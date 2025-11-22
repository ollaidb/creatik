-- Ajouter les colonnes platform et url à la table pending_publications
-- Ces colonnes sont nécessaires pour les types de contenu 'source' et 'account'

-- Vérifier si les colonnes existent déjà
DO $$
BEGIN
    -- Ajouter la colonne platform si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'platform'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN platform TEXT;
    END IF;

    -- Ajouter la colonne url si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'url'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN url TEXT;
    END IF;
END $$;

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pending_publications' 
AND column_name IN ('platform', 'url')
ORDER BY column_name; 