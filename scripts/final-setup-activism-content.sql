-- Script final pour configurer tout et ajouter le contenu Activisme/Campagnes
-- Exécutez ce script dans votre base de données Supabase

-- 1. Ajouter les colonnes manquantes à pending_publications
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

-- 2. Créer la table sources si elle n'existe pas
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    category TEXT,
    subcategory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category);
CREATE INDEX IF NOT EXISTS idx_sources_subcategory ON sources(subcategory);

-- 4. Activer RLS pour sources
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS pour sources
DROP POLICY IF EXISTS "Sources are viewable by everyone" ON sources;
CREATE POLICY "Sources are viewable by everyone" ON sources
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sources are insertable by authenticated users" ON sources;
CREATE POLICY "Sources are insertable by authenticated users" ON sources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sources are updatable by authenticated users" ON sources;
CREATE POLICY "Sources are updatable by authenticated users" ON sources
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sources are deletable by authenticated users" ON sources;
CREATE POLICY "Sources are deletable by authenticated users" ON sources
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Triggers pour updated_at
DROP TRIGGER IF EXISTS update_sources_updated_at ON sources;
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Mettre à jour la fonction process_user_publications
CREATE OR REPLACE FUNCTION process_user_publications()
RETURNS JSON AS $$
DECLARE
    publication_record user_publications%ROWTYPE;
    is_duplicate BOOLEAN;
    result JSON;
    processed_count INTEGER := 0;
    category_colors TEXT[] := ARRAY['primary', 'orange', 'green', 'pink'];
    random_color TEXT;
