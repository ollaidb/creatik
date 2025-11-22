-- Script pour ajouter Podcasts comme réseau social (version simple)
-- Ajouter Podcasts dans la table social_networks

-- 1. Ajouter Podcasts dans social_networks (avec seulement les colonnes de base)
INSERT INTO social_networks (id, name, display_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'podcasts', 'Podcasts')
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name;

-- 2. Vérifier que Podcasts a été ajouté
SELECT 
    id,
    name,
    display_name
FROM social_networks 
WHERE name = 'podcasts'; 