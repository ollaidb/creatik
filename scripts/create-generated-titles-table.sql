-- Script pour créer la table generated_titles
-- Cette table va sauvegarder définitivement tous les titres générés
-- Exécutez ce script dans Supabase SQL Editor

-- ========================================
-- 1. CRÉER LA TABLE generated_titles
-- ========================================

CREATE TABLE IF NOT EXISTS generated_titles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch', 'all')),
    subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    subject_word TEXT,
    verb_word TEXT,
    complement_word TEXT,
    twist_word TEXT,
    generation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CRÉER LES INDEX POUR LES PERFORMANCES
-- ========================================

-- Index pour filtrer par plateforme
CREATE INDEX IF NOT EXISTS idx_generated_titles_platform ON generated_titles(platform);

-- Index pour filtrer par sous-catégorie
CREATE INDEX IF NOT EXISTS idx_generated_titles_subcategory ON generated_titles(subcategory_id);

-- Index pour filtrer par plateforme ET sous-catégorie
CREATE INDEX IF NOT EXISTS idx_generated_titles_platform_subcategory ON generated_titles(platform, subcategory_id);

-- Index pour les titres actifs
CREATE INDEX IF NOT EXISTS idx_generated_titles_active ON generated_titles(is_active) WHERE is_active = TRUE;

-- Index pour la date de génération
CREATE INDEX IF NOT EXISTS idx_generated_titles_generation_date ON generated_titles(generation_date);

-- ========================================
-- 3. CRÉER UNE FONCTION POUR GÉNÉRER DES TITRES
-- ========================================

CREATE OR REPLACE FUNCTION generate_and_save_titles(
    p_platform VARCHAR(50),
    p_subcategory_id UUID,
    p_count INTEGER DEFAULT 10
) RETURNS INTEGER AS $$
DECLARE
    v_subject_words TEXT[];
    v_verb_words TEXT[];
    v_complement_words TEXT[];
    v_twist_words TEXT[];
    v_subject_word TEXT;
    v_verb_word TEXT;
    v_complement_word TEXT;
    v_twist_word TEXT;
    v_generated_title TEXT;
    v_generated_count INTEGER := 0;
    v_existing_title_count INTEGER;
BEGIN
    -- Récupérer les mots pour cette plateforme et sous-catégorie
    SELECT words INTO v_subject_words
    FROM word_blocks 
    WHERE platform = p_platform 
    AND subcategory_id = p_subcategory_id 
    AND category = 'subject'
    LIMIT 1;
    
    SELECT words INTO v_verb_words
    FROM word_blocks 
    WHERE platform = p_platform 
    AND subcategory_id = p_subcategory_id 
    AND category = 'verb'
    LIMIT 1;
    
    SELECT words INTO v_complement_words
    FROM word_blocks 
    WHERE platform = p_platform 
    AND subcategory_id = p_subcategory_id 
    AND category = 'complement'
    LIMIT 1;
    
    SELECT words INTO v_twist_words
    FROM word_blocks 
    WHERE platform = p_platform 
    AND subcategory_id = p_subcategory_id 
    AND category = 'twist'
    LIMIT 1;
    
    -- Vérifier qu'on a des mots pour toutes les catégories
    IF v_subject_words IS NULL OR v_verb_words IS NULL OR v_complement_words IS NULL OR v_twist_words IS NULL THEN
        RAISE EXCEPTION 'Mots manquants pour la plateforme % et sous-catégorie %', p_platform, p_subcategory_id;
    END IF;
    
    -- Générer p_count titres
    FOR i IN 1..p_count LOOP
        -- Sélectionner des mots aléatoirement
        v_subject_word := v_subject_words[1 + floor(random() * array_length(v_subject_words, 1))];
        v_verb_word := v_verb_words[1 + floor(random() * array_length(v_verb_words, 1))];
        v_complement_word := v_complement_words[1 + floor(random() * array_length(v_complement_words, 1))];
        v_twist_word := v_twist_words[1 + floor(random() * array_length(v_twist_words, 1))];
        
        -- Construire le titre
        v_generated_title := v_twist_word || ' ' || v_subject_word || ' ' || v_verb_word || ' ' || v_complement_word;
        
        -- Vérifier si ce titre existe déjà
        SELECT COUNT(*) INTO v_existing_title_count
        FROM generated_titles
        WHERE title = v_generated_title 
        AND platform = p_platform 
        AND subcategory_id = p_subcategory_id;
        
        -- Insérer seulement si le titre n'existe pas déjà
        IF v_existing_title_count = 0 THEN
            INSERT INTO generated_titles (
                title, 
                platform, 
                subcategory_id, 
                subject_word, 
                verb_word, 
                complement_word, 
                twist_word
            ) VALUES (
                v_generated_title,
                p_platform,
                p_subcategory_id,
                v_subject_word,
                v_verb_word,
                v_complement_word,
                v_twist_word
            );
            v_generated_count := v_generated_count + 1;
        END IF;
    END LOOP;
    
    RETURN v_generated_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 4. CRÉER UNE FONCTION POUR RÉCUPÉRER DES TITRES
-- ========================================

CREATE OR REPLACE FUNCTION get_generated_titles(
    p_platform VARCHAR(50),
    p_subcategory_id UUID,
    p_limit INTEGER DEFAULT 20
) RETURNS TABLE (
    id UUID,
    title TEXT,
    platform VARCHAR(50),
    subcategory_id UUID,
    generation_date TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gt.id,
        gt.title,
        gt.platform,
        gt.subcategory_id,
        gt.generation_date,
        gt.usage_count
    FROM generated_titles gt
    WHERE gt.platform = p_platform
    AND gt.subcategory_id = p_subcategory_id
    AND gt.is_active = TRUE
    ORDER BY gt.generation_date DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. CRÉER UN TRIGGER POUR METTRE À JOUR updated_at
-- ========================================

CREATE OR REPLACE FUNCTION update_generated_titles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_generated_titles_updated_at
    BEFORE UPDATE ON generated_titles
    FOR EACH ROW
    EXECUTE FUNCTION update_generated_titles_updated_at();

-- ========================================
-- 6. VÉRIFICATION DE LA CRÉATION
-- ========================================

-- Vérifier que la table a été créée
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generated_titles') 
    THEN '✅ Table generated_titles créée avec succès'
    ELSE '❌ Erreur lors de la création de generated_titles'
  END as status;

-- Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'generated_titles'
ORDER BY ordinal_position;

-- Vérifier les index créés
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'generated_titles'
ORDER BY indexname; 