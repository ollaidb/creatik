-- Migration complète pour ajouter des données de test pour toutes les catégories
-- Date: 2025-07-23

-- 1. Ajouter des sous-catégories pour toutes les catégories principales
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) VALUES
-- Activisme
('Manifestations', 'Comment organiser et participer aux manifestations', (SELECT id FROM public.categories WHERE name = 'Activisme' LIMIT 1), now(), now()),
('Pétitions', 'Créer et partager des pétitions efficaces', (SELECT id FROM public.categories WHERE name = 'Activisme' LIMIT 1), now(), now()),
('Campagnes', 'Lancer des campagnes de sensibilisation', (SELECT id FROM public.categories WHERE name = 'Activisme' LIMIT 1), now(), now()),

-- Actualités
('Breaking news', 'Couverture des actualités en temps réel', (SELECT id FROM public.categories WHERE name = 'Actualités' LIMIT 1), now(), now()),
('Analyses politiques', 'Décryptage des événements politiques', (SELECT id FROM public.categories WHERE name = 'Actualités' LIMIT 1), now(), now()),
('International', 'Actualités du monde', (SELECT id FROM public.categories WHERE name = 'Actualités' LIMIT 1), now(), now()),

-- Analyse
('Analyses de marché', 'Analyses économiques et financières', (SELECT id FROM public.categories WHERE name = 'Analyse' LIMIT 1), now(), now()),
('Tendances', 'Analyses des tendances actuelles', (SELECT id FROM public.categories WHERE name = 'Analyse' LIMIT 1), now(), now()),
('Décryptage', 'Analyses approfondies de sujets', (SELECT id FROM public.categories WHERE name = 'Analyse' LIMIT 1), now(), now()),

-- Anecdote
('Histoires personnelles', 'Récits et anecdotes personnelles', (SELECT id FROM public.categories WHERE name = 'Anecdote' LIMIT 1), now(), now()),
('Expériences', 'Partage d''expériences vécues', (SELECT id FROM public.categories WHERE name = 'Anecdote' LIMIT 1), now(), now()),
('Mémoires', 'Souvenirs et moments marquants', (SELECT id FROM public.categories WHERE name = 'Anecdote' LIMIT 1), now(), now()),

-- Astuce
('Life hacks', 'Astuces de vie quotidienne', (SELECT id FROM public.categories WHERE name = 'Astuce' LIMIT 1), now(), now()),
('Trucs et astuces', 'Conseils pratiques pour tout', (SELECT id FROM public.categories WHERE name = 'Astuce' LIMIT 1), now(), now()),
('Optimisation', 'Comment optimiser son quotidien', (SELECT id FROM public.categories WHERE name = 'Astuce' LIMIT 1), now(), now()),

-- Animation / dessin animé
('Tutoriels animation', 'Comment créer des animations', (SELECT id FROM public.categories WHERE name = 'Animation / dessin animé' LIMIT 1), now(), now()),
('Dessins animés', 'Création de dessins animés', (SELECT id FROM public.categories WHERE name = 'Animation / dessin animé' LIMIT 1), now(), now()),
('Motion design', 'Design animé et motion graphics', (SELECT id FROM public.categories WHERE name = 'Animation / dessin animé' LIMIT 1), now(), now()),

-- Animaux
('Soins animaux', 'Conseils pour prendre soin des animaux', (SELECT id FROM public.categories WHERE name = 'Animaux' LIMIT 1), now(), now()),
('Éducation animale', 'Éduquer et dresser les animaux', (SELECT id FROM public.categories WHERE name = 'Animaux' LIMIT 1), now(), now()),
('Comportement', 'Comprendre le comportement animal', (SELECT id FROM public.categories WHERE name = 'Animaux' LIMIT 1), now(), now()),

-- Art
('Peinture', 'Tutoriels de peinture', (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1), now(), now()),
('Dessin', 'Techniques de dessin', (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1), now(), now()),
('Art digital', 'Création artistique numérique', (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1), now(), now()),

