-- Script pour insérer des données dans subcategories_level2
-- À exécuter dans le SQL Editor de votre dashboard Supabase

-- 1. D'abord, vérifions quelles sous-catégories niveau 1 existent pour "Vie personnelle"
SELECT 
  s.id,
  s.name,
  c.name as category_name
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle'
ORDER BY s.name;

-- 2. Insérer des sous-catégories niveau 2 pour "Apparence"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Soins du visage', 'Routines et produits pour le visage', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Soins du corps', 'Routines et produits pour le corps', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Cheveux', 'Soins et coiffures', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Maquillage', 'Tutoriels et conseils de maquillage', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Style vestimentaire', 'Mode et conseils vestimentaires', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
ON CONFLICT DO NOTHING;

-- 3. Insérer des sous-catégories niveau 2 pour "Relations"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Relations amoureuses', 'Conseils et expériences en couple', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Relations'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Amitiés', 'Entretenir et développer ses amitiés', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Relations'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Relations familiales', 'Dynamiques familiales', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Relations'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Relations professionnelles', 'Gérer les relations au travail', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Relations'
ON CONFLICT DO NOTHING;

-- 4. Insérer des sous-catégories niveau 2 pour "Bien-être"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Santé mentale', 'Prendre soin de sa santé psychologique', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Bien-être'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Santé physique', 'Maintenir une bonne santé physique', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Bien-être'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Nutrition', 'Alimentation équilibrée', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Bien-être'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Gestion du stress', 'Techniques pour gérer le stress', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Bien-être'
ON CONFLICT DO NOTHING;

-- 5. Insérer des sous-catégories niveau 2 pour "Développement personnel"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Objectifs personnels', 'Définir et atteindre ses objectifs', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Développement personnel'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Confiance en soi', 'Développer sa confiance', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Développement personnel'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Gestion du temps', 'Organiser son temps efficacement', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Développement personnel'
ON CONFLICT DO NOTHING;

-- 6. Insérer des sous-catégories niveau 2 pour "Expériences de vie"
INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Voyages personnels', 'Récits et conseils de voyages', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Expériences de vie'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Moments marquants', 'Événements importants de la vie', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Expériences de vie'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Histoires personnelles', 'Récits et anecdotes de la vie quotidienne', s.id, now(), now()
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Expériences de vie'
ON CONFLICT DO NOTHING;

-- 7. Vérifier le résultat
SELECT 'Données insérées avec succès!' as status;
SELECT COUNT(*) as total_subcategories_level2 FROM subcategories_level2;

-- 8. Afficher quelques exemples
SELECT 
  sl2.name,
  sl2.description,
  s.name as parent_subcategory,
  c.name as category
FROM subcategories_level2 sl2
JOIN subcategories s ON sl2.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
ORDER BY c.name, s.name, sl2.name
LIMIT 10;
