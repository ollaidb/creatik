-- Configuration de la hiérarchie pour la catégorie "Art"
-- Ce script configure quelles sous-catégories ont besoin d'un niveau 2

-- 1. Configurer la catégorie "Art" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
VALUES ((SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1), true)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 2. Configurer les sous-catégories qui ONT BESOIN du niveau 2 (has_level2 = true)
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) VALUES
-- Art numérique - très large, mérite d'être divisé
((SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Photographie artistique - très large, mérite d'être divisé
((SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Design graphique - très large, mérite d'être divisé
((SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Sculpture - très large, mérite d'être divisé
((SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Street art - pourrait être divisé
((SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Installation artistique - très large
((SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art textile - très large
((SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art vidéo - très large
((SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Performance artistique - très large
((SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Illustration éditoriale - très large
((SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Design d'objet - très large
((SELECT id FROM public.subcategories WHERE name = 'Design d''objet (création d''objets d''art ou design)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Mode artistique - très large
((SELECT id FROM public.subcategories WHERE name = 'Mode artistique (créations haute couture expérimentales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Vidéo expérimentale - très large
((SELECT id FROM public.subcategories WHERE name = 'Vidéo expérimentale (film d''art abstrait)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Animation 2D/3D - très large
((SELECT id FROM public.subcategories WHERE name = 'Animation 2D/3D artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Bande dessinée - très large
((SELECT id FROM public.subcategories WHERE name = 'Bande dessinée d''auteur (BD artistique, non commerciale)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art conceptuel - très large
((SELECT id FROM public.subcategories WHERE name = 'Art conceptuel (idées transmises par objets ou performances)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Illustration fantasy - très large
((SELECT id FROM public.subcategories WHERE name = 'Illustration fantasy / imaginaire' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Modélisation 3D - très large
((SELECT id FROM public.subcategories WHERE name = 'Modélisation 3D artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art interactif - très large
((SELECT id FROM public.subcategories WHERE name = 'Art interactif (installations où le public participe)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Performance de danse - très large
((SELECT id FROM public.subcategories WHERE name = 'Performance de danse artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art engagé - très large
((SELECT id FROM public.subcategories WHERE name = 'Art engagé (œuvres à message social ou politique)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art écologique - très large
((SELECT id FROM public.subcategories WHERE name = 'Art écologique (matériaux naturels et recyclés)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art religieux - très large
((SELECT id FROM public.subcategories WHERE name = 'Art religieux ou spirituel (œuvres à thème sacré)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Fresque historique - très large
((SELECT id FROM public.subcategories WHERE name = 'Fresque historique (illustration d''événements)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true),

-- Art thérapeutique - très large
((SELECT id FROM public.subcategories WHERE name = 'Art thérapeutique (art utilisé dans la guérison émotionnelle)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), true)

ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- 3. Configurer les sous-catégories qui N'ONT PAS BESOIN du niveau 2 (has_level2 = false ou pas de configuration)
-- Ces sous-catégories iront directement aux titres :

-- Art visuel (peinture, dessin, illustration) - spécifique
-- Calligraphie artistique - spécifique
-- Collage artistique - spécifique
-- Gravure et impression artistique - spécifique
-- Land art (créations naturelles en extérieur) - spécifique
-- Body art (peinture corporelle, tatouages artistiques) - spécifique
-- Art sonore (création musicale expérimentale) - spécifique
-- Musique instrumentale originale - spécifique
-- Musique vocale (chant artistique) - spécifique
-- Calligraphie artistique - spécifique
-- Architecture artistique (bâtiments iconiques, design urbain) - spécifique
-- Peinture murale intérieure (home art, décoration artistique) - spécifique
-- Origami et art du pliage papier - spécifique
-- Caricature et dessin satirique - spécifique
-- Art abstrait (formes libres, interprétations ouvertes) - spécifique
-- Art figuratif (représentation fidèle du réel) - spécifique
-- Gravure sur bois ou métal - spécifique
-- Vidéo stop-motion créative - spécifique
-- Dioramas et miniatures artistiques - spécifique
-- Illustration pour jeux vidéo ou animation - spécifique
-- Fresque collaborative (œuvre créée à plusieurs) - spécifique
-- Art éphémère (créations temporaires) - spécifique
-- Peinture sur objets (customisation artistique) - spécifique
-- Design floral (créations florales artistiques) - spécifique

-- Note: Ces sous-catégories n'ont pas de configuration spécifique, 
-- donc elles iront directement aux titres (comportement par défaut) 