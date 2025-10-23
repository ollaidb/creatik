-- Script pour ajouter les sous-catégories de niveau 2 pour l'activisme
-- Date: 2025-01-28

-- 1. Vérifier les sous-catégories de niveau 1 pour Activisme
SELECT 
  s.id,
  s.name as subcategory_name,
  c.name as category_name
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name;

-- 2. Ajouter les sous-catégories de niveau 2 pour "Droits des femmes"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Féminisme intersectionnel', 'Féminisme qui prend en compte toutes les formes d''oppression', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Égalité salariale', 'Lutte pour l''égalité des salaires entre hommes et femmes', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Violence domestique', 'Lutte contre les violences faites aux femmes', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Droits reproductifs', 'Accès à la contraception et à l''avortement', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Leadership féminin', 'Promouvoir les femmes dans les postes de direction', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Droits des femmes'
ON CONFLICT DO NOTHING;

-- 3. Ajouter les sous-catégories de niveau 2 pour "Climat"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Réchauffement climatique', 'Actions contre le réchauffement de la planète', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Énergies renouvelables', 'Promotion des énergies vertes', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'COP et négociations', 'Suivi des conférences climatiques internationales', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Transition écologique', 'Accompagner la transition vers une économie verte', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Climat'
ON CONFLICT DO NOTHING;

-- 4. Ajouter les sous-catégories de niveau 2 pour "Politique nationale"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Élections', 'Surveillance et participation aux élections', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Gouvernance', 'Amélioration de la gouvernance publique', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Corruption', 'Lutte contre la corruption politique', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Transparence', 'Promotion de la transparence dans les institutions', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Politique nationale'
ON CONFLICT DO NOTHING;

-- 5. Ajouter les sous-catégories de niveau 2 pour "Justice économique"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Pauvreté', 'Lutte contre la pauvreté et l''exclusion', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Inégalités', 'Réduction des inégalités sociales et économiques', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Redistribution', 'Politiques de redistribution des richesses', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Microfinance', 'Accès au crédit pour les plus pauvres', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%' AND s.name = 'Justice économique'
ON CONFLICT DO NOTHING;

-- 6. Vérifier les sous-catégories de niveau 2 ajoutées
SELECT 
  sl2.id,
  sl2.name as level2_name,
  sl2.description,
  s.name as level1_name,
  c.name as category_name
FROM subcategories_level2 sl2
JOIN subcategories s ON sl2.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name, sl2.name;

-- 7. Statistiques finales
SELECT 
  'STATISTIQUES' as section,
  s.name as subcategory_name,
  COUNT(sl2.id) as nombre_level2
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN subcategories_level2 sl2 ON s.id = sl2.subcategory_id
WHERE c.name ILIKE '%activisme%'
GROUP BY s.id, s.name
ORDER BY s.name;
