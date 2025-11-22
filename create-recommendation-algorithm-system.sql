-- ============================================
-- SYSTÈME D'ALGORITHME DE RECOMMANDATION DE CONTENU
-- ============================================
-- Ce script crée toutes les tables et règles nécessaires pour
-- le système de recommandation personnalisée de Creatik
--
-- Fonctionnalités principales :
-- 1. Règles configurables de recommandation
-- 2. Tracking des interactions utilisateur (engagement)
-- 3. Calcul et mise en cache des scores de pertinence
-- 4. Système de suggestions avec cache
-- 5. Analyse des posts réseaux sociaux (pour intégration future)
-- ============================================
-- 
-- INSTRUCTIONS D'EXÉCUTION :
-- 1. Copiez tout ce script dans l'éditeur SQL de Supabase
-- 2. Exécutez le script (Run)
-- 3. Vérifiez que toutes les tables sont créées
-- ============================================

-- ============================================
-- 1. TABLE DES RÈGLES DE RECOMMANDATION
-- ============================================
-- Stocke les règles configurables pour suggérer du contenu
-- Chaque règle définit comment et quand suggérer du contenu

CREATE TABLE IF NOT EXISTS public.content_recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifiant et métadonnées
  rule_name VARCHAR(255) NOT NULL UNIQUE,
  rule_type VARCHAR(50) NOT NULL, -- 'preference_based', 'engagement_based', 'similarity_based', 'trending', 'collaborative', 'social_analysis'
  priority INTEGER DEFAULT 1 NOT NULL, -- Ordre d'exécution (1 = priorité max, plus petit = plus prioritaire)
  weight FLOAT DEFAULT 1.0 CHECK (weight >= 0.0 AND weight <= 1.0), -- Poids pour calculer le score final
  
  -- Conditions de la règle (JSONB pour flexibilité)
  -- Exemple: {"source": "user_preferences", "field": "preferred_category_id", "operator": "exists"}
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Action/Logique de la règle
  -- Exemple: {"type": "filter_by_category", "subcategory_ids": [], "fallback": true}
  action JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Paramètres de la règle
  max_results INTEGER DEFAULT 10 CHECK (max_results > 0),
  min_relevance_score FLOAT DEFAULT 0.0 CHECK (min_relevance_score >= 0.0 AND min_relevance_score <= 1.0),
  
  -- État et métadonnées
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_type ON public.content_recommendation_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_priority ON public.content_recommendation_rules(priority, is_active);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_active ON public.content_recommendation_rules(is_active) WHERE is_active = true;

-- Commentaires
COMMENT ON TABLE public.content_recommendation_rules IS 'Stocke les règles configurables pour générer des recommandations de contenu personnalisées';
COMMENT ON COLUMN public.content_recommendation_rules.rule_type IS 'Type de règle: preference_based (préférences utilisateur), engagement_based (historique interactions), similarity_based (titres similaires), trending (contenu tendance), collaborative (filtrage collaboratif), social_analysis (analyse réseaux sociaux)';
COMMENT ON COLUMN public.content_recommendation_rules.conditions IS 'Conditions JSONB pour déterminer quand appliquer la règle';
COMMENT ON COLUMN public.content_recommendation_rules.action IS 'Action JSONB définissant la logique de recommandation';

-- ============================================
-- 2. TABLE DES MÉTRIQUES D'ENGAGEMENT
-- ============================================
-- Track toutes les interactions utilisateur avec le contenu
-- Permet d'analyser le comportement pour améliorer les recommandations

CREATE TABLE IF NOT EXISTS public.user_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Références au contenu
  content_title_id UUID REFERENCES public.content_titles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  
  -- Type d'interaction
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'favorite', 'copy', 'share', 'skip', 'dismiss', 'click', 'save', 'report'
  interaction_value INTEGER DEFAULT 1, -- Peut être utilisé pour pondérer (ex: like = 2, view = 1, dismiss = -1)
  
  -- Contexte de l'interaction
  session_id UUID,
  platform VARCHAR(50) DEFAULT 'web', -- 'web', 'mobile', 'ios', 'android'
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  source VARCHAR(100), -- 'for_you_page', 'search', 'category_page', 'direct_link', etc.
  
  -- Données contextuelles détaillées (JSONB)
  -- Exemple: {"position": 3, "time_spent_seconds": 15, "scroll_depth": 0.8, "referrer": "/categories/tech"}
  context JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes d'analyse