-- Avant / Après
('Transformations', 'Avant/après de transformations', (SELECT id FROM public.categories WHERE name = 'Avant / Après' LIMIT 1), now(), now()),
('Évolutions', 'Suivi d''évolutions dans le temps', (SELECT id FROM public.categories WHERE name = 'Avant / Après' LIMIT 1), now(), now()),
('Progrès', 'Documentation de progrès', (SELECT id FROM public.categories WHERE name = 'Avant / Après' LIMIT 1), now(), now()),

-- Asmr
('Tapping', 'Sons de tapotement ASMR', (SELECT id FROM public.categories WHERE name = 'Asmr' LIMIT 1), now(), now()),
('Eating sounds', 'Sons de mastication ASMR', (SELECT id FROM public.categories WHERE name = 'Asmr' LIMIT 1), now(), now()),
('Relaxation', 'Contenus relaxants ASMR', (SELECT id FROM public.categories WHERE name = 'Asmr' LIMIT 1), now(), now()),

-- Astrologie
('Horoscopes', 'Prédictions astrologiques', (SELECT id FROM public.categories WHERE name = 'Astrologie' LIMIT 1), now(), now()),
('Signes zodiacaux', 'Caractéristiques des signes', (SELECT id FROM public.categories WHERE name = 'Astrologie' LIMIT 1), now(), now()),
('Compatibilité', 'Compatibilité astrologique', (SELECT id FROM public.categories WHERE name = 'Astrologie' LIMIT 1), now(), now()),

-- Beauty / style
('Makeup tutorials', 'Tutoriels de maquillage', (SELECT id FROM public.categories WHERE name = 'Beauty / style' LIMIT 1), now(), now()),
('Fashion tips', 'Conseils de mode et style', (SELECT id FROM public.categories WHERE name = 'Beauty / style' LIMIT 1), now(), now()),
('Skincare', 'Soins de la peau', (SELECT id FROM public.categories WHERE name = 'Beauty / style' LIMIT 1), now(), now()),

-- Bricolage / DIY
('Projets DIY', 'Projets à faire soi-même', (SELECT id FROM public.categories WHERE name = 'Bricolage / DIY' LIMIT 1), now(), now()),
('Décoration', 'Décoration maison DIY', (SELECT id FROM public.categories WHERE name = 'Bricolage / DIY' LIMIT 1), now(), now()),
('Récupération', 'Projets de récupération', (SELECT id FROM public.categories WHERE name = 'Bricolage / DIY' LIMIT 1), now(), now()),

-- Bts / coulisse
('Making of', 'Coulisses de création', (SELECT id FROM public.categories WHERE name = 'Bts / coulisse' LIMIT 1), now(), now()),
('Backstage', 'Vie en coulisses', (SELECT id FROM public.categories WHERE name = 'Bts / coulisse' LIMIT 1), now(), now()),
('Préparation', 'Processus de préparation', (SELECT id FROM public.categories WHERE name = 'Bts / coulisse' LIMIT 1), now(), now()),

-- Carrière
('CV et entretiens', 'Conseils pour CV et entretiens', (SELECT id FROM public.categories WHERE name = 'Carrière' LIMIT 1), now(), now()),
('Développement pro', 'Développement professionnel', (SELECT id FROM public.categories WHERE name = 'Carrière' LIMIT 1), now(), now()),
('Networking', 'Réseautage professionnel', (SELECT id FROM public.categories WHERE name = 'Carrière' LIMIT 1), now(), now()),

-- Caption
('Écriture captions', 'Comment écrire des captions', (SELECT id FROM public.categories WHERE name = 'Caption' LIMIT 1), now(), now()),
('Stratégies caption', 'Stratégies de captions', (SELECT id FROM public.categories WHERE name = 'Caption' LIMIT 1), now(), now()),
('Engagement caption', 'Captions pour l''engagement', (SELECT id FROM public.categories WHERE name = 'Caption' LIMIT 1), now(), now()),

