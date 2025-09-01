-- Migration pour créer la table des guides de catégories
-- Date: 2025-01-28

-- Création de la table principale
CREATE TABLE IF NOT EXISTS public.category_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    how_to TEXT NOT NULL,
    personalization TEXT NOT NULL,
    tips JSONB DEFAULT '[]'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    characteristics JSONB DEFAULT '[]'::jsonb,
    platforms JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_category_guides_category_id ON public.category_guides(category_id);
CREATE INDEX IF NOT EXISTS idx_category_guides_title ON public.category_guides(title);

-- Contrainte d'unicité : une seule entrée par catégorie
ALTER TABLE public.category_guides 
ADD CONSTRAINT unique_category_guide UNIQUE (category_id);

-- RLS (Row Level Security) - Lecture publique, écriture admin seulement
ALTER TABLE public.category_guides ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Allow public read access to category guides" ON public.category_guides
    FOR SELECT USING (true);

-- Politique d'écriture pour les utilisateurs authentifiés (pour l'instant)
CREATE POLICY "Allow authenticated users to insert category guides" ON public.category_guides
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique de mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update category guides" ON public.category_guides
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique de suppression pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete category guides" ON public.category_guides
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_category_guides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_guides_updated_at
    BEFORE UPDATE ON public.category_guides
    FOR EACH ROW
    EXECUTE FUNCTION update_category_guides_updated_at();

