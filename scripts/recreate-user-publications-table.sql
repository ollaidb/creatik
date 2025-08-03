-- Script complet pour recréer la table user_publications
-- Date: 2025-01-27
-- Ce script supprime et recrée complètement la table user_publications

-- =====================================================
-- ÉTAPE 1: SUPPRIMER LA TABLE EXISTANTE
-- =====================================================

-- Supprimer les triggers existants
DROP TRIGGER IF EXISTS trigger_update_user_publications_updated_at ON user_publications;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS update_user_publications_updated_at();

-- Supprimer les politiques RLS existantes
DROP POLICY IF EXISTS "Users can view their own publications" ON user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON user_publications;

-- Supprimer la table user_publications
DROP TABLE IF EXISTS user_publications CASCADE;

-- =====================================================
-- ÉTAPE 2: CRÉER LA NOUVELLE TABLE
-- =====================================================

-- Créer la table user_publications avec la structure correcte
CREATE TABLE user_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    platform VARCHAR(100),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÉTAPE 3: CRÉER LES INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index sur user_id pour les requêtes par utilisateur
CREATE INDEX idx_user_publications_user_id ON user_publications(user_id);

-- Index sur content_type pour filtrer par type de contenu
CREATE INDEX idx_user_publications_content_type ON user_publications(content_type);

-- Index sur status pour filtrer par statut
CREATE INDEX idx_user_publications_status ON user_publications(status);

-- Index sur created_at pour le tri chronologique
CREATE INDEX idx_user_publications_created_at ON user_publications(created_at DESC);

-- Index composite pour les requêtes fréquentes
CREATE INDEX idx_user_publications_user_status ON user_publications(user_id, status);

-- =====================================================
-- ÉTAPE 4: CRÉER LES TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_user_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER trigger_update_user_publications_updated_at
    BEFORE UPDATE ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION update_user_publications_updated_at();

-- =====================================================
-- ÉTAPE 5: ACTIVER ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur la table
ALTER TABLE user_publications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ÉTAPE 6: CRÉER LES POLITIQUES RLS
-- =====================================================

-- Politique pour permettre aux utilisateurs de voir leurs propres publications
CREATE POLICY "Users can view their own publications" 
    ON user_publications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres publications
CREATE POLICY "Users can create their own publications" 
    ON user_publications 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres publications
CREATE POLICY "Users can update their own publications" 
    ON user_publications 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres publications
CREATE POLICY "Users can delete their own publications" 
    ON user_publications 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- =====================================================
-- ÉTAPE 7: CRÉER DES DONNÉES DE TEST
-- =====================================================

-- Insérer quelques publications de test pour l'utilisateur par défaut
INSERT INTO user_publications (user_id, content_type, title, description, platform, status) 
SELECT 
    u.id as user_id,
    'title' as content_type,
    'Titre de test ' || generate_series(1, 5) as title,
    'Description de test pour publication ' || generate_series(1, 5) as description,
    'Instagram' as platform,
    'approved' as status
FROM auth.users u 
WHERE u.email = 'collabbinta@gmail.com'
LIMIT 1;

-- Insérer quelques publications de type 'account'
INSERT INTO user_publications (user_id, content_type, title, description, platform, status) 
SELECT 
    u.id as user_id,
    'account' as content_type,
    'Compte de test ' || generate_series(1, 3) as title,
    'Compte exemplaire pour inspiration' as description,
    'TikTok' as platform,
    'approved' as status
FROM auth.users u 
WHERE u.email = 'collabbinta@gmail.com'
LIMIT 1;

-- =====================================================
-- ÉTAPE 8: VÉRIFICATIONS
-- =====================================================

-- Vérifier que la table a été créée correctement
SELECT 
    'Table créée' as status,
    COUNT(*) as total_publications
FROM user_publications;

-- Vérifier les politiques RLS
SELECT 
    'Politiques RLS' as check_type,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'user_publications';

-- Vérifier les index
SELECT 
    'Index créés' as check_type,
    COUNT(*) as total_indexes
FROM pg_indexes 
WHERE tablename = 'user_publications';

-- Vérifier les triggers
SELECT 
    'Triggers créés' as check_type,
    COUNT(*) as total_triggers
FROM information_schema.triggers 
WHERE event_object_table = 'user_publications';

-- Afficher quelques exemples de publications créées
SELECT 
    id,
    user_id,
    content_type,
    title,
    platform,
    status,
    created_at
FROM user_publications 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- ÉTAPE 9: MESSAGE DE CONFIRMATION
-- =====================================================

SELECT 
    '✅ TABLE USER_PUBLICATIONS RECRÉÉE AVEC SUCCÈS' as status,
    'Structure: Complète avec tous les champs nécessaires' as structure,
    'Sécurité: RLS activé avec politiques utilisateur' as security,
    'Performance: Index optimisés pour les requêtes' as performance,
    'Test: Données de test insérées' as test_data; 