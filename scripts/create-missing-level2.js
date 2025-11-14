#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const structure = {
    'Géographie': [
        { name: 'National', description: 'Actualités nationales' },
        { name: 'Régional', description: 'Actualités régionales' },
        { name: 'Local', description: 'Actualités locales' },
        { name: 'Europe', description: 'Actualités européennes' },
        { name: 'Amérique', description: 'Actualités américaines' },
        { name: 'Asie', description: 'Actualités asiatiques' },
        { name: 'Afrique', description: 'Actualités africaines' },
        { name: 'Moyen-Orient', description: 'Actualités Moyen-Orient' },
        { name: 'Océanie', description: 'Actualités Océanie' },
        { name: 'International', description: 'Actualités internationales' }
    ],
    'Réseaux sociaux': [
        { name: 'YouTube', description: 'Actualités YouTube' },
        { name: 'TikTok', description: 'Actualités TikTok' },
        { name: 'Instagram', description: 'Actualités Instagram' },
        { name: 'Twitter', description: 'Actualités Twitter' },
        { name: 'Facebook', description: 'Actualités Facebook' },
        { name: 'LinkedIn', description: 'Actualités LinkedIn' },
        { name: 'Snapchat', description: 'Actualités Snapchat' },
        { name: 'Pinterest', description: 'Actualités Pinterest' },
        { name: 'Reddit', description: 'Actualités Reddit' },
        { name: 'Discord', description: 'Actualités Discord' },
        { name: 'Twitch', description: 'Actualités Twitch' },
        { name: 'Telegram', description: 'Actualités Telegram' },
        { name: 'WhatsApp', description: 'Actualités WhatsApp' },
        { name: 'Clubhouse', description: 'Actualités Clubhouse' },
        { name: 'BeReal', description: 'Actualités BeReal' }
    ],
    'Divertissement': [
        { name: 'Téléréalité', description: 'Actualités téléréalité' },
        { name: 'Influenceurs', description: 'Actualités influenceurs' },
        { name: 'Célébrités', description: 'Actualités célébrités' },
        { name: 'People', description: 'Actualités people' },
        { name: 'Cinéma', description: 'Actualités cinéma' },
        { name: 'Séries TV', description: 'Actualités séries télévisées' },
        { name: 'Musique', description: 'Actualités musique' },
        { name: 'Gaming', description: 'Actualités gaming' },
        { name: 'E-sport', description: 'Actualités e-sport' },
        { name: 'Streaming', description: 'Actualités streaming' },
        { name: 'Podcast', description: 'Actualités podcast' },
        { name: 'Comédie', description: 'Actualités comédie' },
        { name: 'Humour', description: 'Actualités humour' },
        { name: 'Stand-up', description: 'Actualités stand-up' },
        { name: 'Théâtre', description: 'Actualités théâtre' },
        { name: 'Danse', description: 'Actualités danse' },
        { name: 'Cirque', description: 'Actualités cirque' },
        { name: 'Magie', description: 'Actualités magie' },
        { name: 'Festivals', description: 'Actualités festivals' },
        { name: 'Concerts', description: 'Actualités concerts' },
        { name: 'Spectacles', description: 'Actualités spectacles' }
    ],
    'Médias': [
        { name: 'Presse', description: 'Actualités presse' },
        { name: 'Télévision', description: 'Actualités télévision' },
        { name: 'Radio', description: 'Actualités radio' },
        { name: 'Presse écrite', description: 'Actualités presse écrite' },
        { name: 'Magazines', description: 'Actualités magazines' },
        { name: 'Journalisme', description: 'Actualités journalisme' },
        { name: 'Médias traditionnels', description: 'Actualités médias traditionnels' },
        { name: 'Médias sociaux', description: 'Actualités médias sociaux' },
        { name: 'Fake news', description: 'Actualités fake news' },
        { name: 'Désinformation', description: 'Actualités désinformation' },
        { name: 'Fact-checking', description: 'Vérification des faits' }
    ],
    'Format/Type': [
        { name: 'Breaking news', description: 'Actualités en temps réel' },
        { name: 'Live', description: 'Actualités en direct' },
        { name: 'Reportage', description: 'Reportages d\'actualité' },
        { name: 'Interview', description: 'Interviews d\'actualité' },
        { name: 'Débat', description: 'Débats d\'actualité' },
        { name: 'Opinion', description: 'Opinions sur l\'actualité' },
        { name: 'Décryptage', description: 'Décryptage de l\'actualité' },
        { name: 'Résumé', description: 'Résumés d\'actualité' },
        { name: 'Tendances', description: 'Tendances de l\'actualité' },
        { name: 'Scoop', description: 'Scoops exclusifs' },
        { name: 'Exclusivité', description: 'Actualités exclusives' },
        { name: 'Révélation', description: 'Révélations et scoops' },
        { name: 'Scandale', description: 'Scandales et révélations' },
        { name: 'Crise', description: 'Crises et urgences' },
        { name: 'Urgence', description: 'Actualités urgences' }
    ],
    'Économie': [
        { name: 'Business', description: 'Actualités business' },
        { name: 'Finance', description: 'Actualités financières' },
        { name: 'Bourse', description: 'Actualités boursières' },
        { name: 'Startup', description: 'Actualités startups' },
        { name: 'Entrepreneuriat', description: 'Actualités entrepreneuriat' },
        { name: 'Commerce', description: 'Actualités commerce' },
        { name: 'E-commerce', description: 'Actualités e-commerce' },
        { name: 'Crypto', description: 'Actualités cryptomonnaies' },
        { name: 'Blockchain', description: 'Actualités blockchain' },
        { name: 'Fiscalité', description: 'Actualités fiscalité' },
        { name: 'Impôts', description: 'Actualités impôts' },
        { name: 'Emploi', description: 'Actualités emploi' },
        { name: 'Chômage', description: 'Actualités chômage' },
        { name: 'Télétravail', description: 'Actualités télétravail' },
        { name: 'Freelance', description: 'Actualités freelance' }
    ],
    'Sport': [
        { name: 'Football', description: 'Actualités football' },
        { name: 'Basketball', description: 'Actualités basketball' },
        { name: 'Tennis', description: 'Actualités tennis' },
        { name: 'Rugby', description: 'Actualités rugby' },
        { name: 'Cyclisme', description: 'Actualités cyclisme' },
        { name: 'Athlétisme', description: 'Actualités athlétisme' },
        { name: 'Natation', description: 'Actualités natation' },
        { name: 'Combat', description: 'Actualités sports de combat' },
        { name: 'E-sport', description: 'Actualités e-sport' },
        { name: 'Olympiques', description: 'Actualités olympiques' },
        { name: 'Paralympiques', description: 'Actualités paralympiques' },
        { name: 'Extrême', description: 'Actualités sports extrêmes' }
    ],
    'Culture': [
        { name: 'Art', description: 'Actualités art' },
        { name: 'Littérature', description: 'Actualités littérature' },
        { name: 'Livres', description: 'Actualités livres' },
        { name: 'Édition', description: 'Actualités édition' },
        { name: 'Musées', description: 'Actualités musées' },
        { name: 'Expositions', description: 'Actualités expositions' },
        { name: 'Bibliothèques', description: 'Actualités bibliothèques' },
        { name: 'Patrimoine', description: 'Actualités patrimoine' },
        { name: 'Histoire', description: 'Actualités histoire' },
        { name: 'Archéologie', description: 'Actualités archéologie' },
        { name: 'Traditions', description: 'Actualités traditions' },
        { name: 'Folklore', description: 'Actualités folklore' },
        { name: 'Langues', description: 'Actualités langues' }
    ],
    'Technologie': [
        { name: 'IA', description: 'Actualités intelligence artificielle' },
        { name: 'Robotique', description: 'Actualités robotique' },
        { name: 'Drones', description: 'Actualités drones' },
        { name: 'Voiture autonome', description: 'Actualités voiture autonome' },
        { name: 'Blockchain', description: 'Actualités blockchain' },
        { name: 'NFT', description: 'Actualités NFT' },
        { name: 'Métavers', description: 'Actualités métavers' },
        { name: 'Réalité virtuelle', description: 'Actualités réalité virtuelle' },
        { name: 'Réalité augmentée', description: 'Actualités réalité augmentée' },
        { name: '5G', description: 'Actualités 5G' },
        { name: '6G', description: 'Actualités 6G' },
        { name: 'Internet', description: 'Actualités internet' },
        { name: 'Cybersécurité', description: 'Actualités cybersécurité' },
        { name: 'Hacking', description: 'Actualités hacking' },
        { name: 'Applications', description: 'Actualités applications' },
        { name: 'Mobile', description: 'Actualités mobile' },
        { name: 'Jeux vidéo', description: 'Actualités jeux vidéo' }
    ],
    'Santé': [
        { name: 'Médecine', description: 'Actualités médecine' },
        { name: 'Recherche médicale', description: 'Actualités recherche médicale' },
        { name: 'Hôpitaux', description: 'Actualités hôpitaux' },
        { name: 'Assurance santé', description: 'Actualités assurance santé' },
        { name: 'Médicaments', description: 'Actualités médicaments' },
        { name: 'Vaccins', description: 'Actualités vaccins' },
        { name: 'Épidémies', description: 'Actualités épidémies' },
        { name: 'Pandémies', description: 'Actualités pandémies' },
        { name: 'Bien-être', description: 'Actualités bien-être' },
        { name: 'Psychologie', description: 'Actualités psychologie' },
        { name: 'Santé mentale', description: 'Actualités santé mentale' }
    ],
    'Environnement': [
        { name: 'Climat', description: 'Actualités climat' },
        { name: 'Écologie', description: 'Actualités écologie' },
        { name: 'Pollution', description: 'Actualités pollution' },
        { name: 'Recyclage', description: 'Actualités recyclage' },
        { name: 'Déchets', description: 'Actualités déchets' },
        { name: 'Énergie renouvelable', description: 'Actualités énergie renouvelable' },
        { name: 'Solaire', description: 'Actualités solaire' },
        { name: 'Éolien', description: 'Actualités éolien' },
        { name: 'Biodiversité', description: 'Actualités biodiversité' },
        { name: 'Espèces menacées', description: 'Actualités espèces menacées' },
        { name: 'Forêts', description: 'Actualités forêts' },
        { name: 'Océans', description: 'Actualités océans' },
        { name: 'Eau', description: 'Actualités eau' },
        { name: 'Qualité de l\'air', description: 'Actualités qualité de l\'air' }
    ],
    'Science': [
        { name: 'Recherche', description: 'Actualités recherche' },
        { name: 'Découvertes', description: 'Actualités découvertes' },
        { name: 'Inventions', description: 'Actualités inventions' },
        { name: 'Astronomie', description: 'Actualités astronomie' },
        { name: 'Espace', description: 'Actualités espace' },
        { name: 'Exploration spatiale', description: 'Actualités exploration spatiale' },
        { name: 'Biologie', description: 'Actualités biologie' },
        { name: 'Chimie', description: 'Actualités chimie' },
        { name: 'Physique', description: 'Actualités physique' },
        { name: 'Mathématiques', description: 'Actualités mathématiques' },
        { name: 'Géologie', description: 'Actualités géologie' },
        { name: 'Météorologie', description: 'Actualités météorologie' },
        { name: 'Météo', description: 'Actualités météo' },
        { name: 'Prix Nobel', description: 'Actualités prix Nobel' }
    ],
    'Société': [
        { name: 'Éducation', description: 'Actualités éducation' },
        { name: 'École', description: 'Actualités école' },
        { name: 'Université', description: 'Actualités université' },
        { name: 'Formation', description: 'Actualités formation' },
        { name: 'Jeunesse', description: 'Actualités jeunesse' },
        { name: 'Famille', description: 'Actualités famille' },
        { name: 'Parentalité', description: 'Actualités parentalité' },
        { name: 'Retraite', description: 'Actualités retraite' },
        { name: 'Immigration', description: 'Actualités immigration' },
        { name: 'Réfugiés', description: 'Actualités réfugiés' },
        { name: 'Diversité', description: 'Actualités diversité' },
        { name: 'Inclusion', description: 'Actualités inclusion' },
        { name: 'Féminisme', description: 'Actualités féminisme' },
        { name: 'LGBTQ+', description: 'Actualités LGBTQ+' },
        { name: 'Discrimination', description: 'Actualités discrimination' },
        { name: 'Racisme', description: 'Actualités racisme' },
        { name: 'Solidarité', description: 'Actualités solidarité' },
        { name: 'Associations', description: 'Actualités associations' },
        { name: 'Bénévolat', description: 'Actualités bénévolat' },
        { name: 'Humanitaire', description: 'Actualités humanitaire' }
    ],
    'Justice': [
        { name: 'Procès', description: 'Actualités procès' },
        { name: 'Tribunaux', description: 'Actualités tribunaux' },
        { name: 'Lois', description: 'Actualités lois' },
        { name: 'Réformes judiciaires', description: 'Actualités réformes judiciaires' },
        { name: 'Droits', description: 'Actualités droits' },
        { name: 'Droits de l\'homme', description: 'Actualités droits de l\'homme' },
        { name: 'Police', description: 'Actualités police' },
        { name: 'Sécurité', description: 'Actualités sécurité' },
        { name: 'Criminalité', description: 'Actualités criminalité' }
    ],
    'Politique': [
        { name: 'Analyses politiques', description: 'Décryptage des événements politiques' },
        { name: 'Élections', description: 'Actualités électorales' },
        { name: 'Gouvernement', description: 'Actualités gouvernement' },
        { name: 'Parlement', description: 'Actualités parlement' },
        { name: 'Partis politiques', description: 'Actualités partis politiques' },
        { name: 'Diplomatie', description: 'Actualités diplomatie' },
        { name: 'Relations internationales', description: 'Actualités relations internationales' },
        { name: 'ONU', description: 'Actualités ONU' },
        { name: 'Union européenne', description: 'Actualités Union européenne' },
        { name: 'OTAN', description: 'Actualités OTAN' },
        { name: 'Manifestations', description: 'Actualités manifestations' },
        { name: 'Mouvements sociaux', description: 'Actualités mouvements sociaux' }
    ],
    'Mode & Beauté': [
        { name: 'Mode', description: 'Actualités mode' },
        { name: 'Fashion', description: 'Actualités fashion' },
        { name: 'Beauté', description: 'Actualités beauté' },
        { name: 'Cosmétiques', description: 'Actualités cosmétiques' },
        { name: 'Luxe', description: 'Actualités luxe' },
        { name: 'Défilés', description: 'Actualités défilés' },
        { name: 'Design', description: 'Actualités design' }
    ],
    'Voyage & Tourisme': [
        { name: 'Voyage', description: 'Actualités voyage' },
        { name: 'Tourisme', description: 'Actualités tourisme' },
        { name: 'Tourisme durable', description: 'Actualités tourisme durable' },
        { name: 'Écotourisme', description: 'Actualités écotourisme' },
        { name: 'Aventure', description: 'Actualités aventure' },
        { name: 'Exploration', description: 'Actualités exploration' },
        { name: 'Hôtellerie', description: 'Actualités hôtellerie' },
        { name: 'Restaurant', description: 'Actualités restaurant' },
        { name: 'Gastronomie', description: 'Actualités gastronomie' }
    ],
    'Transport': [
        { name: 'Automobile', description: 'Actualités automobile' },
        { name: 'Aéronautique', description: 'Actualités aéronautique' },
        { name: 'Aviation', description: 'Actualités aviation' },
        { name: 'Maritime', description: 'Actualités maritime' },
        { name: 'Ferroviaire', description: 'Actualités ferroviaire' },
        { name: 'Mobilité', description: 'Actualités mobilité' },
        { name: 'Vélo', description: 'Actualités vélo' },
        { name: 'Transport public', description: 'Actualités transport public' }
    ],
    'Énergie': [
        { name: 'Énergie renouvelable', description: 'Actualités énergie renouvelable' },
        { name: 'Nucléaire', description: 'Actualités nucléaire' },
        { name: 'Pétrole', description: 'Actualités pétrole' },
        { name: 'Gaz', description: 'Actualités gaz' },
        { name: 'Charbon', description: 'Actualités charbon' },
        { name: 'Hydrogène', description: 'Actualités hydrogène' },
        { name: 'Solaire', description: 'Actualités solaire' },
        { name: 'Éolien', description: 'Actualités éolien' }
    ],
    'Agriculture': [
        { name: 'Agriculture biologique', description: 'Actualités agriculture biologique' },
        { name: 'Alimentation', description: 'Actualités alimentation' },
        { name: 'Sécurité alimentaire', description: 'Actualités sécurité alimentaire' },
        { name: 'OGM', description: 'Actualités OGM' },
        { name: 'Pesticides', description: 'Actualités pesticides' },
        { name: 'Bien-être animal', description: 'Actualités bien-être animal' },
        { name: 'Veganisme', description: 'Actualités véganisme' },
        { name: 'Végétarisme', description: 'Actualités végétarisme' }
    ],
    'Immobilier': [
        { name: 'Immobilier neuf', description: 'Actualités immobilier neuf' },
        { name: 'Immobilier ancien', description: 'Actualités immobilier ancien' },
        { name: 'Location', description: 'Actualités location' },
        { name: 'Achat', description: 'Actualités achat' },
        { name: 'Vente', description: 'Actualités vente' },
        { name: 'Prêt immobilier', description: 'Actualités prêt immobilier' },
        { name: 'Urbanisme', description: 'Actualités urbanisme' },
        { name: 'Architecture', description: 'Actualités architecture' },
        { name: 'Construction', description: 'Actualités construction' },
        { name: 'Rénovation', description: 'Actualités rénovation' }
    ],
    'Autres': [
        { name: 'Religion', description: 'Actualités religion' },
        { name: 'Spiritualité', description: 'Actualités spiritualité' },
        { name: 'Philosophie', description: 'Actualités philosophie' },
        { name: 'Éthique', description: 'Actualités éthique' },
        { name: 'Guerre', description: 'Actualités guerre' },
        { name: 'Paix', description: 'Actualités paix' },
        { name: 'Terrorisme', description: 'Actualités terrorisme' },
        { name: 'Conflits', description: 'Actualités conflits' },
        { name: 'Accidents', description: 'Actualités accidents' },
        { name: 'Catastrophes', description: 'Actualités catastrophes' },
        { name: 'Récompenses', description: 'Actualités récompenses' },
        { name: 'Cérémonies', description: 'Actualités cérémonies' },
        { name: 'Oscars', description: 'Actualités Oscars' },
        { name: 'Grammy', description: 'Actualités Grammy' },
        { name: 'Cannes', description: 'Actualités Cannes' },
        { name: 'César', description: 'Actualités César' }
    ]
};

