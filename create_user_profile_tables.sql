-- Script SQL pour créer les tables du système de profil utilisateur
-- Tables pour les réseaux sociaux, publications personnelles et playlists

-- Table des réseaux sociaux de l'utilisateur
CREATE TABLE IF NOT EXISTS public.user_social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'tiktok', 'instagram', 'youtube', 'twitter'
  username VARCHAR(255),
  display_name VARCHAR(255),
  profile_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform, username)
);

-- Table des publications personnelles de l'utilisateur
CREATE TABLE IF NOT EXISTS public.user_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'archived'
  engagement_data JSONB, -- likes, comments, shares, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des playlists de l'utilisateur
CREATE TABLE IF NOT EXISTS public.user_content_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Couleur hex pour l'UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison posts-playlists
CREATE TABLE IF NOT EXISTS public.playlist_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.user_content_playlists(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.user_social_posts(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, post_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_social_accounts_user_id ON public.user_social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_accounts_platform ON public.user_social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_user_social_posts_user_id ON public.user_social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_posts_social_account_id ON public.user_social_posts(social_account_id);
CREATE INDEX IF NOT EXISTS idx_user_social_posts_status ON public.user_social_posts(status);
CREATE INDEX IF NOT EXISTS idx_user_content_playlists_user_id ON public.user_content_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_posts_playlist_id ON public.playlist_posts(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_posts_post_id ON public.playlist_posts(post_id);

-- RLS Policies pour user_social_accounts
ALTER TABLE public.user_social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social accounts" ON public.user_social_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social accounts" ON public.user_social_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" ON public.user_social_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" ON public.user_social_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies pour user_social_posts
ALTER TABLE public.user_social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social posts" ON public.user_social_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social posts" ON public.user_social_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social posts" ON public.user_social_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social posts" ON public.user_social_posts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies pour user_content_playlists
ALTER TABLE public.user_content_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own playlists" ON public.user_content_playlists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" ON public.user_content_playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON public.user_content_playlists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON public.user_content_playlists
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies pour playlist_posts
ALTER TABLE public.playlist_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own playlist posts" ON public.playlist_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_content_playlists 
            WHERE id = playlist_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own playlist posts" ON public.playlist_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_content_playlists 
            WHERE id = playlist_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own playlist posts" ON public.playlist_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_content_playlists 
            WHERE id = playlist_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own playlist posts" ON public.playlist_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_content_playlists 
            WHERE id = playlist_id AND user_id = auth.uid()
        )
    );

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_user_social_accounts_updated_at
    BEFORE UPDATE ON public.user_social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_social_posts_updated_at
    BEFORE UPDATE ON public.user_social_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_content_playlists_updated_at
    BEFORE UPDATE ON public.user_content_playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
