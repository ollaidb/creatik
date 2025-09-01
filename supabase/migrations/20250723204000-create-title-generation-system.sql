-- Migration pour le système de génération intelligente de titres
-- Date: 2025-07-23

-- 1. Table des modèles de titres (templates)
CREATE TABLE public.title_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_text TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('débutant', 'intermédiaire', 'avancé')),
  engagement_score INTEGER CHECK (engagement_score >= 1 AND engagement_score <= 10),
  variables_needed TEXT[], -- ['VERBE', 'OBJET', 'PERSONNE', 'ACTION']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Table des variables pour les templates
CREATE TABLE public.title_variables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  variable_type TEXT NOT NULL, -- 'VERBE', 'OBJET', 'PERSONNE', 'ACTION', 'CONTEXTE'
  variable_value TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  popularity_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Table des titres générés (statiques)
CREATE TABLE public.generated_titles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_text TEXT NOT NULL,
  subcategory_id UUID REFERENCES public.subcategories(id),
  template_id UUID REFERENCES public.title_templates(id),
  variables_used JSONB, -- {"VERBE": "maîtriser", "OBJET": "TikTok", "PERSONNE": "créateur"}
  uniqueness_score FLOAT DEFAULT 1.0,
  engagement_potential INTEGER DEFAULT 5,
  is_ai_generated BOOLEAN DEFAULT false,
  source_type TEXT DEFAULT 'combinatoire', -- 'combinatoire', 'ai', 'manuel'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Table pour la recherche intelligente
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  query_text TEXT NOT NULL,
  intent_type TEXT, -- 'category', 'subcategory', 'title', 'general'
  suggested_category_id UUID REFERENCES public.categories(id),
  suggested_subcategory_id UUID REFERENCES public.subcategories(id),
  search_results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Table pour les suggestions de recherche
CREATE TABLE public.search_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_pattern TEXT NOT NULL, -- Pattern pour matcher les recherches
  suggestion_type TEXT NOT NULL, -- 'category', 'subcategory', 'title', 'correction'
  suggestion_value TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Table pour les prompts ChatGPT
CREATE TABLE public.generation_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  variables_to_replace TEXT[], -- ['OBJET', 'VERBE', 'CONTEXTE']
  max_tokens INTEGER DEFAULT 1000,
  temperature FLOAT DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Table pour l'historique de génération IA
