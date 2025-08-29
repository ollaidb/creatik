-- Script pour appliquer la migration des sous-catégories niveau 2
-- À exécuter dans le SQL Editor de votre dashboard Supabase

-- 1. Créer la table subcategories_level2
CREATE TABLE IF NOT EXISTS public.subcategories_level2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table de configuration pour indiquer quelles catégories ont besoin du niveau 2
CREATE TABLE IF NOT EXISTS public.category_hierarchy_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  has_level2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id)
);

-- 3. Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_subcategories_level2_subcategory_id ON public.subcategories_level2(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_category_hierarchy_config_category_id ON public.category_hierarchy_config(category_id);

-- 4. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_subcategories_level2_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_subcategories_level2_updated_at
  BEFORE UPDATE ON public.subcategories_level2
  FOR EACH ROW
  EXECUTE FUNCTION update_subcategories_level2_updated_at();

-- 5. Configurer "Vie personnelle" pour avoir le niveau 2
INSERT INTO public.category_hierarchy_config (category_id, has_level2) 
VALUES (
  (SELECT id FROM public.categories WHERE name = 'Vie personnelle' LIMIT 1), 
  true
)
ON CONFLICT (category_id) DO UPDATE SET has_level2 = true;

-- 6. Ajouter quelques exemples de sous-catégories niveau 2 pour "Vie personnelle"
-- D'abord, créons quelques sous-catégories niveau 1 pour "Vie personnelle" si elles n'existent pas
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Apparence', 'Tout ce qui concerne l''apparence physique', c.id, now(), now()
FROM public.categories c 
WHERE c.name = 'Vie personnelle' 
  AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.name = 'Apparence' AND s.category_id = c.id);

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Relations', 'Toutes les relations sociales et personnelles', c.id, now(), now()
FROM public.categories c 
WHERE c.name = 'Vie personnelle' 
  AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.name = 'Relations' AND s.category_id = c.id);

INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT 'Bien-être', 'Santé physique et mentale', c.id, now(), now()
FROM public.categories c 
WHERE c.name = 'Vie personnelle' 
  AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.name = 'Bien-être' AND s.category_id = c.id);

-- 7. Maintenant, ajoutons les sous-catégories niveau 2
INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Soins du visage', 'Routines et produits pour le visage', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
  AND NOT EXISTS (SELECT 1 FROM public.subcategories_level2 sl2 WHERE sl2.name = 'Soins du visage' AND sl2.subcategory_id = s.id);

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Soins du corps', 'Routines et produits pour le corps', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Apparence'
  AND NOT EXISTS (SELECT 1 FROM public.subcategories_level2 sl2 WHERE sl2.name = 'Soins du corps' AND sl2.subcategory_id = s.id);

INSERT INTO public.subcategories_level2 (name, description, subcategory_id, created_at, updated_at) 
SELECT 'Relations amoureuses', 'Conseils et expériences en couple', s.id, now(), now()
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name = 'Vie personnelle' AND s.name = 'Relations'
  AND NOT EXISTS (SELECT 1 FROM public.subcategories_level2 sl2 WHERE sl2.name = 'Relations amoureuses' AND sl2.subcategory_id = s.id);

-- 8. Activer RLS sur la table
ALTER TABLE public.subcategories_level2 ENABLE ROW LEVEL SECURITY;

-- 9. Créer une politique RLS basique (lecture publique)
CREATE POLICY IF NOT EXISTS "Allow public read access" ON public.subcategories_level2
  FOR SELECT USING (true);

-- 10. Vérifier le résultat
SELECT 'Migration terminée avec succès!' as status;
SELECT COUNT(*) as total_subcategories_level2 FROM public.subcategories_level2;
SELECT COUNT(*) as total_config FROM public.category_hierarchy_config;
