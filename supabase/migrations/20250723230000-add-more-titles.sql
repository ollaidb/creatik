-- Migration pour ajouter plus d'exemples de titres
-- Date: 2025-07-23

-- Ajouter des titres pour différentes sous-catégories
INSERT INTO public.content_titles (title, subcategory_id, type, platform, created_at) VALUES

-- Titres pour Life hacks (Astuce)
('10 astuces pour organiser sa maison en 5 minutes', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Les secrets pour plier ses vêtements comme un pro', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Comment nettoyer son téléphone en 30 secondes', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('5 astuces pour économiser l''eau au quotidien', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),
('Comment faire ses courses sans oublier rien', (SELECT id FROM public.subcategories WHERE name = 'Life hacks' LIMIT 1), 'title', 'all', now()),

-- Titres pour Makeup tutorials (Beauty / style)
('Tutoriel makeup naturel pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Comment faire un smoky eye en 5 étapes', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Les erreurs à éviter en maquillage', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Tutoriel makeup pour les yeux marron', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),
('Comment faire un contouring naturel', (SELECT id FROM public.subcategories WHERE name = 'Makeup tutorials' LIMIT 1), 'title', 'all', now()),

-- Titres pour Recettes rapides (Cuisine)
('Recette de pâtes en 10 minutes chrono', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Comment faire un sandwich gourmet', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Recette de salade composée express', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('5 recettes avec des restes de frigo', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),
('Comment cuisiner sans vaisselle', (SELECT id FROM public.subcategories WHERE name = 'Recettes rapides' LIMIT 1), 'title', 'all', now()),

-- Titres pour Motivation (Développement personnel)
('Comment se lever tôt sans souffrir', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('5 habitudes pour être plus productif', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Comment arrêter de procrastiner', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Les secrets des gens qui réussissent', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),
('Comment garder sa motivation en hiver', (SELECT id FROM public.subcategories WHERE name = 'Motivation' LIMIT 1), 'title', 'all', now()),

-- Titres pour Blagues (Humour)
('Les meilleures blagues de l''année', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Comment faire rire son crush', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Blagues pour briser la glace', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Les blagues qui marchent à tous les coups', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),
('Comment être drôle sans être méchant', (SELECT id FROM public.subcategories WHERE name = 'Blagues' LIMIT 1), 'title', 'all', now()),

-- Titres pour Covers (Musique)
('Comment faire une cover virale sur TikTok', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Les chansons les plus faciles à reprendre', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Comment améliorer sa voix pour les covers', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Covers qui ont cartonné en 2024', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),
('Comment arranger une chanson à sa façon', (SELECT id FROM public.subcategories WHERE name = 'Covers' LIMIT 1), 'title', 'all', now()),

-- Titres pour Fitness (Santé - sport)
('Entraînement complet en 20 minutes', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Comment se muscler sans équipement', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Exercices pour perdre du ventre', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Routine matinale pour être en forme', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),
('Comment faire des pompes correctement', (SELECT id FROM public.subcategories WHERE name = 'Fitness' LIMIT 1), 'title', 'all', now()),

-- Titres pour Gadgets (Technologie)
('Les gadgets les plus utiles de 2024', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Comment choisir son smartphone', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Gadgets pour améliorer sa productivité', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Les meilleures applications gratuites', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),
('Comment protéger ses données personnelles', (SELECT id FROM public.subcategories WHERE name = 'Gadgets' LIMIT 1), 'title', 'all', now()),

-- Titres pour Destinations (Voyage)
('Les destinations les moins chères d''Europe', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Comment voyager avec un petit budget', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Les plus beaux endroits à visiter en France', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Destinations pour les amoureux de nature', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),
('Comment planifier un voyage parfait', (SELECT id FROM public.subcategories WHERE name = 'Destinations' LIMIT 1), 'title', 'all', now()),

-- Titres pour Fashion tips (Beauty / style)
('Comment s''habiller selon sa morphologie', (SELECT id FROM public.subcategories WHERE name = 'Fashion tips' LIMIT 1), 'title', 'all', now()),
('Les tendances de l''été 2024', (SELECT id FROM public.subcategories WHERE name = 'Fashion tips' LIMIT 1), 'title', 'all', now()),
('Comment créer une garde-robe capsule', (SELECT id FROM public.subcategories WHERE name = 'Fashion tips' LIMIT 1), 'title', 'all', now()),
('Les erreurs de style à éviter', (SELECT id FROM public.subcategories WHERE name = 'Fashion tips' LIMIT 1), 'title', 'all', now()),
('Comment porter les couleurs qui vous vont', (SELECT id FROM public.subcategories WHERE name = 'Fashion tips' LIMIT 1), 'title', 'all', now()),

-- Titres pour Skincare (Beauty / style)
('Routine skincare pour débutants', (SELECT id FROM public.subcategories WHERE name = 'Skincare' LIMIT 1), 'title', 'all', now()),
('Comment traiter l''acné naturellement', (SELECT id FROM public.subcategories WHERE name = 'Skincare' LIMIT 1), 'title', 'all', now()),
('Les produits essentiels pour sa peau', (SELECT id FROM public.subcategories WHERE name = 'Skincare' LIMIT 1), 'title', 'all', now()),
('Comment hydrater sa peau en hiver', (SELECT id FROM public.subcategories WHERE name = 'Skincare' LIMIT 1), 'title', 'all', now()),
('Routine du soir pour une belle peau', (SELECT id FROM public.subcategories WHERE name = 'Skincare' LIMIT 1), 'title', 'all', now()),

-- Titres pour Nutrition (Santé - sport)
('Comment manger équilibré sans se ruiner', (SELECT id FROM public.subcategories WHERE name = 'Nutrition' LIMIT 1), 'title', 'all', now()),
('Les superaliments à ajouter à son alimentation', (SELECT id FROM public.subcategories WHERE name = 'Nutrition' LIMIT 1), 'title', 'all', now()),
('Comment perdre du poids sainement', (SELECT id FROM public.subcategories WHERE name = 'Nutrition' LIMIT 1), 'title', 'all', now()),
('Recettes healthy pour le déjeuner', (SELECT id FROM public.subcategories WHERE name = 'Nutrition' LIMIT 1), 'title', 'all', now()),
('Comment boire plus d''eau au quotidien', (SELECT id FROM public.subcategories WHERE name = 'Nutrition' LIMIT 1), 'title', 'all', now()),

-- Titres pour Apps (Technologie)
('Les meilleures apps de productivité', (SELECT id FROM public.subcategories WHERE name = 'Apps' LIMIT 1), 'title', 'all', now()),
('Comment organiser sa vie avec son téléphone', (SELECT id FROM public.subcategories WHERE name = 'Apps' LIMIT 1), 'title', 'all', now()),
('Apps gratuites pour apprendre les langues', (SELECT id FROM public.subcategories WHERE name = 'Apps' LIMIT 1), 'title', 'all', now()),
('Les meilleures apps de fitness', (SELECT id FROM public.subcategories WHERE name = 'Apps' LIMIT 1), 'title', 'all', now()),
('Comment sécuriser ses comptes en ligne', (SELECT id FROM public.subcategories WHERE name = 'Apps' LIMIT 1), 'title', 'all', now()),

-- Titres pour IA (Technologie)
('Comment utiliser ChatGPT efficacement', (SELECT id FROM public.subcategories WHERE name = 'IA' LIMIT 1), 'title', 'all', now()),
('Les outils IA pour créer du contenu', (SELECT id FROM public.subcategories WHERE name = 'IA' LIMIT 1), 'title', 'all', now()),
('Comment l''IA va changer notre quotidien', (SELECT id FROM public.subcategories WHERE name = 'IA' LIMIT 1), 'title', 'all', now()),
('Les meilleures applications d''IA gratuites', (SELECT id FROM public.subcategories WHERE name = 'IA' LIMIT 1), 'title', 'all', now()),
('Comment créer des images avec l''IA', (SELECT id FROM public.subcategories WHERE name = 'IA' LIMIT 1), 'title', 'all', now()),

-- Titres pour Bien-être (Santé - sport)
('Comment gérer son stress au quotidien', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' LIMIT 1), 'title', 'all', now()),
('Techniques de respiration pour se détendre', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' LIMIT 1), 'title', 'all', now()),
('Comment améliorer son sommeil', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' LIMIT 1), 'title', 'all', now()),
('Routine matinale pour être zen', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' LIMIT 1), 'title', 'all', now()),
('Comment prendre soin de sa santé mentale', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' LIMIT 1), 'title', 'all', now()),

-- Titres pour Confiance en soi (Développement personnel)
('Comment avoir plus confiance en soi', (SELECT id FROM public.subcategories WHERE name = 'Confiance en soi' LIMIT 1), 'title', 'all', now()),
('Techniques pour parler en public', (SELECT id FROM public.subcategories WHERE name = 'Confiance en soi' LIMIT 1), 'title', 'all', now()),
('Comment arrêter de se comparer aux autres', (SELECT id FROM public.subcategories WHERE name = 'Confiance en soi' LIMIT 1), 'title', 'all', now()),
('Exercices pour améliorer sa posture', (SELECT id FROM public.subcategories WHERE name = 'Confiance en soi' LIMIT 1), 'title', 'all', now()),
('Comment se sentir bien dans sa peau', (SELECT id FROM public.subcategories WHERE name = 'Confiance en soi' LIMIT 1), 'title', 'all', now()),

-- Titres pour Objectifs (Développement personnel)
('Comment atteindre ses objectifs en 2024', (SELECT id FROM public.subcategories WHERE name = 'Objectifs' LIMIT 1), 'title', 'all', now()),
('Techniques pour rester motivé sur le long terme', (SELECT id FROM public.subcategories WHERE name = 'Objectifs' LIMIT 1), 'title', 'all', now()),
('Comment planifier ses objectifs efficacement', (SELECT id FROM public.subcategories WHERE name = 'Objectifs' LIMIT 1), 'title', 'all', now()),
('Les habitudes des gens qui réussissent', (SELECT id FROM public.subcategories WHERE name = 'Objectifs' LIMIT 1), 'title', 'all', now()),
('Comment transformer ses rêves en réalité', (SELECT id FROM public.subcategories WHERE name = 'Objectifs' LIMIT 1), 'title', 'all', now()); 