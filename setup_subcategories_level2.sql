-- Script SQL pour créer le système de sous-catégories niveau 2
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Créer la table subcategories_level2
CREATE TABLE IF NOT EXISTS public.subcategories_level2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table de configuration pour indiquer quelles catégories ont besoin du niveau 2
CREATE TABLE IF NOT EXISTS public.category_hierarchy_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  has_level2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id)
);

-- 3. Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_subcategories_level2_subcategory_id ON public.subcategories_level2(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_category_hierarchy_config_category_id ON public.category_hierarchy_config(category_id);

-- 4. Configurer "Vie personnelle" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
VALUES ((SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), true)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 5. Ajouter quelques exemples de sous-catégories niveau 2 pour "Vie personnelle"
-- D'abord, créons quelques sous-catégories niveau 1 pour "Vie personnelle"
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) VALUES
('Apparence', 'Tout ce qui concerne l''apparence physique', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Relations', 'Toutes les relations sociales et personnelles', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Bien-être', 'Santé physique et mentale', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Développement personnel', 'Croissance et amélioration personnelle', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now()),
('Expériences de vie', 'Récits et moments personnels', (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 6. Maintenant, ajoutons les sous-catégories niveau 2
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) VALUES
-- Sous-catégories niveau 2 pour "Apparence"
('Soins du visage', 'Routines et produits pour le visage', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Soins du corps', 'Routines et produits pour le corps', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Cheveux', 'Soins et coiffures', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Maquillage', 'Tutoriels et conseils de maquillage', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Style vestimentaire', 'Mode et conseils vestimentaires', (SELECT id FROM public.subcategories WHERE name = 'Apparence' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),

-- Sous-catégories niveau 2 pour "Relations"
('Relations amoureuses', 'Conseils et expériences en couple', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Amitiés', 'Entretenir et développer ses amitiés', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Relations familiales', 'Dynamiques familiales', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Relations professionnelles', 'Gérer les relations au travail', (SELECT id FROM public.subcategories WHERE name = 'Relations' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),

-- Sous-catégories niveau 2 pour "Bien-être"
('Santé mentale', 'Prendre soin de sa santé psychologique', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Santé physique', 'Maintenir une bonne santé physique', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Nutrition', 'Alimentation équilibrée', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Gestion du stress', 'Techniques pour gérer le stress', (SELECT id FROM public.subcategories WHERE name = 'Bien-être' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),

-- Sous-catégories niveau 2 pour "Développement personnel"
('Objectifs personnels', 'Définir et atteindre ses objectifs', (SELECT id FROM public.subcategories WHERE name = 'Développement personnel' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Confiance en soi', 'Développer sa confiance', (SELECT id FROM public.subcategories WHERE name = 'Développement personnel' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Gestion du temps', 'Organiser son temps efficacement', (SELECT id FROM public.subcategories WHERE name = 'Développement personnel' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),

-- Sous-catégories niveau 2 pour "Expériences de vie"
('Voyages personnels', 'Récits et conseils de voyages', (SELECT id FROM public.subcategories WHERE name = 'Expériences de vie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Moments marquants', 'Événements importants de la vie', (SELECT id FROM public.subcategories WHERE name = 'Expériences de vie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now()),
('Histoires personnelles', 'Récits et anecdotes de la vie quotidienne', (SELECT id FROM public.subcategories WHERE name = 'Expériences de vie' AND category_id = (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1) LIMIT 1), now(), now())
ON CONFLICT DO NOTHING;

-- 7. Vérifier que tout a été créé correctement
SELECT 'Configuration de Vie personnelle:' as info;
SELECT 
    c.name as category_name,
    chc.has_level2
FROM category_hierarchy_config chc
JOIN categories c ON chc.category_id = c.id
WHERE c.name = 'Vie personnelle';

SELECT 'Sous-catégories niveau 2 pour Vie personnelle:' as info;
SELECT 
    sl2.name as subcategory_level2_name,
    s.name as parent_subcategory_name
FROM subcategories_level2 sl2
JOIN subcategories s ON sl2.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle'
ORDER BY s.name, sl2.name; 