-- Script pour ajouter des mots pour Blog et Article dans word_blocks
-- Ce script ajoute des mots génériques pour Blog et Article pour toutes les sous-catégories existantes

-- Fonction pour ajouter des mots pour une sous-catégorie et tous les réseaux
CREATE OR REPLACE FUNCTION add_words_for_subcategory_and_networks(
  p_subcategory_name TEXT,
  p_subject_words TEXT[],
  p_verb_words TEXT[],
  p_complement_words TEXT[],
  p_twist_words TEXT[]
) RETURNS VOID AS $$
DECLARE
  subcategory_record RECORD;
  network_record RECORD;
BEGIN
  -- Trouver la sous-catégorie par nom
  SELECT * INTO subcategory_record 
  FROM subcategories 
  WHERE name ILIKE '%' || p_subcategory_name || '%' 
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'Sous-catégorie "%" non trouvée', p_subcategory_name;
    RETURN;
  END IF;
  
  -- Ajouter des mots pour tous les réseaux (y compris blog et article)
  FOR network_record IN 
    SELECT id, name FROM social_networks 
    WHERE name IN ('tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch', 'blog', 'article')
  LOOP
    -- Sujets
    INSERT INTO word_blocks (platform, subcategory_id, category, words) 
    VALUES (network_record.name, subcategory_record.id, 'subject', p_subject_words)
    ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
    
    -- Verbes
    INSERT INTO word_blocks (platform, subcategory_id, category, words) 
    VALUES (network_record.name, subcategory_record.id, 'verb', p_verb_words)
    ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
    
    -- Compléments
    INSERT INTO word_blocks (platform, subcategory_id, category, words) 
    VALUES (network_record.name, subcategory_record.id, 'complement', p_complement_words)
    ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
    
    -- Twists
    INSERT INTO word_blocks (platform, subcategory_id, category, words) 
    VALUES (network_record.name, subcategory_record.id, 'twist', p_twist_words)
    ON CONFLICT (platform, subcategory_id, category) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Mots ajoutés pour "%" sur tous les réseaux', p_subcategory_name;
END;
$$ LANGUAGE plpgsql;

-- Ajouter des mots pour Blog et Article pour toutes les sous-catégories existantes
-- Utiliser des mots génériques qui fonctionnent bien pour les blogs et articles

-- Analyses politiques
SELECT add_words_for_subcategory_and_networks(
  'Analyses politiques',
  ARRAY['Politique', 'Gouvernement', 'Élections', 'Démocratie', 'Partis politiques', 'Législation', 'Réformes', 'Débats publics'],
  ARRAY['Analyser', 'Expliquer', 'Décortiquer', 'Comprendre', 'Décrypter', 'Étudier', 'Examiner', 'Interpréter'],
  ARRAY['en profondeur', 'pour tous', 'simplement', 'objectivement', 'avec nuance', 'sans parti pris', 'de manière claire'],
  ARRAY['ce que vous devez savoir', 'les enjeux cachés', 'la vérité derrière', 'les conséquences réelles', 'les impacts sur votre vie']
);

-- Recettes rapides
SELECT add_words_for_subcategory_and_networks(
  'Recettes rapides',
  ARRAY['Cuisine', 'Recettes', 'Ingrédients', 'Plats', 'Cuisine du monde', 'Gastronomie', 'Alimentation', 'Nutrition'],
  ARRAY['Préparer', 'Cuisiner', 'Réaliser', 'Créer', 'Concocter', 'Élaborer', 'Faire', 'Confectionner'],
  ARRAY['en 15 minutes', 'facilement', 'avec peu d''ingrédients', 'pour débutants', 'sans difficulté', 'rapidement'],
  ARRAY['que tout le monde peut faire', 'qui va vous surprendre', 'qui change tout', 'qui va vous régaler', 'qui impressionne']
);

