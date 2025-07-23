
-- Créer la table des thèmes
CREATE TABLE public.themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT 'primary',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table de relation many-to-many entre catégories et thèmes
CREATE TABLE public.category_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, theme_id)
);

-- Insérer les thèmes de base
INSERT INTO public.themes (name, description, display_order) VALUES
('Tout', 'Toutes les catégories', 0),
('Inspirer', 'Contenu inspirant et motivant', 1),
('Motiver', 'Contenu de motivation et défis', 2),
('Éduquer', 'Contenu éducatif et informatif', 3),
('Divertir', 'Contenu divertissant et amusant', 4),
('Promouvoir', 'Contenu de promotion et marketing', 5),
('Engager', 'Contenu d''engagement communautaire', 6);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_themes ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour lecture publique
CREATE POLICY "Public read access for themes" 
  ON public.themes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access for category_themes" 
  ON public.category_themes 
  FOR SELECT 
  USING (true);

-- Maintenant, associer les catégories existantes aux thèmes selon votre classification
-- ÉDUQUER
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Éduquer' 
AND c.name IN (
  'Éducation', 'Information', 'Intelligence artificielle', 'Conseil', 
  'Développement personnel', 'Podcast', 'Documentaire', 'Critique', 
  'Analyse', 'Science', 'Statistique', 'Prévention', 'Psychologie', 
  'Marketing', 'Recyclage', 'Nature', 'Lecture', 'Guide débutant', 
  'Mythe', 'Religion', 'Histoire', 'FAQ vidéo', 'Politique', 
  'Tradition / culture', 'Option', 'Sondage', 'Technologie', 
  'Micro-trottoir', 'Témoignage', 'Interview', 'Actualités', 'Dilemme'
);

-- INSPIRER
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Inspirer' 
AND c.name IN (
  'Motivation', 'Storytelling', 'Témoignage', 'Développement personnel', 
  'Lecture', 'Histoire', 'Transition', 'Voyage', 'Routine', 
  'Vie quotidienne général', 'Lifestyle', 'Beauty / style', 'Makeup', 
  'Familles', 'Communauté', 'Religion', 'Art', 'Nature', 'Vlog', 'Portrait'
);

-- MOTIVER
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Motiver' 
AND c.name IN (
  'Lifestyle', 'Défi', 'Challenge', 'Motivation', 'Routine', 
  'Vie quotidienne général', 'Rangement', 'Avant / Après', 'Makeover', 
  'Guide débutant', 'Astuce', 'Carrière', 'Bricolage / DIY', 'Cuisine', 'Santé - sport'
);

-- DIVERTIR  
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Divertir' 
AND c.name IN (
  'Humour', 'Prank', 'Meme', 'Sketch', 'Parodie', 'Asmr', 'Lip sync', 
  'Danse', 'Dégustation', 'Cinéma', 'Caption', 'Téléréalité', 'Complotiste', 
  'Anecdote', 'Fun fact', 'Animation / dessin animé', 'Animaux', 
  'Contenu sans visage', 'Jeu vidéo', 'Nostalgie', 'Science-fiction', 
  'POV', 'Duo', 'Satisfaisant', 'Unboxing', 'Vlog', 'Divertissement / fun', 
  'Catastrophe / erreur', 'Date marquante', 'Bts / coulisse', 'Micro-trottoir'
);

-- PROMOUVOIR
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Promouvoir' 
AND c.name IN (
  'Marketing', 'Réseaux sociaux', 'UGC', 'Fan account', 'Recommandation', 
  'Vente', 'Beauty / style', 'Makeup', 'Photo', 'Haul', 'Mode / fashion'
);

-- ENGAGER
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Engager' 
AND c.name IN (
  'Communauté', 'Micro-trottoir', 'Podcast', 'Débat', 'Expérience sociale', 
  'Live', 'Sondage', 'Témoignage', 'Réalité', 'Challenge', 'POV', 
  'Activisme', 'Politique', 'Relation', 'Religion'
);

-- Associer toutes les catégories au thème "Tout"
INSERT INTO public.category_themes (category_id, theme_id)
SELECT c.id, t.id 
FROM public.categories c, public.themes t 
WHERE t.name = 'Tout';
