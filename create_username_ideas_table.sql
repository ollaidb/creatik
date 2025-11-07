-- Migration: Créer la table username_ideas
-- Description: Table pour stocker les idées de pseudos/noms d'utilisateur pour les réseaux sociaux

-- 1. Créer la table username_ideas
CREATE TABLE IF NOT EXISTS public.username_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pseudo VARCHAR(255) NOT NULL,
    social_network_id UUID NOT NULL REFERENCES public.social_networks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_username_ideas_social_network_id ON public.username_ideas(social_network_id);
CREATE INDEX IF NOT EXISTS idx_username_ideas_user_id ON public.username_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_username_ideas_created_at ON public.username_ideas(created_at DESC);

-- 3. Contrainte d'unicité : un même pseudo ne peut pas être dupliqué pour le même réseau social
ALTER TABLE public.username_ideas 
ADD CONSTRAINT unique_pseudo_per_network UNIQUE (pseudo, social_network_id);

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.username_ideas ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS
-- Tout le monde peut voir les idées de pseudos
CREATE POLICY "Username ideas are viewable by everyone" 
ON public.username_ideas 
FOR SELECT 
USING (true);

-- Tout le monde peut créer des idées de pseudos (pour permettre les insertions automatiques avec user_id = NULL)
CREATE POLICY "Username ideas are insertable by everyone" 
ON public.username_ideas 
FOR INSERT 
WITH CHECK (true);

-- Les utilisateurs peuvent modifier leurs propres idées de pseudos ou celles sans user_id
CREATE POLICY "Users can update own username ideas" 
ON public.username_ideas 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- Les utilisateurs peuvent supprimer leurs propres idées de pseudos ou celles sans user_id
CREATE POLICY "Users can delete own username ideas" 
ON public.username_ideas 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- 6. Commentaires
COMMENT ON TABLE public.username_ideas IS 'Table pour stocker les idées de pseudos/noms d''utilisateur pour les réseaux sociaux';
COMMENT ON COLUMN public.username_ideas.pseudo IS 'Le nom d''utilisateur/pseudo proposé';
COMMENT ON COLUMN public.username_ideas.social_network_id IS 'Référence au réseau social pour lequel ce pseudo est proposé';
COMMENT ON COLUMN public.username_ideas.user_id IS 'Utilisateur qui a créé cette idée de pseudo';

-- 7. Fonction pour vérifier si un pseudo existe déjà pour un réseau
CREATE OR REPLACE FUNCTION check_username_idea_exists(pseudo_text TEXT, network_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.username_ideas 
    WHERE LOWER(TRIM(pseudo)) = LOWER(TRIM(pseudo_text)) 
    AND social_network_id = network_id
  );
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
SELECT 'Table username_ideas créée avec succès!' as message;

