-- Migration pour ajouter des données de test
-- Date: 2025-07-23

-- 1. Ajouter des sous-catégories pour toutes les catégories existantes
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) VALUES
-- Activisme
('Manifestations', 'Comment organiser et participer aux manifestations', (SELECT id FROM public.categories WHERE name = 'Activisme' LIMIT 1), now(), now()),
('Pétitions', 'Créer et partager des pétitions efficaces', (SELECT id FROM public.categories WHERE name = 'Activisme' LIMIT 1), now(), now()),

-- Actualités
('Breaking news', 'Couverture des actualités en temps réel', (SELECT id FROM public.categories WHERE name = 'Actualités' LIMIT 1), now(), now()),
('Analyses politiques', 'Décryptage des événements politiques', (SELECT id FROM public.categories WHERE name = 'Actualités' LIMIT 1), now(), now()),

-- Astuce
('Life hacks', 'Astuces de vie quotidienne', (SELECT id FROM public.categories WHERE name = 'Astuce' LIMIT 1), now(), now()),
('Trucs et astuces', 'Conseils pratiques pour tout', (SELECT id FROM public.categories WHERE name = 'Astuce' LIMIT 1), now(), now()),

-- Beauty / style
('Makeup tutorials', 'Tutoriels de maquillage', (SELECT id FROM public.categories WHERE name = 'Beauty / style' LIMIT 1), now(), now()),
('Fashion tips', 'Conseils de mode et style', (SELECT id FROM public.categories WHERE name = 'Beauty / style' LIMIT 1), now(), now()),

-- Cuisine
('Recettes rapides', 'Recettes faciles et rapides', (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1), now(), now()),
('Cuisine du monde', 'Découverte des cuisines internationales', (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1), now(), now()),

-- Développement personnel
('Motivation', 'Conseils pour rester motivé', (SELECT id FROM public.categories WHERE name = 'Développement personnel' LIMIT 1), now(), now()),
('Confiance en soi', 'Développer sa confiance en soi', (SELECT id FROM public.categories WHERE name = 'Développement personnel' LIMIT 1), now(), now()),

-- Humour
('Blagues', 'Contenu humoristique', (SELECT id FROM public.categories WHERE name = 'Humour' LIMIT 1), now(), now()),
('Parodies', 'Parodies et imitations', (SELECT id FROM public.categories WHERE name = 'Humour' LIMIT 1), now(), now()),

-- Musique
('Covers', 'Reprises de chansons', (SELECT id FROM public.categories WHERE name = 'Musique' LIMIT 1), now(), now()),
('Composition', 'Création musicale', (SELECT id FROM public.categories WHERE name = 'Musique' LIMIT 1), now(), now()),

-- Sport
('Fitness', 'Exercices et entraînement', (SELECT id FROM public.categories WHERE name = 'Santé - sport' LIMIT 1), now(), now()),
('Nutrition', 'Conseils nutritionnels', (SELECT id FROM public.categories WHERE name = 'Santé - sport' LIMIT 1), now(), now()),

-- Technologie
('Gadgets', 'Nouveaux gadgets et technologies', (SELECT id FROM public.categories WHERE name = 'Technologie' LIMIT 1), now(), now()),
('Apps', 'Applications et logiciels', (SELECT id FROM public.categories WHERE name = 'Technologie' LIMIT 1), now(), now()),

-- Voyage
('Destinations', 'Découverte de destinations', (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1), now(), now()),
('Conseils voyage', 'Conseils pour voyager', (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1), now(), now());

-- 2. Ajouter des titres pour chaque sous-catégorie
-- Titres pour Manifestations
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Comment organiser une manifestation efficace', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now()),
('Les erreurs à éviter lors d''une manifestation', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now()),
('Pourquoi manifester change les choses', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now());

-- Titres pour Pétitions
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Comment créer une pétition virale', (SELECT id FROM public.subcategories WHERE name = 'Pétitions' LIMIT 1), 'title', 'all', now()),
('Les secrets d''une pétition efficace', (SELECT id FROM public.subcategories WHERE name = 'Pétitions' LIMIT 1), 'title', 'all', now()),
('Pourquoi signer des pétitions est important', (SELECT id FROM public.subcategories WHERE name = 'Pétitions' LIMIT 1), 'title', 'all', now());

-- Titres pour Breaking news
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Comment couvrir les breaking news', (SELECT id FROM public.subcategories WHERE name = 'Breaking news' LIMIT 1), 'title', 'all', now()),
('Les erreurs à éviter en journalisme', (SELECT id FROM public.subcategories WHERE name = 'Breaking news' LIMIT 1), 'title', 'all', now()),
('Pourquoi l''actualité est importante', (SELECT id FROM public.subcategories WHERE name = 'Breaking news' LIMIT 1), 'title', 'all', now());

-- Titres pour Life hacks
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('10 life hacks qui changent tout', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Les astuces que personne ne connaît', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Comment simplifier sa vie', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now());

-- Titres pour Makeup tutorials
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Tutoriel makeup pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Les secrets du makeup professionnel', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Comment maîtriser le contouring', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now());

-- Titres pour Recettes rapides
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Recettes en 15 minutes', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Cuisine facile pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Comment cuisiner sans stress', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now());

-- Titres pour Motivation
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Comment rester motivé tous les jours', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Les secrets des gens motivés', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Pourquoi la motivation est clé', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now());

-- Titres pour Blagues
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Les meilleures blagues du moment', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Comment faire rire son audience', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('L''humour qui cartonne', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now());

-- Titres pour Covers
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Comment faire une cover virale', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Les secrets des covers réussies', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Pourquoi les covers marchent', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now());

-- Titres pour Fitness
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Entraînement à la maison', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Comment se muscler sans salle', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Les exercices qui marchent', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now());

-- Titres pour Gadgets
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Les gadgets du futur', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Comment choisir ses gadgets', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Pourquoi les gadgets changent tout', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now());

-- Titres pour Destinations
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
('Les destinations à ne pas manquer', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Comment choisir sa destination', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Pourquoi voyager change la vie', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()); 