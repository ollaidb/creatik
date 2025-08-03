-- Script pour corriger les problèmes de réseaux sociaux et contraintes
-- Ce script va résoudre tous les problèmes identifiés

-- 1. Supprimer la contrainte restrictive sur content_titles
ALTER TABLE content_titles DROP CONSTRAINT IF EXISTS content_titles_platform_check;

-- 2. Ajouter la colonne is_active à social_networks si elle n'existe pas
ALTER TABLE social_networks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Mettre à jour tous les réseaux existants comme actifs
UPDATE social_networks SET is_active = true WHERE is_active IS NULL;

-- 4. Vérifier et corriger les données dans social_networks
-- S'assurer que tous les réseaux nécessaires existent
INSERT INTO social_networks (id, name, display_name, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'all', 'Tout', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'tiktok', 'TikTok', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'youtube', 'YouTube', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'instagram', 'Instagram', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'facebook', 'Facebook', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'twitter', 'Twitter', true),
  ('550e8400-e29b-41d4-a716-446655440007', 'twitch', 'Twitch', true),
  ('550e8400-e29b-41d4-a716-446655440008', 'linkedin', 'LinkedIn', true),
  ('550e8400-e29b-41d4-a716-446655440009', 'blog', 'Blog', true),
  ('550e8400-e29b-41d4-a716-446655440010', 'article', 'Article', true)
ON CONFLICT (name) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  is_active = EXCLUDED.is_active;

-- 5. Vérifier les résultats
SELECT 
  name,
  display_name,
  is_active
FROM social_networks 
ORDER BY 
  CASE name
    WHEN 'all' THEN 0
    WHEN 'tiktok' THEN 1
    WHEN 'youtube' THEN 2
    WHEN 'instagram' THEN 3
    WHEN 'facebook' THEN 4
    WHEN 'twitter' THEN 5
    WHEN 'linkedin' THEN 6
    WHEN 'twitch' THEN 7
    WHEN 'blog' THEN 8
    WHEN 'article' THEN 9
    ELSE 999
  END;

-- 6. Vérifier qu'il n'y a plus de contrainte restrictive
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'content_titles'::regclass 
AND contype = 'c' 
AND conname LIKE '%platform%'; 