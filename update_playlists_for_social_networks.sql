-- Script pour modifier les playlists pour qu'elles soient liées aux réseaux sociaux
-- Ajouter une colonne social_network_id à la table user_content_playlists

-- 1. Ajouter la colonne social_network_id
ALTER TABLE public.user_content_playlists 
ADD COLUMN IF NOT EXISTS social_network_id UUID REFERENCES public.user_social_accounts(id) ON DELETE CASCADE;

-- 2. Ajouter un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_content_playlists_social_network_id 
ON public.user_content_playlists(social_network_id);

-- 3. Mettre à jour les playlists existantes (si elles existent)
-- Associer les playlists existantes au premier réseau social de l'utilisateur
DO $$
DECLARE
    user_record RECORD;
    first_social_account_id UUID;
BEGIN
    -- Pour chaque utilisateur qui a des playlists
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_content_playlists 
        WHERE social_network_id IS NULL
    LOOP
        -- Récupérer le premier réseau social de l'utilisateur
        SELECT id INTO first_social_account_id 
        FROM public.user_social_accounts 
        WHERE user_id = user_record.user_id 
        ORDER BY created_at ASC 
        LIMIT 1;
        
        -- Si l'utilisateur a un réseau social, associer les playlists
        IF first_social_account_id IS NOT NULL THEN
            UPDATE public.user_content_playlists 
            SET social_network_id = first_social_account_id
            WHERE user_id = user_record.user_id 
            AND social_network_id IS NULL;
            
            RAISE NOTICE 'Playlists associées au réseau social pour l''utilisateur %', user_record.user_id;
        END IF;
    END LOOP;
END $$;

-- 4. Mettre à jour les politiques RLS pour inclure social_network_id
DROP POLICY IF EXISTS "Users can view their own playlists" ON public.user_content_playlists;
DROP POLICY IF EXISTS "Users can create their own playlists" ON public.user_content_playlists;
DROP POLICY IF EXISTS "Users can update their own playlists" ON public.user_content_playlists;
DROP POLICY IF EXISTS "Users can delete their own playlists" ON public.user_content_playlists;

CREATE POLICY "Users can view their own playlists" ON public.user_content_playlists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" ON public.user_content_playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON public.user_content_playlists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON public.user_content_playlists
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Ajouter une contrainte pour s'assurer qu'une playlist a un réseau social
ALTER TABLE public.user_content_playlists 
ALTER COLUMN social_network_id SET NOT NULL;

RAISE NOTICE 'Modification des playlists pour les réseaux sociaux terminée!';
