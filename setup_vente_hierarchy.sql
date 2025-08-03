-- Configuration de la catégorie "Vente" pour le niveau 2
-- Date: 2025-08-03

-- 1. Configurer la catégorie "Vente" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2)
VALUES ((SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), true)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 2. Ajouter les sous-catégories principales pour "Vente"
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) VALUES
('Mode et Accessoires', 'Vêtements, chaussures, sacs, bijoux, montres', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Électronique et Tech', 'Smartphones, ordinateurs, gadgets, accessoires tech', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Maison et Décoration', 'Mobilier, décoration, art de vivre, jardinage', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Beauté et Bien-être', 'Cosmétiques, parfums, soins, produits bien-être', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Sport et Loisirs', 'Équipements sportifs, jeux, jouets, activités', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Automobile et Transport', 'Voitures, motos, vélos, accessoires auto', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Immobilier et Location', 'Appartements, maisons, terrains, locations', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Art et Collection', 'Artisanat, antiquités, art, objets de collection', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Alimentation et Gastronomie', 'Produits locaux, spécialités, ustensiles de cuisine', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now()),
('Services et Formation', 'Cours, formations, conseils, services personnalisés', (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), now(), now());

-- 3. Configurer toutes les sous-catégories pour avoir le niveau 2
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2)
SELECT id, true FROM public.subcategories 
WHERE category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1)
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true; 