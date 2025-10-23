-- Migration sécurisée pour intégrer les réseaux sociaux, playlists et défis
-- Ce script vérifie l'existence des colonnes avant de les ajouter

-- ==============================================
-- 1. VÉRIFICATION ET AJOUT SÉCURISÉ DES COLONNES
-- ==============================================

-- Vérifier et ajouter social_network_id à user_content_playlists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_content_playlists' 
        AND column_name = 'social_network_id'
    ) THEN
        ALTER TABLE public.user_content_playlists 
        ADD COLUMN social_network_id UUID REFERENCES public.user_social_accounts(id) ON DELETE CASCADE;
        RAISE NOTICE 'Colonne social_network_id ajoutée à user_content_playlists';
    ELSE
        RAISE NOTICE 'Colonne social_network_id existe déjà dans user_content_playlists';
    END IF;
END $$;

-- Vérifier et ajouter playlist_id à user_social_posts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_social_posts' 
        AND column_name = 'playlist_id'
    ) THEN
        ALTER TABLE public.user_social_posts 
        ADD COLUMN playlist_id UUID REFERENCES public.user_content_playlists(id) ON DELETE SET NULL;
        RAISE NOTICE 'Colonne playlist_id ajoutée à user_social_posts';
    ELSE
        RAISE NOTICE 'Colonne playlist_id existe déjà dans user_social_posts';
    END IF;
END $$;

-- Vérifier et ajouter les colonnes à user_challenges
DO $$
BEGIN
    -- Ajouter social_account_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'social_account_id'
    ) THEN
        ALTER TABLE public.user_challenges 
        ADD COLUMN social_account_id UUID REFERENCES public.user_social_accounts(id) ON DELETE CASCADE;
        RAISE NOTICE 'Colonne social_account_id ajoutée à user_challenges';
    ELSE
        RAISE NOTICE 'Colonne social_account_id existe déjà dans user_challenges';
    END IF;

    -- Ajouter playlist_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'playlist_id'
    ) THEN
        ALTER TABLE public.user_challenges 
        ADD COLUMN playlist_id UUID REFERENCES public.user_content_playlists(id) ON DELETE SET NULL;
        RAISE NOTICE 'Colonne playlist_id ajoutée à user_challenges';
    ELSE
        RAISE NOTICE 'Colonne playlist_id existe déjà dans user_challenges';
    END IF;

    -- Ajouter is_custom si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'is_custom'
    ) THEN
        ALTER TABLE public.user_challenges 
        ADD COLUMN is_custom BOOLEAN DEFAULT false;
        RAISE NOTICE 'Colonne is_custom ajoutée à user_challenges';
    ELSE
        RAISE NOTICE 'Colonne is_custom existe déjà dans user_challenges';
    END IF;

    -- Ajouter custom_title si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'custom_title'
    ) THEN
        ALTER TABLE public.user_challenges 
        ADD COLUMN custom_title TEXT;
        RAISE NOTICE 'Colonne custom_title ajoutée à user_challenges';
    ELSE
        RAISE NOTICE 'Colonne custom_title existe déjà dans user_challenges';
    END IF;

    -- Ajouter custom_description si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'custom_description'
    ) THEN
        ALTER TABLE public.user_challenges 
        ADD COLUMN custom_description TEXT;
        RAISE NOTICE 'Colonne custom_description ajoutée à user_challenges';
    ELSE
        RAISE NOTICE 'Colonne custom_description existe déjà dans user_challenges';
    END IF;
END $$;

-- ==============================================
-- 2. CRÉER LES TABLES MANQUANTES (SI ELLES N'EXISTENT PAS)
-- ==============================================

-- Créer user_program_settings si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_program_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES public.user_content_playlists(id) ON DELETE CASCADE,
  duration VARCHAR(20) NOT NULL DEFAULT '3months',
  contents_per_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, social_account_id, playlist_id)
);

-- Créer user_custom_challenges si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_custom_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES public.user_content_playlists(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Créer user_custom_challenges_completed si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_custom_challenges_completed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.user_custom_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, challenge_id)
);

