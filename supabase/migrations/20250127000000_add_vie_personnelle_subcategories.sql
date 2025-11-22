-- Migration pour ajouter les sous-catégories de "Vie personnelle"
-- Date: 2025-01-27

-- Ajouter les sous-catégories pour "Vie personnelle" organisées par thèmes

-- 1. APPARENCE & CORPS
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) VALUES
('Soins du visage', 'Routines et produits pour prendre soin de son visage', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Soins du corps', 'Soins et routines pour le corps', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Cheveux', 'Soins, coiffures et conseils pour les cheveux', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Ongles', 'Soins et manucures pour les ongles', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Maquillage', 'Tutoriels et conseils de maquillage', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Style vestimentaire', 'Mode, style et conseils vestimentaires', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Accessoires', 'Bijoux, sacs et autres accessoires', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),

-- 2. RELATIONS & SOCIAL
('Relations amoureuses', 'Conseils et expériences en couple', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Amitiés', 'Entretenir et développer ses amitiés', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Relations familiales', 'Dynamiques et conseils familiaux', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Relations professionnelles', 'Gérer les relations au travail', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Rencontres sociales', 'Comment rencontrer de nouvelles personnes', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Communication', 'Améliorer sa communication avec les autres', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),

-- 3. BIEN-ÊTRE & SANTÉ
('Santé mentale', 'Prendre soin de sa santé psychologique', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Santé physique', 'Maintenir une bonne santé physique', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Nutrition', 'Alimentation équilibrée et conseils nutritionnels', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Sommeil', 'Améliorer la qualité de son sommeil', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Gestion du stress', 'Techniques pour gérer le stress quotidien', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Méditation', 'Pratiques de méditation et relaxation', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),

-- 4. DÉVELOPPEMENT PERSONNEL
('Objectifs personnels', 'Définir et atteindre ses objectifs', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Confiance en soi', 'Développer et maintenir sa confiance', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Gestion du temps', 'Organiser son temps efficacement', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Organisation', 'Méthodes d''organisation personnelle', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Apprentissage', 'Techniques d''apprentissage et développement de compétences', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Réflexion personnelle', 'Introspection et développement de soi', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),

-- 5. EXPÉRIENCES DE VIE
('Voyages personnels', 'Récits et conseils de voyages', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Moments marquants', 'Événements importants de la vie', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Défis personnels', 'Relever des défis et surmonter les obstacles', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Réalisations', 'Célébrer ses réussites et accomplissements', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Apprentissages', 'Leçons tirées des expériences de vie', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Histoires personnelles', 'Récits et anecdotes de la vie quotidienne', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now());

-- Ajouter quelques exemples de titres de contenu pour certaines sous-catégories
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES
-- Titres pour Soins du visage
('Ma routine skincare du matin', (SELECT id FROM public.subcategories WHERE name = 'Soins du visage' LIMIT 1), 'title', 'all', now()),
('Les produits essentiels pour débuter', (SELECT id FROM public.subcategories WHERE name = 'Soins du visage' LIMIT 1), 'title', 'all', now()),
('Comment adapter sa routine selon sa peau', (SELECT id FROM public.subcategories WHERE name = 'Soins du visage' LIMIT 1), 'title', 'all', now()),

-- Titres pour Relations amoureuses
('Comment communiquer dans son couple', (SELECT id FROM public.subcategories WHERE name = 'Relations amoureuses' LIMIT 1), 'title', 'all', now()),
('Les clés d''une relation épanouie', (SELECT id FROM public.subcategories WHERE name = 'Relations amoureuses' LIMIT 1), 'title', 'all', now()),
('Gérer les conflits en couple', (SELECT id FROM public.subcategories WHERE name = 'Relations amoureuses' LIMIT 1), 'title', 'all', now()),

-- Titres pour Santé mentale
('Prendre soin de sa santé mentale au quotidien', (SELECT id FROM public.subcategories WHERE name = 'Santé mentale' LIMIT 1), 'title', 'all', now()),
('Techniques pour gérer l''anxiété', (SELECT id FROM public.subcategories WHERE name = 'Santé mentale' LIMIT 1), 'title', 'all', now()),
('Comment se sentir mieux dans sa tête', (SELECT id FROM public.subcategories WHERE name = 'Santé mentale' LIMIT 1), 'title', 'all', now()),

-- Titres pour Objectifs personnels
('Comment définir ses objectifs de vie', (SELECT id FROM public.subcategories WHERE name = 'Objectifs personnels' LIMIT 1), 'title', 'all', now()),
('Atteindre ses objectifs étape par étape', (SELECT id FROM public.subcategories WHERE name = 'Objectifs personnels' LIMIT 1), 'title', 'all', now()),
('Rester motivé pour ses objectifs', (SELECT id FROM public.subcategories WHERE name = 'Objectifs personnels' LIMIT 1), 'title', 'all', now()),

-- Titres pour Histoires personnelles
('Les moments qui m''ont marqué', (SELECT id FROM public.subcategories WHERE name = 'Histoires personnelles' LIMIT 1), 'title', 'all', now()),
('Partager mes expériences de vie', (SELECT id FROM public.subcategories WHERE name = 'Histoires personnelles' LIMIT 1), 'title', 'all', now()),
('Les leçons que la vie m''a apprises', (SELECT id FROM public.subcategories WHERE name = 'Histoires personnelles' LIMIT 1), 'title', 'all', now()); 