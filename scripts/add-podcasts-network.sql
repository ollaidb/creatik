-- Script pour ajouter Podcasts comme réseau social
-- Ajouter Podcasts dans la table social_networks

-- 1. Ajouter Podcasts dans social_networks
INSERT INTO social_networks (id, name, display_name, description, icon_url, color_theme) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'podcasts', 'Podcasts', 'Contenu audio et épisodes', '/icons/podcast.svg', '#8A2BE2')
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  icon_url = EXCLUDED.icon_url,
  color_theme = EXCLUDED.color_theme;

-- 2. Ajouter la configuration pour Podcasts
INSERT INTO network_configurations (network_id, priority_categories, hidden_categories, redirect_mappings, sort_priority) VALUES
  ('550e8400-e29b-41d4-a716-446655440011',
   ARRAY['education', 'entertainment', 'business', 'technology'],
   ARRAY[],
   '{}',
   '{"education": 1, "entertainment": 2, "business": 3, "technology": 4}')
ON CONFLICT (network_id) DO UPDATE SET
  priority_categories = EXCLUDED.priority_categories,
  hidden_categories = EXCLUDED.hidden_categories,
  redirect_mappings = EXCLUDED.redirect_mappings,
  sort_priority = EXCLUDED.sort_priority;

-- 3. Vérifier que Podcasts a été ajouté
SELECT 
    id,
    name,
    display_name,
    description,
    icon_url,
    color_theme
FROM social_networks 
WHERE name = 'podcasts'; 