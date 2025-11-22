-- Script pour ajouter les sous-catégories de la catégorie "Activisme"
-- Date: 2025-01-28

-- 1. VÉRIFICATION : Trouver l'ID de la catégorie "Activisme"
SELECT 
  'RECHERCHE CATÉGORIE ACTIVISME' as section,
  id,
  name,
  description,
  color,
  created_at
FROM public.categories 
WHERE LOWER(name) LIKE '%activisme%' 
   OR LOWER(name) LIKE '%activisme%'
   OR LOWER(name) LIKE '%activiste%'
ORDER BY created_at DESC;

-- 2. AJOUT DES SOUS-CATÉGORIES POUR ACTIVISME
-- Note: Remplacez 'CATEGORY_ID_ACTIVISME' par l'ID réel trouvé ci-dessus

-- Sous-catégories par région/communauté
INSERT INTO public.subcategories (name, description, category_id) VALUES
('Panafricanisme', 'Unité africaine, identité panafricaine, solidarité entre pays africains', 'CATEGORY_ID_ACTIVISME'),
('Droits des femmes', 'Féminisme, égalité des genres, droits des femmes dans la société', 'CATEGORY_ID_ACTIVISME'),
('Droits des enfants', 'Protection des enfants, éducation, droits fondamentaux des mineurs', 'CATEGORY_ID_ACTIVISME'),
('Droits des minorités', 'LGBTQ+, minorités ethniques, religieuses, protection des groupes vulnérables', 'CATEGORY_ID_ACTIVISME'),
('Migrations', 'Réfugiés, immigration, droits des migrants, accueil et intégration', 'CATEGORY_ID_ACTIVISME'),

-- Sous-catégories environnementales
('Climat', 'Réchauffement climatique, COP, actions pour le climat, transition écologique', 'CATEGORY_ID_ACTIVISME'),
('Biodiversité', 'Protection des espèces, écosystèmes, conservation de la nature', 'CATEGORY_ID_ACTIVISME'),
('Pollution', 'Pollution de l''air, de l''eau, des sols, lutte contre le plastique', 'CATEGORY_ID_ACTIVISME'),

-- Sous-catégories politiques
('Politique nationale', 'Gouvernement, élections, démocratie, institutions politiques', 'CATEGORY_ID_ACTIVISME'),
('Dénonciation', 'Corruption, injustices, abus de pouvoir, transparence', 'CATEGORY_ID_ACTIVISME'),
('Démocratie', 'Liberté d''expression, transparence, participation citoyenne', 'CATEGORY_ID_ACTIVISME'),

-- Sous-catégories économiques
('Justice économique', 'Pauvreté, inégalités sociales, redistribution des richesses', 'CATEGORY_ID_ACTIVISME'),
('Droits du travail', 'Syndicats, conditions de travail, protection des travailleurs', 'CATEGORY_ID_ACTIVISME')

ON CONFLICT (name, category_id) DO NOTHING;

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

-- 4. COMPTAGE : Nombre de sous-catégories par catégorie
SELECT 
  'STATISTIQUES' as section,
  c.name as category_name,
  COUNT(s.id) as nombre_sous_categories
FROM public.categories c
LEFT JOIN public.subcategories s ON c.id = s.category_id
WHERE c.name ILIKE '%activisme%'
GROUP BY c.id, c.name;

-- 5. VÉRIFICATION FINALE
SELECT 
  'VÉRIFICATION TERMINÉE' as status,
  'Sous-catégories de l''activisme ajoutées avec succès' as message;
