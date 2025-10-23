-- Créer la table sources
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    category TEXT,
    subcategory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table accounts
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    platform TEXT,
    url TEXT,
    avatar_url TEXT,
    category TEXT,
    subcategory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category);
CREATE INDEX IF NOT EXISTS idx_sources_subcategory ON sources(subcategory);
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts(category);
CREATE INDEX IF NOT EXISTS idx_accounts_subcategory ON accounts(subcategory);
CREATE INDEX IF NOT EXISTS idx_accounts_platform ON accounts(platform);

-- Activer RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour sources
CREATE POLICY "Sources are viewable by everyone" ON sources
    FOR SELECT USING (true);

CREATE POLICY "Sources are insertable by authenticated users" ON sources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sources are updatable by authenticated users" ON sources
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Sources are deletable by authenticated users" ON sources
    FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques RLS pour accounts
CREATE POLICY "Accounts are viewable by everyone" ON accounts
    FOR SELECT USING (true);

CREATE POLICY "Accounts are insertable by authenticated users" ON accounts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Accounts are updatable by authenticated users" ON accounts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Accounts are deletable by authenticated users" ON accounts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 