-- Script pour ajouter des sous-catégories à la catégorie "Situation"
-- Date: 2025-01-28
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- ========================================
-- VÉRIFICATION DE LA CATÉGORIE SITUATION
-- ========================================

-- Vérifier que la catégorie "Situation" existe
DO $$
DECLARE
    situation_category_id UUID;
BEGIN
    SELECT id INTO situation_category_id 
    FROM public.categories 
    WHERE LOWER(name) = 'situation' 
    LIMIT 1;
    
    IF situation_category_id IS NULL THEN
        RAISE EXCEPTION 'La catégorie "Situation" n''existe pas. Veuillez d''abord exécuter add-situation-category.sql';
    END IF;
END $$;

-- Afficher la catégorie Situation
SELECT 
    '=== CATÉGORIE SITUATION ===' as info,
    c.id,
    c.name,
    c.color,
    c.description
FROM public.categories c
WHERE LOWER(c.name) = 'situation';

-- Afficher les sous-catégories existantes pour Situation
SELECT 
    '=== SOUS-CATÉGORIES EXISTANTES ===' as info,
    s.id,
    s.name as subcategory_name,
    s.description,
    s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE LOWER(c.name) = 'situation'
ORDER BY s.name;

-- ========================================
-- AJOUT DES SOUS-CATÉGORIES NIVEAU 1
-- ========================================
-- Liste complète de toutes les situations et lieux pour la catégorie "Situation"

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    -- Lieux de restauration et consommation
    ('Restaurant', 'Contenu pour les situations en restaurant', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Café', 'Contenu pour les situations dans un café', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Fast-food', 'Contenu pour les situations en fast-food', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Bar', 'Contenu pour les situations dans un bar', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Brasserie', 'Contenu pour les situations en brasserie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Food truck', 'Contenu pour les situations au food truck', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Marché', 'Contenu pour les situations au marché', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Épicerie', 'Contenu pour les situations à l''épicerie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Supermarché', 'Contenu pour les situations au supermarché', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Boulangerie', 'Contenu pour les situations à la boulangerie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pâtisserie', 'Contenu pour les situations à la pâtisserie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de travail et professionnels
    ('Bureau', 'Contenu pour les situations au bureau', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Télétravail', 'Contenu pour les situations en télétravail', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Réunion professionnelle', 'Contenu pour les situations en réunion professionnelle', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Conférence', 'Contenu pour les situations en conférence', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Séminaire', 'Contenu pour les situations en séminaire', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Entretien d''embauche', 'Contenu pour les situations en entretien d''embauche', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Client', 'Contenu pour les situations chez un client', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Rendez-vous client', 'Contenu pour les situations en rendez-vous client', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Coworking', 'Contenu pour les situations en espace de coworking', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Usine', 'Contenu pour les situations en usine', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Atelier', 'Contenu pour les situations en atelier', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Commerce', 'Contenu pour les situations dans un commerce', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Boutique', 'Contenu pour les situations dans une boutique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Chantier', 'Contenu pour les situations sur un chantier', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Laboratoire', 'Contenu pour les situations en laboratoire', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Studio photo', 'Contenu pour les situations en studio photo', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Studio vidéo', 'Contenu pour les situations en studio vidéo', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cuisine professionnelle', 'Contenu pour les situations en cuisine professionnelle', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Entrepôt', 'Contenu pour les situations en entrepôt', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dépôt', 'Contenu pour les situations au dépôt', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Port', 'Contenu pour les situations au port', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dock', 'Contenu pour les situations au dock', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Transports et déplacements
    ('Transports en commun', 'Contenu pour les situations dans les transports en commun', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Métro', 'Contenu pour les situations dans le métro', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Bus', 'Contenu pour les situations dans le bus', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Tram', 'Contenu pour les situations dans le tram', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Voiture', 'Contenu pour les situations en voiture', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Train', 'Contenu pour les situations en train', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Avion', 'Contenu pour les situations en avion', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Vélo', 'Contenu pour les situations à vélo', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Trottinette', 'Contenu pour les situations en trottinette', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Marche à pied', 'Contenu pour les situations en marchant', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Taxi', 'Contenu pour les situations en taxi', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('VTC', 'Contenu pour les situations en VTC', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Gare', 'Contenu pour les situations en gare', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Aéroport', 'Contenu pour les situations à l''aéroport', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Station-service', 'Contenu pour les situations à la station-service', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Parking', 'Contenu pour les situations au parking', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Parking souterrain', 'Contenu pour les situations au parking souterrain', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Quai de gare', 'Contenu pour les situations sur le quai de gare', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Arrêt de bus', 'Contenu pour les situations à l''arrêt de bus', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Station de métro', 'Contenu pour les situations à la station de métro', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Aire d''autoroute', 'Contenu pour les situations sur l''aire d''autoroute', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Gare routière', 'Contenu pour les situations à la gare routière', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux d'éducation et formation
    ('École', 'Contenu pour les situations à l''école', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Université', 'Contenu pour les situations à l''université', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cours', 'Contenu pour les situations en cours', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Formation', 'Contenu pour les situations en formation', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Bibliothèque', 'Contenu pour les situations à la bibliothèque', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle d''étude', 'Contenu pour les situations en salle d''étude', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Examen', 'Contenu pour les situations en examen', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Concours', 'Contenu pour les situations en concours', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Résidence étudiante', 'Contenu pour les situations en résidence étudiante', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Internat', 'Contenu pour les situations en internat', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de santé et bien-être
    ('Hôpital', 'Contenu pour les situations à l''hôpital', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cabinet médical', 'Contenu pour les situations au cabinet médical', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pharmacie', 'Contenu pour les situations à la pharmacie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle de sport', 'Contenu pour les situations en salle de sport', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Fitness', 'Contenu pour les situations au fitness', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Piscine', 'Contenu pour les situations à la piscine', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Spa', 'Contenu pour les situations au spa', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Centre de bien-être', 'Contenu pour les situations au centre de bien-être', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Kinésithérapeute', 'Contenu pour les situations chez le kinésithérapeute', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Ostéopathe', 'Contenu pour les situations chez l''ostéopathe', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Hammam', 'Contenu pour les situations au hammam', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Sauna', 'Contenu pour les situations au sauna', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Jacuzzi', 'Contenu pour les situations au jacuzzi', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de loisirs et divertissement
    ('Cinéma', 'Contenu pour les situations au cinéma', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Théâtre', 'Contenu pour les situations au théâtre', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Concert', 'Contenu pour les situations en concert', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Festival', 'Contenu pour les situations en festival', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Musée', 'Contenu pour les situations au musée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Exposition', 'Contenu pour les situations en exposition', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Parc d''attractions', 'Contenu pour les situations au parc d''attractions', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Bowling', 'Contenu pour les situations au bowling', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Escape game', 'Contenu pour les situations en escape game', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle de jeux', 'Contenu pour les situations en salle de jeux', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Casino', 'Contenu pour les situations au casino', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Galerie d''art', 'Contenu pour les situations en galerie d''art', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Studio d''enregistrement', 'Contenu pour les situations en studio d''enregistrement', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Atelier d''artiste', 'Contenu pour les situations en atelier d''artiste', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Scène', 'Contenu pour les situations sur scène', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Plateau', 'Contenu pour les situations sur un plateau', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Backstage', 'Contenu pour les situations en backstage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dressing', 'Contenu pour les situations au dressing', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de vie quotidienne
    ('Domicile', 'Contenu pour les situations à domicile', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Chez des amis', 'Contenu pour les situations chez des amis', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Chez la famille', 'Contenu pour les situations chez la famille', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Ascenseur', 'Contenu pour les situations dans l''ascenseur', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Couloir', 'Contenu pour les situations dans le couloir', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Hall', 'Contenu pour les situations dans le hall', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Escalier', 'Contenu pour les situations dans l''escalier', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Terrasse', 'Contenu pour les situations sur la terrasse', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Balcon', 'Contenu pour les situations sur le balcon', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Jardin', 'Contenu pour les situations dans le jardin', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Garage', 'Contenu pour les situations au garage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cave', 'Contenu pour les situations à la cave', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Grenier', 'Contenu pour les situations au grenier', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Toit', 'Contenu pour les situations sur le toit', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Rooftop', 'Contenu pour les situations sur le rooftop', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de services
    ('Banque', 'Contenu pour les situations à la banque', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Poste', 'Contenu pour les situations à la poste', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Mairie', 'Contenu pour les situations à la mairie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Administration', 'Contenu pour les situations à l''administration', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Commissariat', 'Contenu pour les situations au commissariat', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Tribunal', 'Contenu pour les situations au tribunal', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Agence immobilière', 'Contenu pour les situations à l''agence immobilière', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salon de coiffure', 'Contenu pour les situations au salon de coiffure', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Institut de beauté', 'Contenu pour les situations à l''institut de beauté', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pressing', 'Contenu pour les situations au pressing', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Blanchisserie', 'Contenu pour les situations à la blanchisserie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Garage automobile', 'Contenu pour les situations au garage automobile', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de shopping
    ('Centre commercial', 'Contenu pour les situations au centre commercial', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Magasin de vêtements', 'Contenu pour les situations au magasin de vêtements', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Magasin d''électronique', 'Contenu pour les situations au magasin d''électronique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Magasin de décoration', 'Contenu pour les situations au magasin de décoration', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Magasin de sport', 'Contenu pour les situations au magasin de sport', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Librairie', 'Contenu pour les situations à la librairie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Animalerie', 'Contenu pour les situations à l''animalerie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de nature et extérieur
    ('Plage', 'Contenu pour les situations à la plage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Montagne', 'Contenu pour les situations à la montagne', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Forêt', 'Contenu pour les situations en forêt', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Parc', 'Contenu pour les situations au parc', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Jardin public', 'Contenu pour les situations au jardin public', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Lac', 'Contenu pour les situations au lac', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Rivière', 'Contenu pour les situations à la rivière', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Camping', 'Contenu pour les situations au camping', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pique-nique', 'Contenu pour les situations en pique-nique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Randonnée', 'Contenu pour les situations en randonnée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Plage privée', 'Contenu pour les situations sur une plage privée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Piscine privée', 'Contenu pour les situations à la piscine privée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Jardin privé', 'Contenu pour les situations dans un jardin privé', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de sport
    ('Stade', 'Contenu pour les situations au stade', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Terrain de sport', 'Contenu pour les situations sur un terrain de sport', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Court de tennis', 'Contenu pour les situations sur un court de tennis', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Terrain de foot', 'Contenu pour les situations sur un terrain de foot', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle de danse', 'Contenu pour les situations en salle de danse', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dojo', 'Contenu pour les situations au dojo', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle d''arts martiaux', 'Contenu pour les situations en salle d''arts martiaux', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Base nautique', 'Contenu pour les situations à la base nautique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Marina', 'Contenu pour les situations à la marina', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Station de ski', 'Contenu pour les situations à la station de ski', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de culte et spirituels
    ('Église', 'Contenu pour les situations à l''église', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Mosquée', 'Contenu pour les situations à la mosquée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Temple', 'Contenu pour les situations au temple', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Synagogue', 'Contenu pour les situations à la synagogue', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cimetière', 'Contenu pour les situations au cimetière', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Lieu de pèlerinage', 'Contenu pour les situations dans un lieu de pèlerinage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de fête et événements
    ('Mariage', 'Contenu pour les situations en mariage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Anniversaire', 'Contenu pour les situations en anniversaire', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Soirée', 'Contenu pour les situations en soirée', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Fête', 'Contenu pour les situations en fête', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dîner entre amis', 'Contenu pour les situations en dîner entre amis', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Barbecue', 'Contenu pour les situations en barbecue', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pot de départ', 'Contenu pour les situations en pot de départ', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cérémonie', 'Contenu pour les situations en cérémonie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Salle de réception', 'Contenu pour les situations en salle de réception', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Chapiteau', 'Contenu pour les situations sous un chapiteau', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Tente', 'Contenu pour les situations sous une tente', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Stand', 'Contenu pour les situations au stand', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Kiosque', 'Contenu pour les situations au kiosque', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Scène en plein air', 'Contenu pour les situations sur une scène en plein air', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Terrasse événementielle', 'Contenu pour les situations sur une terrasse événementielle', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de voyage et hébergement
    ('Hôtel', 'Contenu pour les situations à l''hôtel', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Auberge de jeunesse', 'Contenu pour les situations en auberge de jeunesse', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Airbnb', 'Contenu pour les situations en Airbnb', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Location', 'Contenu pour les situations en location', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Gîte', 'Contenu pour les situations en gîte', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Chambre d''hôte', 'Contenu pour les situations en chambre d''hôte', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Situations particulières
    ('File d''attente', 'Contenu pour les situations en file d''attente', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Embouteillage', 'Contenu pour les situations en embouteillage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Panne', 'Contenu pour les situations en panne', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Incident', 'Contenu pour les situations en incident', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Urgence', 'Contenu pour les situations en urgence', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Déménagement', 'Contenu pour les situations en déménagement', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Voyage', 'Contenu pour les situations en voyage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Vacances', 'Contenu pour les situations en vacances', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Week-end', 'Contenu pour les situations en week-end', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pause déjeuner', 'Contenu pour les situations en pause déjeuner', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pause café', 'Contenu pour les situations en pause café', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Avant de dormir', 'Contenu pour les situations avant de dormir', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Au réveil', 'Contenu pour les situations au réveil', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('En douche', 'Contenu pour les situations en douche', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Dans les transports', 'Contenu pour les situations dans les transports', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('En attendant', 'Contenu pour les situations en attendant', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('En promenade', 'Contenu pour les situations en promenade', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('En voyage', 'Contenu pour les situations en voyage', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('En vacances', 'Contenu pour les situations en vacances', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux urbains et espaces publics
    ('Rue', 'Contenu pour les situations dans la rue', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Avenue', 'Contenu pour les situations dans l''avenue', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Place publique', 'Contenu pour les situations sur la place publique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Pont', 'Contenu pour les situations sur le pont', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Tunnel', 'Contenu pour les situations dans le tunnel', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Passage piéton', 'Contenu pour les situations au passage piéton', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Quartier résidentiel', 'Contenu pour les situations en quartier résidentiel', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Centre-ville', 'Contenu pour les situations en centre-ville', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Périphérie', 'Contenu pour les situations en périphérie', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Zone commerciale', 'Contenu pour les situations en zone commerciale', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Zone industrielle', 'Contenu pour les situations en zone industrielle', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Banlieue', 'Contenu pour les situations en banlieue', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux de vie collective
    ('Foyer', 'Contenu pour les situations en foyer', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Maison de retraite', 'Contenu pour les situations en maison de retraite', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Colonie de vacances', 'Contenu pour les situations en colonie de vacances', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    
    -- Lieux insolites ou particuliers
    ('Toilettes publiques', 'Contenu pour les situations aux toilettes publiques', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Vestiaire', 'Contenu pour les situations au vestiaire', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Locker', 'Contenu pour les situations au locker', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Casier', 'Contenu pour les situations au casier', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Abri-bus', 'Contenu pour les situations à l''abri-bus', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Cabine téléphonique', 'Contenu pour les situations dans une cabine téléphonique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Distributeur automatique', 'Contenu pour les situations au distributeur automatique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now()),
    ('Guichet automatique', 'Contenu pour les situations au guichet automatique', (SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE LOWER(name) = LOWER(v.name) 
    AND category_id = v.category_id
);

-- ========================================
-- VÉRIFICATION APRÈS AJOUT
-- ========================================

-- Afficher toutes les sous-catégories de Situation après insertion
SELECT 
    '=== SOUS-CATÉGORIES APRÈS AJOUT ===' as info,
    s.id,
    s.name as subcategory_name,
    s.description,
    s.created_at,
    COUNT(sl2.id) as level2_count
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) = 'situation'
GROUP BY s.id, s.name, s.description, s.created_at
ORDER BY s.name;

-- ========================================
-- CONFIGURATION NIVEAU 2 (si nécessaire)
-- ========================================
-- Décommentez cette section si vous avez besoin de sous-catégories niveau 2

/*
-- Activer le niveau 2 pour la catégorie Situation
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
VALUES ((SELECT id FROM public.categories WHERE name = 'Situation' LIMIT 1), true)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- Exemple d'ajout de sous-catégories niveau 2
-- Remplacez 'Nom Sous-catégorie Niveau 1' par le nom réel de votre sous-catégorie niveau 1
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 
    'Nom Sous-catégorie Niveau 2',
    'Description de la sous-catégorie niveau 2',
    s.id,
    now(),
    now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name = 'Situation' 
AND s.name = 'Nom Sous-catégorie Niveau 1'
ON CONFLICT DO NOTHING;
*/

-- ========================================
-- RÉSUMÉ FINAL
-- ========================================

SELECT 
    '=== RÉSUMÉ ===' as info,
    COUNT(s.id) as total_subcategories,
    COUNT(sl2.id) as total_level2_subcategories
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
LEFT JOIN public.subcategories_level2 sl2 ON sl2.subcategory_id = s.id
WHERE LOWER(c.name) = 'situation';

