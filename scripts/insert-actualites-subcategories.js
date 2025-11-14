#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Sous-catégories existantes (à garder) - Breaking news, Analyses politiques, International
    
    // Par domaine traditionnel
    { name: 'Économie', description: 'Actualités économiques' },
    { name: 'Sport', description: 'Actualités sportives' },
    { name: 'Culture', description: 'Actualités culturelles' },
    { name: 'Technologie', description: 'Actualités technologiques' },
    { name: 'Santé', description: 'Actualités santé' },
    { name: 'Environnement', description: 'Actualités environnement' },
    { name: 'Éducation', description: 'Actualités éducation' },
    { name: 'Justice', description: 'Actualités judiciaires' },
    { name: 'Médias', description: 'Actualités médias' },
    { name: 'Divertissement', description: 'Actualités divertissement' },
    { name: 'Science', description: 'Actualités scientifiques' },
    { name: 'Société', description: 'Actualités société' },
    { name: 'Immobilier', description: 'Actualités immobilier' },
    { name: 'Transport', description: 'Actualités transport' },
    { name: 'Énergie', description: 'Actualités énergie' },
    { name: 'Agriculture', description: 'Actualités agriculture' },
    
    // Divertissement et people
    { name: 'Téléréalité', description: 'Actualités téléréalité' },
    { name: 'Influenceurs', description: 'Actualités influenceurs' },
    { name: 'Célébrités', description: 'Actualités célébrités' },
    { name: 'People', description: 'Actualités people' },
    { name: 'Cinéma', description: 'Actualités cinéma' },
    { name: 'Séries TV', description: 'Actualités séries télévisées' },
    { name: 'Musique', description: 'Actualités musique' },
    { name: 'Mode', description: 'Actualités mode' },
    { name: 'Beauté', description: 'Actualités beauté' },
    { name: 'Gaming', description: 'Actualités gaming' },
    { name: 'Streaming', description: 'Actualités streaming' },
    { name: 'Podcast', description: 'Actualités podcast' },
    { name: 'YouTube', description: 'Actualités YouTube' },
    { name: 'TikTok', description: 'Actualités TikTok' },
    { name: 'Instagram', description: 'Actualités Instagram' },
    { name: 'Twitter', description: 'Actualités Twitter' },
    
    // Par géographie
    { name: 'National', description: 'Actualités nationales' },
    { name: 'Régional', description: 'Actualités régionales' },
    { name: 'Local', description: 'Actualités locales' },
    { name: 'Europe', description: 'Actualités européennes' },
    { name: 'Amérique', description: 'Actualités américaines' },
    { name: 'Asie', description: 'Actualités asiatiques' },
    { name: 'Afrique', description: 'Actualités africaines' },
    { name: 'Moyen-Orient', description: 'Actualités Moyen-Orient' },
    { name: 'Océanie', description: 'Actualités Océanie' },
    
    // Par format/type
    { name: 'Live', description: 'Actualités en direct' },
    { name: 'Reportage', description: 'Reportages d\'actualité' },
    { name: 'Interview', description: 'Interviews d\'actualité' },
    { name: 'Débat', description: 'Débats d\'actualité' },
    { name: 'Opinion', description: 'Opinions sur l\'actualité' },
    { name: 'Fact-checking', description: 'Vérification des faits' },
    { name: 'Décryptage', description: 'Décryptage de l\'actualité' },
    { name: 'Résumé', description: 'Résumés d\'actualité' },
    { name: 'Tendances', description: 'Tendances de l\'actualité' },
    { name: 'Scandale', description: 'Scandales et révélations' },
    { name: 'Crise', description: 'Crises et urgences' },
    { name: 'Élection', description: 'Actualités électorales' },
    { name: 'Manifestation', description: 'Manifestations et mouvements' },
    { name: 'Accident', description: 'Accidents et incidents' },
    { name: 'Catastrophe', description: 'Catastrophes naturelles' },
    { name: 'Innovation', description: 'Innovations et découvertes' },
    { name: 'Réforme', description: 'Réformes et changements' },
    { name: 'Décision', description: 'Décisions importantes' },
    { name: 'Annonce', description: 'Annonces officielles' },
    { name: 'Révélation', description: 'Révélations et scoops' },
    { name: 'Scoop', description: 'Scoops exclusifs' },
    { name: 'Exclusivité', description: 'Actualités exclusives' },
    
    // Autres domaines
    { name: 'Business', description: 'Actualités business' },
    { name: 'Startup', description: 'Actualités startups' },
    { name: 'Finance', description: 'Actualités financières' },
    { name: 'Bourse', description: 'Actualités boursières' },
    { name: 'Crypto', description: 'Actualités cryptomonnaies' },
    { name: 'IA', description: 'Actualités intelligence artificielle' },
    { name: 'Climat', description: 'Actualités climat' },
    { name: 'Écologie', description: 'Actualités écologie' },
    { name: 'Météo', description: 'Actualités météo' },
    { name: 'Voyage', description: 'Actualités voyage' },
    { name: 'Tourisme', description: 'Actualités tourisme' },
    { name: 'Gastronomie', description: 'Actualités gastronomie' },
    { name: 'Art', description: 'Actualités art' },
    { name: 'Littérature', description: 'Actualités littérature' },
    { name: 'Théâtre', description: 'Actualités théâtre' },
    { name: 'Danse', description: 'Actualités danse' },
    { name: 'Fashion', description: 'Actualités fashion' },
    { name: 'Luxe', description: 'Actualités luxe' },
    { name: 'Automobile', description: 'Actualités automobile' },
    { name: 'Aéronautique', description: 'Actualités aéronautique' },
    { name: 'Spatial', description: 'Actualités spatial' },
    { name: 'Maritime', description: 'Actualités maritime' },
    { name: 'Militaire', description: 'Actualités militaire' },
    { name: 'Sécurité', description: 'Actualités sécurité' },
    { name: 'Police', description: 'Actualités police' },
    { name: 'Pompiers', description: 'Actualités pompiers' },
    { name: 'Urgence', description: 'Actualités urgences' },
    { name: 'Médecine', description: 'Actualités médecine' },
    { name: 'Recherche', description: 'Actualités recherche' },
    { name: 'Université', description: 'Actualités université' },
    { name: 'École', description: 'Actualités école' },
    { name: 'Jeunesse', description: 'Actualités jeunesse' },
    { name: 'Famille', description: 'Actualités famille' },
    { name: 'Parentalité', description: 'Actualités parentalité' },
    { name: 'Animaux', description: 'Actualités animaux' },
    { name: 'Nature', description: 'Actualités nature' },
    { name: 'Faune', description: 'Actualités faune' },
    { name: 'Flore', description: 'Actualités flore' },
    { name: 'Océan', description: 'Actualités océan' },
    { name: 'Montagne', description: 'Actualités montagne' },
    { name: 'Ville', description: 'Actualités ville' },
    { name: 'Rural', description: 'Actualités rural' },
    { name: 'Urbanisme', description: 'Actualités urbanisme' },
    { name: 'Architecture', description: 'Actualités architecture' },
    { name: 'Design', description: 'Actualités design' },
    { name: 'Innovation sociale', description: 'Actualités innovation sociale' },
    { name: 'Solidarité', description: 'Actualités solidarité' },
    { name: 'Associations', description: 'Actualités associations' },
    { name: 'Bénévolat', description: 'Actualités bénévolat' },
    { name: 'Humanitaire', description: 'Actualités humanitaire' },
    { name: 'Religion', description: 'Actualités religion' },
    { name: 'Spiritualité', description: 'Actualités spiritualité' },
    { name: 'Histoire', description: 'Actualités histoire' },
    { name: 'Patrimoine', description: 'Actualités patrimoine' },
    { name: 'Archéologie', description: 'Actualités archéologie' },
    { name: 'Géologie', description: 'Actualités géologie' },
    { name: 'Astronomie', description: 'Actualités astronomie' },
    { name: 'Météorologie', description: 'Actualités météorologie' },
    { name: 'Biologie', description: 'Actualités biologie' },
    { name: 'Chimie', description: 'Actualités chimie' },
    { name: 'Physique', description: 'Actualités physique' },
    { name: 'Mathématiques', description: 'Actualités mathématiques' },
    { name: 'Psychologie', description: 'Actualités psychologie' },
    { name: 'Sociologie', description: 'Actualités sociologie' },
    { name: 'Anthropologie', description: 'Actualités anthropologie' },
    { name: 'Philosophie', description: 'Actualités philosophie' },
    { name: 'Éthique', description: 'Actualités éthique' },
    { name: 'Droits', description: 'Actualités droits' },
    { name: 'Droits de l\'homme', description: 'Actualités droits de l\'homme' },
    { name: 'Féminisme', description: 'Actualités féminisme' },
    { name: 'LGBTQ+', description: 'Actualités LGBTQ+' },
    { name: 'Diversité', description: 'Actualités diversité' },
    { name: 'Inclusion', description: 'Actualités inclusion' },
    { name: 'Discrimination', description: 'Actualités discrimination' },
    { name: 'Racisme', description: 'Actualités racisme' },
    { name: 'Immigration', description: 'Actualités immigration' },
    { name: 'Réfugiés', description: 'Actualités réfugiés' },
    { name: 'Terrorisme', description: 'Actualités terrorisme' },
    { name: 'Guerre', description: 'Actualités guerre' },
    { name: 'Paix', description: 'Actualités paix' },
    { name: 'Diplomatie', description: 'Actualités diplomatie' },
    { name: 'Relations internationales', description: 'Actualités relations internationales' },
    { name: 'ONU', description: 'Actualités ONU' },
    { name: 'Union européenne', description: 'Actualités Union européenne' },
    { name: 'OTAN', description: 'Actualités OTAN' },
    { name: 'Commerce', description: 'Actualités commerce' },
    { name: 'Import-export', description: 'Actualités import-export' },
    { name: 'Douane', description: 'Actualités douane' },
    { name: 'Fiscalité', description: 'Actualités fiscalité' },
    { name: 'Impôts', description: 'Actualités impôts' },
    { name: 'Retraite', description: 'Actualités retraite' },
    { name: 'Chômage', description: 'Actualités chômage' },
    { name: 'Emploi', description: 'Actualités emploi' },
    { name: 'Formation', description: 'Actualités formation' },
    { name: 'Reconversion', description: 'Actualités reconversion' },
    { name: 'Télétravail', description: 'Actualités télétravail' },
    { name: 'Freelance', description: 'Actualités freelance' },
    { name: 'Entrepreneuriat', description: 'Actualités entrepreneuriat' },
    { name: 'Innovation', description: 'Actualités innovation' },
    { name: 'Recherche et développement', description: 'Actualités R&D' },
    { name: 'Brevet', description: 'Actualités brevets' },
    { name: 'Propriété intellectuelle', description: 'Actualités propriété intellectuelle' },
    { name: 'Données', description: 'Actualités données' },
    { name: 'Privacy', description: 'Actualités vie privée' },
    { name: 'Cybersécurité', description: 'Actualités cybersécurité' },
    { name: 'Hacking', description: 'Actualités hacking' },
    { name: 'Virus', description: 'Actualités virus informatiques' },
    { name: 'Malware', description: 'Actualités malware' },
    { name: 'Blockchain', description: 'Actualités blockchain' },
    { name: 'NFT', description: 'Actualités NFT' },
    { name: 'Métavers', description: 'Actualités métavers' },
    { name: 'Réalité virtuelle', description: 'Actualités réalité virtuelle' },
    { name: 'Réalité augmentée', description: 'Actualités réalité augmentée' },
    { name: 'Robotique', description: 'Actualités robotique' },
    { name: 'Drones', description: 'Actualités drones' },
    { name: 'Voiture autonome', description: 'Actualités voiture autonome' },
    { name: 'Énergie renouvelable', description: 'Actualités énergie renouvelable' },
    { name: 'Solaire', description: 'Actualités solaire' },
    { name: 'Éolien', description: 'Actualités éolien' },
    { name: 'Hydrogène', description: 'Actualités hydrogène' },
    { name: 'Nucléaire', description: 'Actualités nucléaire' },
    { name: 'Pétrole', description: 'Actualités pétrole' },
    { name: 'Gaz', description: 'Actualités gaz' },
    { name: 'Charbon', description: 'Actualités charbon' },
    { name: 'Déchets', description: 'Actualités déchets' },
    { name: 'Recyclage', description: 'Actualités recyclage' },
    { name: 'Pollution', description: 'Actualités pollution' },
    { name: 'Qualité de l\'air', description: 'Actualités qualité de l\'air' },
    { name: 'Eau', description: 'Actualités eau' },
    { name: 'Océans', description: 'Actualités océans' },
    { name: 'Forêts', description: 'Actualités forêts' },
    { name: 'Biodiversité', description: 'Actualités biodiversité' },
    { name: 'Espèces menacées', description: 'Actualités espèces menacées' },
    { name: 'Conservation', description: 'Actualités conservation' },
    { name: 'Parcs naturels', description: 'Actualités parcs naturels' },
    { name: 'Agriculture biologique', description: 'Actualités agriculture biologique' },
    { name: 'Alimentation', description: 'Actualités alimentation' },
    { name: 'Sécurité alimentaire', description: 'Actualités sécurité alimentaire' },
    { name: 'OGM', description: 'Actualités OGM' },
    { name: 'Pesticides', description: 'Actualités pesticides' },
    { name: 'Bien-être animal', description: 'Actualités bien-être animal' },
    { name: 'Veganisme', description: 'Actualités véganisme' },
    { name: 'Végétarisme', description: 'Actualités végétarisme' },
    { name: 'Fast-food', description: 'Actualités fast-food' },
    { name: 'Restaurant', description: 'Actualités restaurant' },
    { name: 'Hôtellerie', description: 'Actualités hôtellerie' },
    { name: 'Tourisme durable', description: 'Actualités tourisme durable' },
    { name: 'Écotourisme', description: 'Actualités écotourisme' },
    { name: 'Aventure', description: 'Actualités aventure' },
    { name: 'Extrême', description: 'Actualités sports extrêmes' },
    { name: 'Olympiques', description: 'Actualités olympiques' },
    { name: 'Paralympiques', description: 'Actualités paralympiques' },
    { name: 'Football', description: 'Actualités football' },
    { name: 'Basketball', description: 'Actualités basketball' },
    { name: 'Tennis', description: 'Actualités tennis' },
    { name: 'Rugby', description: 'Actualités rugby' },
    { name: 'Cyclisme', description: 'Actualités cyclisme' },
    { name: 'Athlétisme', description: 'Actualités athlétisme' },
    { name: 'Natation', description: 'Actualités natation' },
    { name: 'Combat', description: 'Actualités sports de combat' },
    { name: 'E-sport', description: 'Actualités e-sport' },
    { name: 'Jeux vidéo', description: 'Actualités jeux vidéo' },
    { name: 'Mobile', description: 'Actualités mobile' },
    { name: 'Applications', description: 'Actualités applications' },
    { name: 'Réseaux sociaux', description: 'Actualités réseaux sociaux' },
    { name: 'Influence', description: 'Actualités influence' },
    { name: 'Marketing', description: 'Actualités marketing' },
    { name: 'Publicité', description: 'Actualités publicité' },
    { name: 'Branding', description: 'Actualités branding' },
    { name: 'Communication', description: 'Actualités communication' },
    { name: 'Presse', description: 'Actualités presse' },
    { name: 'Journalisme', description: 'Actualités journalisme' },
    { name: 'Médias sociaux', description: 'Actualités médias sociaux' },
    { name: 'Fake news', description: 'Actualités fake news' },
    { name: 'Désinformation', description: 'Actualités désinformation' },
    { name: 'Médias traditionnels', description: 'Actualités médias traditionnels' },
    { name: 'Radio', description: 'Actualités radio' },
    { name: 'Télévision', description: 'Actualités télévision' },
    { name: 'Presse écrite', description: 'Actualités presse écrite' },
    { name: 'Magazines', description: 'Actualités magazines' },
    { name: 'Livres', description: 'Actualités livres' },
    { name: 'Édition', description: 'Actualités édition' },
    { name: 'Bibliothèques', description: 'Actualités bibliothèques' },
    { name: 'Musées', description: 'Actualités musées' },
    { name: 'Expositions', description: 'Actualités expositions' },
    { name: 'Festivals', description: 'Actualités festivals' },
    { name: 'Concerts', description: 'Actualités concerts' },
    { name: 'Spectacles', description: 'Actualités spectacles' },
    { name: 'Comédie', description: 'Actualités comédie' },
    { name: 'Humour', description: 'Actualités humour' },
    { name: 'Stand-up', description: 'Actualités stand-up' },
    { name: 'Improvisation', description: 'Actualités improvisation' },
    { name: 'Cirque', description: 'Actualités cirque' },
    { name: 'Magie', description: 'Actualités magie' },
    { name: 'Voyage', description: 'Actualités voyage' },
    { name: 'Aventure', description: 'Actualités aventure' },
    { name: 'Exploration', description: 'Actualités exploration' },
    { name: 'Découverte', description: 'Actualités découverte' },
    { name: 'Culture locale', description: 'Actualités culture locale' },
    { name: 'Traditions', description: 'Actualités traditions' },
    { name: 'Folklore', description: 'Actualités folklore' },
    { name: 'Langues', description: 'Actualités langues' },
    { name: 'Traduction', description: 'Actualités traduction' },
    { name: 'Interprétation', description: 'Actualités interprétation' },
    { name: 'Échanges culturels', description: 'Actualités échanges culturels' },
    { name: 'Coopération', description: 'Actualités coopération' },
    { name: 'Partenariats', description: 'Actualités partenariats' },
    { name: 'Alliances', description: 'Actualités alliances' },
    { name: 'Conflits', description: 'Actualités conflits' },
    { name: 'Négociations', description: 'Actualités négociations' },
    { name: 'Accords', description: 'Actualités accords' },
    { name: 'Traités', description: 'Actualités traités' },
    { name: 'Sanctions', description: 'Actualités sanctions' },
    { name: 'Embargos', description: 'Actualités embargos' },
    { name: 'Commerce international', description: 'Actualités commerce international' },
    { name: 'Globalisation', description: 'Actualités globalisation' },
    { name: 'Localisation', description: 'Actualités localisation' },
    { name: 'Délocalisation', description: 'Actualités délocalisation' },
    { name: 'Relocalisation', description: 'Actualités relocalisation' },
    { name: 'Production', description: 'Actualités production' },
    { name: 'Industrie', description: 'Actualités industrie' },
    { name: 'Manufacturing', description: 'Actualités manufacturing' },
    { name: 'Supply chain', description: 'Actualités supply chain' },
    { name: 'Logistique', description: 'Actualités logistique' },
    { name: 'Distribution', description: 'Actualités distribution' },
    { name: 'Vente au détail', description: 'Actualités vente au détail' },
    { name: 'E-commerce', description: 'Actualités e-commerce' },
    { name: 'Marketplace', description: 'Actualités marketplace' },
    { name: 'Livraison', description: 'Actualités livraison' },
    { name: 'Colis', description: 'Actualités colis' },
    { name: 'Poste', description: 'Actualités poste' },
    { name: 'Courrier', description: 'Actualités courrier' },
    { name: 'Télécommunications', description: 'Actualités télécommunications' },
    { name: 'Internet', description: 'Actualités internet' },
    { name: 'Fibre', description: 'Actualités fibre' },
    { name: '5G', description: 'Actualités 5G' },
    { name: '6G', description: 'Actualités 6G' },
    { name: 'Satellite', description: 'Actualités satellite' },
    { name: 'Starlink', description: 'Actualités Starlink' },
    { name: 'SpaceX', description: 'Actualités SpaceX' },
    { name: 'NASA', description: 'Actualités NASA' },
    { name: 'ESA', description: 'Actualités ESA' },
    { name: 'Exploration spatiale', description: 'Actualités exploration spatiale' },
    { name: 'Mars', description: 'Actualités Mars' },
    { name: 'Lune', description: 'Actualités Lune' },
    { name: 'Astéroïdes', description: 'Actualités astéroïdes' },
    { name: 'Comètes', description: 'Actualités comètes' },
    { name: 'Trou noir', description: 'Actualités trou noir' },
    { name: 'Exoplanètes', description: 'Actualités exoplanètes' },
    { name: 'Vie extraterrestre', description: 'Actualités vie extraterrestre' },
    { name: 'OVNI', description: 'Actualités OVNI' },
    { name: 'UFO', description: 'Actualités UFO' },
    { name: 'Paranormal', description: 'Actualités paranormal' },
    { name: 'Mystères', description: 'Actualités mystères' },
    { name: 'Conspiration', description: 'Actualités conspiration' },
    { name: 'Théories', description: 'Actualités théories' },
    { name: 'Hypothèses', description: 'Actualités hypothèses' },
    { name: 'Découvertes', description: 'Actualités découvertes' },
    { name: 'Inventions', description: 'Actualités inventions' },
    { name: 'Prix Nobel', description: 'Actualités prix Nobel' },
    { name: 'Récompenses', description: 'Actualités récompenses' },
    { name: 'Distinctions', description: 'Actualités distinctions' },
    { name: 'Cérémonies', description: 'Actualités cérémonies' },
    { name: 'Remises de prix', description: 'Actualités remises de prix' },
    { name: 'Oscars', description: 'Actualités Oscars' },
    { name: 'Grammy', description: 'Actualités Grammy' },
    { name: 'Cannes', description: 'Actualités Cannes' },
    { name: 'Venise', description: 'Actualités Venise' },
    { name: 'Berlin', description: 'Actualités Berlin' },
    { name: 'Sundance', description: 'Actualités Sundance' },
    { name: 'Emmy', description: 'Actualités Emmy' },
    { name: 'Tony', description: 'Actualités Tony' },
    { name: 'Golden Globe', description: 'Actualités Golden Globe' },
    { name: 'BAFTA', description: 'Actualités BAFTA' },
    { name: 'César', description: 'Actualités César' },
    { name: 'Molière', description: 'Actualités Molière' },
    { name: 'Victoires de la musique', description: 'Actualités Victoires de la musique' },
    { name: 'NRJ Music Awards', description: 'Actualités NRJ Music Awards' },
    { name: 'MTV', description: 'Actualités MTV' },
    { name: 'VMA', description: 'Actualités VMA' },
    { name: 'Billboard', description: 'Actualités Billboard' },
    { name: 'Charts', description: 'Actualités charts' },
    { name: 'Hit parade', description: 'Actualités hit parade' },
    { name: 'Tops', description: 'Actualités tops' },
    { name: 'Classements', description: 'Actualités classements' },
    { name: 'Records', description: 'Actualités records' },
    { name: 'Guinness', description: 'Actualités Guinness World Records' },
    { name: 'Exploits', description: 'Actualités exploits' },
    { name: 'Performances', description: 'Actualités performances' },
    { name: 'Réussites', description: 'Actualités réussites' },
    { name: 'Succès', description: 'Actualités succès' },
    { name: 'Échecs', description: 'Actualités échecs' },
    { name: 'Faillites', description: 'Actualités faillites' },
    { name: 'Liquidations', description: 'Actualités liquidations' },
    { name: 'Fermetures', description: 'Actualités fermetures' },
    { name: 'Ouvertures', description: 'Actualités ouvertures' },
    { name: 'Lancements', description: 'Actualités lancements' },
    { name: 'Sorties', description: 'Actualités sorties' },
    { name: 'Précommandes', description: 'Actualités précommandes' },
    { name: 'Avis', description: 'Actualités avis' },
    { name: 'Tests', description: 'Actualités tests' },
    { name: 'Comparaisons', description: 'Actualités comparaisons' },
    { name: 'Guides', description: 'Actualités guides' },
    { name: 'Tutoriels', description: 'Actualités tutoriels' },
    { name: 'Conseils', description: 'Actualités conseils' },
    { name: 'Astuces', description: 'Actualités astuces' },
    { name: 'Trucs', description: 'Actualités trucs' },
    { name: 'Hacks', description: 'Actualités hacks' },
    { name: 'Life hacks', description: 'Actualités life hacks' },
    { name: 'DIY', description: 'Actualités DIY' },
    { name: 'Bricolage', description: 'Actualités bricolage' },
    { name: 'Jardinage', description: 'Actualités jardinage' },
    { name: 'Décoration', description: 'Actualités décoration' },
    { name: 'Rénovation', description: 'Actualités rénovation' },
    { name: 'Construction', description: 'Actualités construction' },
    { name: 'Immobilier neuf', description: 'Actualités immobilier neuf' },
    { name: 'Immobilier ancien', description: 'Actualités immobilier ancien' },
    { name: 'Location', description: 'Actualités location' },
    { name: 'Achat', description: 'Actualités achat' },
    { name: 'Vente', description: 'Actualités vente' },
    { name: 'Prêt', description: 'Actualités prêt' },
    { name: 'Crédit', description: 'Actualités crédit' },
    { name: 'Hypothèque', description: 'Actualités hypothèque' },
    { name: 'Assurance habitation', description: 'Actualités assurance habitation' },
    { name: 'Assurance auto', description: 'Actualités assurance auto' },
    { name: 'Assurance santé', description: 'Actualités assurance santé' },
    { name: 'Assurance vie', description: 'Actualités assurance vie' },
    { name: 'Retraite', description: 'Actualités retraite' },
    { name: 'Épargne', description: 'Actualités épargne' },
    { name: 'Investissement', description: 'Actualités investissement' },
    { name: 'Épargne retraite', description: 'Actualités épargne retraite' },
    { name: 'PERP', description: 'Actualités PERP' },
    { name: 'PER', description: 'Actualités PER' },
    { name: 'Livret A', description: 'Actualités Livret A' },
    { name: 'LDDS', description: 'Actualités LDDS' },
    { name: 'PEL', description: 'Actualités PEL' },
    { name: 'CEL', description: 'Actualités CEL' },
    { name: 'Assurance-vie', description: 'Actualités assurance-vie' },
    { name: 'SCPI', description: 'Actualités SCPI' },
    { name: 'Crowdfunding', description: 'Actualités crowdfunding' },
    { name: 'Financement participatif', description: 'Actualités financement participatif' },
    { name: 'Don', description: 'Actualités don' },
    { name: 'Mécénat', description: 'Actualités mécénat' },
    { name: 'Sponsoring', description: 'Actualités sponsoring' },
    { name: 'Partenariats', description: 'Actualités partenariats' },
    { name: 'Collaborations', description: 'Actualités collaborations' },
    { name: 'Fusions', description: 'Actualités fusions' },
    { name: 'Acquisitions', description: 'Actualités acquisitions' },
    { name: 'Rachats', description: 'Actualités rachats' },
    { name: 'OPA', description: 'Actualités OPA' },
    { name: 'OPE', description: 'Actualités OPE' },
    { name: 'Introduction en bourse', description: 'Actualités introduction en bourse' },
    { name: 'IPO', description: 'Actualités IPO' },
    { name: 'Cotation', description: 'Actualités cotation' },
    { name: 'CAC 40', description: 'Actualités CAC 40' },
    { name: 'Dow Jones', description: 'Actualités Dow Jones' },
    { name: 'NASDAQ', description: 'Actualités NASDAQ' },
    { name: 'S&P 500', description: 'Actualités S&P 500' },
    { name: 'FTSE', description: 'Actualités FTSE' },
    { name: 'DAX', description: 'Actualités DAX' },
    { name: 'Nikkei', description: 'Actualités Nikkei' },
    { name: 'Hang Seng', description: 'Actualités Hang Seng' },
    { name: 'Shanghai', description: 'Actualités Shanghai' },
    { name: 'Bourse', description: 'Actualités boursières' }
];

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Actualités\n');
        
        // 1. Vérifier/Créer la catégorie
        console.log('📋 Vérification de la catégorie Actualités...');
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Actualités')
            .single();
        
        if (catError && catError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Actualités...');
            const { data: theme } = await supabase
                .from('themes')
                .select('id')
                .in('name', ['Société', 'Divertissement', 'Tout'])
                .limit(1)
                .single();
            
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert({
                    name: 'Actualités',
                    color: 'orange',
                    description: 'Informations et news du moment',
                    theme_id: theme?.id || null
                })
                .select()
                .single();
            
            if (createError) throw createError;
            category = newCat;
        }
        
        const categoryId = category.id;
        console.log(`✅ Catégorie ID: ${categoryId}\n`);
        
        // 2. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', categoryId);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion directe avec la clé service_role (contourne RLS)
        console.log('💾 Insertion directe des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        // Insérer par batch de 50 pour éviter les timeouts
        const batchSize = 50;
        for (let i = 0; i < toAdd.length; i += batchSize) {
            const batch = toAdd.slice(i, i + batchSize);
            const batchData = batch.map(sub => ({
                name: sub.name,
                description: sub.description,
                category_id: categoryId,
                created_at: now,
                updated_at: now
            }));
            
            const { error } = await supabase
                .from('subcategories')
                .insert(batchData);
            
            if (error) {
                // Si erreur batch, essayer une par une
                for (const sub of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert({
                            name: sub.name,
                            description: sub.description,
                            category_id: categoryId,
                            created_at: now,
                            updated_at: now
                        });
                    
                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            success++;
                        } else {
                            console.log(`⚠️  "${sub.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        success++;
                    }
                }
            } else {
                success += batch.length;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Actualités`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

