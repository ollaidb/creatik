-- Script sécurisé pour ajouter des hashtags spécifiques pour toutes les sous-catégories
-- Exécutez ce script dans votre base de données Supabase

-- Supprimer tous les anciens hashtags pour éviter les doublons
DELETE FROM subcategory_hashtags;

-- Fonction pour ajouter des hashtags seulement si la sous-catégorie existe
DO $$
DECLARE
    subcategory_id_val UUID;
BEGIN
    -- Ajouter des hashtags pour Activisme/Campagnes
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Campagnes' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440031', subcategory_id_val, '#Activisme', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440032', subcategory_id_val, '#JusticeSociale', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440033', subcategory_id_val, '#DroitsHumains', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440034', subcategory_id_val, '#Écologie', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440035', subcategory_id_val, '#Climat', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440036', subcategory_id_val, '#Égalité', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440037', subcategory_id_val, '#Féminisme', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440038', subcategory_id_val, '#Antiracisme', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440039', subcategory_id_val, '#Pacifisme', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440040', subcategory_id_val, '#Mobilisation', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Campagnes';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Campagnes" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Informations relationnelles
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Informations relationnelles' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440041', subcategory_id_val, '#Relations', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440042', subcategory_id_val, '#Communication', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440043', subcategory_id_val, '#Empathie', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440044', subcategory_id_val, '#Écoute', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440045', subcategory_id_val, '#Confiance', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440046', subcategory_id_val, '#Respect', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440047', subcategory_id_val, '#Bienveillance', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440048', subcategory_id_val, '#Ouverture', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440049', subcategory_id_val, '#Authenticité', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440050', subcategory_id_val, '#Connexion', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Informations relationnelles';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Informations relationnelles" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Peinture
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Peinture' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440051', subcategory_id_val, '#Art', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440052', subcategory_id_val, '#Créativité', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440053', subcategory_id_val, '#Expression', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440054', subcategory_id_val, '#Couleurs', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440055', subcategory_id_val, '#Inspiration', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440056', subcategory_id_val, '#Technique', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440057', subcategory_id_val, '#Style', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440058', subcategory_id_val, '#Composition', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440059', subcategory_id_val, '#Émotion', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440060', subcategory_id_val, '#Beauté', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Peinture';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Peinture" non trouvée';
    END IF;

    -- Ajouter des hashtags pour International
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'International' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440061', subcategory_id_val, '#Monde', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440062', subcategory_id_val, '#Culture', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440063', subcategory_id_val, '#Diversité', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440064', subcategory_id_val, '#Voyage', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440065', subcategory_id_val, '#Découverte', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440066', subcategory_id_val, '#Échange', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440067', subcategory_id_val, '#Ouverture', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440068', subcategory_id_val, '#Tolérance', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440069', subcategory_id_val, '#Solidarité', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440070', subcategory_id_val, '#Unité', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour International';
    ELSE
        RAISE NOTICE 'Sous-catégorie "International" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Technologie
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Technologie' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440071', subcategory_id_val, '#Innovation', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440072', subcategory_id_val, '#Digital', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440073', subcategory_id_val, '#Futur', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440074', subcategory_id_val, '#IA', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440075', subcategory_id_val, '#Robotique', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440076', subcategory_id_val, '#Connectivité', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440077', subcategory_id_val, '#Automatisation', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440078', subcategory_id_val, '#Transformation', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440079', subcategory_id_val, '#Efficacité', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440080', subcategory_id_val, '#Progrès', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Technologie';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Technologie" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Santé
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Santé' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440081', subcategory_id_val, '#Bienêtre', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440082', subcategory_id_val, '#Médecine', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440083', subcategory_id_val, '#Prévention', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440084', subcategory_id_val, '#Nutrition', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440085', subcategory_id_val, '#Sport', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440086', subcategory_id_val, '#Mentale', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440087', subcategory_id_val, '#Physique', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440088', subcategory_id_val, '#Équilibre', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440089', subcategory_id_val, '#Vitalité', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440090', subcategory_id_val, '#Guérison', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Santé';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Santé" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Éducation
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Éducation' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440091', subcategory_id_val, '#Apprentissage', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440092', subcategory_id_val, '#Formation', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440093', subcategory_id_val, '#Connaissance', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440094', subcategory_id_val, '#Développement', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440095', subcategory_id_val, '#Compétences', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440096', subcategory_id_val, '#Excellence', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440097', subcategory_id_val, '#Innovation', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440098', subcategory_id_val, '#Pédagogie', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440099', subcategory_id_val, '#Excellence', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440100', subcategory_id_val, '#Réussite', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Éducation';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Éducation" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Environnement
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Environnement' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440101', subcategory_id_val, '#Écologie', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440102', subcategory_id_val, '#Durabilité', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440103', subcategory_id_val, '#Climat', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440104', subcategory_id_val, '#Biodiversité', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440105', subcategory_id_val, '#Protection', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440106', subcategory_id_val, '#Renouvelable', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440107', subcategory_id_val, '#ZéroDéchet', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440108', subcategory_id_val, '#Conservation', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440109', subcategory_id_val, '#Nature', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440110', subcategory_id_val, '#Planète', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Environnement';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Environnement" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Économie
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Économie' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440111', subcategory_id_val, '#Finance', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440112', subcategory_id_val, '#Marché', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440113', subcategory_id_val, '#Investissement', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440114', subcategory_id_val, '#Croissance', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440115', subcategory_id_val, '#Entrepreneuriat', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440116', subcategory_id_val, '#Innovation', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440117', subcategory_id_val, '#Stratégie', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440118', subcategory_id_val, '#Performance', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440119', subcategory_id_val, '#Développement', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440120', subcategory_id_val, '#Prospérité', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Économie';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Économie" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Culture
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Culture' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440121', subcategory_id_val, '#Art', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440122', subcategory_id_val, '#Histoire', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440123', subcategory_id_val, '#Tradition', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440124', subcategory_id_val, '#Patrimoine', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440125', subcategory_id_val, '#Expression', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440126', subcategory_id_val, '#Créativité', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440127', subcategory_id_val, '#Diversité', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440128', subcategory_id_val, '#Identité', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440129', subcategory_id_val, '#Valeurs', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440130', subcategory_id_val, '#Transmission', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Culture';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Culture" non trouvée';
    END IF;

    -- Ajouter des hashtags pour Sport
    SELECT id INTO subcategory_id_val FROM subcategories WHERE name = 'Sport' LIMIT 1;
    IF subcategory_id_val IS NOT NULL THEN
        INSERT INTO subcategory_hashtags (id, subcategory_id, hashtag, hashtag_order, created_at) VALUES 
        ('550e8400-e29b-41d4-a716-446655440131', subcategory_id_val, '#Performance', 1, NOW()),
        ('550e8400-e29b-41d4-a716-446655440132', subcategory_id_val, '#Compétition', 2, NOW()),
        ('550e8400-e29b-41d4-a716-446655440133', subcategory_id_val, '#Dépassement', 3, NOW()),
        ('550e8400-e29b-41d4-a716-446655440134', subcategory_id_val, '#Équipe', 4, NOW()),
        ('550e8400-e29b-41d4-a716-446655440135', subcategory_id_val, '#Victoire', 5, NOW()),
        ('550e8400-e29b-41d4-a716-446655440136', subcategory_id_val, '#Entraînement', 6, NOW()),
        ('550e8400-e29b-41d4-a716-446655440137', subcategory_id_val, '#Motivation', 7, NOW()),
        ('550e8400-e29b-41d4-a716-446655440138', subcategory_id_val, '#Excellence', 8, NOW()),
        ('550e8400-e29b-41d4-a716-446655440139', subcategory_id_val, '#Passion', 9, NOW()),
        ('550e8400-e29b-41d4-a716-446655440140', subcategory_id_val, '#Défi', 10, NOW());
        RAISE NOTICE 'Hashtags ajoutés pour Sport';
    ELSE
        RAISE NOTICE 'Sous-catégorie "Sport" non trouvée';
    END IF;

END $$;

-- Vérifier que tous les hashtags ont été ajoutés
SELECT 'Hashtags ajoutés pour toutes les sous-catégories:' as info;
SELECT 
  s.name as subcategory_name,
  COUNT(sh.hashtag) as hashtag_count
FROM subcategories s
LEFT JOIN subcategory_hashtags sh ON s.id = sh.subcategory_id
GROUP BY s.id, s.name
ORDER BY s.name; 