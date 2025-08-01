-- Script complet pour corriger le système de publication
-- Exécutez ce script dans votre base de données Supabase

-- 1. Créer la table social_networks si elle n'existe pas
CREATE TABLE IF NOT EXISTS social_networks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  icon_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insérer les réseaux sociaux par défaut
INSERT INTO social_networks (name, display_name) VALUES
  ('tiktok', 'TikTok'), 
  ('instagram', 'Instagram'), 
  ('youtube', 'YouTube'), 
  ('twitter', 'Twitter/X'),
  ('facebook', 'Facebook'), 
  ('linkedin', 'LinkedIn'), 
  ('pinterest', 'Pinterest'), 
  ('snapchat', 'Snapchat'),
  ('twitch', 'Twitch'), 
  ('discord', 'Discord'), 
  ('telegram', 'Telegram')
ON CONFLICT (name) DO NOTHING;

-- 3. Ajouter la colonne social_network_id à pending_publications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'social_network_id'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN social_network_id UUID;
    END IF;
END $$;

-- 4. Ajouter les colonnes manquantes à pending_publications
DO $$
BEGIN
    -- Ajouter la colonne platform si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'platform'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN platform TEXT;
    END IF;

    -- Ajouter la colonne url si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'url'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN url TEXT;
    END IF;

    -- Ajouter la colonne description si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pending_publications' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE pending_publications ADD COLUMN description TEXT;
    END IF;
END $$;

-- 5. Mettre à jour la contrainte CHECK pour inclure tous les types de contenu
ALTER TABLE pending_publications DROP CONSTRAINT IF EXISTS pending_publications_content_type_check;
ALTER TABLE pending_publications ADD CONSTRAINT pending_publications_content_type_check 
  CHECK (content_type IN ('category', 'subcategory', 'title', 'challenge', 'source', 'account', 'hooks', 'inspiration'));

-- 6. Créer les tables pour les nouveaux types de contenu
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    social_network_id UUID REFERENCES social_networks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    platform TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    social_network_id UUID REFERENCES social_networks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    social_network_id UUID REFERENCES social_networks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspirations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    social_network_id UUID REFERENCES social_networks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Fonction pour vérifier les doublons (mise à jour)
DROP FUNCTION IF EXISTS check_duplicate_content(VARCHAR, VARCHAR, VARCHAR);
CREATE OR REPLACE FUNCTION check_duplicate_content(
  p_content_type VARCHAR, p_name VARCHAR, p_title VARCHAR
) RETURNS JSON AS $$
DECLARE
  duplicate_found BOOLEAN := FALSE;
  error_message TEXT := '';
