-- ============================================
-- SYSTÈME D'ALGORITHME DE RECOMMANDATION DE CONTENU
-- Version 2 - Compatible Supabase SQL Editor
-- ============================================
-- Copiez et exécutez ce script dans l'éditeur SQL de Supabase

-- ============================================
-- ÉTAPE 1: CRÉER TOUTES LES TABLES
-- ============================================

-- 1. Table des règles de recommandation
CREATE TABLE IF NOT EXISTS public.content_recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL UNIQUE,
  rule_type VARCHAR(50) NOT NULL,
  priority INTEGER DEFAULT 1 NOT NULL,
  weight FLOAT DEFAULT 1.0 CHECK (weight >= 0.0 AND weight <= 1.0),
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  action JSONB NOT NULL DEFAULT '{}'::jsonb,
  max_results INTEGER DEFAULT 10 CHECK (max_results > 0),
  min_relevance_score FLOAT DEFAULT 0.0 CHECK (min_relevance_score >= 0.0 AND min_relevance_score <= 1.0),
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des métriques d'engagement
CREATE TABLE IF NOT EXISTS public.user_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_title_id UUID REFERENCES public.content_titles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  interaction_type VARCHAR(50) NOT NULL,
  interaction_value INTEGER DEFAULT 1,
  session_id UUID,
  platform VARCHAR(50) DEFAULT 'web',
  device_type VARCHAR(50),
  source VARCHAR(100),
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des scores de pertinence
CREATE TABLE IF NOT EXISTS public.content_relevance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_title_id UUID NOT NULL REFERENCES public.content_titles(id) ON DELETE CASCADE,
  base_score FLOAT DEFAULT 0.0 CHECK (base_score >= 0.0 AND base_score <= 1.0),
  preference_score FLOAT DEFAULT 0.0 CHECK (preference_score >= 0.0 AND preference_score <= 1.0),
  engagement_score FLOAT DEFAULT 0.0 CHECK (engagement_score >= 0.0 AND engagement_score <= 1.0),
  similarity_score FLOAT DEFAULT 0.0 CHECK (similarity_score >= 0.0 AND similarity_score <= 1.0),
  trending_score FLOAT DEFAULT 0.0 CHECK (trending_score >= 0.0 AND trending_score <= 1.0),
  social_score FLOAT DEFAULT 0.0 CHECK (social_score >= 0.0 AND social_score <= 1.0),
  collaborative_score FLOAT DEFAULT 0.0 CHECK (collaborative_score >= 0.0 AND collaborative_score <= 1.0),
  final_score FLOAT DEFAULT 0.0 CHECK (final_score >= 0.0 AND final_score <= 1.0),
  rule_ids UUID[],
  rule_contributions JSONB DEFAULT '{}'::jsonb,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  UNIQUE(user_id, content_title_id, version)
);

-- 4. Table des suggestions en cache
CREATE TABLE IF NOT EXISTS public.content_suggestions_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  suggested_title_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  suggestion_context JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  total_count INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0.0,
  UNIQUE(user_id)
);

-- 5. Table d'analyse des posts réseaux sociaux
CREATE TABLE IF NOT EXISTS public.user_social_post_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_post_id UUID REFERENCES public.user_social_posts(id) ON DELETE CASCADE,
  analyzed_title TEXT,
  detected_themes TEXT[],
  detected_categories UUID[],
  detected_subcategories UUID[],
  engagement_data JSONB DEFAULT '{}'::jsonb,
  relevance_score FLOAT DEFAULT 0.0,
  performance_score FLOAT DEFAULT 0.0,
  suggested_content_ids UUID[],
  suggested_keywords TEXT[],
  analysis_status VARCHAR(50) DEFAULT 'pending',
  analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_model VARCHAR(100),
  analysis_version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table du profil de recommandation
CREATE TABLE IF NOT EXISTS public.user_recommendation_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  top_categories UUID[],
  top_subcategories UUID[],
  preferred_content_types TEXT[],
  total_interactions INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  average_engagement_rate FLOAT DEFAULT 0.0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  last_recommendation_at TIMESTAMP WITH TIME ZONE,
  personalization_level VARCHAR(50) DEFAULT 'low',
  profile_version INTEGER DEFAULT 1,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_calculation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÉTAPE 2: CRÉER LES INDEX
