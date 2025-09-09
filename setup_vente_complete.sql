-- Configuration complète de la catégorie "Vente"
-- Date: 2025-08-03

-- 1. Ajouter la catégorie "Vente" si elle n'existe pas
INSERT INTO public.categories (name, color, description) 
VALUES ('Vente', 'green', 'Vente de produits et services')
ON CONFLICT (name) DO NOTHING;

-- 2. Configurer la catégorie "Vente" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2)
VALUES ((SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1), true)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 3. Ajouter les sous-catégories principales pour "Vente"
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

-- 4. Configurer toutes les sous-catégories pour avoir le niveau 2
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2)
SELECT id, true FROM public.subcategories 
WHERE category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1)
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- 5. Ajouter les sous-sous-catégories pour "Mode et Accessoires"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Vêtements', 'Habits, robes, pantalons, t-shirts', (SELECT id FROM public.subcategories WHERE name = 'Mode et Accessoires' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Chaussures', 'Sneakers, talons, boots, sandales', (SELECT id FROM public.subcategories WHERE name = 'Mode et Accessoires' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Sacs', 'Handbags, backpacks, totes, clutches', (SELECT id FROM public.subcategories WHERE name = 'Mode et Accessoires' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Bijoux', 'Colliers, bracelets, bagues, boucles d''oreilles', (SELECT id FROM public.subcategories WHERE name = 'Mode et Accessoires' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Montres', 'Montres de luxe, smartwatches, bracelets', (SELECT id FROM public.subcategories WHERE name = 'Mode et Accessoires' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 6. Ajouter les sous-sous-catégories pour "Électronique et Tech"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Smartphones', 'Téléphones, tablettes, accessoires mobiles', (SELECT id FROM public.subcategories WHERE name = 'Électronique et Tech' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Ordinateurs', 'Laptops, PC, Mac, accessoires informatiques', (SELECT id FROM public.subcategories WHERE name = 'Électronique et Tech' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Gadgets', 'Objets connectés, drones, caméras', (SELECT id FROM public.subcategories WHERE name = 'Électronique et Tech' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Audio', 'Écouteurs, enceintes, microphones', (SELECT id FROM public.subcategories WHERE name = 'Électronique et Tech' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Gaming', 'Consoles, jeux vidéo, accessoires gaming', (SELECT id FROM public.subcategories WHERE name = 'Électronique et Tech' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 7. Ajouter les sous-sous-catégories pour "Maison et Décoration"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Mobilier', 'Meubles, canapés, tables, chaises', (SELECT id FROM public.subcategories WHERE name = 'Maison et Décoration' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Décoration', 'Tableaux, vases, coussins, tapis', (SELECT id FROM public.subcategories WHERE name = 'Maison et Décoration' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Cuisine', 'Ustensiles, électroménager, vaisselle', (SELECT id FROM public.subcategories WHERE name = 'Maison et Décoration' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Jardinage', 'Plantes, pots, outils de jardin', (SELECT id FROM public.subcategories WHERE name = 'Maison et Décoration' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Luminaire', 'Lampes, lustres, éclairage', (SELECT id FROM public.subcategories WHERE name = 'Maison et Décoration' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 8. Ajouter les sous-sous-catégories pour "Beauté et Bien-être"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Maquillage', 'Fonds de teint, rouges à lèvres, palettes', (SELECT id FROM public.subcategories WHERE name = 'Beauté et Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Soins visage', 'Crèmes, sérums, masques', (SELECT id FROM public.subcategories WHERE name = 'Beauté et Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Parfums', 'Fragrances, eaux de toilette', (SELECT id FROM public.subcategories WHERE name = 'Beauté et Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Bien-être', 'Produits naturels, huiles essentielles', (SELECT id FROM public.subcategories WHERE name = 'Beauté et Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Accessoires beauté', 'Pinceaux, éponges, miroirs', (SELECT id FROM public.subcategories WHERE name = 'Beauté et Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 9. Ajouter les sous-sous-catégories pour "Sport et Loisirs"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Équipements sportifs', 'Matériel de fitness, yoga, running', (SELECT id FROM public.subcategories WHERE name = 'Sport et Loisirs' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Vêtements sportifs', 'Tenues de sport, chaussures fitness', (SELECT id FROM public.subcategories WHERE name = 'Sport et Loisirs' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Jeux', 'Jeux de société, puzzles, cartes', (SELECT id FROM public.subcategories WHERE name = 'Sport et Loisirs' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Jouets', 'Peluches, figurines, jeux éducatifs', (SELECT id FROM public.subcategories WHERE name = 'Sport et Loisirs' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Activités extérieures', 'Camping, pêche, randonnée', (SELECT id FROM public.subcategories WHERE name = 'Sport et Loisirs' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 10. Ajouter les sous-sous-catégories pour "Automobile et Transport"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Voitures', 'Véhicules neufs et d''occasion', (SELECT id FROM public.subcategories WHERE name = 'Automobile et Transport' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Motos', 'Motos, scooters, accessoires', (SELECT id FROM public.subcategories WHERE name = 'Automobile et Transport' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Vélos', 'Vélos, trottinettes, accessoires', (SELECT id FROM public.subcategories WHERE name = 'Automobile et Transport' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Accessoires auto', 'GPS, sièges, équipements', (SELECT id FROM public.subcategories WHERE name = 'Automobile et Transport' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Pièces détachées', 'Pneus, batteries, filtres', (SELECT id FROM public.subcategories WHERE name = 'Automobile et Transport' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 11. Ajouter les sous-sous-catégories pour "Immobilier et Location"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Appartements', 'Studios, T1, T2, T3+', (SELECT id FROM public.subcategories WHERE name = 'Immobilier et Location' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Maisons', 'Maisons individuelles, villas', (SELECT id FROM public.subcategories WHERE name = 'Immobilier et Location' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Terrains', 'Terrains constructibles, agricoles', (SELECT id FROM public.subcategories WHERE name = 'Immobilier et Location' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Locations', 'Appartements, maisons à louer', (SELECT id FROM public.subcategories WHERE name = 'Immobilier et Location' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Bureaux', 'Locaux commerciaux, bureaux', (SELECT id FROM public.subcategories WHERE name = 'Immobilier et Location' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 12. Ajouter les sous-sous-catégories pour "Art et Collection"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Artisanat', 'Créations faites main, objets uniques', (SELECT id FROM public.subcategories WHERE name = 'Art et Collection' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Antiquités', 'Objets anciens, meubles vintage', (SELECT id FROM public.subcategories WHERE name = 'Art et Collection' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Art', 'Tableaux, sculptures, photographies', (SELECT id FROM public.subcategories WHERE name = 'Art et Collection' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Collections', 'Timbres, pièces, cartes', (SELECT id FROM public.subcategories WHERE name = 'Art et Collection' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Vintage', 'Objets rétro, années 80-90', (SELECT id FROM public.subcategories WHERE name = 'Art et Collection' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 13. Ajouter les sous-sous-catégories pour "Alimentation et Gastronomie"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Produits locaux', 'Fruits, légumes, fromages locaux', (SELECT id FROM public.subcategories WHERE name = 'Alimentation et Gastronomie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Spécialités', 'Charcuteries, pâtisseries, confitures', (SELECT id FROM public.subcategories WHERE name = 'Alimentation et Gastronomie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Ustensiles cuisine', 'Casseroles, couteaux, robots', (SELECT id FROM public.subcategories WHERE name = 'Alimentation et Gastronomie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Épices', 'Herbes, épices, condiments', (SELECT id FROM public.subcategories WHERE name = 'Alimentation et Gastronomie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Boissons', 'Vins, bières, jus artisanaux', (SELECT id FROM public.subcategories WHERE name = 'Alimentation et Gastronomie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now());

-- 14. Ajouter les sous-sous-catégories pour "Services et Formation"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Cours', 'Cours particuliers, formations', (SELECT id FROM public.subcategories WHERE name = 'Services et Formation' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Conseils', 'Consultations, accompagnement', (SELECT id FROM public.subcategories WHERE name = 'Services et Formation' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Services personnalisés', 'Services sur mesure, customisation', (SELECT id FROM public.subcategories WHERE name = 'Services et Formation' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Formations', 'Stages, ateliers, séminaires', (SELECT id FROM public.subcategories WHERE name = 'Services et Formation' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()),
('Coaching', 'Accompagnement personnel, professionnel', (SELECT id FROM public.subcategories WHERE name = 'Services et Formation' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vente' LIMIT 1) LIMIT 1), now(), now()); 