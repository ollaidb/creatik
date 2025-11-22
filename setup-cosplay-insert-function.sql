-- Fonction pour insérer les sous-catégories Cosplay (contourne RLS)
-- À exécuter une seule fois dans Supabase SQL Editor

CREATE OR REPLACE FUNCTION insert_cosplay_subcategories()
RETURNS TABLE(inserted_count INTEGER, skipped_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cosplay_category_id UUID;
    subcat RECORD;
    inserted INTEGER := 0;
    skipped INTEGER := 0;
BEGIN
    -- Récupérer l'ID de la catégorie Cosplay
    SELECT id INTO cosplay_category_id 
    FROM public.categories 
    WHERE LOWER(name) = 'cosplay' 
    LIMIT 1;
    
    IF cosplay_category_id IS NULL THEN
        -- Créer la catégorie si elle n'existe pas
        INSERT INTO public.categories (name, color, description, theme_id)
        SELECT 
            'Cosplay',
            'purple',
            'Contenu sur le cosplay et les déguisements de personnages',
            COALESCE(
                (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1),
                (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1),
                (SELECT id FROM themes WHERE name = 'Tout' LIMIT 1)
            )
        RETURNING id INTO cosplay_category_id;
    END IF;
    
    -- Liste des sous-catégories à insérer
    FOR subcat IN 
        SELECT * FROM (VALUES
            ('Manga', 'Cosplay de personnages de mangas'),
            ('Anime', 'Cosplay de personnages d''animés'),
            ('Jeux vidéo', 'Cosplay de personnages de jeux vidéo'),
            ('Films', 'Cosplay de personnages de films'),
            ('Séries TV', 'Cosplay de personnages de séries télévisées'),
            ('Comics', 'Cosplay de personnages de comics'),
            ('BD', 'Cosplay de personnages de bandes dessinées'),
            ('Livres', 'Cosplay de personnages de livres et romans'),
            ('Webtoon', 'Cosplay de personnages de webtoons'),
            ('Manhwa', 'Cosplay de personnages de manhwas coréens'),
            ('Marvel', 'Cosplay de personnages Marvel'),
            ('DC Comics', 'Cosplay de personnages DC Comics'),
            ('Star Wars', 'Cosplay de personnages de Star Wars'),
            ('Disney', 'Cosplay de personnages Disney'),
            ('Harry Potter', 'Cosplay de personnages de Harry Potter'),
            ('Final Fantasy', 'Cosplay de personnages de Final Fantasy'),
            ('Zelda', 'Cosplay de personnages de The Legend of Zelda'),
            ('Pokémon', 'Cosplay de personnages de Pokémon'),
            ('Fantasy', 'Cosplay dans l''univers fantasy'),
            ('Sci-Fi', 'Cosplay dans l''univers science-fiction'),
            ('Horreur', 'Cosplay de personnages d''horreur'),
            ('Super-héros', 'Cosplay de super-héros'),
            ('Super-vilains', 'Cosplay de super-vilains'),
            ('Steampunk', 'Cosplay style steampunk'),
            ('Cyberpunk', 'Cosplay style cyberpunk'),
            ('Médiéval', 'Cosplay style médiéval'),
            ('Historique', 'Cosplay de personnages historiques'),
            ('Mythologie', 'Cosplay de personnages mythologiques')
        ) AS v(name, description)
    LOOP
        -- Vérifier si la sous-catégorie existe déjà
        IF NOT EXISTS (
            SELECT 1 FROM public.subcategories 
            WHERE LOWER(name) = LOWER(subcat.name) 
            AND category_id = cosplay_category_id
        ) THEN
            -- Insérer la sous-catégorie
            INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at)
            VALUES (subcat.name, subcat.description, cosplay_category_id, NOW(), NOW());
            inserted := inserted + 1;
        ELSE
            skipped := skipped + 1;
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT inserted, skipped;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION insert_cosplay_subcategories() TO authenticated;
GRANT EXECUTE ON FUNCTION insert_cosplay_subcategories() TO anon;