-- ============================================

-- Index pour content_recommendation_rules
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_type ON public.content_recommendation_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_priority ON public.content_recommendation_rules(priority, is_active);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_active ON public.content_recommendation_rules(is_active) WHERE is_active = true;

-- Index pour user_engagement_metrics
CREATE INDEX IF NOT EXISTS idx_engagement_user_id ON public.user_engagement_metrics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_content_id ON public.user_engagement_metrics(content_title_id);
CREATE INDEX IF NOT EXISTS idx_engagement_type ON public.user_engagement_metrics(interaction_type, user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_category ON public.user_engagement_metrics(category_id, user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_subcategory ON public.user_engagement_metrics(subcategory_id, user_id);

-- Index pour content_relevance_scores
CREATE INDEX IF NOT EXISTS idx_relevance_user_score ON public.content_relevance_scores(user_id, final_score DESC, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_relevance_content ON public.content_relevance_scores(content_title_id);
CREATE INDEX IF NOT EXISTS idx_relevance_expires ON public.content_relevance_scores(expires_at) WHERE expires_at IS NOT NULL;

-- Index pour content_suggestions_cache
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON public.content_suggestions_cache(user_id, is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_suggestions_expires ON public.content_suggestions_cache(expires_at) WHERE expires_at IS NOT NULL;

-- Index pour user_social_post_analysis
CREATE INDEX IF NOT EXISTS idx_social_analysis_user ON public.user_social_post_analysis(user_id, analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_analysis_post ON public.user_social_post_analysis(social_post_id);
CREATE INDEX IF NOT EXISTS idx_social_analysis_status ON public.user_social_post_analysis(analysis_status);

-- Index pour user_recommendation_profile
CREATE INDEX IF NOT EXISTS idx_user_recommendation_profile_user ON public.user_recommendation_profile(user_id);

-- ============================================
-- ÉTAPE 3: ACTIVER RLS ET CRÉER LES POLICIES
-- ============================================

-- RLS pour content_recommendation_rules
ALTER TABLE public.content_recommendation_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active recommendation rules" ON public.content_recommendation_rules;
CREATE POLICY "Anyone can view active recommendation rules"
  ON public.content_recommendation_rules
  FOR SELECT
  USING (is_active = true);

-- RLS pour user_engagement_metrics
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own engagement metrics" ON public.user_engagement_metrics;
CREATE POLICY "Users can view own engagement metrics"
  ON public.user_engagement_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own engagement metrics" ON public.user_engagement_metrics;
CREATE POLICY "Users can insert own engagement metrics"
  ON public.user_engagement_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS pour content_relevance_scores
ALTER TABLE public.content_relevance_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own relevance scores" ON public.content_relevance_scores;
CREATE POLICY "Users can view own relevance scores"
  ON public.content_relevance_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS pour content_suggestions_cache
ALTER TABLE public.content_suggestions_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own suggestions cache" ON public.content_suggestions_cache;
CREATE POLICY "Users can view own suggestions cache"
  ON public.content_suggestions_cache
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own suggestions cache" ON public.content_suggestions_cache;
CREATE POLICY "Users can manage own suggestions cache"
  ON public.content_suggestions_cache
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS pour user_social_post_analysis
ALTER TABLE public.user_social_post_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own social post analysis" ON public.user_social_post_analysis;
CREATE POLICY "Users can manage own social post analysis"
  ON public.user_social_post_analysis
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS pour user_recommendation_profile
ALTER TABLE public.user_recommendation_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own recommendation profile" ON public.user_recommendation_profile;
CREATE POLICY "Users can view own recommendation profile"
  ON public.user_recommendation_profile
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recommendation profile" ON public.user_recommendation_profile;
CREATE POLICY "Users can update own recommendation profile"
  ON public.user_recommendation_profile
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ÉTAPE 4: INSÉRER LES RÈGLES PAR DÉFAUT
-- ============================================

-- Règle 1: Priorité MAXIMALE - Catégorie préférée depuis la personnalisation
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Preference Category Priority',
  'preference_based',
  1,
  1.0,
  '{"source": "user_preferences", "field": "preferred_category_id", "operator": "exists"}'::jsonb,
  '{"type": "filter_by_preferred_category", "include_level2": true, "fallback_to_all_subcategories": true, "exclude_liked": true, "priority_order": true}'::jsonb,
  40,
  0.1,
  'Priorise les titres de la catégorie préférée depuis la page de personnalisation (score: 1.0) - PRIORITÉ MAXIMALE'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 2: Titres likés - Contenu similaire dans des sous-catégories proches
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Similar Content from Liked Titles',
  'similarity_based',
  2,
  0.95,
  '{"source": "user_favorites", "field": "item_type", "value": "title", "operator": "has_records", "min_likes": 1}'::jsonb,
  '{"type": "find_similar_by_liked_titles", "find_related_subcategories": true, "include_nearby_subcategories": true, "exclude_liked": true, "max_liked_titles_to_analyze": 20, "subcategory_similarity_threshold": 0.7}'::jsonb,
  35,
  0.2,
  'Propose du contenu similaire dans des sous-catégories proches des titres que l''utilisateur a likés (score: 0.95)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 3: Titres similaires sélectionnés dans la personnalisation
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Similar Titles from Personalization',
  'similarity_based',
  3,
  0.9,
  '{"source": "user_preferences", "field": "similar_titles_ids", "operator": "array_length_greater", "value": 0}'::jsonb,
  '{"type": "find_similar_by_subcategory", "similarity_threshold": 0.8, "exclude_liked": true, "max_similar_titles_to_analyze": 10, "find_related_subcategories": true}'::jsonb,
  30,
  0.2,
  'Trouve des titres similaires basés sur les titres sélectionnés dans la personnalisation (score: 0.9)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 4: Créateurs likés
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Content from Liked Creators',
  'engagement_based',
  4,
  0.9,
  '{"source": "user_favorites", "field": "item_type", "value": "compte", "operator": "has_records", "min_likes": 1}'::jsonb,
  '{"type": "recommend_by_liked_creators", "use_creator_categories": true, "use_creator_subcategories": true, "exclude_liked": true, "max_creators_to_analyze": 15}'::jsonb,
  30,
  0.25,
  'Propose du contenu selon les créateurs de contenu que l''utilisateur a likés (score: 0.9)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 5: Créateurs inspirants depuis la personnalisation
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Inspiring Creators Content',
  'preference_based',
  5,
  0.85,
  '{"source": "user_preferences", "field": "inspiring_creators_ids", "operator": "array_length_greater", "value": 0}'::jsonb,
  '{"type": "filter_by_creator_categories", "use_creator_subcategories": true, "exclude_liked": true, "max_creators_to_analyze": 10}'::jsonb,
  25,
  0.25,
  'Recommandations basées sur les créateurs inspirants sélectionnés dans la personnalisation (score: 0.85)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 6: Catégories likées
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Liked Categories Content',
  'engagement_based',
  6,
  0.8,
  '{"source": "user_favorites", "field": "item_type", "value": "category", "operator": "has_records", "min_likes": 1}'::jsonb,
  '{"type": "recommend_by_liked_categories", "exclude_liked_titles": true, "include_all_subcategories": true, "priority_most_liked_categories": true}'::jsonb,
  40,
  0.3,
  'Propose du contenu selon les catégories que l''utilisateur a likées (score: 0.8)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 7: Sous-catégories likées - Contenu similaire
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Liked Subcategories Similar Content',
  'engagement_based',
  7,
  0.85,
  '{"source": "user_favorites", "field": "item_type", "value": "subcategory", "operator": "has_records", "min_likes": 1}'::jsonb,
  '{"type": "recommend_by_liked_subcategories", "find_related_subcategories": true, "include_same_category": true, "exclude_liked": true, "subcategory_similarity_threshold": 0.6}'::jsonb,
  30,
  0.25,
  'Propose du contenu dans des sous-catégories proches de celles que l''utilisateur a likées (score: 0.85)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 8: Recherches de l'utilisateur
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Search History Based',
  'engagement_based',
  8,
  0.7,
  '{"source": "search_history", "min_searches": 1, "lookback_days": 30}'::jsonb,
  '{"type": "recommend_by_search_keywords", "extract_keywords": true, "min_keyword_length": 3, "max_keywords": 5, "exclude_liked": true, "weight_recent_searches": true, "recent_days": 7}'::jsonb,
  30,
  0.3,
  'Propose du contenu selon les recherches de l''utilisateur (score: 0.7)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 9: Défis notés/sélectionnés
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'User Challenges Based',
  'engagement_based',
  9,
  0.75,
  '{"source": "user_challenges", "min_challenges": 1, "include_active": true, "include_completed": true}'::jsonb,
  '{"type": "recommend_by_challenges", "match_challenge_categories": true, "match_challenge_themes": true, "exclude_liked": true, "weight_active_challenges": true}'::jsonb,
  25,
  0.3,
  'Propose du contenu selon les défis que l''utilisateur a notés/sélectionnés (score: 0.75)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 10: Engagement général
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'General Engagement Based',
  'engagement_based',
  10,
  0.65,
  '{"source": "user_engagement_metrics", "min_interactions": 5, "lookback_days": 30}'::jsonb,
  '{"type": "recommend_by_engagement", "lookback_days": 30, "weight_likes": 2.0, "weight_views": 1.0, "weight_favorites": 2.5, "exclude_negative": true, "focus_on_high_engagement_categories": true}'::jsonb,
  20,
  0.35,
  'Recommandations basées sur l''historique d''engagement général (score: 0.65)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- Règle 11: Contenu tendance (fallback)
INSERT INTO public.content_recommendation_rules (
  rule_name, rule_type, priority, weight, conditions, action, max_results, min_relevance_score, description
) VALUES (
  'Trending Content Fallback',
  'trending',
  15,
  0.4,
  '{"source": "system", "always_apply": true, "apply_only_if_needed": true, "min_previous_recommendations": 20}'::jsonb,
  '{"type": "get_trending", "lookback_days": 7, "min_engagement": 10, "order_by": "created_at", "exclude_liked": true}'::jsonb,
  10,
  0.0,
  'Complète avec du contenu tendance si pas assez de recommandations personnalisées (score: 0.4)'
) ON CONFLICT (rule_name) DO UPDATE SET
  rule_type = EXCLUDED.rule_type,
  priority = EXCLUDED.priority,
  weight = EXCLUDED.weight,
  conditions = EXCLUDED.conditions,
  action = EXCLUDED.action,
  max_results = EXCLUDED.max_results,
  min_relevance_score = EXCLUDED.min_relevance_score,
  description = EXCLUDED.description;

-- ============================================
-- ÉTAPE 5: CRÉER LES FONCTIONS ET TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_content_recommendation_rules_updated_at ON public.content_recommendation_rules;
CREATE TRIGGER update_content_recommendation_rules_updated_at
  BEFORE UPDATE ON public.content_recommendation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_social_post_analysis_updated_at ON public.user_social_post_analysis;
CREATE TRIGGER update_user_social_post_analysis_updated_at
  BEFORE UPDATE ON public.user_social_post_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_recommendation_profile_updated_at ON public.user_recommendation_profile;
CREATE TRIGGER update_user_recommendation_profile_updated_at
  BEFORE UPDATE ON public.user_recommendation_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour nettoyer les caches expirés
CREATE OR REPLACE FUNCTION public.cleanup_expired_caches()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.content_suggestions_cache
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM public.content_relevance_scores
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ✅ SCRIPT TERMINÉ AVEC SUCCÈS
-- ============================================
-- 
-- Vérifiez que tout est créé avec:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND (table_name LIKE 'content_recommendation%' 
--   OR table_name LIKE 'user_engagement%' 
--   OR table_name LIKE 'user_recommendation%')
-- ORDER BY table_name;
--
-- Voir les règles:
-- SELECT rule_name, priority, weight, is_active 
-- FROM public.content_recommendation_rules 
-- ORDER BY priority;

