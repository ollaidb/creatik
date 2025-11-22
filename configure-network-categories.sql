-- ========================================
-- CONFIGURATION DES CATÉGORIES PAR RÉSEAU
-- ========================================
-- Ce script configure les catégories disponibles pour chaque réseau social
-- Pour LinkedIn, Snapchat, Twitch et Pinterest : liste limitée de catégories
-- Pour les autres réseaux : toutes les catégories sont disponibles

-- 0. Créer les tables si elles n'existent pas
CREATE TABLE IF NOT EXISTS social_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  color_theme VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS network_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES social_networks(id) ON DELETE CASCADE,
  priority_categories TEXT[],
  hidden_categories TEXT[],
  redirect_mappings JSONB,
  sort_priority JSONB,
  allowed_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(network_id)
);

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_configurations ENABLE ROW LEVEL SECURITY;

-- Créer les policies si elles n'existent pas
DO $$
BEGIN
  -- Policy pour social_networks
  BEGIN
    CREATE POLICY "social_networks_select_policy" ON social_networks
      FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL; -- La policy existe déjà, on continue
  END;

  -- Policy pour network_configurations
  BEGIN
    CREATE POLICY "network_configurations_select_policy" ON network_configurations
      FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL; -- La policy existe déjà, on continue
  END;
END $$;

-- 1. Ajouter la colonne color_theme si elle n'existe pas
ALTER TABLE social_networks 
ADD COLUMN IF NOT EXISTS color_theme VARCHAR(7);

-- 2. Ajouter les réseaux Snapchat et Pinterest s'ils n'existent pas
INSERT INTO social_networks (name, display_name, icon_url, color_theme, is_active)
VALUES 
  ('snapchat', 'Snapchat', '/icons/snapchat.svg', '#FFFC00', true),
  ('pinterest', 'Pinterest', '/icons/pinterest.svg', '#E60023', true)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  icon_url = EXCLUDED.icon_url,
  color_theme = EXCLUDED.color_theme,
  is_active = EXCLUDED.is_active;

-- 3. Ajouter une colonne allowed_categories à network_configurations si elle n'existe pas
ALTER TABLE network_configurations 
ADD COLUMN IF NOT EXISTS allowed_categories TEXT[];

-- 4. CONFIGURATION LINKEDIN - Catégories professionnelles uniquement
DO $$
DECLARE
  linkedin_network_id UUID;
  linkedin_categories TEXT[] := ARRAY[
    'Carrière',
    'Marketing',
    'Développement personnel',
    'Éducation',
    'Information',
    'Analyse',
    'Conseil',
    'Technologie',
    'Interview',
    'Témoignage',
    'Storytelling',
    'Documentaire',
    'Science',
    'Politique',
    'Actualités',
    'Statistique',
    'Guide débutant',
    'Tuto',
    'FAQ vidéo',
    'Portrait',
    'Relation',
    'Santé - sport',
    'Prévention',
    'Voyage',
    'Vie personnelle',
    'Lifestyle',
    'Intelligence artificielle',
    'Débat',
    'Critique',
    'Recommandation'
  ];
  linkedin_category_ids TEXT[];
BEGIN
  -- Récupérer l'ID du réseau LinkedIn
  SELECT id INTO linkedin_network_id FROM social_networks WHERE name = 'linkedin';
  
  IF linkedin_network_id IS NULL THEN
    RAISE EXCEPTION 'Réseau LinkedIn non trouvé';
  END IF;
  
  -- Obtenir les IDs des catégories
  SELECT ARRAY_AGG(id::TEXT)
  INTO linkedin_category_ids
  FROM categories
  WHERE name = ANY(linkedin_categories);
  
  -- Mettre à jour ou insérer la configuration
  INSERT INTO network_configurations (
    network_id, 
    allowed_categories,
    priority_categories,
    hidden_categories,
    sort_priority
  )
  VALUES (
    linkedin_network_id,
    linkedin_category_ids,
    linkedin_category_ids[1:5],
    ARRAY[]::TEXT[],
    jsonb_build_object(
      'carrière', 1,
      'marketing', 2,
      'développement personnel', 3,
      'éducation', 4,
      'technologie', 5
    )
  )
  ON CONFLICT (network_id) 
  DO UPDATE SET
    allowed_categories = EXCLUDED.allowed_categories,
    priority_categories = EXCLUDED.priority_categories,
    sort_priority = EXCLUDED.sort_priority,
    updated_at = NOW();
    
  RAISE NOTICE '✅ LinkedIn configuré avec % catégories', array_length(linkedin_category_ids, 1);
