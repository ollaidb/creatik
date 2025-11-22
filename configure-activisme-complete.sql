-- Script complet pour configurer la catégorie "Activisme" comme "Vie personnelle"
-- Date: 2025-01-28

-- 1. Vérifier que la catégorie "Activisme" existe
SELECT 
  'VÉRIFICATION CATÉGORIE ACTIVISME' as section,
  c.id,
  c.name,
  c.description,
  c.color
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ORDER BY c.created_at DESC;

-- 2. Configurer "Activisme" pour avoir le niveau 2 dans category_hierarchy_config
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
SELECT c.id, true
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 3. Vérifier la configuration
SELECT 
  'CONFIGURATION HIÉRARCHIE ACTIVISME' as section,
  c.name as category_name,
  chc.has_level2,
  chc.created_at
FROM public.category_hierarchy_config chc
JOIN public.categories c ON chc.category_id = c.id
WHERE c.name ILIKE '%activisme%';

-- 4. Créer les sous-catégories de niveau 1 pour Activisme (si elles n'existent pas)
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Panafricanisme', 'Unité africaine, identité panafricaine, solidarité entre pays africains', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Droits des femmes', 'Féminisme, égalité des genres, droits des femmes dans la société', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Droits des enfants', 'Protection des enfants, éducation, droits fondamentaux des mineurs', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Droits des minorités', 'LGBTQ+, minorités ethniques, religieuses, protection des groupes vulnérables', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Migrations', 'Réfugiés, immigration, droits des migrants, accueil et intégration', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Climat', 'Réchauffement climatique, COP, actions pour le climat, transition écologique', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Biodiversité', 'Protection des espèces, écosystèmes, conservation de la nature', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Pollution', 'Pollution de l''air, de l''eau, des sols, lutte contre le plastique', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Politique nationale', 'Gouvernement, élections, démocratie, institutions politiques', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Dénonciation', 'Corruption, injustices, abus de pouvoir, transparence', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Démocratie', 'Liberté d''expression, transparence, participation citoyenne', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Justice économique', 'Pauvreté, inégalités sociales, redistribution des richesses', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Droits du travail', 'Syndicats, conditions de travail, protection des travailleurs', c.id, now(), now()
FROM public.categories c
WHERE c.name ILIKE '%activisme%'
ON CONFLICT DO NOTHING;

-- 5. Créer les sous-catégories de niveau 2 pour "Droits des femmes"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Féminisme intersectionnel', 'Féminisme qui prend en compte toutes les formes d''oppression', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Égalité salariale', 'Lutte pour l''égalité des salaires entre hommes et femmes', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Violence domestique', 'Lutte contre les violences faites aux femmes', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Droits reproductifs', 'Accès à la contraception et à l''avortement', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Leadership féminin', 'Promouvoir les femmes dans les postes de direction', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

-- 6. Créer les sous-catégories de niveau 2 pour "Climat"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Réchauffement climatique', 'Actions contre le réchauffement de la planète', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Énergies renouvelables', 'Promotion des énergies vertes', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'COP et négociations', 'Suivi des conférences climatiques internationales', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Transition écologique', 'Accompagner la transition vers une économie verte', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

-- 7. Créer les sous-catégories de niveau 2 pour "Politique nationale"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Élections', 'Surveillance et participation aux élections', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Gouvernance', 'Amélioration de la gouvernance publique', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Corruption', 'Lutte contre la corruption politique', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Transparence', 'Promotion de la transparence dans les institutions', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

-- 8. Créer les sous-catégories de niveau 2 pour "Justice économique"
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Pauvreté', 'Lutte contre la pauvreté et l''exclusion', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Inégalités', 'Réduction des inégalités sociales et économiques', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Redistribution', 'Politiques de redistribution des richesses', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Microfinance', 'Accès au crédit pour les plus pauvres', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

-- 9. Vérification finale de la structure complète
SELECT 
  'STRUCTURE FINALE ACTIVISME' as section,
  c.name as category_name,
  COUNT(DISTINCT s.id) as nombre_sous_categories_niveau1,
  COUNT(DISTINCT sl2.id) as nombre_sous_categories_niveau2,
  chc.has_level2 as configuration_level2
FROM public.categories c
LEFT JOIN public.subcategories s ON c.id = s.category_id
LEFT JOIN public.subcategories_level2 sl2 ON s.id = sl2.subcategory_id
LEFT JOIN public.category_hierarchy_config chc ON c.id = chc.category_id
WHERE c.name ILIKE '%activisme%'
GROUP BY c.id, c.name, chc.has_level2;

-- 10. Afficher toutes les sous-catégories de niveau 2 créées
SELECT 
  'SOUS-CATÉGORIES NIVEAU 2 CRÉÉES' as section,
  sl2.name as level2_name,
  sl2.description,
  s.name as level1_name,
  c.name as category_name
FROM public.subcategories_level2 sl2
JOIN public.subcategories s ON sl2.subcategory_id = s.id
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name, sl2.name;