-- Motivation
SELECT add_words_for_subcategory_and_networks(
  'Motivation',
  ARRAY['Développement personnel', 'Motivation', 'Succès', 'Objectifs', 'Réussite', 'Croissance', 'Amélioration', 'Transformation'],
  ARRAY['Développer', 'Cultiver', 'Renforcer', 'Améliorer', 'Transformer', 'Évoluer', 'Progresser', 'Grandir'],
  ARRAY['votre potentiel', 'vos compétences', 'votre confiance', 'votre mindset', 'votre vie', 'vos habitudes'],
  ARRAY['qui va changer votre vie', 'que personne ne vous a dit', 'qui fait la différence', 'qui vous propulse vers le succès']
);

-- Makeup tutorials
SELECT add_words_for_subcategory_and_networks(
  'Makeup tutorials',
  ARRAY['Beauté', 'Maquillage', 'Cosmétiques', 'Tendances', 'Styles', 'Techniques', 'Produits', 'Looks'],
  ARRAY['Créer', 'Réaliser', 'Appliquer', 'Maîtriser', 'Apprendre', 'Découvrir', 'Expérimenter', 'Tester'],
  ARRAY['facilement', 'pour débutants', 'en 5 minutes', 'avec peu de produits', 'simplement', 'rapidement'],
  ARRAY['qui va vous transformer', 'qui va vous surprendre', 'qui change tout', 'qui va vous faire briller', 'qui impressionne']
);

-- Breaking news
SELECT add_words_for_subcategory_and_networks(
  'Breaking news',
  ARRAY['Actualités', 'Nouvelles', 'Événements', 'Informations', 'Développements', 'Révélations', 'Découvertes', 'Annonces'],
  ARRAY['Révéler', 'Découvrir', 'Annoncer', 'Partager', 'Informer', 'Découvrir', 'Exposer', 'Divulguer'],
  ARRAY['en exclusivité', 'en temps réel', 'en avant-première', 'en direct', 'immédiatement', 'sans délai'],
  ARRAY['que vous devez connaître', 'qui va tout changer', 'qui va vous surprendre', 'qui fait sensation', 'qui va marquer l''histoire']
);

-- Manifestations
SELECT add_words_for_subcategory_and_networks(
  'Manifestations',
  ARRAY['Mouvements sociaux', 'Manifestations', 'Protestations', 'Revendications', 'Mobilisations', 'Luttes', 'Actions', 'Mouvements'],
  ARRAY['Participer', 'Soutenir', 'Rejoindre', 'Organiser', 'Mobiliser', 'Manifester', 'Défendre', 'Lutter'],
  ARRAY['pour vos droits', 'pour le changement', 'ensemble', 'solidaires', 'en masse', 'pacifiquement'],
  ARRAY['qui va faire bouger les choses', 'qui va changer la société', 'qui va vous donner du pouvoir', 'qui va marquer l''histoire']
);

-- Analyses de marché
SELECT add_words_for_subcategory_and_networks(
  'Analyses de marché',
  ARRAY['Marchés', 'Économie', 'Investissements', 'Finance', 'Tendances', 'Opportunités', 'Risques', 'Stratégies'],
  ARRAY['Analyser', 'Étudier', 'Évaluer', 'Prédire', 'Anticiper', 'Comprendre', 'Décrypter', 'Interpréter'],
  ARRAY['les tendances', 'les opportunités', 'les risques', 'l''avenir', 'les mouvements', 'les signaux'],
  ARRAY['qui va vous faire gagner de l''argent', 'qui va vous protéger', 'qui va vous donner l''avantage', 'qui va changer votre vision']
);

-- Fashion tips
SELECT add_words_for_subcategory_and_networks(
  'Fashion tips',
  ARRAY['Mode', 'Style', 'Fashion', 'Tendances', 'Vêtements', 'Accessoires', 'Looks', 'Outfits'],
  ARRAY['Créer', 'Adopter', 'Découvrir', 'Expérimenter', 'Mixer', 'Associer', 'Styler', 'Composer'],
  ARRAY['votre style', 'facilement', 'avec ce que vous avez', 'pour tous les budgets', 'simplement', 'rapidement'],
  ARRAY['qui va vous transformer', 'qui va vous faire briller', 'qui va vous surprendre', 'qui change tout', 'qui va vous donner confiance']
);

