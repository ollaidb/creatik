-- Migration: Create Hooks Table
-- Description: Create hooks table with social_network_id support

-- 1. Créer la table hooks
CREATE TABLE public.hooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  social_network_id UUID REFERENCES public.social_networks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_hooks_category_id ON public.hooks(category_id);
CREATE INDEX IF NOT EXISTS idx_hooks_subcategory_id ON public.hooks(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_hooks_social_network_id ON public.hooks(social_network_id);
CREATE INDEX IF NOT EXISTS idx_hooks_created_at ON public.hooks(created_at);

-- 3. Créer les politiques RLS (Row Level Security)
ALTER TABLE public.hooks ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Public read access for hooks" ON public.hooks
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert hooks" ON public.hooks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update hooks" ON public.hooks
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete hooks" ON public.hooks
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hooks_updated_at 
  BEFORE UPDATE ON public.hooks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Insérer quelques hooks d'exemple pour YouTube
INSERT INTO public.hooks (title, description, category_id, subcategory_id, social_network_id) VALUES
('Comment optimiser vos titres YouTube pour plus de vues', 'Découvrez les techniques pour créer des titres accrocheurs qui génèrent plus de clics', 
  (SELECT id FROM public.categories WHERE name = 'YouTube' LIMIT 1),
  (SELECT id FROM public.subcategories WHERE name = 'Optimisation' LIMIT 1),
  (SELECT id FROM public.social_networks WHERE name = 'youtube' LIMIT 1)),
('Les mots-clés qui boostent vos vidéos YouTube', 'Liste des mots-clés tendance pour améliorer votre visibilité', 
  (SELECT id FROM public.categories WHERE name = 'YouTube' LIMIT 1),
  (SELECT id FROM public.subcategories WHERE name = 'SEO' LIMIT 1),
  (SELECT id FROM public.social_networks WHERE name = 'youtube' LIMIT 1)),
('Titres qui créent l''urgence sur YouTube', 'Formules magiques pour inciter les utilisateurs à cliquer immédiatement', 
  (SELECT id FROM public.categories WHERE name = 'YouTube' LIMIT 1),
  (SELECT id FROM public.subcategories WHERE name = 'Psychologie' LIMIT 1),
  (SELECT id FROM public.social_networks WHERE name = 'youtube' LIMIT 1));

-- 6. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Table hooks créée avec succès';
    RAISE NOTICE 'Politiques RLS configurées';
    RAISE NOTICE 'Index créés pour optimiser les performances';
    RAISE NOTICE 'Hooks d''exemple insérés pour YouTube';
END $$; 