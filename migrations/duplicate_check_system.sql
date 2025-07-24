-- Système de vérification des doublons avec délai de traitement

-- 1. Créer une table pour les publications en cours de vérification
CREATE TABLE IF NOT EXISTS pending_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title')),
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'checking' CHECK (status IN ('checking', 'approved', 'rejected', 'duplicate')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pending_publications_status ON pending_publications(status);
CREATE INDEX IF NOT EXISTS idx_pending_publications_content_type ON pending_publications(content_type);
CREATE INDEX IF NOT EXISTS idx_pending_publications_created_at ON pending_publications(created_at);
CREATE INDEX IF NOT EXISTS idx_pending_publications_user_id ON pending_publications(user_id);

-- 3. Fonction pour vérifier les doublons
CREATE OR REPLACE FUNCTION check_for_duplicates(
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    duplicate_count INTEGER := 0;
BEGIN
    -- Vérifier selon le type de contenu
    IF p_content_type = 'category' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM categories
        WHERE LOWER(name) = LOWER(p_title);
        
    ELSIF p_content_type = 'subcategory' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM subcategories
        WHERE LOWER(name) = LOWER(p_title) 
        AND category_id = p_category_id;
        
    ELSIF p_content_type = 'title' THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM content_titles
        WHERE LOWER(title) = LOWER(p_title) 
        AND subcategory_id = p_subcategory_id;
        
    END IF;
    
    RETURN duplicate_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 4. Fonction pour traiter les publications en attente
CREATE OR REPLACE FUNCTION process_pending_publications()
RETURNS JSON AS $$
DECLARE
    publication_record pending_publications%ROWTYPE;
    is_duplicate BOOLEAN;
    result JSON;
    processed_count INTEGER := 0;
BEGIN
    -- Traiter les publications en attente depuis plus de 10 secondes
    FOR publication_record IN 
        SELECT * FROM pending_publications 
        WHERE status = 'checking' 
        AND created_at < NOW() - INTERVAL '10 seconds'
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
            UPDATE pending_publications
            SET status = 'duplicate', 
                rejection_reason = 'Contenu en double détecté',
                updated_at = NOW()
            WHERE id = publication_record.id;
            
        ELSE
            -- Insérer dans la table principale
            BEGIN
                IF publication_record.content_type = 'category' THEN
                    INSERT INTO categories (name, description, color)
                    VALUES (publication_record.title, 'Catégorie publiée', '#3B82F6');
                    
                ELSIF publication_record.content_type = 'subcategory' THEN
                    INSERT INTO subcategories (name, description, category_id)
                    VALUES (publication_record.title, 'Sous-catégorie publiée', publication_record.category_id);
                    
                ELSIF publication_record.content_type = 'title' THEN
                    INSERT INTO content_titles (title, subcategory_id, type, platform)
                    VALUES (publication_record.title, publication_record.subcategory_id, 'title', 'all');
                    
                END IF;
                
                -- Marquer comme approuvé
                UPDATE pending_publications
                SET status = 'approved', updated_at = NOW()
                WHERE id = publication_record.id;
                
                processed_count := processed_count + 1;
                
            EXCEPTION
                WHEN OTHERS THEN
                    -- Marquer comme rejeté en cas d'erreur
                    UPDATE pending_publications
                    SET status = 'rejected', 
                        rejection_reason = 'Erreur lors de l\'insertion: ' || SQLERRM,
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

-- 5. Fonction pour créer une publication avec vérification
CREATE OR REPLACE FUNCTION create_publication_with_check(
    p_user_id UUID,
    p_content_type TEXT,
    p_title TEXT,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    publication_id UUID;
    result JSON;
BEGIN
    -- Créer la publication en attente
    INSERT INTO pending_publications (
        user_id, content_type, title, category_id, subcategory_id
    ) VALUES (
        p_user_id, p_content_type, p_title, p_category_id, p_subcategory_id
    ) RETURNING id INTO publication_id;
    
    result := json_build_object(
        'success', true,
        'message', 'Publication soumise et en cours de vérification',
        'publication_id', publication_id,
        'status', 'checking'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Politiques RLS pour pending_publications
ALTER TABLE pending_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_publications_select_policy" ON pending_publications
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "pending_publications_insert_policy" ON pending_publications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pending_publications_update_policy" ON pending_publications
    FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 7. Créer un trigger pour traiter automatiquement les publications
CREATE OR REPLACE FUNCTION auto_process_publications()
RETURNS TRIGGER AS $$
BEGIN
    -- Traiter les publications en attente
    PERFORM process_pending_publications();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Créer un job pour traiter les publications (à exécuter manuellement ou via cron)
-- Cette fonction peut être appelée toutes les 10 secondes
CREATE OR REPLACE FUNCTION auto_process_publications_job()
RETURNS void AS $$
BEGIN
    PERFORM process_pending_publications();
END;
$$ LANGUAGE plpgsql; 