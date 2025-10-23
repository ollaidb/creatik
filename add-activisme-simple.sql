-- Script simple pour ajouter les sous-catégories de l'activisme
-- Date: 2025-01-28

-- 1. TROUVER L'ID DE LA CATÉGORIE ACTIVISME
SELECT 
  'RECHERCHE CATÉGORIE ACTIVISME' as section,
  id,
  name,
  description,
  color
FROM public.categories 
WHERE LOWER(name) LIKE '%activisme%' 
   OR LOWER(name) LIKE '%activiste%'
   OR LOWER(name) LIKE '%activisme%'
ORDER BY created_at DESC;

-- 2. AJOUTER LES SOUS-CATÉGORIES (remplacez CATEGORY_ID par l'ID trouvé ci-dessus)
-- Note: Exécutez d'abord la requête ci-dessus pour trouver l'ID, puis remplacez CATEGORY_ID

-- Sous-catégories par région/communauté
INSERT INTO public.subcategories (name, description, category_id) VALUES
('Panafricanisme', 'Unité africaine, identité panafricaine, solidarité entre pays africains', 'CATEGORY_ID'),
('Droits des femmes', 'Féminisme, égalité des genres, droits des femmes dans la société', 'CATEGORY_ID'),
('Droits des enfants', 'Protection des enfants, éducation, droits fondamentaux des mineurs', 'CATEGORY_ID'),
('Droits des minorités', 'LGBTQ+, minorités ethniques, religieuses, protection des groupes vulnérables', 'CATEGORY_ID'),
('Migrations', 'Réfugiés, immigration, droits des migrants, accueil et intégration', 'CATEGORY_ID');

-- Sous-catégories environnementales
INSERT INTO public.subcategories (name, description, category_id) VALUES
('Climat', 'Réchauffement climatique, COP, actions pour le climat, transition écologique', 'CATEGORY_ID'),
('Biodiversité', 'Protection des espèces, écosystèmes, conservation de la nature', 'CATEGORY_ID'),
('Pollution', 'Pollution de l''air, de l''eau, des sols, lutte contre le plastique', 'CATEGORY_ID');

-- Sous-catégories politiques
INSERT INTO public.subcategories (name, description, category_id) VALUES
('Politique nationale', 'Gouvernement, élections, démocratie, institutions politiques', 'CATEGORY_ID'),
('Dénonciation', 'Corruption, injustices, abus de pouvoir, transparence', 'CATEGORY_ID'),
('Démocratie', 'Liberté d''expression, transparence, participation citoyenne', 'CATEGORY_ID');

-- Sous-catégories économiques
INSERT INTO public.subcategories (name, description, category_id) VALUES
('Justice économique', 'Pauvreté, inégalités sociales, redistribution des richesses', 'CATEGORY_ID'),
('Droits du travail', 'Syndicats, conditions de travail, protection des travailleurs', 'CATEGORY_ID');

-- 3. VÉRIFICATION : Lister les sous-catégories ajoutées
SELECT 
  'SOUS-CATÉGORIES AJOUTÉES' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name;

-- 4. STATISTIQUES
SELECT 
  'STATISTIQUES' as section,
  c.name as category_name,
  COUNT(s.id) as nombre_sous_categories
FROM public.categories c
LEFT JOIN public.subcategories s ON c.id = s.category_id
WHERE c.name ILIKE '%activisme%'
GROUP BY c.id, c.name;
