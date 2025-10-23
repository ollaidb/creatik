-- Script pour recréer proprement la catégorie Activisme
-- Date: 2025-01-28

-- 1. Supprimer toutes les données liées aux sous-catégories d'Activisme
-- D'abord, supprimer les sous-catégories de niveau 2
DELETE FROM public.subcategories_level2 
WHERE subcategory_id IN (
  SELECT s.id 
  FROM public.subcategories s 
  JOIN public.categories c ON s.category_id = c.id 
  WHERE c.name ILIKE '%activisme%'
);

-- Supprimer les configurations de sous-catégories
DELETE FROM public.subcategory_hierarchy_config 
WHERE subcategory_id IN (
  SELECT s.id 
  FROM public.subcategories s 
  JOIN public.categories c ON s.category_id = c.id 
  WHERE c.name ILIKE '%activisme%'
);

-- Supprimer les word_blocks liés aux sous-catégories d'Activisme
DELETE FROM public.word_blocks 
WHERE subcategory_id IN (
  SELECT s.id 
  FROM public.subcategories s 
  JOIN public.categories c ON s.category_id = c.id 
  WHERE c.name ILIKE '%activisme%'
);

-- Supprimer les publications utilisateur liées aux sous-catégories d'Activisme
DELETE FROM public.user_publications 
WHERE subcategory_id IN (
  SELECT s.id 
  FROM public.subcategories s 
  JOIN public.categories c ON s.category_id = c.id 
  WHERE c.name ILIKE '%activisme%'
);

-- Supprimer les favoris liés aux sous-catégories d'Activisme (si la table existe)
-- DELETE FROM public.favorites 
-- WHERE item_id IN (
--   SELECT s.id 
--   FROM public.subcategories s 
--   JOIN public.categories c ON s.category_id = c.id 
--   WHERE c.name ILIKE '%activisme%'
-- ) AND item_type = 'subcategory';

-- Maintenant supprimer les sous-catégories
DELETE FROM public.subcategories 
WHERE category_id IN (
  SELECT id FROM public.categories WHERE name ILIKE '%activisme%'
);

-- 2. Configurer la catégorie Activisme pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
SELECT c.id, true
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 3. Créer les 3 nouvelles sous-catégories principales
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Politique', 'Engagement politique, démocratie, gouvernance, institutions', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Droits humains', 'Défense des droits fondamentaux, justice sociale, égalité', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Environnement', 'Protection de l''environnement, climat, biodiversité, écologie', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

-- 4. Configurer les 3 sous-catégories pour avoir le niveau 2
-- Politique
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- Droits humains
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- Environnement
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2) 
SELECT s.id, true
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT (subcategory_id) DO UPDATE SET has_level2 = true;

-- 5. Créer les sous-catégories de niveau 2 pour POLITIQUE
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Élections et démocratie', 'Surveillance des élections, participation citoyenne, transparence', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Corruption et transparence', 'Lutte contre la corruption, transparence des institutions', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Liberté d''expression', 'Défense de la liberté de la presse et d''expression', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Justice et réformes', 'Réformes judiciaires, indépendance de la justice', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Participation citoyenne', 'Mobilisation citoyenne, pétitions, manifestations', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique'
ON CONFLICT DO NOTHING;

-- 6. Créer les sous-catégories de niveau 2 pour DROITS HUMAINS
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Droits des femmes', 'Égalité des genres, féminisme, droits reproductifs', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Droits des enfants', 'Protection des mineurs, éducation, bien-être', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Droits des minorités', 'LGBTQ+, minorités ethniques, religieuses', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Migrations et réfugiés', 'Droits des migrants, accueil, intégration', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Justice économique', 'Pauvreté, inégalités, redistribution des richesses', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits humains'
ON CONFLICT DO NOTHING;

-- 7. Créer les sous-catégories de niveau 2 pour ENVIRONNEMENT
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Changement climatique', 'Réchauffement, COP, actions climatiques', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Biodiversité', 'Protection des espèces, écosystèmes, conservation', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Pollution', 'Pollution air/eau/sols, déchets, plastique', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Énergies renouvelables', 'Transition énergétique, énergies vertes', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Consommation durable', 'Économie circulaire, consommation responsable', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Environnement'
ON CONFLICT DO NOTHING;
