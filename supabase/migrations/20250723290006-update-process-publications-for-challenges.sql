-- Mettre à jour la fonction process_pending_publications pour gérer les challenges
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