BEGIN
  -- Vérifier selon le type de contenu
  CASE p_content_type
    WHEN 'category' THEN
      SELECT EXISTS(SELECT 1 FROM categories WHERE name = p_name) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Une catégorie avec ce nom existe déjà';
      END IF;
      
    WHEN 'subcategory' THEN
      SELECT EXISTS(SELECT 1 FROM subcategories WHERE name = p_name) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Une sous-catégorie avec ce nom existe déjà';
      END IF;
      
    WHEN 'title' THEN
      SELECT EXISTS(SELECT 1 FROM content_titles WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Un titre avec ce nom existe déjà';
      END IF;
      
    WHEN 'challenge' THEN
      SELECT EXISTS(SELECT 1 FROM challenges WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Un challenge avec ce nom existe déjà';
      END IF;
      
    WHEN 'source' THEN
      SELECT EXISTS(SELECT 1 FROM sources WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Une source avec ce nom existe déjà';
      END IF;
      
    WHEN 'account' THEN
      SELECT EXISTS(SELECT 1 FROM accounts WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Un compte avec ce nom existe déjà';
      END IF;
      
    WHEN 'hooks' THEN
      SELECT EXISTS(SELECT 1 FROM hooks WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Un hook avec ce nom existe déjà';
      END IF;
      
    WHEN 'inspiration' THEN
      SELECT EXISTS(SELECT 1 FROM inspirations WHERE title = p_title) INTO duplicate_found;
      IF duplicate_found THEN
        error_message := 'Une inspiration avec ce nom existe déjà';
      END IF;
      
    ELSE
      error_message := 'Type de contenu non reconnu';
      duplicate_found := TRUE;
  END CASE;
  
  RETURN json_build_object(
    'success', NOT duplicate_found,
    'error', error_message
  );
END;
$$ LANGUAGE plpgsql;

-- 8. Fonction pour approuver une publication (mise à jour)
DROP FUNCTION IF EXISTS approve_publication(UUID);
CREATE OR REPLACE FUNCTION approve_publication(publication_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  publication_record pending_publications%ROWTYPE;
BEGIN
  -- Récupérer la publication
  SELECT * INTO publication_record
  FROM pending_publications
  WHERE id = publication_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Insérer selon le type de contenu
  CASE publication_record.content_type
    WHEN 'category' THEN
      INSERT INTO categories (name, description, color)
      VALUES (publication_record.title, publication_record.description, '#3B82F6')
      ON CONFLICT (name) DO NOTHING;
      
    WHEN 'subcategory' THEN
      INSERT INTO subcategories (name, description, category_id)
      VALUES (publication_record.title, publication_record.description, publication_record.category_id)
      ON CONFLICT (name, category_id) DO NOTHING;
      
    WHEN 'title' THEN
      INSERT INTO content_titles (title, subcategory_id, type, platform)
      VALUES (publication_record.title, publication_record.subcategory_id, 'title', 'all')
      ON CONFLICT (title, subcategory_id) DO NOTHING;
      
    WHEN 'challenge' THEN
      INSERT INTO challenges (title, description, category_id, subcategory_id)
      VALUES (publication_record.title, publication_record.description, publication_record.category_id, publication_record.subcategory_id)
      ON CONFLICT (title) DO NOTHING;
      
    WHEN 'source' THEN
      INSERT INTO sources (title, url, description, category_id, subcategory_id, social_network_id)
      VALUES (publication_record.title, publication_record.url, publication_record.description, publication_record.category_id, publication_record.subcategory_id, publication_record.social_network_id)
      ON CONFLICT (title) DO NOTHING;
      
    WHEN 'account' THEN
      INSERT INTO accounts (title, url, platform, category_id, subcategory_id, social_network_id)
      VALUES (publication_record.title, publication_record.url, publication_record.platform, publication_record.category_id, publication_record.subcategory_id, publication_record.social_network_id)
      ON CONFLICT (title) DO NOTHING;
      
    WHEN 'hooks' THEN
      INSERT INTO hooks (title, description, category_id, subcategory_id, social_network_id)
      VALUES (publication_record.title, publication_record.description, publication_record.category_id, publication_record.subcategory_id, publication_record.social_network_id)
      ON CONFLICT (title) DO NOTHING;
      
    WHEN 'inspiration' THEN
      INSERT INTO inspirations (title, description, category_id, subcategory_id, social_network_id)
      VALUES (publication_record.title, publication_record.description, publication_record.category_id, publication_record.subcategory_id, publication_record.social_network_id)
      ON CONFLICT (title) DO NOTHING;
      
  END CASE;
  
  -- Mettre à jour le statut
  UPDATE pending_publications
  SET status = 'approved', updated_at = NOW()
  WHERE id = publication_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 9. Fonction pour traiter automatiquement les publications
DROP FUNCTION IF EXISTS process_user_publications();
CREATE OR REPLACE FUNCTION process_user_publications()
RETURNS VOID AS $$
DECLARE
  publication_record pending_publications%ROWTYPE;
BEGIN
  -- Traiter toutes les publications en attente
  FOR publication_record IN 
    SELECT * FROM pending_publications 
    WHERE status = 'pending'
  LOOP
    PERFORM approve_publication(publication_record.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 10. Activer RLS pour toutes les nouvelles tables
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;

-- 11. Politiques RLS pour les nouvelles tables
-- Sources
DROP POLICY IF EXISTS "Sources are viewable by everyone" ON sources;
CREATE POLICY "Sources are viewable by everyone" ON sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sources are insertable by authenticated users" ON sources;
CREATE POLICY "Sources are insertable by authenticated users" ON sources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Accounts
DROP POLICY IF EXISTS "Accounts are viewable by everyone" ON accounts;
CREATE POLICY "Accounts are viewable by everyone" ON accounts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Accounts are insertable by authenticated users" ON accounts;
CREATE POLICY "Accounts are insertable by authenticated users" ON accounts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Hooks
DROP POLICY IF EXISTS "Hooks are viewable by everyone" ON hooks;
CREATE POLICY "Hooks are viewable by everyone" ON hooks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Hooks are insertable by authenticated users" ON hooks;
CREATE POLICY "Hooks are insertable by authenticated users" ON hooks FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Inspirations
DROP POLICY IF EXISTS "Inspirations are viewable by everyone" ON inspirations;
CREATE POLICY "Inspirations are viewable by everyone" ON inspirations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inspirations are insertable by authenticated users" ON inspirations;
CREATE POLICY "Inspirations are insertable by authenticated users" ON inspirations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 12. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sources_category_id ON sources(category_id);
CREATE INDEX IF NOT EXISTS idx_sources_subcategory_id ON sources(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_sources_social_network_id ON sources(social_network_id);

CREATE INDEX IF NOT EXISTS idx_accounts_category_id ON accounts(category_id);
CREATE INDEX IF NOT EXISTS idx_accounts_subcategory_id ON accounts(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_accounts_social_network_id ON accounts(social_network_id);

CREATE INDEX IF NOT EXISTS idx_hooks_category_id ON hooks(category_id);
CREATE INDEX IF NOT EXISTS idx_hooks_subcategory_id ON hooks(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_hooks_social_network_id ON hooks(social_network_id);

CREATE INDEX IF NOT EXISTS idx_inspirations_category_id ON inspirations(category_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_subcategory_id ON inspirations(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_social_network_id ON inspirations(social_network_id);

-- 13. Vérifier que tout est en place
SELECT 'Tables créées avec succès' as status;
SELECT table_name FROM information_schema.tables WHERE table_name IN ('social_networks', 'sources', 'accounts', 'hooks', 'inspirations');
SELECT column_name FROM information_schema.columns WHERE table_name = 'pending_publications' AND column_name = 'social_network_id'; 