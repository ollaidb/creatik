 -- Script pour ajouter de nouvelles catégories de contenu
-- Couvrant tous les domaines possibles pour les réseaux sociaux
-- Date: 2025-01-28

-- ========================================
-- NOUVELLES CATÉGORIES FINANCE & CRYPTO
-- ========================================

INSERT INTO categories (name, color, description, theme_id) VALUES
-- Finance & Crypto
('Bitcoin & Crypto', 'orange', 'Contenu sur les cryptomonnaies et blockchain', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Trading', 'green', 'Analyse technique, stratégies de trading', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Investissement', 'blue', 'Conseils d''investissement et gestion de portefeuille', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Économie', 'purple', 'Actualités économiques et analyses macro', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),
('Fintech', 'pink', 'Technologies financières et innovations', (SELECT id FROM themes WHERE name = 'Finance' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES CONSPIRATION & ALTERNATIF
-- ========================================

('Théories du complot', 'red', 'Contenu sur les théories conspirationnistes', (SELECT id FROM themes WHERE name = 'Controverses' LIMIT 1)),
('Médecine alternative', 'green', 'Santé naturelle et médecines douces', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('UFO & Paranormal', 'purple', 'Phénomènes paranormaux et extraterrestres', (SELECT id FROM themes WHERE name = 'Mystères' LIMIT 1)),
('Spiritualité', 'blue', 'Contenu spirituel et ésotérique', (SELECT id FROM themes WHERE name = 'Spiritualité' LIMIT 1)),
('Astrologie & Occulte', 'pink', 'Horoscopes, tarot, sciences occultes', (SELECT id FROM themes WHERE name = 'Spiritualité' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES TECH & INNOVATION
-- ========================================

('Intelligence Artificielle', 'blue', 'IA, machine learning, ChatGPT', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Réalité Virtuelle', 'purple', 'VR, AR, métavers', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Robotique', 'green', 'Robots, automatisation, IA', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Cybersécurité', 'red', 'Sécurité informatique et protection des données', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),
('Blockchain', 'orange', 'Technologie blockchain et applications', (SELECT id FROM themes WHERE name = 'Technologie' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES LIFESTYLE & SOCIÉTÉ
-- ========================================

('Minimalisme', 'gray', 'Mode de vie minimaliste et simplicité', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Zero Waste', 'green', 'Réduction des déchets et écologie', (SELECT id FROM themes WHERE name = 'Écologie' LIMIT 1)),
('Slow Living', 'blue', 'Rythme de vie ralenti et mindfulness', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Digital Detox', 'purple', 'Déconnexion numérique et bien-être', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Parentalité', 'pink', 'Conseils pour parents et éducation', (SELECT id FROM themes WHERE name = 'Famille' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES SANTÉ & BIEN-ÊTRE
-- ========================================

('Méditation', 'blue', 'Pratiques de méditation et mindfulness', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('Yoga', 'green', 'Pratique du yoga et bien-être', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('Nutrition', 'orange', 'Alimentation saine et nutrition', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('Fitness', 'red', 'Sport et remise en forme', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('Santé mentale', 'purple', 'Bien-être psychologique et thérapie', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES VOYAGE & DÉCOUVERTE
-- ========================================

('Voyage', 'blue', 'Conseils voyage et découverte du monde', (SELECT id FROM themes WHERE name = 'Découverte' LIMIT 1)),
('Culture', 'purple', 'Découverte des cultures du monde', (SELECT id FROM themes WHERE name = 'Culture' LIMIT 1)),
('Gastronomie', 'orange', 'Cuisine du monde et découvertes culinaires', (SELECT id FROM themes WHERE name = 'Cuisine' LIMIT 1)),
('Photographie', 'pink', 'Art photographique et techniques', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),
('Histoire', 'brown', 'Histoire et patrimoine', (SELECT id FROM themes WHERE name = 'Culture' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES ENTREPRENEURIAT
-- ========================================

('Startup', 'green', 'Création d''entreprise et innovation', (SELECT id FROM themes WHERE name = 'Business' LIMIT 1)),
('Marketing Digital', 'blue', 'Stratégies marketing en ligne', (SELECT id FROM themes WHERE name = 'Business' LIMIT 1)),
('E-commerce', 'orange', 'Vente en ligne et dropshipping', (SELECT id FROM themes WHERE name = 'Business' LIMIT 1)),
('Freelance', 'purple', 'Travail indépendant et freelancing', (SELECT id FROM themes WHERE name = 'Business' LIMIT 1)),
('Leadership', 'red', 'Management et leadership', (SELECT id FROM themes WHERE name = 'Business' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES DIVERTISSEMENT SPÉCIALISÉ
-- ========================================

('Gaming', 'green', 'Jeux vidéo et e-sport', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Anime & Manga', 'pink', 'Culture japonaise et animation', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Comics', 'blue', 'Bandes dessinées et super-héros', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Fantasy', 'purple', 'Fantasy et science-fiction', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Horreur', 'black', 'Contenu d''horreur et thriller', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES ÉDUCATION SPÉCIALISÉE
-- ========================================

('Langues', 'blue', 'Apprentissage des langues étrangères', (SELECT id FROM themes WHERE name = 'Éducation' LIMIT 1)),
('Programmation', 'green', 'Coding et développement', (SELECT id FROM themes WHERE name = 'Éducation' LIMIT 1)),
('Mathématiques', 'red', 'Maths et sciences exactes', (SELECT id FROM themes WHERE name = 'Éducation' LIMIT 1)),
('Philosophie', 'purple', 'Réflexion philosophique et éthique', (SELECT id FROM themes WHERE name = 'Éducation' LIMIT 1)),
('Psychologie', 'pink', 'Comportement humain et psychologie', (SELECT id FROM themes WHERE name = 'Éducation' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES SOCIÉTÉ & POLITIQUE
-- ========================================

('Politique', 'blue', 'Actualités politiques et débats', (SELECT id FROM themes WHERE name = 'Société' LIMIT 1)),
('Féminisme', 'pink', 'Droits des femmes et égalité', (SELECT id FROM themes WHERE name = 'Société' LIMIT 1)),
('LGBTQ+', 'rainbow', 'Communauté LGBTQ+ et droits', (SELECT id FROM themes WHERE name = 'Société' LIMIT 1)),
('Écologie', 'green', 'Environnement et développement durable', (SELECT id FROM themes WHERE name = 'Écologie' LIMIT 1)),
('Droits de l''homme', 'red', 'Droits humains et justice sociale', (SELECT id FROM themes WHERE name = 'Société' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES CRÉATIVITÉ & ART
-- ========================================

('Musique', 'purple', 'Création musicale et instruments', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),
('Danse', 'pink', 'Chorégraphie et styles de danse', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),
('Théâtre', 'red', 'Art dramatique et performance', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),
('Littérature', 'brown', 'Écriture et livres', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),
('Design', 'blue', 'Design graphique et créatif', (SELECT id FROM themes WHERE name = 'Art' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES SPÉCIALISÉES
-- ========================================

('Droit', 'black', 'Légal et juridique', (SELECT id FROM themes WHERE name = 'Professionnel' LIMIT 1)),
('Médecine', 'red', 'Santé et médecine', (SELECT id FROM themes WHERE name = 'Santé' LIMIT 1)),
('Architecture', 'gray', 'Design architectural et construction', (SELECT id FROM themes WHERE name = 'Professionnel' LIMIT 1)),
('Ingénierie', 'blue', 'Sciences de l''ingénieur', (SELECT id FROM themes WHERE name = 'Professionnel' LIMIT 1)),
('Journalisme', 'green', 'Médias et information', (SELECT id FROM themes WHERE name = 'Médias' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES TENDANCES & VIRAL
-- ========================================

('Tendances TikTok', 'pink', 'Tendances populaires sur TikTok', (SELECT id FROM themes WHERE name = 'Tendances' LIMIT 1)),
('Memes', 'yellow', 'Contenu mème et humoristique', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Challenges', 'orange', 'Défis viraux et challenges', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Réactions', 'purple', 'Vidéos de réaction', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),
('Pranks', 'red', 'Blagues et canulars', (SELECT id FROM themes WHERE name = 'Divertissement' LIMIT 1)),

-- ========================================
-- NOUVELLES CATÉGORIES NICHE & SPÉCIALISÉES
-- ========================================

('Vintage', 'brown', 'Mode et objets vintage', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('DIY & Bricolage', 'green', 'Projets à faire soi-même', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Jardinage', 'green', 'Plantes et jardinage', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Bricolage Auto', 'gray', 'Réparation et entretien automobile', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1)),
('Collection', 'purple', 'Collections et objets de collection', (SELECT id FROM themes WHERE name = 'Lifestyle' LIMIT 1));

-- ========================================
-- VÉRIFICATION DES DONNÉES INSÉRÉES
-- ========================================

-- Afficher le nombre total de catégories
SELECT COUNT(*) as total_categories FROM categories;

-- Afficher les nouvelles catégories par thème
SELECT 
    t.name as theme_name,
    COUNT(c.id) as category_count
FROM themes t
LEFT JOIN categories c ON t.id = c.theme_id
GROUP BY t.id, t.name
ORDER BY category_count DESC;

-- Afficher toutes les catégories récemment ajoutées
SELECT 
    c.name,
    c.color,
    c.description,
    t.name as theme_name
FROM categories c
LEFT JOIN themes t ON c.theme_id = t.id
WHERE c.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY c.name;