BEGIN
    -- Traiter les publications en attente depuis plus de 5 secondes
    FOR publication_record IN 
        SELECT * FROM user_publications 
        WHERE status = 'pending' 
        AND created_at < NOW() - INTERVAL '5 seconds'
        ORDER BY created_at ASC
    LOOP
        -- Vérifier les doublons
        is_duplicate := check_for_duplicates(
            publication_record.content_type,
            publication_record.title,
            publication_record.category_id,
            publication_record.subcategory_id
        );
        
        IF is_duplicate THEN
            -- Marquer comme doublon
            UPDATE user_publications
            SET status = 'duplicate', 
                rejection_reason = 'Contenu en double détecté',
                updated_at = NOW()
            WHERE id = publication_record.id;
            
        ELSE
            -- Insérer dans la table principale
            BEGIN
                IF publication_record.content_type = 'category' THEN
                    -- Sélectionner une couleur aléatoire
                    random_color := category_colors[1 + (EXTRACT(EPOCH FROM NOW())::INTEGER % 4)];
                    
                    INSERT INTO categories (name, description, color)
                    VALUES (publication_record.title, 'Catégorie publiée', random_color);
                    
                ELSIF publication_record.content_type = 'subcategory' THEN
                    INSERT INTO subcategories (name, description, category_id)
                    VALUES (publication_record.title, 'Sous-catégorie publiée', publication_record.category_id);
                    
                ELSIF publication_record.content_type = 'title' THEN
                    INSERT INTO content_titles (title, subcategory_id, type, platform)
                    VALUES (publication_record.title, publication_record.subcategory_id, 'title', 'all');
                    
                ELSIF publication_record.content_type = 'challenge' THEN
                    -- Insérer dans la table challenges
                    INSERT INTO challenges (
                        title, 
                        description, 
                        category, 
                        points, 
                        difficulty, 
                        duration_days, 
                        is_daily, 
                        is_active, 
                        created_by
                    ) VALUES (
                        publication_record.title,
                        COALESCE(publication_record.description, 'Challenge publié'),
                        'Challenge',
                        50,
                        'medium',
                        1,
                        false,
                        true,
                        publication_record.user_id
                    );
                    
                ELSIF publication_record.content_type = 'source' THEN
                    -- Insérer dans la table sources
                    INSERT INTO sources (
                        title,
                        url,
                        description,
                        category,
                        subcategory
                    ) VALUES (
                        publication_record.title,
                        COALESCE(publication_record.url, ''),
                        COALESCE(publication_record.description, 'Source publiée'),
                        (SELECT name FROM categories WHERE id = publication_record.category_id),
                        (SELECT name FROM subcategories WHERE id = publication_record.subcategory_id)
                    );
                    
                ELSIF publication_record.content_type = 'account' THEN
                    -- Insérer dans la table exemplary_accounts existante
                    INSERT INTO exemplary_accounts (
                        account_name,
                        description,
                        platform,
                        account_url,
                        subcategory_id
                    ) VALUES (
                        publication_record.title,
                        COALESCE(publication_record.description, 'Compte publié'),
                        COALESCE(publication_record.platform, 'other'),
                        COALESCE(publication_record.url, ''),
                        publication_record.subcategory_id
                    );
                    
                END IF;
                
                -- Marquer comme approuvé
                UPDATE user_publications
                SET status = 'approved', updated_at = NOW()
                WHERE id = publication_record.id;
                
                processed_count := processed_count + 1;
                
            EXCEPTION
                WHEN OTHERS THEN
                    -- Marquer comme rejeté en cas d'erreur
                    UPDATE user_publications
                    SET status = 'rejected', 
                        rejection_reason = 'Erreur lors de l''insertion: ' || SQLERRM,
                        updated_at = NOW()
                    WHERE id = publication_record.id;
            END;
        END IF;
    END LOOP;
    
    result := json_build_object(
        'success', true,
        'processed_count', processed_count,
        'message', processed_count || ' publications traitées'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 9. Ajouter des comptes de test dans exemplary_accounts pour Activisme/Campagnes
INSERT INTO exemplary_accounts (
  id,
  subcategory_id,
  account_name,
  platform,
  account_url,
  description,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'Influollaid',
  'tiktok',
  'https://www.tiktok.com/@influollaid',
  'Créateur de contenu activiste sur TikTok',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'EcoWarrior',
  'instagram',
  'https://www.instagram.com/ecowarrior',
  'Militant écologiste sur Instagram',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'JusticeVoice',
  'youtube',
  'https://www.youtube.com/@justicevoice',
  'Chaîne YouTube sur la justice sociale',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ClimateActivist',
  'twitter',
  'https://twitter.com/climateactivist',
  'Activiste climatique sur Twitter',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'HumanRightsNow',
  'facebook',
  'https://www.facebook.com/humanrightsnow',
  'Page Facebook pour les droits humains',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440016',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ClimateStrike',
  'tiktok',
  'https://www.tiktok.com/@climatestrike',
  'Mouvement de grève pour le climat sur TikTok',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440017',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'BlackLivesMatter',
  'instagram',
  'https://www.instagram.com/blacklivesmatter',
  'Mouvement pour les droits civiques sur Instagram',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440018',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'MeTooMovement',
  'twitter',
  'https://twitter.com/metoomvmt',
  'Mouvement contre les violences sexuelles sur Twitter',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440019',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'ExtinctionRebellion',
  'youtube',
  'https://www.youtube.com/@extinctionrebellion',
  'Mouvement de désobéissance civile pour le climat',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440020',
  (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1),
  'FridaysForFuture',
  'facebook',
  'https://www.facebook.com/fridaysforfuture',
  'Mouvement de grève scolaire pour le climat',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  account_name = EXCLUDED.account_name,
  platform = EXCLUDED.platform,
  account_url = EXCLUDED.account_url,
  description = EXCLUDED.description,
  created_at = NOW();

-- 10. Ajouter des sources de test dans sources pour Activisme/Campagnes
INSERT INTO sources (
  id,
  title,
  url,
  description,
  category,
  subcategory,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Guide complet de l''activisme digital',
  'https://www.activisme-digital.com/guide',
  'Un guide complet pour mener des campagnes activistes sur les réseaux sociaux',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Stratégies de mobilisation en ligne',
  'https://www.mobilisation-online.org/strategies',
  'Comment organiser des mouvements sociaux via les plateformes numériques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  'Outils de création de contenu militant',
  'https://www.outils-militants.com/creation',
  'Ressources et outils pour créer du contenu engagé et impactant',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440009',
  'Manuel de communication non-violente',
  'https://www.communication-non-violente.org/manuel',
  'Guide pour communiquer efficacement lors de campagnes sociales',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'Plateforme de coordination des actions',
  'https://www.coordination-actions.org',
  'Site web pour coordonner les actions activistes à travers le monde',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440026',
  'Manuel de désobéissance civile',
  'https://www.desobeissance-civile.org/manuel',
  'Guide pratique pour organiser des actions de désobéissance civile non-violente',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440027',
  'Stratégies de communication militante',
  'https://www.communication-militante.com/strategies',
  'Comment communiquer efficacement lors de campagnes sociales et politiques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440028',
  'Outils de mobilisation numérique',
  'https://www.mobilisation-numerique.org/outils',
  'Plateformes et outils pour mobiliser des communautés en ligne',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440029',
  'Guide de l''action directe',
  'https://www.action-directe.org/guide',
  'Méthodes et techniques pour mener des actions directes pacifiques',
  'Activisme',
  'Campagnes',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440030',
  'Ressources pour l''éducation populaire',
  'https://www.education-populaire.org/ressources',
  'Matériaux et méthodes pour l''éducation populaire et la conscientisation',
  'Activisme',
  'Campagnes',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  created_at = NOW();

-- 11. Vérifier que tout a été créé et ajouté
SELECT 'Colonnes ajoutées à pending_publications:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pending_publications' 
AND column_name IN ('platform', 'url')
ORDER BY column_name;

SELECT 'Tables créées:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('sources', 'exemplary_accounts', 'challenges');

SELECT 'Comptes ajoutés pour Activisme/Campagnes:' as info;
SELECT id, account_name, platform, account_url, description 
FROM exemplary_accounts 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE name = 'Campagnes' LIMIT 1)
ORDER BY created_at DESC;

SELECT 'Sources ajoutées pour Activisme/Campagnes:' as info;
SELECT id, title, url, description 
FROM sources 
WHERE category = 'Activisme' AND subcategory = 'Campagnes'
ORDER BY created_at DESC; 