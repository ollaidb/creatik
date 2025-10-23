-- Script pour ajouter les catégories spécifiques mentionnées
-- Bitcoin, Trading, Complotisme, etc.

-- ========================================
-- CATÉGORIES FINANCE & CRYPTO
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
('Bitcoin & Crypto', 'orange', 'Contenu sur les cryptomonnaies, blockchain et investissements crypto', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Trading', 'green', 'Analyse technique, stratégies de trading et marchés financiers', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Étude du marché', 'blue', 'Analyses de marché, tendances économiques et prévisions', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Investissement', 'purple', 'Conseils d''investissement, gestion de portefeuille et diversification', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Fintech', 'pink', 'Technologies financières, applications bancaires et innovations', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1));

-- ========================================
-- CATÉGORIES CONSPIRATION & ALTERNATIF
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
('Théories du complot', 'red', 'Contenu sur les théories conspirationnistes et analyses alternatives', (SELECT id FROM themes WHERE name = 'Controverses' LIMIT 1)),
('Complotisme', 'darkred', 'Théories du complot et analyses critiques des institutions', (SELECT id FROM themes WHERE name = 'Controverses' LIMIT 1)),
('Médecine alternative', 'green', 'Santé naturelle, médecines douces et approches holistiques', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('UFO & Paranormal', 'purple', 'Phénomènes paranormaux, extraterrestres et mystères', (SELECT id FROM themes WHERE name = 'Mystères' LIMIT 1)),
('Spiritualité', 'blue', 'Contenu spirituel, méditation et développement personnel', (SELECT id FROM themes WHERE name = 'Spiritualité' LIMIT 1));

-- ========================================
-- CATÉGORIES TECH & INNOVATION
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
('Intelligence Artificielle', 'blue', 'IA, machine learning, ChatGPT et applications', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Réalité Virtuelle', 'purple', 'VR, AR, métavers et technologies immersives', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Blockchain', 'orange', 'Technologie blockchain, smart contracts et Web3', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Cybersécurité', 'red', 'Sécurité informatique, protection des données et hacking éthique', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Robotique', 'green', 'Robots, automatisation et intelligence artificielle', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1));

-- ========================================
-- CATÉGORIES LIFESTYLE & SOCIÉTÉ
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
('Minimalisme', 'gray', 'Mode de vie minimaliste, simplicité et désencombrement', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Zero Waste', 'green', 'Réduction des déchets, écologie et consommation responsable', (SELECT id FROM themes WHERE name = 'Écologie' LIMIT 1)),
('Slow Living', 'blue', 'Rythme de vie ralenti, mindfulness et bien-être', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Digital Detox', 'purple', 'Déconnexion numérique et équilibre technologique', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Parentalité', 'pink', 'Conseils pour parents, éducation et développement de l''enfant', (SELECT id FROM themes WHERE name = 'Famille' LIMIT 1));

-- ========================================
-- CATÉGORIES DIVERTISSEMENT SPÉCIALISÉ
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
('Gaming', 'green', 'Jeux vidéo, e-sport et culture gaming', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Anime & Manga', 'pink', 'Culture japonaise, animation et manga', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Comics', 'blue', 'Bandes dessinées, super-héros et univers Marvel/DC', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Fantasy', 'purple', 'Fantasy, science-fiction et univers imaginaires', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Horreur', 'black', 'Contenu d''horreur, thriller et films d''épouvante', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1));

-- ========================================
-- VÉRIFICATION
-- ========================================

-- Afficher les nouvelles catégories ajoutées
SELECT 
    c.name,
    c.color,
    c.description,
    t.name as theme_name
FROM categories c
LEFT JOIN themes t ON c.theme_id = t.id
WHERE c.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY c.name;

-- Compter le total
SELECT COUNT(*) as total_categories FROM categories;
