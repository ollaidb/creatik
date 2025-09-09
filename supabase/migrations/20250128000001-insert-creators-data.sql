-- Migration: Insert Creators Data
-- Description: Insert sample creators and their social networks

-- 1. Insérer des créateurs de test
INSERT INTO creators (id, name, display_name, avatar, bio, category, subcategory) VALUES
    ('550e8400-e29b-41d4-a716-446655440101', 'Marie Dubois', '@mariedubois', '/placeholder.svg', 'Créatrice de contenu lifestyle et beauté passionnée par le partage de conseils authentiques et de routines quotidiennes.', 'Lifestyle', 'Beauté'),
    ('550e8400-e29b-41d4-a716-446655440102', 'Thomas Martin', '@thomasmartin', '/placeholder.svg', 'Expert en marketing digital et réseaux sociaux, je partage mes stratégies pour développer sa présence en ligne.', 'Business', 'Marketing'),
    ('550e8400-e29b-41d4-a716-446655440103', 'Sophie Bernard', '@sophiebernard', '/placeholder.svg', 'Passionnée de cuisine et de recettes créatives, je partage mes découvertes culinaires et astuces.', 'Lifestyle', 'Cuisine'),
    ('550e8400-e29b-41d4-a716-446655440104', 'Alexandre Petit', '@alexpetit', '/placeholder.svg', 'Créateur de contenu gaming et tech, je teste et partage les dernières nouveautés du monde du jeu.', 'Entertainment', 'Gaming'),
    ('550e8400-e29b-41d4-a716-446655440105', 'Emma Rousseau', '@emmarousseau', '/placeholder.svg', 'Influenceuse mode et tendances, je partage mes looks et découvertes fashion.', 'Fashion', 'Mode'),
    ('550e8400-e29b-41d4-a716-446655440106', 'Lucas Moreau', '@lucasmoreau', '/placeholder.svg', 'Coach fitness et bien-être, je partage mes routines d''entraînement et conseils nutrition.', 'Lifestyle', 'Fitness');

-- 2. Insérer les réseaux sociaux des créateurs
INSERT INTO creator_social_networks (creator_id, social_network_id, username, profile_url, followers_count, is_primary) VALUES
    -- Marie Dubois
    ('550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM social_networks WHERE name = 'instagram'), '@mariedubois', 'https://instagram.com/mariedubois', 12500, true),
    ('550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM social_networks WHERE name = 'youtube'), 'Marie Dubois', 'https://youtube.com/@mariedubois', 8200, false),
    ('550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM social_networks WHERE name = 'tiktok'), '@mariedubois', 'https://tiktok.com/@mariedubois', 15400, false),
    
    -- Thomas Martin
    ('550e8400-e29b-41d4-a716-446655440102', (SELECT id FROM social_networks WHERE name = 'linkedin'), 'Thomas Martin', 'https://linkedin.com/in/thomasmartin', 8900, true),
    ('550e8400-e29b-41d4-a716-446655440102', (SELECT id FROM social_networks WHERE name = 'twitter'), '@thomasmartin', 'https://twitter.com/thomasmartin', 5600, false),
    ('550e8400-e29b-41d4-a716-446655440102', (SELECT id FROM social_networks WHERE name = 'youtube'), 'Thomas Martin', 'https://youtube.com/@thomasmartin', 3200, false),
    
    -- Sophie Bernard
    ('550e8400-e29b-41d4-a716-446655440103', (SELECT id FROM social_networks WHERE name = 'instagram'), '@sophiebernard', 'https://instagram.com/sophiebernard', 9800, true),
    ('550e8400-e29b-41d4-a716-446655440103', (SELECT id FROM social_networks WHERE name = 'blog'), 'sophiebernard.com', 'https://sophiebernard.com', 2100, false),
    ('550e8400-e29b-41d4-a716-446655440103', (SELECT id FROM social_networks WHERE name = 'pinterest'), '@sophiebernard', 'https://pinterest.com/sophiebernard', 4500, false),
    
    -- Alexandre Petit
    ('550e8400-e29b-41d4-a716-446655440104', (SELECT id FROM social_networks WHERE name = 'twitch'), '@alexpetit', 'https://twitch.tv/alexpetit', 18700, true),
    ('550e8400-e29b-41d4-a716-446655440104', (SELECT id FROM social_networks WHERE name = 'youtube'), 'Alex Petit Gaming', 'https://youtube.com/@alexpetit', 12400, false),
    ('550e8400-e29b-41d4-a716-446655440104', (SELECT id FROM social_networks WHERE name = 'twitter'), '@alexpetit', 'https://twitter.com/alexpetit', 7800, false),
    
    -- Emma Rousseau
    ('550e8400-e29b-41d4-a716-446655440105', (SELECT id FROM social_networks WHERE name = 'instagram'), '@emmarousseau', 'https://instagram.com/emmarousseau', 23400, true),
    ('550e8400-e29b-41d4-a716-446655440105', (SELECT id FROM social_networks WHERE name = 'tiktok'), '@emmarousseau', 'https://tiktok.com/@emmarousseau', 18900, false),
    ('550e8400-e29b-41d4-a716-446655440105', (SELECT id FROM social_networks WHERE name = 'youtube'), 'Emma Rousseau', 'https://youtube.com/@emmarousseau', 5600, false),
    
    -- Lucas Moreau
    ('550e8400-e29b-41d4-a716-446655440106', (SELECT id FROM social_networks WHERE name = 'instagram'), '@lucasmoreau', 'https://instagram.com/lucasmoreau', 11200, true),
    ('550e8400-e29b-41d4-a716-446655440106', (SELECT id FROM social_networks WHERE name = 'youtube'), 'Lucas Moreau Fitness', 'https://youtube.com/@lucasmoreau', 8900, false),
    ('550e8400-e29b-41d4-a716-446655440106', (SELECT id FROM social_networks WHERE name = 'tiktok'), '@lucasmoreau', 'https://tiktok.com/@lucasmoreau', 15600, false);

-- 3. Insérer des défis de test
INSERT INTO creator_challenges (challenge_id, creator_id, user_id, content, social_network_id, status) VALUES
    ((SELECT id FROM challenges LIMIT 1), '550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM auth.users LIMIT 1), 'J''ai créé une routine beauté inspirée de Marie Dubois avec des produits naturels !', (SELECT id FROM social_networks WHERE name = 'instagram'), 'active'),
    ((SELECT id FROM challenges LIMIT 1), '550e8400-e29b-41d4-a716-446655440101', (SELECT id FROM auth.users LIMIT 1), 'Test du défi 5 minutes de Marie Dubois - résultat incroyable !', (SELECT id FROM social_networks WHERE name = 'tiktok'), 'active'),
    ((SELECT id FROM challenges LIMIT 1), '550e8400-e29b-41d4-a716-446655440102', (SELECT id FROM auth.users LIMIT 1), 'J''ai appliqué les conseils marketing de Thomas Martin, c''est efficace !', (SELECT id FROM social_networks WHERE name = 'linkedin'), 'active');
