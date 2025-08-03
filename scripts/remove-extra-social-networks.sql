-- Script pour supprimer les réseaux sociaux supplémentaires
-- Garder seulement : all, tiktok, youtube, instagram, facebook, twitter, linkedin, twitch, blog, article

-- Supprimer les réseaux sociaux non désirés
DELETE FROM social_networks 
WHERE name IN ('pinterest', 'snapchat', 'discord', 'telegram');

-- Vérifier les réseaux sociaux restants
SELECT 
  name,
  display_name
FROM social_networks 
ORDER BY display_name;

-- Supprimer les mots de word_blocks pour les réseaux supprimés
DELETE FROM word_blocks 
WHERE platform IN ('pinterest', 'snapchat', 'discord', 'telegram');

-- Vérifier les plateformes restantes dans word_blocks
SELECT 
  platform,
  COUNT(*) as total_words
FROM word_blocks 
GROUP BY platform
ORDER BY platform;

-- Supprimer les titres de content_titles pour les réseaux supprimés
DELETE FROM content_titles 
WHERE platform IN ('pinterest', 'snapchat', 'discord', 'telegram');

-- Supprimer les titres générés pour les réseaux supprimés
DELETE FROM generated_titles 
WHERE platform IN ('pinterest', 'snapchat', 'discord', 'telegram');

-- Vérifier les plateformes restantes dans content_titles
SELECT 
  platform,
  COUNT(*) as total_titles
FROM content_titles 
GROUP BY platform
ORDER BY platform;

-- Vérifier les plateformes restantes dans generated_titles
SELECT 
  platform,
  COUNT(*) as total_generated_titles
FROM generated_titles 
GROUP BY platform
ORDER BY platform; 