END $$;

-- 5. CONFIGURATION TWITCH - Catégories gaming et divertissement
DO $$
DECLARE
  twitch_network_id UUID;
  twitch_categories TEXT[] := ARRAY[
    'Jeu vidéo',
    'Divertissement / fun',
    'Communauté',
    'Challenge',
    'Défi',
    'Reaction',
    'Humour',
    'Meme',
    'Prank',
    'Parodie',
    'Musique',
    'Danse',
    'Art',
    'Animation / dessin animé',
    'Cinéma',
    'Science-fiction',
    'Technologie',
    'Intelligence artificielle',
    'Tuto',
    'Guide débutant',
    'Unboxing',
    'Haul',
    'Vlog',
    'Bts / coulisse',
    'Fan account',
    'Tendance',
    'Live',
    'Sketch',
    'Playback'
  ];
  twitch_category_ids TEXT[];
BEGIN
  SELECT id INTO twitch_network_id FROM social_networks WHERE name = 'twitch';
  
  IF twitch_network_id IS NULL THEN
    RAISE EXCEPTION 'Réseau Twitch non trouvé';
  END IF;
  
  SELECT ARRAY_AGG(id::TEXT)
  INTO twitch_category_ids
  FROM categories
  WHERE name = ANY(twitch_categories);
  
  INSERT INTO network_configurations (
    network_id, 
    allowed_categories,
    priority_categories,
    hidden_categories,
    sort_priority
  )
  VALUES (
    twitch_network_id,
    twitch_category_ids,
    twitch_category_ids[1:5],
    ARRAY[]::TEXT[],
    jsonb_build_object(
      'jeu vidéo', 1,
      'divertissement / fun', 2,
      'live', 3,
      'communauté', 4,
      'humour', 5
    )
  )
  ON CONFLICT (network_id) 
  DO UPDATE SET
    allowed_categories = EXCLUDED.allowed_categories,
    priority_categories = EXCLUDED.priority_categories,
    sort_priority = EXCLUDED.sort_priority,
    updated_at = NOW();
    
  RAISE NOTICE '✅ Twitch configuré avec % catégories', array_length(twitch_category_ids, 1);
END $$;

-- 6. CONFIGURATION SNAPCHAT - Catégories visuelles et éphémères
DO $$
DECLARE
  snapchat_network_id UUID;
  snapchat_categories TEXT[] := ARRAY[
    'Beauty / style',
    'Mode / fashion',
    'Makeup',
    'Makeover',
    'Lifestyle',
    'Vie personnelle',
    'Vlog',
    'Bts / coulisse',
    'Routine',
    'Voyage',
    'Cuisine',
    'Familles',
    'Relation',
    'Divertissement / fun',
    'Humour',
    'Meme',
    'Prank',
    'Challenge',
    'Défi',
    'Danse',
    'Musique',
    'Lip sync',
    'Playback',
    'Reaction',
    'Storytelling',
    'Anecdote',
    'Témoignage',
    'Tendance',
    'Photo',
    'Art'
  ];
  snapchat_category_ids TEXT[];
BEGIN
  SELECT id INTO snapchat_network_id FROM social_networks WHERE name = 'snapchat';
  
  IF snapchat_network_id IS NULL THEN
    RAISE EXCEPTION 'Réseau Snapchat non trouvé';
  END IF;
  
  SELECT ARRAY_AGG(id::TEXT)
  INTO snapchat_category_ids
  FROM categories
  WHERE name = ANY(snapchat_categories);
  
  INSERT INTO network_configurations (
    network_id, 
    allowed_categories,
    priority_categories,
    hidden_categories,
    sort_priority
  )
  VALUES (
    snapchat_network_id,
    snapchat_category_ids,
    snapchat_category_ids[1:5],
    ARRAY[]::TEXT[],
    jsonb_build_object(
      'beauty / style', 1,
      'mode / fashion', 2,
      'lifestyle', 3,
      'vie personnelle', 4,
      'vlog', 5
    )
  )
  ON CONFLICT (network_id) 
  DO UPDATE SET
    allowed_categories = EXCLUDED.allowed_categories,
    priority_categories = EXCLUDED.priority_categories,
    sort_priority = EXCLUDED.sort_priority,
    updated_at = NOW();
    
  RAISE NOTICE '✅ Snapchat configuré avec % catégories', array_length(snapchat_category_ids, 1);
