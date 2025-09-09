-- Ajout des sous-sous-catégories pour la catégorie "Art"
-- Ce script ajoute les sous-sous-catégories pour les sous-catégories qui ont besoin du niveau 2

-- 1. Sous-sous-catégories pour "Art numérique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Digital painting', 'Peinture numérique sur tablette ou ordinateur', (SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('NFT Art', 'Art numérique tokenisé et blockchain', (SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Art généré par IA', 'Créations artistiques assistées par intelligence artificielle', (SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Art 3D numérique', 'Modélisation et sculpture 3D artistique', (SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Pixel art', 'Art créé pixel par pixel', (SELECT id FROM public.subcategories WHERE name = 'Art numérique (digital painting, NFT, art généré par IA)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 2. Sous-sous-catégories pour "Photographie artistique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Portrait artistique', 'Photographie de portraits créatifs et expressifs', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Paysage artistique', 'Photographie de paysages avec vision artistique', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Photographie abstraite', 'Images abstraites et expérimentales', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Macro artistique', 'Photographie rapprochée d''objets du quotidien', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Photographie conceptuelle', 'Images avec message ou concept profond', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Street photography', 'Photographie de rue et vie urbaine', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Photographie en noir et blanc', 'Images monochromes artistiques', (SELECT id FROM public.subcategories WHERE name = 'Photographie artistique' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 3. Sous-sous-catégories pour "Design graphique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Logos et identité visuelle', 'Création de logos et chartes graphiques', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Affiches et posters', 'Design d''affiches événementielles et promotionnelles', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Packaging design', 'Design d''emballages et packaging créatif', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Web design', 'Design d''interfaces web et applications', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Typographie créative', 'Design de polices et compositions typographiques', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustration vectorielle', 'Illustrations créées avec des vecteurs', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Branding et identité', 'Création d''identités de marque complètes', (SELECT id FROM public.subcategories WHERE name = 'Design graphique (affiches, visuels branding)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 4. Sous-sous-catégories pour "Sculpture"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Sculpture en argile', 'Créations en terre cuite et céramique', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture sur pierre', 'Taille de pierre et marbre', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture sur bois', 'Taille et sculpture sur bois', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture métallique', 'Sculptures en fer, bronze, acier', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture contemporaine', 'Sculptures modernes et expérimentales', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installation sculpturale', 'Sculptures en espace et installations', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture figurative', 'Représentations réalistes et figuratives', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Sculpture abstraite', 'Formes abstraites et géométriques', (SELECT id FROM public.subcategories WHERE name = 'Sculpture (argile, pierre, bois, métal)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 5. Sous-sous-catégories pour "Street art"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Graffiti artistique', 'Graffiti et tags créatifs', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Fresques murales', 'Peintures murales monumentales', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Stickers et collages urbains', 'Art de rue avec stickers et collages', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Pochoirs urbains', 'Street art au pochoir', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations urbaines', 'Installations artistiques en espace public', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Art urbain légal', 'Street art autorisé et commandé', (SELECT id FROM public.subcategories WHERE name = 'Street art (graffiti, fresques murales)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 6. Sous-sous-catégories pour "Installation artistique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Installations lumineuses', 'Installations avec éclairage artistique', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations sonores', 'Installations avec éléments sonores', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations interactives', 'Installations où le public participe', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations éphémères', 'Installations temporaires et éphémères', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations immersives', 'Environnements immersifs et expérientiels', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations conceptuelles', 'Installations avec message ou concept', (SELECT id FROM public.subcategories WHERE name = 'Installation artistique (art contemporain en espace)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 7. Sous-sous-catégories pour "Art textile"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Tissage artistique', 'Tissage créatif et expérimental', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Couture artistique', 'Couture créative et expérimentale', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Broderie artistique', 'Broderie créative et contemporaine', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Teinture artistique', 'Teinture créative et expérimentale', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Fabrication de papier', 'Création de papier artisanal', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Installations textiles', 'Installations artistiques en textile', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Art du feutre', 'Créations en feutre artistique', (SELECT id FROM public.subcategories WHERE name = 'Art textile (tissage, couture artistique, broderie)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 8. Sous-sous-catégories pour "Art vidéo"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Clip vidéo créatif', 'Vidéos musicales artistiques', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Vidéo d''art expérimentale', 'Vidéos artistiques expérimentales', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Vidéo performance', 'Vidéos de performances artistiques', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Vidéo installation', 'Vidéos dans des installations', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Vidéo conceptuelle', 'Vidéos avec concept ou message', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Vidéo documentaire artistique', 'Documentaires sur l''art', (SELECT id FROM public.subcategories WHERE name = 'Art vidéo (clip vidéo créatif, vidéo d''art)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 9. Sous-sous-catégories pour "Performance artistique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Performance corporelle', 'Performances avec le corps', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Performance théâtrale', 'Performances théâtrales expérimentales', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Performance musicale', 'Performances avec musique', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Performance interactive', 'Performances avec participation du public', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Performance conceptuelle', 'Performances avec concept ou message', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Performance éphémère', 'Performances temporaires et uniques', (SELECT id FROM public.subcategories WHERE name = 'Performance artistique (art vivant)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 10. Sous-sous-catégories pour "Illustration éditoriale"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
('Illustrations pour livres', 'Illustrations de livres et romans', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustrations pour magazines', 'Illustrations de presse et magazines', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustrations pour journaux', 'Illustrations de presse quotidienne', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustrations pour bandes dessinées', 'Illustrations de BD et comics', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustrations pour publicité', 'Illustrations publicitaires', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now()),
('Illustrations pour packaging', 'Illustrations d''emballages', (SELECT id FROM public.subcategories WHERE name = 'Illustration éditoriale (illustrations pour livres, magazines)' AND category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING; 