-- ==============================================
-- 3. CRÉER LES INDEX (SI ILS N'EXISTENT PAS)
-- ==============================================

-- Index pour user_content_playlists
CREATE INDEX IF NOT EXISTS idx_user_content_playlists_social_network ON public.user_content_playlists(social_network_id);
CREATE INDEX IF NOT EXISTS idx_user_content_playlists_user_social ON public.user_content_playlists(user_id, social_network_id);

-- Index pour user_social_posts
CREATE INDEX IF NOT EXISTS idx_user_social_posts_playlist ON public.user_social_posts(playlist_id);
CREATE INDEX IF NOT EXISTS idx_user_social_posts_user_social ON public.user_social_posts(user_id, social_account_id);

-- Index pour user_challenges
CREATE INDEX IF NOT EXISTS idx_user_challenges_social_account ON public.user_challenges(social_account_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_playlist ON public.user_challenges(playlist_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_custom ON public.user_challenges(is_custom);

-- Index pour user_custom_challenges
CREATE INDEX IF NOT EXISTS idx_user_custom_challenges_user ON public.user_custom_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_challenges_social ON public.user_custom_challenges(social_account_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_challenges_playlist ON public.user_custom_challenges(playlist_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_challenges_status ON public.user_custom_challenges(status);

-- Index pour user_program_settings
CREATE INDEX IF NOT EXISTS idx_user_program_settings_user ON public.user_program_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_program_settings_social ON public.user_program_settings(social_account_id);
CREATE INDEX IF NOT EXISTS idx_user_program_settings_playlist ON public.user_program_settings(playlist_id);

-- ==============================================
-- 4. CONFIGURER RLS (SI PAS DÉJÀ FAIT)
-- ==============================================

-- RLS pour user_program_settings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relname = 'user_program_settings' AND relkind = 'r'
    ) THEN
        RAISE NOTICE 'Table user_program_settings n''existe pas, RLS ignoré';
    ELSE
        ALTER TABLE public.user_program_settings ENABLE ROW LEVEL SECURITY;
        
        -- Créer les politiques si elles n'existent pas
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_program_settings' AND policyname = 'Users can view their own program settings'
        ) THEN
            CREATE POLICY "Users can view their own program settings" ON public.user_program_settings
              FOR SELECT USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_program_settings' AND policyname = 'Users can insert their own program settings'
        ) THEN
            CREATE POLICY "Users can insert their own program settings" ON public.user_program_settings
              FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_program_settings' AND policyname = 'Users can update their own program settings'
        ) THEN
            CREATE POLICY "Users can update their own program settings" ON public.user_program_settings
              FOR UPDATE USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_program_settings' AND policyname = 'Users can delete their own program settings'
        ) THEN
            CREATE POLICY "Users can delete their own program settings" ON public.user_program_settings
              FOR DELETE USING (auth.uid() = user_id);
        END IF;
        
        RAISE NOTICE 'RLS configuré pour user_program_settings';
    END IF;
END $$;

-- RLS pour user_custom_challenges
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relname = 'user_custom_challenges' AND relkind = 'r'
    ) THEN
        RAISE NOTICE 'Table user_custom_challenges n''existe pas, RLS ignoré';
    ELSE
        ALTER TABLE public.user_custom_challenges ENABLE ROW LEVEL SECURITY;
        
        -- Créer les politiques si elles n'existent pas
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges' AND policyname = 'Users can view their own custom challenges'
        ) THEN
            CREATE POLICY "Users can view their own custom challenges" ON public.user_custom_challenges
              FOR SELECT USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges' AND policyname = 'Users can insert their own custom challenges'
        ) THEN
            CREATE POLICY "Users can insert their own custom challenges" ON public.user_custom_challenges
              FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges' AND policyname = 'Users can update their own custom challenges'
        ) THEN
            CREATE POLICY "Users can update their own custom challenges" ON public.user_custom_challenges
              FOR UPDATE USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges' AND policyname = 'Users can delete their own custom challenges'
        ) THEN
            CREATE POLICY "Users can delete their own custom challenges" ON public.user_custom_challenges
              FOR DELETE USING (auth.uid() = user_id);
        END IF;
        
        RAISE NOTICE 'RLS configuré pour user_custom_challenges';
    END IF;