END $$;

-- 7. CONFIGURATION PINTEREST - Catégories visuelles et créatives
DO $$
DECLARE
  pinterest_network_id UUID;
  pinterest_categories TEXT[] := ARRAY[
    'Beauty / style',
    'Mode / fashion',
    'Bricolage / DIY',
    'Cuisine',
    'Art',
    'Photo',
    'Voyage',
    'Lifestyle',
    'Rangement',
    'Makeup',
    'Makeover',
    'Avant / Après',
    'Bts / coulisse',
    'Tuto',
    'Guide débutant',
    'Astuce',
    'Conseil',
    'Recommandation',
    'Haul',
    'Unboxing',
    'Familles',
    'Vie personnelle',
    'Routine',
    'Santé - sport',
    'Nature',
    'Recyclage',
    'Vie quotidienne général'
  ];
  pinterest_category_ids TEXT[];
BEGIN
  SELECT id INTO pinterest_network_id FROM social_networks WHERE name = 'pinterest';
  
  IF pinterest_network_id IS NULL THEN
    RAISE EXCEPTION 'Réseau Pinterest non trouvé';
  END IF;
  
  SELECT ARRAY_AGG(id::TEXT)
  INTO pinterest_category_ids
  FROM categories
  WHERE name = ANY(pinterest_categories);
  
  INSERT INTO network_configurations (
    network_id, 
    allowed_categories,
    priority_categories,
    hidden_categories,
    sort_priority
  )
  VALUES (
    pinterest_network_id,
    pinterest_category_ids,
    pinterest_category_ids[1:5],
    ARRAY[]::TEXT[],
    jsonb_build_object(
      'beauty / style', 1,
      'mode / fashion', 2,
      'bricolage / diy', 3,
      'cuisine', 4,
      'art', 5
    )
  )
  ON CONFLICT (network_id) 
  DO UPDATE SET
    allowed_categories = EXCLUDED.allowed_categories,
    priority_categories = EXCLUDED.priority_categories,
    sort_priority = EXCLUDED.sort_priority,
    updated_at = NOW();
    
  RAISE NOTICE '✅ Pinterest configuré avec % catégories', array_length(pinterest_category_ids, 1);
END $$;

-- 8. Pour les autres réseaux (TikTok, YouTube, Twitter, Podcast, Article, Instagram, Facebook, Blog)
-- S'assurer qu'ils n'ont pas de restriction (allowed_categories = NULL)
DO $$
DECLARE
  network_record RECORD;
BEGIN
  FOR network_record IN 
    SELECT id, name FROM social_networks 
    WHERE name IN ('tiktok', 'youtube', 'instagram', 'facebook', 'twitter', 'blog', 'article', 'podcasts')
  LOOP
    -- S'assurer qu'il n'y a pas de restriction (allowed_categories = NULL)
    INSERT INTO network_configurations (network_id, allowed_categories)
    VALUES (network_record.id, NULL)
    ON CONFLICT (network_id) 
    DO UPDATE SET allowed_categories = NULL, updated_at = NOW();
    
    RAISE NOTICE '✅ % configuré pour toutes les catégories', network_record.name;
  END LOOP;
END $$;

-- 9. Vérification finale
SELECT 
  sn.name as network_name,
  sn.display_name,
  CASE 
    WHEN nc.allowed_categories IS NULL THEN 'Toutes les catégories'
    ELSE array_length(nc.allowed_categories, 1)::TEXT || ' catégories'
  END as categories_count
FROM social_networks sn
LEFT JOIN network_configurations nc ON sn.id = nc.network_id
WHERE sn.is_active = true
ORDER BY 
  CASE 
    WHEN nc.allowed_categories IS NULL THEN 0
    ELSE 1
  END,
  sn.name;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Configuration terminée !';
  RAISE NOTICE '📊 LinkedIn, Snapchat, Twitch et Pinterest ont des catégories limitées';
  RAISE NOTICE '🌐 Les autres réseaux ont accès à toutes les catégories';
END $$;