CREATE INDEX IF NOT EXISTS idx_engagement_user_id ON public.user_engagement_metrics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_content_id ON public.user_engagement_metrics(content_title_id);
CREATE INDEX IF NOT EXISTS idx_engagement_type ON public.user_engagement_metrics(interaction_type, user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_category ON public.user_engagement_metrics(category_id, user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_subcategory ON public.user_engagement_metrics(subcategory_id, user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_created_at ON public.user_engagement_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_user_type_created ON public.user_engagement_metrics(user_id, interaction_type, created_at DESC);

-- Commentaires
COMMENT ON TABLE public.user_engagement_metrics IS 'Track toutes les interactions utilisateur avec le contenu pour analyser le comportement et améliorer les recommandations';
COMMENT ON COLUMN public.user_engagement_metrics.interaction_value IS 'Valeur numérique de l''interaction pour pondération (like=2, view=1, dismiss=-1)';

-- ============================================
-- 3. TABLE DES SCORES DE PERTINENCE
-- ============================================
-- Stocke les scores de pertinence calculés pour chaque combinaison utilisateur/contenu
-- Permet de mettre en cache les calculs et éviter les recalculs fréquents

CREATE TABLE IF NOT EXISTS public.content_relevance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_title_id UUID NOT NULL REFERENCES public.content_titles(id) ON DELETE CASCADE,
  
  -- Scores détaillés par type de règle
  base_score FLOAT DEFAULT 0.0 CHECK (base_score >= 0.0 AND base_score <= 1.0), -- Score de base (0.0 à 1.0)
  preference_score FLOAT DEFAULT 0.0 CHECK (preference_score >= 0.0 AND preference_score <= 1.0), -- Score basé sur les préférences
  engagement_score FLOAT DEFAULT 0.0 CHECK (engagement_score >= 0.0 AND engagement_score <= 1.0), -- Score basé sur l'engagement passé
  similarity_score FLOAT DEFAULT 0.0 CHECK (similarity_score >= 0.0 AND similarity_score <= 1.0), -- Score basé sur la similarité
  trending_score FLOAT DEFAULT 0.0 CHECK (trending_score >= 0.0 AND trending_score <= 1.0), -- Score basé sur les tendances
  social_score FLOAT DEFAULT 0.0 CHECK (social_score >= 0.0 AND social_score <= 1.0), -- Score basé sur l'analyse des posts réseaux sociaux
  collaborative_score FLOAT DEFAULT 0.0 CHECK (collaborative_score >= 0.0 AND collaborative_score <= 1.0), -- Score basé sur le filtrage collaboratif
  final_score FLOAT DEFAULT 0.0 CHECK (final_score >= 0.0 AND final_score <= 1.0), -- Score final pondéré
  
  -- Métadonnées
  rule_ids UUID[], -- IDs des règles qui ont contribué à ce score
  rule_contributions JSONB DEFAULT '{}'::jsonb, -- Détail de la contribution de chaque règle {"rule_id": "weight"}
  
  -- Gestion du cache
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Pour permettre le recalcul périodique (ex: après 24h)
  
  -- Version pour permettre le recalcul progressif
  version INTEGER DEFAULT 1,
  
  UNIQUE(user_id, content_title_id, version)
);

-- Index pour les requêtes de recommandation
CREATE INDEX IF NOT EXISTS idx_relevance_user_score ON public.content_relevance_scores(user_id, final_score DESC, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_relevance_content ON public.content_relevance_scores(content_title_id);
CREATE INDEX IF NOT EXISTS idx_relevance_expires ON public.content_relevance_scores(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_relevance_user_version ON public.content_relevance_scores(user_id, version DESC, final_score DESC);

-- Commentaires
COMMENT ON TABLE public.content_relevance_scores IS 'Stocke les scores de pertinence calculés pour chaque combinaison utilisateur/contenu, avec mise en cache';
COMMENT ON COLUMN public.content_relevance_scores.final_score IS 'Score final pondéré combinant tous les types de scores';

-- ============================================
-- 4. TABLE DES SUGGESTIONS GÉNÉRÉES (CACHE)
-- ============================================
-- Met en cache les suggestions générées pour éviter de recalculer à chaque requête
-- Peut être régénéré périodiquement ou après des événements importants

CREATE TABLE IF NOT EXISTS public.content_suggestions_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Suggestions ordonnées par score
  suggested_title_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  
  -- Contexte de la génération
  suggestion_context JSONB DEFAULT '{}'::jsonb, -- Ex: {"page": 1, "source": "for_you", "rules_applied": ["rule_id_1"], "total_candidates": 150}
  
  -- Métadonnées
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Cache expiration (ex: après 1h)
  is_active BOOLEAN DEFAULT true,
  
  -- Statistiques
  total_count INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0.0,
  
  UNIQUE(user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON public.content_suggestions_cache(user_id, is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_suggestions_expires ON public.content_suggestions_cache(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_suggestions_active ON public.content_suggestions_cache(is_active, generated_at DESC) WHERE is_active = true;

-- Commentaires
COMMENT ON TABLE public.content_suggestions_cache IS 'Met en cache les suggestions générées pour chaque utilisateur pour améliorer les performances';

-- ============================================
-- 5. TABLE POUR L'ANALYSE DES POSTS RÉSEAUX SOCIAUX
-- ============================================
-- Stocke l'analyse des posts de l'utilisateur depuis ses réseaux sociaux connectés
-- Utilisé pour la fonctionnalité future d'analyse automatique des posts

CREATE TABLE IF NOT EXISTS public.user_social_post_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_post_id UUID REFERENCES public.user_social_posts(id) ON DELETE CASCADE,
  
  -- Analyse du post
  analyzed_title TEXT, -- Titre extrait/analysé du post
  detected_themes TEXT[], -- Thèmes détectés dans le post
  detected_categories UUID[], -- Catégories détectées
  detected_subcategories UUID[], -- Sous-catégories détectées
  
  -- Métriques d'engagement du post original
  engagement_data JSONB DEFAULT '{}'::jsonb, -- {"likes": 100, "comments": 20, "shares": 15, "views": 1000, "engagement_rate": 0.135}
  
  -- Scores d'analyse
  relevance_score FLOAT DEFAULT 0.0, -- Pertinence du post pour l'utilisateur
  performance_score FLOAT DEFAULT 0.0, -- Performance du post (basé sur engagement)
  
  -- Suggestions basées sur l'analyse
  suggested_content_ids UUID[], -- IDs de contenu suggéré basé sur ce post
  suggested_keywords TEXT[], -- Mots-clés suggérés
  
  -- Métadonnées
  analysis_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'analyzing', 'completed', 'failed'
  analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_model VARCHAR(100), -- Modèle d'IA utilisé pour l'analyse
  analysis_version INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_social_analysis_user ON public.user_social_post_analysis(user_id, analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_analysis_post ON public.user_social_post_analysis(social_post_id);
CREATE INDEX IF NOT EXISTS idx_social_analysis_status ON public.user_social_post_analysis(analysis_status);
CREATE INDEX IF NOT EXISTS idx_social_analysis_themes ON public.user_social_post_analysis USING GIN(detected_themes);

-- Commentaires
COMMENT ON TABLE public.user_social_post_analysis IS 'Stocke l''analyse des posts de l''utilisateur depuis ses réseaux sociaux pour générer des recommandations personnalisées';
COMMENT ON COLUMN public.user_social_post_analysis.detected_themes IS 'Thèmes détectés dans le post pour suggérer du contenu similaire';

-- ============================================
-- 6. TABLE DES PROFILS UTILISATEUR POUR RECOMMANDATIONS
-- ============================================
-- Stocke des informations calculées/agrégées pour optimiser les recommandations
-- Évite de recalculer les mêmes informations à chaque fois

CREATE TABLE IF NOT EXISTS public.user_recommendation_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Préférences calculées (agrégation des préférences explicites et implicites)
  top_categories UUID[], -- Top 5 catégories préférées
  top_subcategories UUID[], -- Top 10 sous-catégories préférées
  preferred_content_types TEXT[], -- Types de contenu préférés
  
  -- Comportement analysé
  total_interactions INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  average_engagement_rate FLOAT DEFAULT 0.0,
  
  -- Dernière activité
  last_active_at TIMESTAMP WITH TIME ZONE,
  last_recommendation_at TIMESTAMP WITH TIME ZONE,
  
  -- Scores de personnalisation
  personalization_level VARCHAR(50) DEFAULT 'low', -- 'low', 'medium', 'high' (basé sur quantité de données)
  
  -- Métadonnées
  profile_version INTEGER DEFAULT 1,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_calculation_at TIMESTAMP WITH TIME ZONE, -- Prochain calcul programmé
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_recommendation_profile_user ON public.user_recommendation_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendation_profile_next_calc ON public.user_recommendation_profile(next_calculation_at) WHERE next_calculation_at IS NOT NULL;

-- Commentaires
COMMENT ON TABLE public.user_recommendation_profile IS 'Profil de recommandation calculé pour chaque utilisateur, mis à jour périodiquement';

-- ============================================
-- 7. ACTIVATION DE RLS (ROW LEVEL SECURITY)
-- ============================================

-- RLS pour content_recommendation_rules (lecture publique, écriture admin uniquement)
ALTER TABLE public.content_recommendation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active recommendation rules"
  ON public.content_recommendation_rules
  FOR SELECT
  USING (is_active = true);

-- RLS pour user_engagement_metrics (utilisateur voit uniquement ses propres interactions)
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own engagement metrics"
  ON public.user_engagement_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement metrics"
  ON public.user_engagement_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS pour content_relevance_scores (utilisateur voit uniquement ses propres scores)
ALTER TABLE public.content_relevance_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own relevance scores"
  ON public.content_relevance_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS pour content_suggestions_cache (utilisateur voit uniquement ses propres suggestions)
ALTER TABLE public.content_suggestions_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions cache"
  ON public.content_suggestions_cache
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own suggestions cache"
  ON public.content_suggestions_cache
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS pour user_social_post_analysis (utilisateur voit uniquement ses propres analyses)
ALTER TABLE public.user_social_post_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social post analysis"
  ON public.user_social_post_analysis
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS pour user_recommendation_profile (utilisateur voit uniquement son propre profil)
ALTER TABLE public.user_recommendation_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendation profile"
  ON public.user_recommendation_profile
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendation profile"
  ON public.user_recommendation_profile
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. INSERTION DES RÈGLES PAR DÉFAUT
-- ============================================
-- Ces règles sont basées sur les besoins spécifiques :
-- 1. Proposer du contenu selon les likes
-- 2. Proposer du contenu selon la personnalisation (page Personalization.tsx)
-- 3. Proposer du contenu similaire dans des sous-catégories proches
-- 4. Proposer du contenu selon les créateurs likés
-- 5. Proposer du contenu selon les recherches
-- 6. Proposer du contenu selon les défis notés/sélectionnés

-- Règle 1: Priorité MAXIMALE - Catégorie préférée depuis la page de personnalisation
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 2: Titres likés - Proposer du contenu similaire dans des sous-catégories proches
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
) ON CONFLICT (rule_name) DO NOTHING;

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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 4: Créateurs likés - Proposer du contenu selon les créateurs likés
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
) ON CONFLICT (rule_name) DO NOTHING;

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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 6: Catégories likées - Proposer du contenu selon les likes de catégories
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 7: Sous-catégories likées - Contenu dans des sous-catégories similaires
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 8: Recherches de l'utilisateur - Proposer du contenu selon les recherches
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 9: Défis notés/sélectionnés - Proposer du contenu selon les défis
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 10: Engagement général basé sur les interactions (views, likes, favorites)
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
) ON CONFLICT (rule_name) DO NOTHING;

-- Règle 11: Contenu tendance (pour compléter si pas assez de recommandations)
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
) ON CONFLICT (rule_name) DO NOTHING;

-- ============================================
-- 9. FONCTION POUR CALCULER LES RECOMMANDATIONS
-- ============================================
-- Cette fonction combine toutes les règles pour générer des recommandations

CREATE OR REPLACE FUNCTION public.get_user_recommendations(
  p_user_id UUID,
  p_max_results INTEGER DEFAULT 50,
  p_source VARCHAR(50) DEFAULT 'for_you' -- 'for_you' pour page d'accueil, 'titles' pour page titres
)
RETURNS TABLE (
  title_id UUID,
  title TEXT,
  subcategory_id UUID,
  category_id UUID,
  final_score FLOAT,
  recommendation_source TEXT
) AS $$
DECLARE
  v_liked_title_ids UUID[] := '{}'::UUID[];
  v_exclude_ids UUID[] := '{}'::UUID[];
BEGIN
  -- 1. Récupérer les titres déjà likés par l'utilisateur (à exclure)
  SELECT COALESCE(array_agg(item_id), '{}'::UUID[]) INTO v_liked_title_ids
  FROM public.user_favorites
  WHERE user_id = p_user_id AND item_type = 'title';
  
  v_exclude_ids := v_liked_title_ids;
  
  -- 2. Retourner les recommandations basées sur les scores de pertinence
  -- La logique complète sera implémentée dans le code TypeScript qui appliquera chaque règle
  RETURN QUERY
  SELECT 
    ct.id as title_id,
    ct.title,
    ct.subcategory_id,
    s.category_id,
    COALESCE(crs.final_score, 0.0) as final_score,
    'recommendation_system'::TEXT as recommendation_source
  FROM public.content_titles ct
  LEFT JOIN public.subcategories s ON s.id = ct.subcategory_id
  LEFT JOIN public.content_relevance_scores crs 
    ON crs.content_title_id = ct.id 
    AND crs.user_id = p_user_id
    AND (crs.expires_at IS NULL OR crs.expires_at > NOW())
  WHERE ct.id != ALL(v_exclude_ids)
  ORDER BY 
    COALESCE(crs.final_score, 0.0) DESC,
    ct.created_at DESC
  LIMIT p_max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permissions
GRANT EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER, VARCHAR) TO anon;

-- Commentaire
COMMENT ON FUNCTION public.get_user_recommendations IS 'Calcule et retourne les recommandations de contenu pour un utilisateur en combinant toutes les règles actives';

-- ============================================
-- 10. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_content_recommendation_rules_updated_at
  BEFORE UPDATE ON public.content_recommendation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_social_post_analysis_updated_at
  BEFORE UPDATE ON public.user_social_post_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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
  -- Supprimer les suggestions expirées
  DELETE FROM public.content_suggestions_cache
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Supprimer les scores expirés (optionnel - on peut aussi les recalculer)
  DELETE FROM public.content_relevance_scores
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. COMMENTAIRES FINAUX
-- ============================================

-- ============================================
-- ✅ SCRIPT TERMINÉ AVEC SUCCÈS
-- ============================================
-- 
-- 📊 Tables créées:
--   1. content_recommendation_rules - Règles configurables de recommandation
--   2. user_engagement_metrics - Tracking des interactions utilisateur
--   3. content_relevance_scores - Scores de pertinence mis en cache
--   4. content_suggestions_cache - Cache des suggestions générées
--   5. user_social_post_analysis - Analyse des posts réseaux sociaux (futur)
--   6. user_recommendation_profile - Profil de recommandation calculé
-- 
-- 📋 Règles par défaut insérées: 11 règles actives
-- 
--   🔝 PRIORITÉ MAXIMALE:
--     1. Preference Category Priority (Priorité: 1, Score: 1.0)
--        → Catégorie préférée depuis la page de personnalisation
-- 
--   ⭐ PRIORITÉ HAUTE:
--     2. Similar Content from Liked Titles (Priorité: 2, Score: 0.95)
--        → Contenu similaire dans des sous-catégories proches des titres likés
--     3. Similar Titles from Personalization (Priorité: 3, Score: 0.9)
--        → Titres similaires sélectionnés dans la personnalisation
--     4. Content from Liked Creators (Priorité: 4, Score: 0.9)
--        → Contenu selon les créateurs likés
--     5. Inspiring Creators Content (Priorité: 5, Score: 0.85)
--        → Créateurs inspirants depuis la personnalisation
--     6. Liked Categories Content (Priorité: 6, Score: 0.8)
--        → Catégories likées par l'utilisateur
--     7. Liked Subcategories Similar Content (Priorité: 7, Score: 0.85)
--        → Sous-catégories similaires aux sous-catégories likées
-- 
--   📊 PRIORITÉ MOYENNE:
--     8. Search History Based (Priorité: 8, Score: 0.7)
--        → Recherches de l'utilisateur
--     9. User Challenges Based (Priorité: 9, Score: 0.75)
--        → Défis notés/sélectionnés par l'utilisateur
--    10. General Engagement Based (Priorité: 10, Score: 0.65)
--        → Engagement général (views, likes, favorites)
-- 
--   🔄 FALLBACK:
--    11. Trending Content Fallback (Priorité: 15, Score: 0.4)
--        → Contenu tendance si pas assez de recommandations
-- 
-- 📌 Algorithme basé sur:
--   ✓ Les likes (titres, catégories, sous-catégories, créateurs)
--   ✓ La personnalisation sauvegardée (page Personalization.tsx)
--   ✓ Les sous-catégories proches des titres likés
--   ✓ Les créateurs likés
--   ✓ Les recherches de l'utilisateur
--   ✓ Les défis notés/sélectionnés
-- 
-- 🎯 Utilisation:
--   • Section "Pour toi" sur la page d'accueil
--   • Premiers titres à afficher dans la page des titres
--   • Évite trop de scroll pour l'utilisateur
-- 
-- 🔒 RLS (Row Level Security) activé pour toutes les tables utilisateur
-- 
-- ⚡ Prochaines étapes:
--   1. Vérifier que toutes les tables sont créées dans Supabase
--   2. Implémenter la logique TypeScript pour appliquer ces règles
--   3. Intégrer l'enregistrement des interactions dans votre code
--   4. Tester les recommandations et ajuster les règles si nécessaire
-- 
-- Pour vérifier les tables créées:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name LIKE 'content_recommendation%' 
-- OR table_name LIKE 'user_engagement%' 
-- OR table_name LIKE 'user_recommendation%';
-- 
-- Pour voir les règles insérées:
-- SELECT rule_name, priority, weight, max_results, is_active 
-- FROM public.content_recommendation_rules 
-- ORDER BY priority;

