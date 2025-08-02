-- Sous-sous-catégories pour "Relations"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Relations amoureuses', 'Conseils et expériences en couple', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Amitiés', 'Entretenir et développer ses amitiés', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Relations familiales', 'Dynamiques familiales', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Relations professionnelles', 'Gérer les relations au travail', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Relations sociales', 'Développer son réseau social', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- Sous-sous-catégories pour "Apparence"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Soins du visage', 'Routines et produits pour le visage', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Soins du corps', 'Routines et produits pour le corps', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Cheveux', 'Soins et coiffures', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Maquillage', 'Tutoriels et conseils de maquillage', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Style vestimentaire', 'Mode et conseils vestimentaires', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- Sous-sous-catégories pour "Profession"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Carrière', 'Développement professionnel', (SELECT id FROM public.subcategories WHERE name = 'Profession' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Formation', 'Apprentissage et compétences', (SELECT id FROM public.subcategories WHERE name = 'Profession' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Entrepreneuriat', 'Créer et gérer son entreprise', (SELECT id FROM public.subcategories WHERE name = 'Profession' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Équilibre vie pro/perso', 'Concilier travail et vie privée', (SELECT id FROM public.subcategories WHERE name = 'Profession' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Leadership', 'Développer ses compétences de leader', (SELECT id FROM public.subcategories WHERE name = 'Profession' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- Sous-sous-catégories pour "Expérience"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Voyages', 'Récits et conseils de voyages', (SELECT id FROM public.subcategories WHERE name = 'Expérience' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Aventures', 'Expériences extraordinaires', (SELECT id FROM public.subcategories WHERE name = 'Expérience' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Apprentissages', 'Leçons tirées de la vie', (SELECT id FROM public.subcategories WHERE name = 'Expérience' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Défis', 'Surmonter les obstacles', (SELECT id FROM public.subcategories WHERE name = 'Expérience' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Réalisations', 'Objectifs atteints et succès', (SELECT id FROM public.subcategories WHERE name = 'Expérience' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- Sous-sous-catégories pour "Témoignage"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Histoires personnelles', 'Récits de vie quotidiens', (SELECT id FROM public.subcategories WHERE name = 'Témoignage' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Moments marquants', 'Événements importants de la vie', (SELECT id FROM public.subcategories WHERE name = 'Témoignage' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Leçons de vie', 'Sagesse et conseils personnels', (SELECT id FROM public.subcategories WHERE name = 'Témoignage' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Inspirations', 'Ce qui nous motive et inspire', (SELECT id FROM public.subcategories WHERE name = 'Témoignage' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Partages authentiques', 'Vulnérabilité et authenticité', (SELECT id FROM public.subcategories WHERE name = 'Témoignage' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING; 