async function main() {
    try {
        console.log('🚀 Création des sous-catégories niveau 2 manquantes\n');
        
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Actualités')
            .single();
        
        if (!category) {
            throw new Error('Catégorie introuvable');
        }
        
        const now = new Date().toISOString();
        let totalCreated = 0;
        
        for (const [level1Name, level2List] of Object.entries(structure)) {
            // Trouver la sous-catégorie niveau 1
            const { data: level1 } = await supabase
                .from('subcategories')
                .select('id')
                .eq('category_id', category.id)
                .eq('name', level1Name)
                .limit(1)
                .single();
            
            if (!level1) {
                console.log(`⚠️  "${level1Name}" introuvable, ignoré`);
                continue;
            }
            
            // Vérifier les niveau 2 existants
            const { data: existing } = await supabase
                .from('subcategories_level2')
                .select('name')
                .eq('subcategory_id', level1.id);
            
            const existingNames = new Set(existing?.map(e => e.name.toLowerCase()) || []);
            const toCreate = level2List.filter(l2 => !existingNames.has(l2.name.toLowerCase()));
            
            if (toCreate.length === 0) {
                console.log(`✅ ${level1Name}: déjà complet`);
                continue;
            }
            
            // Créer les niveau 2 manquants
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1.id,
                name: l2.name,
                description: l2.description,
                created_at: now,
                updated_at: now
            }));
            
            const { error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (error) {
                console.error(`❌ Erreur pour "${level1Name}":`, error.message);
            } else {
                console.log(`✅ ${level1Name}: ${toCreate.length} niveau 2 créé(s)`);
                totalCreated += toCreate.length;
            }
        }
        
        console.log(`\n📊 Total: ${totalCreated} sous-catégorie(s) niveau 2 créée(s)`);
        console.log('\n🎉 Terminé !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