END $$;

-- RLS pour user_custom_challenges_completed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relname = 'user_custom_challenges_completed' AND relkind = 'r'
    ) THEN
        RAISE NOTICE 'Table user_custom_challenges_completed n''existe pas, RLS ignoré';
    ELSE
        ALTER TABLE public.user_custom_challenges_completed ENABLE ROW LEVEL SECURITY;
        
        -- Créer les politiques si elles n'existent pas
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges_completed' AND policyname = 'Users can view their own completed custom challenges'
        ) THEN
            CREATE POLICY "Users can view their own completed custom challenges" ON public.user_custom_challenges_completed
              FOR SELECT USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges_completed' AND policyname = 'Users can insert their own completed custom challenges'
        ) THEN
            CREATE POLICY "Users can insert their own completed custom challenges" ON public.user_custom_challenges_completed
              FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges_completed' AND policyname = 'Users can update their own completed custom challenges'
        ) THEN
            CREATE POLICY "Users can update their own completed custom challenges" ON public.user_custom_challenges_completed
              FOR UPDATE USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'user_custom_challenges_completed' AND policyname = 'Users can delete their own completed custom challenges'
        ) THEN
            CREATE POLICY "Users can delete their own completed custom challenges" ON public.user_custom_challenges_completed
              FOR DELETE USING (auth.uid() = user_id);
        END IF;
        
        RAISE NOTICE 'RLS configuré pour user_custom_challenges_completed';
    END IF;
END $$;