-- Catastrophe / erreur
('Fails', 'Échecs et erreurs', (SELECT id FROM public.categories WHERE name = 'Catastrophe / erreur' LIMIT 1), now(), now()),
('Leçons apprises', 'Leçons tirées des erreurs', (SELECT id FROM public.categories WHERE name = 'Catastrophe / erreur' LIMIT 1), now(), now()),
('Récupération', 'Comment rebondir', (SELECT id FROM public.categories WHERE name = 'Catastrophe / erreur' LIMIT 1), now(), now()),

-- Célébrité
('Gossip', 'Actualités célébrités', (SELECT id FROM public.categories WHERE name = 'Célébrité' LIMIT 1), now(), now()),
('Style célébrités', 'Style des célébrités', (SELECT id FROM public.categories WHERE name = 'Célébrité' LIMIT 1), now(), now()),
('Vie privée', 'Vie privée des célébrités', (SELECT id FROM public.categories WHERE name = 'Célébrité' LIMIT 1), now(), now()),

-- Challenge
('Défis personnels', 'Défis à relever', (SELECT id FROM public.categories WHERE name = 'Challenge' LIMIT 1), now(), now()),
('Challenges viraux', 'Challenges populaires', (SELECT id FROM public.categories WHERE name = 'Challenge' LIMIT 1), now(), now()),
('Défis créatifs', 'Challenges créatifs', (SELECT id FROM public.categories WHERE name = 'Challenge' LIMIT 1), now(), now()),

-- Cinéma
('Critiques films', 'Critiques de films', (SELECT id FROM public.categories WHERE name = 'Cinéma' LIMIT 1), now(), now()),
('Making of films', 'Coulisses du cinéma', (SELECT id FROM public.categories WHERE name = 'Cinéma' LIMIT 1), now(), now()),
('Histoire cinéma', 'Histoire du cinéma', (SELECT id FROM public.categories WHERE name = 'Cinéma' LIMIT 1), now(), now()),

-- Classement / statistique
('Top 10', 'Classements top 10', (SELECT id FROM public.categories WHERE name = 'Classement / statistique' LIMIT 1), now(), now()),
('Statistiques', 'Données statistiques', (SELECT id FROM public.categories WHERE name = 'Classement / statistique' LIMIT 1), now(), now()),
('Comparaisons', 'Comparaisons et classements', (SELECT id FROM public.categories WHERE name = 'Classement / statistique' LIMIT 1), now(), now()),

-- Complotiste
('Théories', 'Théories du complot', (SELECT id FROM public.categories WHERE name = 'Complotiste' LIMIT 1), now(), now()),
('Mystères', 'Mystères non résolus', (SELECT id FROM public.categories WHERE name = 'Complotiste' LIMIT 1), now(), now()),
('Enquêtes', 'Enquêtes conspirationnistes', (SELECT id FROM public.categories WHERE name = 'Complotiste' LIMIT 1), now(), now()),

-- Communauté
('Événements', 'Événements communautaires', (SELECT id FROM public.categories WHERE name = 'Communauté' LIMIT 1), now(), now()),
('Groupes', 'Groupes et communautés', (SELECT id FROM public.categories WHERE name = 'Communauté' LIMIT 1), now(), now()),
('Solidarité', 'Actions solidaires', (SELECT id FROM public.categories WHERE name = 'Communauté' LIMIT 1), now(), now()),

-- Cuisine
('Recettes rapides', 'Recettes faciles et rapides', (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1), now(), now()),
('Cuisine du monde', 'Découverte des cuisines internationales', (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1), now(), now()),
('Techniques', 'Techniques de cuisine', (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1), now(), now()),

-- Développement personnel
('Motivation', 'Conseils pour rester motivé', (SELECT id FROM public.categories WHERE name = 'Développement personnel' LIMIT 1), now(), now()),
('Confiance en soi', 'Développer sa confiance en soi', (SELECT id FROM public.categories WHERE name = 'Développement personnel' LIMIT 1), now(), now()),
('Objectifs', 'Atteindre ses objectifs', (SELECT id FROM public.categories WHERE name = 'Développement personnel' LIMIT 1), now(), now()),

