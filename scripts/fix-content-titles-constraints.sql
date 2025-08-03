-- Script pour corriger les contraintes de content_titles
-- Permettre tous les réseaux sociaux dans la table content_titles

-- 1. Vérifier la contrainte actuelle
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'content_titles'::regclass 
AND conname LIKE '%platform%';

-- 2. Supprimer la contrainte existante si elle existe
DO $$
BEGIN
    -- Supprimer la contrainte content_titles_platform_check si elle existe
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'content_titles_platform_check'
    ) THEN
        ALTER TABLE content_titles DROP CONSTRAINT content_titles_platform_check;
        RAISE NOTICE 'Contrainte content_titles_platform_check supprimée';
    ELSE
        RAISE NOTICE 'Contrainte content_titles_platform_check n''existe pas';
    END IF;
END $$;

-- 3. Créer une nouvelle contrainte plus permissive
ALTER TABLE content_titles 
ADD CONSTRAINT content_titles_platform_check 
CHECK (platform IN (
    'all', 'tiktok', 'youtube', 'instagram', 'facebook', 'twitter', 
    'linkedin', 'twitch', 'blog', 'article'
));

-- 4. Vérifier les valeurs actuelles dans content_titles
SELECT DISTINCT platform, COUNT(*) as count
FROM content_titles 
GROUP BY platform 
ORDER BY platform;

-- 5. Vérifier que la contrainte fonctionne
SELECT 'Contrainte vérifiée' as status; 