-- Cuisine du monde
SELECT add_words_for_subcategory_and_networks(
  'Cuisine du monde',
  ARRAY['Cuisines du monde', 'Cultures', 'Traditions', 'Saveurs', 'Ingrédients', 'Recettes', 'Gastronomie', 'Découvertes'],
  ARRAY['Découvrir', 'Explorer', 'Goûter', 'Voyager', 'Expérimenter', 'Apprendre', 'Déguster', 'Partager'],
  ARRAY['les saveurs du monde', 'les cultures', 'les traditions', 'les ingrédients', 'les techniques', 'les secrets'],
  ARRAY['qui va vous faire voyager', 'qui va vous surprendre', 'qui va changer votre vision', 'qui va vous régaler', 'qui va vous transporter']
);

-- Confiance en soi
SELECT add_words_for_subcategory_and_networks(
  'Confiance en soi',
  ARRAY['Confiance', 'Estime de soi', 'Développement personnel', 'Bien-être', 'Psychologie', 'Croissance', 'Transformation', 'Épanouissement'],
  ARRAY['Développer', 'Cultiver', 'Renforcer', 'Améliorer', 'Construire', 'Nourrir', 'Épanouir', 'Transformer'],
  ARRAY['votre confiance', 'votre estime', 'votre potentiel', 'votre bien-être', 'votre personnalité', 'votre charisme'],
  ARRAY['qui va changer votre vie', 'qui va vous transformer', 'qui va vous faire briller', 'qui va vous donner du pouvoir', 'qui va vous révéler']
);

-- Histoires personnelles
SELECT add_words_for_subcategory_and_networks(
  'Histoires personnelles',
  ARRAY['Expériences', 'Histoires', 'Témoignages', 'Vécus', 'Parcours', 'Aventures', 'Défis', 'Triomphes'],
  ARRAY['Partager', 'Raconter', 'Témoigner', 'Découvrir', 'Inspirer', 'Motiver', 'Émouvoir', 'Toucher'],
  ARRAY['mon histoire', 'mon expérience', 'mon parcours', 'mon aventure', 'mon défi', 'mon triomphe'],
  ARRAY['qui va vous inspirer', 'qui va vous toucher', 'qui va vous motiver', 'qui va changer votre vision', 'qui va vous faire réfléchir']
);

-- Life hacks
SELECT add_words_for_subcategory_and_networks(
  'Life hacks',
  ARRAY['Astuces', 'Conseils', 'Trucs', 'Hacks', 'Optimisations', 'Solutions', 'Idées', 'Innovations'],
  ARRAY['Découvrir', 'Apprendre', 'Tester', 'Expérimenter', 'Adopter', 'Utiliser', 'Partager', 'Créer'],
  ARRAY['pour simplifier', 'pour optimiser', 'pour gagner du temps', 'pour améliorer', 'pour faciliter', 'pour économiser'],
  ARRAY['qui va changer votre vie', 'qui va vous faire gagner du temps', 'qui va vous surprendre', 'qui va tout simplifier', 'que personne ne connaît']
);

-- Vérifier que les mots ont été ajoutés
SELECT 
  platform,
  COUNT(*) as total_words,
  COUNT(CASE WHEN category = 'subject' THEN 1 END) as subjects,
  COUNT(CASE WHEN category = 'verb' THEN 1 END) as verbs,
  COUNT(CASE WHEN category = 'complement' THEN 1 END) as complements,
  COUNT(CASE WHEN category = 'twist' THEN 1 END) as twists
FROM word_blocks 
WHERE platform IN ('blog', 'article')
GROUP BY platform;

-- Afficher quelques exemples de mots ajoutés
SELECT 
  platform,
  category,
  words
FROM word_blocks 
WHERE platform IN ('blog', 'article')
ORDER BY platform, category
LIMIT 20; 