CREATE TABLE public.ai_generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES public.generation_prompts(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  generated_titles JSONB, -- Array des titres générés
  variables_used JSONB,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les performances
CREATE INDEX idx_title_templates_category ON public.title_templates(category_id);
CREATE INDEX idx_title_templates_subcategory ON public.title_templates(subcategory_id);
CREATE INDEX idx_title_variables_type ON public.title_variables(variable_type);
CREATE INDEX idx_title_variables_category ON public.title_variables(category_id);
CREATE INDEX idx_generated_titles_subcategory ON public.generated_titles(subcategory_id);
CREATE INDEX idx_generated_titles_template ON public.generated_titles(template_id);
CREATE INDEX idx_search_queries_user ON public.search_queries(user_id);
CREATE INDEX idx_search_queries_created ON public.search_queries(created_at);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.title_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_history ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour lecture publique (pour les titres et templates)
CREATE POLICY "Public read access for title_templates" 
  ON public.title_templates FOR SELECT USING (true);

CREATE POLICY "Public read access for title_variables" 
  ON public.title_variables FOR SELECT USING (true);

CREATE POLICY "Public read access for generated_titles" 
  ON public.generated_titles FOR SELECT USING (true);

CREATE POLICY "Public read access for search_suggestions" 
  ON public.search_suggestions FOR SELECT USING (true);

CREATE POLICY "Public read access for generation_prompts" 
  ON public.generation_prompts FOR SELECT USING (true);

-- Politiques RLS pour les utilisateurs connectés
CREATE POLICY "Users can view their own search queries" 
  ON public.search_queries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search queries" 
  ON public.search_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour les admins (écriture)
CREATE POLICY "Admins can manage title_templates" 
  ON public.title_templates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage title_variables" 
  ON public.title_variables FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage generated_titles" 
  ON public.generated_titles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage search_suggestions" 
  ON public.search_suggestions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage generation_prompts" 
  ON public.generation_prompts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view ai_generation_history" 
  ON public.ai_generation_history FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_title_templates_updated_at BEFORE UPDATE ON public.title_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_title_variables_updated_at BEFORE UPDATE ON public.title_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_titles_updated_at BEFORE UPDATE ON public.generated_titles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generation_prompts_updated_at BEFORE UPDATE ON public.generation_prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer des titres combinatoires
CREATE OR REPLACE FUNCTION generate_combinatorial_titles(
  p_subcategory_id UUID,
  p_max_titles INTEGER DEFAULT 100
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_template RECORD;
  v_variable RECORD;
  v_title_text TEXT;
  v_variables_used JSONB;
  v_count INTEGER := 0;
BEGIN
  -- Pour chaque template de la sous-catégorie
  FOR v_template IN 
    SELECT * FROM public.title_templates 
    WHERE subcategory_id = p_subcategory_id AND is_active = true
  LOOP
    -- Pour chaque combinaison de variables
    -- (logique simplifiée, à adapter selon tes besoins)
    v_title_text := v_template.template_text;
    v_variables_used := '{}'::jsonb;
    
    -- Insérer le titre généré
    INSERT INTO public.generated_titles (
      title_text, 
      subcategory_id, 
      template_id, 
      variables_used,
      source_type
    ) VALUES (
      v_title_text,
      p_subcategory_id,
      v_template.id,
      v_variables_used,
      'combinatoire'
    );
    
    v_count := v_count + 1;
    
    -- Arrêter si on a atteint le maximum
    IF v_count >= p_max_titles THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_count;
END;
$$;

-- Insérer quelques exemples de templates
INSERT INTO public.title_templates (template_text, description, difficulty_level, engagement_score, variables_needed) VALUES
('Comment [VERBE] [OBJET] comme un pro ?', 'Template action + objet', 'débutant', 7, ARRAY['VERBE', 'OBJET']),
('Les erreurs à éviter quand tu [ACTION] un [OBJET]', 'Template erreur/action/objet', 'intermédiaire', 8, ARRAY['ACTION', 'OBJET']),
('5 choses que tu ignores sur [OBJET]', 'Template liste + objet', 'débutant', 6, ARRAY['OBJET']),
('Est-ce que [OBJET] peut changer ta vie ?', 'Template question + objet', 'débutant', 9, ARRAY['OBJET']),
('Pourquoi [PERSONNE] a choisi [OBJET] ?', 'Template pourquoi + personne + objet', 'avancé', 8, ARRAY['PERSONNE', 'OBJET']);

-- Insérer quelques exemples de variables
INSERT INTO public.title_variables (variable_type, variable_value, popularity_score) VALUES
('VERBE', 'maîtriser', 8),
('VERBE', 'créer', 9),
('VERBE', 'découvrir', 7),
('VERBE', 'apprendre', 8),
('OBJET', 'TikTok', 9),
('OBJET', 'Instagram', 8),
('OBJET', 'YouTube', 7),
('OBJET', 'contenu viral', 9),
('PERSONNE', 'créateur', 8),
('PERSONNE', 'influenceur', 7),
('PERSONNE', 'expert', 6),
('ACTION', 'poster', 8),
('ACTION', 'filmer', 7),
('ACTION', 'éditer', 6);

-- Insérer quelques suggestions de recherche
INSERT INTO public.search_suggestions (query_pattern, suggestion_type, suggestion_value, priority) VALUES
('idée de contenu sur la mode', 'category', 'Mode / fashion', 10),
('quoi créer pour faire rire', 'category', 'Humour', 10),
('contenu éducation santé', 'category', 'Santé - sport', 10),
('tuto', 'category', 'Tuto', 8),
('challenge', 'category', 'Challenge', 8),
('vlog', 'category', 'Vlog', 8); 