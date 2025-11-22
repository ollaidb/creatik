-- Ajouter un champ order à la table user_content_playlists pour sauvegarder l'ordre
-- Cette migration ajoute la colonne order si elle n'existe pas déjà

DO $$
BEGIN
    -- Vérifier si la colonne existe déjà
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_content_playlists' 
        AND column_name = 'order'
    ) THEN
        -- Ajouter la colonne order
        ALTER TABLE public.user_content_playlists 
        ADD COLUMN "order" INTEGER DEFAULT 0;
        
        -- Mettre à jour les playlists existantes avec un ordre basé sur created_at
        UPDATE public.user_content_playlists 
        SET "order" = subquery.row_number
        FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as row_number
          FROM public.user_content_playlists
        ) subquery
        WHERE user_content_playlists.id = subquery.id;
        
        -- Créer un index pour améliorer les performances
        CREATE INDEX IF NOT EXISTS idx_user_content_playlists_user_order 
        ON public.user_content_playlists(user_id, "order");
        
        -- Rendre le champ order NOT NULL après avoir mis à jour les données
        ALTER TABLE public.user_content_playlists 
        ALTER COLUMN "order" SET NOT NULL;
        
        RAISE NOTICE 'Colonne order ajoutée à user_content_playlists';
    ELSE
        RAISE NOTICE 'Colonne order existe déjà dans user_content_playlists';
    END IF;
END $$;

