-- Script pour appliquer toutes les migrations nécessaires
-- Exécutez ce script dans votre base de données Supabase

-- 1. Créer les tables sources et accounts
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

CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    platform TEXT,
    url TEXT,
    avatar_url TEXT,
    category TEXT,
    subcategory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category);
CREATE INDEX IF NOT EXISTS idx_sources_subcategory ON sources(subcategory);
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts(category);
CREATE INDEX IF NOT EXISTS idx_accounts_subcategory ON accounts(subcategory);
CREATE INDEX IF NOT EXISTS idx_accounts_platform ON accounts(platform);

-- 3. Activer RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour sources
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

-- 5. Politiques RLS pour accounts
DROP POLICY IF EXISTS "Accounts are viewable by everyone" ON accounts;
CREATE POLICY "Accounts are viewable by everyone" ON accounts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Accounts are insertable by authenticated users" ON accounts;
CREATE POLICY "Accounts are insertable by authenticated users" ON accounts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Accounts are updatable by authenticated users" ON accounts;
CREATE POLICY "Accounts are updatable by authenticated users" ON accounts
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Accounts are deletable by authenticated users" ON accounts;
CREATE POLICY "Accounts are deletable by authenticated users" ON accounts
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

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Mettre à jour la fonction process_user_publications pour supporter sources et accounts
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
                    -- Insérer dans la table accounts
                    INSERT INTO accounts (
                        name,
                        description,
                        platform,
                        url,
                        category,
                        subcategory
                    ) VALUES (
                        publication_record.title,
                        COALESCE(publication_record.description, 'Compte publié'),
                        COALESCE(publication_record.platform, 'Autre'),
                        COALESCE(publication_record.url, ''),
                        (SELECT name FROM categories WHERE id = publication_record.category_id),
                        (SELECT name FROM subcategories WHERE id = publication_record.subcategory_id)
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

-- 9. Ajouter des données de test pour les challenges
INSERT INTO challenges (
  id,
  title,
  description,
  category,
  points,
  difficulty,
  duration_days,
  is_daily,
  is_active,
  created_by,
  likes_count,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Challenge Créativité Quotidienne',
  'Publiez une création originale chaque jour pendant 30 jours. Peut être une photo, une vidéo, un texte ou une œuvre d''art.',
  'Créativité',
  100,
  'medium',
  30,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  5,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Défi Fitness 21 Jours',
  'Faites au moins 30 minutes d''exercice par jour pendant 21 jours consécutifs.',
  'Santé',
  150,
  'hard',
  21,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  12,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Challenge Lecture Mensuel',
  'Lisez un livre par semaine pendant un mois et partagez vos réflexions.',
  'Éducation',
  80,
  'easy',
  28,
  false,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  8,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Défi Cuisine Internationale',
  'Préparez un plat d''une cuisine différente chaque semaine pendant 2 mois.',
  'Cuisine',
  120,
  'medium',
  56,
  false,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  15,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Challenge Écologie 7 Jours',
  'Adoptez une nouvelle habitude écologique chaque jour pendant une semaine.',
  'Environnement',
  60,
  'easy',
  7,
  true,
  true,
  '550e8400-e29b-41d4-a716-446655440000',
  20,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  points = EXCLUDED.points,
  difficulty = EXCLUDED.difficulty,
  duration_days = EXCLUDED.duration_days,
  is_daily = EXCLUDED.is_daily,
  is_active = EXCLUDED.is_active,
  likes_count = EXCLUDED.likes_count,
  updated_at = NOW();

-- 10. Vérifier que tout a été créé
SELECT 'Tables créées:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('sources', 'accounts', 'challenges');

SELECT 'Challenges ajoutés:' as info;
SELECT id, title, category, points, difficulty, is_active FROM challenges WHERE is_active = true ORDER BY created_at DESC; 