-- Humour
('Blagues', 'Contenu humoristique', (SELECT id FROM public.categories WHERE name = 'Humour' LIMIT 1), now(), now()),
('Parodies', 'Parodies et imitations', (SELECT id FROM public.categories WHERE name = 'Humour' LIMIT 1), now(), now()),
('Sketchs', 'Sketchs comiques', (SELECT id FROM public.categories WHERE name = 'Humour' LIMIT 1), now(), now()),

-- Musique
('Covers', 'Reprises de chansons', (SELECT id FROM public.categories WHERE name = 'Musique' LIMIT 1), now(), now()),
('Composition', 'Création musicale', (SELECT id FROM public.categories WHERE name = 'Musique' LIMIT 1), now(), now()),
('Instruments', 'Apprentissage d''instruments', (SELECT id FROM public.categories WHERE name = 'Musique' LIMIT 1), now(), now()),

-- Santé - sport
('Fitness', 'Exercices et entraînement', (SELECT id FROM public.categories WHERE name = 'Santé - sport' LIMIT 1), now(), now()),
('Nutrition', 'Conseils nutritionnels', (SELECT id FROM public.categories WHERE name = 'Santé - sport' LIMIT 1), now(), now()),
('Bien-être', 'Santé et bien-être', (SELECT id FROM public.categories WHERE name = 'Santé - sport' LIMIT 1), now(), now()),

-- Technologie
('Gadgets', 'Nouveaux gadgets et technologies', (SELECT id FROM public.categories WHERE name = 'Technologie' LIMIT 1), now(), now()),
('Apps', 'Applications et logiciels', (SELECT id FROM public.categories WHERE name = 'Technologie' LIMIT 1), now(), now()),
('IA', 'Intelligence artificielle', (SELECT id FROM public.categories WHERE name = 'Technologie' LIMIT 1), now(), now()),

-- Voyage
('Destinations', 'Découverte de destinations', (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1), now(), now()),
('Conseils voyage', 'Conseils pour voyager', (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1), now(), now()),
('Budget voyage', 'Voyager pas cher', (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1), now(), now());

-- 2. Ajouter des titres pour chaque sous-catégorie (exemples pour quelques sous-catégories)
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
-- Titres pour Manifestations
('Comment organiser une manifestation efficace', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now()),
('Les erreurs à éviter lors d''une manifestation', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now()),
('Pourquoi manifester change les choses', (SELECT id FROM public.subcategories WHERE name = 'Manifestations' LIMIT 1), 'title', 'all', now()),

-- Titres pour Life hacks
('10 life hacks qui changent tout', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Les astuces que personne ne connaît', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Comment simplifier sa vie', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),

-- Titres pour Makeup tutorials
('Tutoriel makeup pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Les secrets du makeup professionnel', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Comment maîtriser le contouring', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),

-- Titres pour Recettes rapides
('Recettes en 15 minutes', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Cuisine facile pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Comment cuisiner sans stress', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),

-- Titres pour Motivation
('Comment rester motivé tous les jours', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Les secrets des gens motivés', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Pourquoi la motivation est clé', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),

-- Titres pour Blagues
('Les meilleures blagues du moment', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Comment faire rire son audience', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('L''humour qui cartonne', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),

-- Titres pour Covers
('Comment faire une cover virale', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Les secrets des covers réussies', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Pourquoi les covers marchent', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),

-- Titres pour Fitness
('Entraînement à la maison', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Comment se muscler sans salle', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Les exercices qui marchent', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),

-- Titres pour Gadgets
('Les gadgets du futur', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Comment choisir ses gadgets', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Pourquoi les gadgets changent tout', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),

-- Titres pour Destinations
('Les destinations à ne pas manquer', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Comment choisir sa destination', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Pourquoi voyager change la vie', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()); 