-- Script de migration des publications vers user_publications
-- Ce script va migrer toutes les publications existantes de content_titles et exemplary_accounts
-- vers la table user_publications pour qu'elles s'affichent dans la page Publications

-- 1. Vérifier si la table user_publications existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'user_publications'
) as table_exists;

-- 2. Si la table n'existe pas, la créer avec user_id nullable
CREATE TABLE IF NOT EXISTS user_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    platform VARCHAR(50),
    status VARCHAR(20) DEFAULT 'approved',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Si la table existe déjà, modifier user_id pour permettre NULL
ALTER TABLE user_publications ALTER COLUMN user_id DROP NOT NULL;

-- 4. Créer un index sur user_id pour les performances
CREATE INDEX IF NOT EXISTS idx_user_publications_user_id ON user_publications(user_id);

-- 5. Créer un trigger pour updated_at
CREATE OR REPLACE FUNCTION update_user_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_publications_updated_at
    BEFORE UPDATE ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION update_user_publications_updated_at();

-- 6. Migrer les titres de content_titles vers user_publications
INSERT INTO user_publications (user_id, content_type, title, subcategory_id, platform, created_at)
SELECT 
    -- Pour l'instant, on utilise NULL pour user_id car on n'a pas l'UUID de l'utilisateur
    NULL as user_id,
    CASE 
        WHEN type = 'hook' THEN 'hooks'
        WHEN type = 'title' THEN 'title'
        WHEN type IS NULL THEN 'title'  -- Valeur par défaut si type est NULL
        ELSE type
    END as content_type,
    title,
    subcategory_id,
    platform,
    created_at
FROM content_titles
ON CONFLICT DO NOTHING;

-- 7. Migrer les comptes de exemplary_accounts vers user_publications
INSERT INTO user_publications (user_id, content_type, title, subcategory_id, platform, created_at)
SELECT 
    -- Pour l'instant, on utilise NULL pour user_id car on n'a pas l'UUID de l'utilisateur
    NULL as user_id,
    'account' as content_type,
    account_name as title,
    subcategory_id,
    platform,
    created_at
FROM exemplary_accounts
ON CONFLICT DO NOTHING;

-- 8. Vérifier le nombre de publications migrées
SELECT 
    'content_titles' as source_table,
    COUNT(*) as total_count
FROM content_titles 
UNION ALL
SELECT 
    'exemplary_accounts' as source_table,
    COUNT(*) as total_count
FROM exemplary_accounts;

-- 9. Vérifier le nombre total de publications dans user_publications
SELECT 
    COUNT(*) as total_publications,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as without_user_id,
    content_type,
    COUNT(*) as count_by_type
FROM user_publications 
GROUP BY content_type
ORDER BY count_by_type DESC;

-- 10. Voir quelques exemples de publications migrées
SELECT 
    id,
    user_id,
    content_type,
    title,
    platform,
    created_at
FROM user_publications 
ORDER BY created_at DESC 
LIMIT 10; 