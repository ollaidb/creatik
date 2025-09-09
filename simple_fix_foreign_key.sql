-- Script simple pour corriger la relation de clé étrangère

-- 1. Vérifier si la contrainte existe déjà
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'user_content_playlists' 
AND constraint_name = 'user_content_playlists_social_network_id_fkey';

-- 2. Supprimer la contrainte si elle existe (avec gestion d'erreur)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_content_playlists_social_network_id_fkey'
        AND table_name = 'user_content_playlists'
    ) THEN
        ALTER TABLE public.user_content_playlists 
        DROP CONSTRAINT user_content_playlists_social_network_id_fkey;
        RAISE NOTICE 'Ancienne contrainte supprimée';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la suppression: %', SQLERRM;
END $$;

-- 3. Créer la nouvelle contrainte
DO $$
BEGIN
    ALTER TABLE public.user_content_playlists 
    ADD CONSTRAINT user_content_playlists_social_network_id_fkey 
    FOREIGN KEY (social_network_id) 
    REFERENCES public.user_social_accounts(id) 
    ON DELETE CASCADE;
    RAISE NOTICE 'Nouvelle contrainte créée avec succès';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la création: %', SQLERRM;
END $$;

-- 4. Vérifier que tout fonctionne
SELECT 
    'user_content_playlists' as table_name,
    COUNT(*) as total_playlists
FROM public.user_content_playlists;

SELECT 
    'user_social_accounts' as table_name,
    COUNT(*) as total_accounts
FROM public.user_social_accounts;