-- Insertion des données d'exemple pour les catégories existantes
INSERT INTO public.category_guides (category_id, title, description, how_to, personalization, tips, examples, characteristics, platforms) VALUES
(
    (SELECT id FROM public.categories WHERE name = 'Mode' LIMIT 1),
    'Guide de la catégorie Mode',
    'La catégorie Mode englobe tout ce qui concerne la fashion, le style vestimentaire, les tendances, la beauté et l''apparence personnelle. C''est un domaine très populaire sur les réseaux sociaux avec une audience engagée.',
    'Pour créer du contenu Mode, concentrez-vous sur les tendances actuelles, les conseils de style, les looks du jour, et les inspirations vestimentaires. Partagez vos découvertes, vos conseils personnels et vos expériences.',
    'Personnalisez votre contenu Mode en choisissant votre niche (streetwear, luxe, minimaliste, vintage), votre audience cible, et votre style de présentation. Développez votre signature visuelle unique.',
    '[
        {"title": "Restez authentique", "description": "Partagez votre vraie expérience et vos vraies opinions", "icon": "star", "color": "blue"},
        {"title": "Soyez cohérent", "description": "Publiez régulièrement pour maintenir l''engagement", "icon": "trending-up", "color": "green"},
        {"title": "Interagissez", "description": "Répondez aux commentaires et créez une communauté", "icon": "users", "color": "purple"},
        {"title": "Analysez", "description": "Suivez vos performances et adaptez votre stratégie", "icon": "bar-chart", "color": "orange"}
    ]'::jsonb,
    '[
        {"type": "Personnalisation par format", "items": ["Vidéos courtes vs longues", "Posts visuels vs textuels", "Stories vs posts classiques", "Lives vs contenu pré-enregistré"]},
        {"type": "Personnalisation par ton", "items": ["Formel vs décontracté", "Technique vs accessible", "Sérieux vs ludique", "Direct vs narratif"]}
    ]'::jsonb,
    '[
        {"title": "Audience large", "description": "Intéresse de nombreuses personnes", "icon": "users", "color": "blue"},
        {"title": "Tendances", "description": "Contenu toujours d''actualité", "icon": "trending-up", "color": "green"},
        {"title": "Hashtags populaires", "description": "Facilite la découverte", "icon": "hash", "color": "purple"},
        {"title": "Contenu saisonnier", "description": "Variations selon les périodes", "icon": "calendar", "color": "orange"}
    ]'::jsonb,
    '[
        {"name": "Instagram", "icon": "📱", "color": "pink"},
        {"name": "TikTok", "icon": "🎵", "color": "black"},
        {"name": "Pinterest", "icon": "📌", "color": "red"},
        {"name": "YouTube", "icon": "📺", "color": "red"}
    ]'::jsonb
),
(
    (SELECT id FROM public.categories WHERE name = 'Cuisine' LIMIT 1),
    'Guide de la catégorie Cuisine',
    'La catégorie Cuisine couvre la gastronomie, les recettes, les techniques culinaires, la nutrition et tout ce qui touche à l''art culinaire. C''est un domaine très apprécié avec une communauté passionnée.',
    'Créez du contenu Cuisine en partageant des recettes, des techniques de cuisine, des conseils nutritionnels, et des découvertes gastronomiques. Montrez vos créations et partagez vos secrets.',
    'Spécialisez-vous dans un type de cuisine (française, asiatique, végétarienne), un niveau de difficulté, ou un style de présentation unique. Trouvez votre angle culinaire.',
    '[
        {"title": "Photos de qualité", "description": "Investissez dans une bonne présentation visuelle", "icon": "camera", "color": "green"},
        {"title": "Recettes testées", "description": "Ne partagez que ce que vous avez vraiment cuisiné", "icon": "check-circle", "color": "blue"},
        {"title": "Conseils pratiques", "description": "Donnez des astuces utiles à votre audience", "icon": "lightbulb", "color": "yellow"},
        {"title": "Histoire derrière", "description": "Racontez l''histoire de vos plats", "icon": "book-open", "color": "purple"}
    ]'::jsonb,
    '[
        {"type": "Types de cuisine", "items": ["Française traditionnelle", "Cuisine fusion", "Végétarienne", "Street food"]},
        {"type": "Niveaux de difficulté", "items": ["Débutant", "Intermédiaire", "Avancé", "Expert"]}
    ]'::jsonb,
    '[
        {"title": "Communauté passionnée", "description": "Audience très engagée et participative", "icon": "heart", "color": "red"},
        {"title": "Contenu pratique", "description": "Recettes directement applicables", "icon": "utensils", "color": "orange"},
        {"title": "Saisonnalité", "description": "Variations selon les produits de saison", "icon": "leaf", "color": "green"},
        {"title": "Culture culinaire", "description": "Lien avec les traditions et cultures", "icon": "globe", "color": "blue"}
    ]'::jsonb,
    '[
        {"name": "Instagram", "icon": "📱", "color": "pink"},
        {"name": "YouTube", "icon": "📺", "color": "red"},
        {"name": "TikTok", "icon": "🎵", "color": "black"},
        {"name": "Blogs", "icon": "🌐", "color": "blue"}
    ]'::jsonb
),
(
    (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1),
    'Guide de la catégorie Fitness',
    'La catégorie Fitness regroupe tout ce qui concerne l''entraînement physique, la santé, le bien-être et la motivation sportive. C''est un domaine en pleine croissance avec une audience motivée.',
    'Produisez du contenu Fitness en partageant des exercices, des programmes d''entraînement, des conseils nutritionnels et de la motivation. Inspirez et guidez votre communauté vers un mode de vie sain.',
    'Choisissez votre spécialité (musculation, cardio, yoga, crossfit) et adaptez le contenu à votre niveau et à celui de votre audience. Développez votre approche unique.',
    '[
        {"title": "Sécurité d''abord", "description": "Montrez toujours les bonnes techniques", "icon": "shield", "color": "green"},
        {"title": "Progression", "description": "Montrez l''évolution et les résultats", "icon": "trending-up", "color": "blue"},
        {"title": "Motivation", "description": "Encouragez et inspirez votre audience", "icon": "zap", "color": "yellow"},
        {"title": "Conseils nutritionnels", "description": "Complétez l''entraînement avec la nutrition", "icon": "apple", "color": "red"}
    ]'::jsonb,
    '[
        {"type": "Types d''entraînement", "items": ["Musculation", "Cardio", "Yoga", "CrossFit", "Pilates"]},
        {"type": "Niveaux", "items": ["Débutant", "Intermédiaire", "Avancé", "Sportif confirmé"]}
    ]'::jsonb,
    '[
        {"title": "Audience motivée", "description": "Personnes cherchant à améliorer leur santé", "icon": "target", "color": "green"},
        {"title": "Contenu éducatif", "description": "Apprentissage continu et progression", "icon": "graduation-cap", "color": "blue"},
        {"title": "Communauté active", "description": "Partage d''expériences et soutien", "icon": "users", "color": "purple"},
        {"title": "Résultats visibles", "description": "Transformations physiques et mentales", "icon": "award", "color": "gold"}
    ]'::jsonb,
    '[
        {"name": "Instagram", "icon": "📱", "color": "pink"},
        {"name": "YouTube", "icon": "📺", "color": "red"},
        {"name": "TikTok", "icon": "🎵", "color": "black"},
        {"name": "LinkedIn", "icon": "💼", "color": "blue"}
    ]'::jsonb
),
(
    (SELECT id FROM public.categories WHERE name = 'Tech' LIMIT 1),
    'Guide de la catégorie Tech',
    'La catégorie Tech couvre les nouvelles technologies, l''innovation, les gadgets, l''intelligence artificielle et l''évolution numérique. C''est un domaine en constante évolution avec une audience tech-savvy.',
    'Créez du contenu Tech en analysant les nouveautés, en testant des produits, en expliquant des concepts et en partageant des tutoriels. Soyez à la pointe de l''innovation.',
    'Spécialisez-vous dans un domaine (IA, gaming, développement, gadgets) et adaptez le niveau technique à votre audience. Trouvez votre niche technologique.',
    '[
        {"title": "Restez à jour", "description": "Suivez les dernières tendances tech", "icon": "refresh-cw", "color": "blue"},
        {"title": "Testez avant", "description": "N''en parlez que si vous l''avez testé", "icon": "check-square", "color": "green"},
        {"title": "Simplifiez", "description": "Rendez la tech accessible à tous", "icon": "zap", "color": "yellow"},
        {"title": "Perspective critique", "description": "Analysez les avantages et inconvénients", "icon": "eye", "color": "purple"}
    ]'::jsonb,
    '[
        {"type": "Domaines tech", "items": ["Intelligence Artificielle", "Gaming", "Développement", "Gadgets", "Cybersécurité"]},
        {"type": "Niveaux techniques", "items": ["Débutant", "Intermédiaire", "Avancé", "Expert", "Développeur"]}
    ]'::jsonb,
    '[
        {"title": "Évolution rapide", "description": "Technologies qui changent constamment", "icon": "rocket", "color": "blue"},
        {"title": "Audience diverse", "description": "Du débutant au professionnel", "icon": "users", "color": "green"},
        {"title": "Impact quotidien", "description": "Tech qui touche tous les aspects de la vie", "icon": "smartphone", "color": "purple"},
        {"title": "Innovation continue", "description": "Nouvelles possibilités constantes", "icon": "lightbulb", "color": "yellow"}
    ]'::jsonb,
    '[
        {"name": "YouTube", "icon": "📺", "color": "red"},
        {"name": "LinkedIn", "icon": "💼", "color": "blue"},
        {"name": "Twitter/X", "icon": "🐦", "color": "black"},
        {"name": "Blogs tech", "icon": "🌐", "color": "blue"}
    ]'::jsonb
),
(
    (SELECT id FROM public.categories WHERE name = 'Voyage' LIMIT 1),
    'Guide de la catégorie Voyage',
    'La catégorie Voyage englobe les destinations, les conseils de voyage, les expériences culturelles et les aventures autour du monde. C''est un domaine très inspirant avec une audience rêveuse.',
    'Partagez vos expériences de voyage, donnez des conseils pratiques, présentez des destinations et inspirez vos followers à explorer. Racontez vos histoires d''aventure.',
    'Choisissez votre style de voyage (luxe, backpacking, culturel, aventure) et votre zone géographique de prédilection. Développez votre approche unique du voyage.',
    '[
        {"title": "Photos authentiques", "description": "Montrez la vraie réalité des lieux", "icon": "camera", "color": "blue"},
        {"title": "Conseils pratiques", "description": "Partagez vos astuces de voyageur", "icon": "map-pin", "color": "green"},
        {"title": "Histoire locale", "description": "Découvrez et partagez la culture", "icon": "book-open", "color": "purple"},
        {"title": "Responsabilité", "description": "Voyagez de manière éthique et durable", "icon": "leaf", "color": "green"}
    ]'::jsonb,
    '[
        {"type": "Styles de voyage", "items": ["Luxe", "Backpacking", "Culturel", "Aventure", "Slow travel"]},
        {"type": "Zones géographiques", "items": ["Europe", "Asie", "Amériques", "Afrique", "Océanie"]}
    ]'::jsonb,
    '[
        {"title": "Audience rêveuse", "description": "Personnes cherchant l''évasion", "icon": "compass", "color": "blue"},
        {"title": "Contenu inspirant", "description": "Photos et récits qui font rêver", "icon": "star", "color": "yellow"},
        {"title": "Découverte culturelle", "description": "Apprentissage et ouverture d''esprit", "icon": "globe", "color": "green"},
        {"title": "Aventure", "description": "Expériences uniques et mémorables", "icon": "mountain", "color": "orange"}
    ]'::jsonb,
    '[
        {"name": "Instagram", "icon": "📱", "color": "pink"},
        {"name": "YouTube", "icon": "📺", "color": "red"},
        {"name": "TikTok", "icon": "🎵", "color": "black"},
        {"name": "Blogs de voyage", "icon": "🌐", "color": "blue"}
    ]'::jsonb
);

-- Vérification de l'insertion
SELECT 
    cg.title,
    c.name as category_name,
    cg.created_at
FROM public.category_guides cg
JOIN public.categories c ON cg.category_id = c.id
ORDER BY c.name;