-- ==============================================
-- 5. CRÉER LES FONCTIONS UTILITAIRES (SI ELLES N'EXISTENT PAS)
-- ==============================================

-- Fonction get_playlist_publications
CREATE OR REPLACE FUNCTION get_playlist_publications(
  playlist_uuid UUID,
  user_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  post_id UUID,
  title VARCHAR,
  content TEXT,
  status VARCHAR,
  social_platform VARCHAR,
  social_username VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.title,
    sp.content,
    sp.status,
    usa.platform,
    usa.username,
    sp.created_at,
    pp.position
  FROM public.user_social_posts sp
  JOIN public.user_social_accounts usa ON sp.social_account_id = usa.id
  LEFT JOIN public.playlist_posts pp ON sp.id = pp.post_id AND pp.playlist_id = playlist_uuid
  WHERE (user_uuid IS NULL OR sp.user_id = user_uuid)
    AND (sp.playlist_id = playlist_uuid OR pp.playlist_id = playlist_uuid)
  ORDER BY COALESCE(pp.position, 0), sp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction get_social_network_challenges
CREATE OR REPLACE FUNCTION get_social_network_challenges(
  social_account_uuid UUID,
  user_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  challenge_id UUID,
  title TEXT,
  description TEXT,
  status VARCHAR,
  is_custom BOOLEAN,
  playlist_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uc.id,
    COALESCE(uc.custom_title, c.title) as title,
    COALESCE(uc.custom_description, c.description) as description,
    uc.status,
    uc.is_custom,
    p.name as playlist_name,
    uc.created_at
  FROM public.user_challenges uc
  LEFT JOIN public.challenges c ON uc.challenge_id = c.id
  LEFT JOIN public.user_content_playlists p ON uc.playlist_id = p.id
  WHERE uc.social_account_id = social_account_uuid
    AND (user_uuid IS NULL OR uc.user_id = user_uuid)
  ORDER BY uc.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction get_social_network_stats
CREATE OR REPLACE FUNCTION get_social_network_stats(
  social_account_uuid UUID,
  user_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  total_publications INTEGER,
  total_challenges INTEGER,
  completed_challenges INTEGER,
  total_playlists INTEGER,
  program_duration VARCHAR,
  contents_per_day INTEGER
) AS $$
DECLARE
  user_id_check UUID;
  program_settings RECORD;
BEGIN
  user_id_check := COALESCE(user_uuid, auth.uid());
  
  -- Récupérer les paramètres de programmation
  SELECT duration, contents_per_day INTO program_settings
  FROM public.user_program_settings
  WHERE social_account_id = social_account_uuid 
    AND user_id = user_id_check
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.user_social_posts 
     WHERE social_account_id = social_account_uuid AND user_id = user_id_check) as total_publications,
    (SELECT COUNT(*)::INTEGER FROM public.user_challenges 
     WHERE social_account_id = social_account_uuid AND user_id = user_id_check) as total_challenges,
    (SELECT COUNT(*)::INTEGER FROM public.user_challenges 
     WHERE social_account_id = social_account_uuid AND user_id = user_id_check AND status = 'completed') as completed_challenges,
    (SELECT COUNT(*)::INTEGER FROM public.user_content_playlists 
     WHERE social_network_id = social_account_uuid AND user_id = user_id_check) as total_playlists,
    COALESCE(program_settings.duration, '3months') as program_duration,
    COALESCE(program_settings.contents_per_day, 1) as contents_per_day;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 6. CRÉER LES TRIGGERS (SI ILS N'EXISTENT PAS)
-- ==============================================

-- Trigger pour user_program_settings
CREATE OR REPLACE FUNCTION update_user_program_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_program_settings_updated_at'
    ) THEN
        CREATE TRIGGER update_user_program_settings_updated_at
          BEFORE UPDATE ON public.user_program_settings
          FOR EACH ROW
          EXECUTE FUNCTION update_user_program_settings_updated_at();
        RAISE NOTICE 'Trigger update_user_program_settings_updated_at créé';
    ELSE
        RAISE NOTICE 'Trigger update_user_program_settings_updated_at existe déjà';
    END IF;
END $$;

-- Trigger pour user_custom_challenges
CREATE OR REPLACE FUNCTION update_user_custom_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_custom_challenges_updated_at'
    ) THEN
        CREATE TRIGGER update_user_custom_challenges_updated_at
          BEFORE UPDATE ON public.user_custom_challenges
          FOR EACH ROW
          EXECUTE FUNCTION update_user_custom_challenges_updated_at();
        RAISE NOTICE 'Trigger update_user_custom_challenges_updated_at créé';
    ELSE
        RAISE NOTICE 'Trigger update_user_custom_challenges_updated_at existe déjà';
    END IF;
END $$;

-- ==============================================
-- 7. MIGRATION DES DONNÉES EXISTANTES (SÉCURISÉE)
-- ==============================================

-- Mettre à jour les playlists existantes pour les lier aux réseaux sociaux
UPDATE public.user_content_playlists 
SET social_network_id = (
  SELECT usa.id 
  FROM public.user_social_accounts usa 
  WHERE usa.user_id = user_content_playlists.user_id 
  LIMIT 1
)
WHERE social_network_id IS NULL;

-- Mettre à jour les publications existantes pour les lier aux playlists
UPDATE public.user_social_posts 
SET playlist_id = (
  SELECT p.id 
  FROM public.user_content_playlists p 
  WHERE p.user_id = user_social_posts.user_id 
    AND p.social_network_id = user_social_posts.social_account_id
  LIMIT 1
)
WHERE playlist_id IS NULL;

-- ==============================================
-- 8. VÉRIFICATION FINALE
-- ==============================================

-- Vérifier que toutes les colonnes sont présentes
SELECT 
  'Vérification des colonnes' as check_type,
  table_name,
  column_name,
  'PRÉSENTE' as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND (
    (table_name = 'user_content_playlists' AND column_name = 'social_network_id') OR
    (table_name = 'user_social_posts' AND column_name = 'playlist_id') OR
    (table_name = 'user_challenges' AND column_name IN ('social_account_id', 'playlist_id', 'is_custom'))
  )
ORDER BY table_name, column_name;

-- Vérifier que toutes les tables sont créées
SELECT 
  'Vérification des tables' as check_type,
  table_name,
  'CRÉÉE' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_program_settings',
    'user_custom_challenges',
    'user_custom_challenges_completed'
  )
ORDER BY table_name;

RAISE NOTICE '=== MIGRATION SÉCURISÉE TERMINÉE ===';
RAISE NOTICE 'Toutes les colonnes et tables ont été vérifiées et créées si nécessaire.';
RAISE NOTICE 'La base de données est maintenant prête pour la communication entre réseaux sociaux, playlists et défis.';
