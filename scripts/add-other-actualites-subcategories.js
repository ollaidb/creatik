#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Structure : sous-catégorie niveau 1 -> liste des sous-catégories niveau 2
const structure = {
    'Réseaux sociaux': [
        'YouTube', 'TikTok', 'Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'Snapchat',
        'Pinterest', 'Reddit', 'Discord', 'Twitch', 'Telegram', 'WhatsApp', 'Clubhouse', 'BeReal'
    ],
    'Divertissement': [
        'Téléréalité', 'Influenceurs', 'Célébrités', 'People', 'Cinéma', 'Séries TV', 'Musique',
        'Gaming', 'E-sport', 'Streaming', 'Podcast', 'Comédie', 'Humour', 'Stand-up', 'Théâtre',
        'Danse', 'Cirque', 'Magie', 'Festivals', 'Concerts', 'Spectacles'
    ],
    'Médias': [
        'Presse', 'Télévision', 'Radio', 'Presse écrite', 'Magazines', 'Journalisme',
        'Médias traditionnels', 'Médias sociaux', 'Fake news', 'Désinformation', 'Fact-checking'
    ],
    'Format/Type': [
        'Breaking news', 'Live', 'Reportage', 'Interview', 'Débat', 'Opinion', 'Décryptage',
        'Résumé', 'Tendances', 'Scoop', 'Exclusivité', 'Révélation', 'Scandale', 'Crise', 'Urgence'
    ],
    'Économie': [
        'Business', 'Finance', 'Bourse', 'Startup', 'Entrepreneuriat', 'Commerce', 'E-commerce',
        'Crypto', 'Blockchain', 'Fiscalité', 'Impôts', 'Emploi', 'Chômage', 'Télétravail', 'Freelance'
    ],
    'Sport': [
        'Football', 'Basketball', 'Tennis', 'Rugby', 'Cyclisme', 'Athlétisme', 'Natation',
        'Combat', 'E-sport', 'Olympiques', 'Paralympiques', 'Extrême'
    ],
    'Culture': [
        'Art', 'Littérature', 'Livres', 'Édition', 'Musées', 'Expositions', 'Bibliothèques',
        'Patrimoine', 'Histoire', 'Archéologie', 'Traditions', 'Folklore', 'Langues'
    ],
    'Technologie': [
        'IA', 'Robotique', 'Drones', 'Voiture autonome', 'Blockchain', 'NFT', 'Métavers',
        'Réalité virtuelle', 'Réalité augmentée', '5G', '6G', 'Internet', 'Cybersécurité',
        'Hacking', 'Applications', 'Mobile', 'Jeux vidéo'
    ],
    'Santé': [
        'Médecine', 'Recherche médicale', 'Hôpitaux', 'Assurance santé', 'Médicaments', 'Vaccins',
        'Épidémies', 'Pandémies', 'Bien-être', 'Psychologie', 'Santé mentale'
    ],
    'Environnement': [
        'Climat', 'Écologie', 'Pollution', 'Recyclage', 'Déchets', 'Énergie renouvelable',
        'Solaire', 'Éolien', 'Biodiversité', 'Espèces menacées', 'Forêts', 'Océans', 'Eau',
        'Qualité de l\'air'
    ],
    'Science': [
        'Recherche', 'Découvertes', 'Inventions', 'Astronomie', 'Espace', 'Exploration spatiale',
        'Biologie', 'Chimie', 'Physique', 'Mathématiques', 'Géologie', 'Météorologie', 'Météo',
        'Prix Nobel'
    ],
    'Société': [
        'Éducation', 'École', 'Université', 'Formation', 'Jeunesse', 'Famille', 'Parentalité',
        'Retraite', 'Immigration', 'Réfugiés', 'Diversité', 'Inclusion', 'Féminisme', 'LGBTQ+',
        'Discrimination', 'Racisme', 'Solidarité', 'Associations', 'Bénévolat', 'Humanitaire'
    ],
    'Justice': [
        'Procès', 'Tribunaux', 'Lois', 'Réformes judiciaires', 'Droits', 'Droits de l\'homme',
        'Police', 'Sécurité', 'Criminalité'
    ],
    'Politique': [
        'Analyses politiques', 'Élections', 'Gouvernement', 'Parlement', 'Partis politiques',
        'Diplomatie', 'Relations internationales', 'ONU', 'Union européenne', 'OTAN',
        'Manifestations', 'Mouvements sociaux'
    ],
    'Mode & Beauté': [
        'Mode', 'Fashion', 'Beauté', 'Cosmétiques', 'Luxe', 'Défilés', 'Design'
    ],
    'Voyage & Tourisme': [
        'Voyage', 'Tourisme', 'Tourisme durable', 'Écotourisme', 'Aventure', 'Exploration',
        'Hôtellerie', 'Restaurant', 'Gastronomie'
    ],
    'Transport': [
        'Automobile', 'Aéronautique', 'Aviation', 'Maritime', 'Ferroviaire', 'Mobilité', 'Vélo',
        'Transport public'
    ],
    'Énergie': [
        'Énergie renouvelable', 'Nucléaire', 'Pétrole', 'Gaz', 'Charbon', 'Hydrogène', 'Solaire',
        'Éolien'
    ],
    'Agriculture': [
        'Agriculture biologique', 'Alimentation', 'Sécurité alimentaire', 'OGM', 'Pesticides',
        'Bien-être animal', 'Veganisme', 'Végétarisme'
    ],
    'Immobilier': [
        'Immobilier neuf', 'Immobilier ancien', 'Location', 'Achat', 'Vente', 'Prêt immobilier',
        'Urbanisme', 'Architecture', 'Construction', 'Rénovation'
    ],
    'Autres': [
        'Religion', 'Spiritualité', 'Philosophie', 'Éthique', 'Guerre', 'Paix', 'Terrorisme',
        'Conflits', 'Accidents', 'Catastrophes', 'Récompenses', 'Cérémonies', 'Oscars', 'Grammy',
        'Cannes', 'César'
    ]
};

async function main() {
    try {
        console.log('🚀 Ajout des autres sous-catégories Actualités\n');
        
        // 1. Récupérer la catégorie Actualités
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Actualités')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Actualités introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        const now = new Date().toISOString();
        let level1Count = 0;
        let level2Count = 0;
        
        // 2. Créer les sous-catégories niveau 1 et niveau 2
        for (const [level1Name, level2List] of Object.entries(structure)) {
            console.log(`📋 Création de "${level1Name}"...`);
            
            // Vérifier si la sous-catégorie niveau 1 existe déjà
            const { data: existing } = await supabase
                .from('subcategories')
                .select('id')
                .eq('category_id', category.id)
                .eq('name', level1Name)
                .single();
            
            let level1Id;
            
            if (existing) {
                level1Id = existing.id;
                console.log(`  ℹ️  Niveau 1 existe déjà`);
            } else {
                // Créer le niveau 1
                const { data: level1, error: level1Error } = await supabase
                    .from('subcategories')
                    .insert({
                        name: level1Name,
                        description: `Actualités ${level1Name.toLowerCase()}`,
                        category_id: category.id,
                        created_at: now,
                        updated_at: now
                    })
                    .select()
                    .single();
                
                if (level1Error) {
                    console.error(`  ❌ Erreur pour "${level1Name}":`, level1Error.message);
                    continue;
                }
                
                level1Id = level1.id;
                level1Count++;
                console.log(`  ✅ Niveau 1 créé`);
            }
            
            // Vérifier les niveau 2 existants
            const { data: existingLevel2 } = await supabase
                .from('subcategories_level2')
                .select('name')
                .eq('subcategory_id', level1Id);
            
            const existingNames = new Set(existingLevel2?.map(e => e.name.toLowerCase()) || []);
            const toCreate = level2List.filter(l2 => !existingNames.has(l2.toLowerCase()));
            
            if (toCreate.length === 0) {
                console.log(`  ✅ Niveau 2 déjà complet (${level2List.length} éléments)\n`);
                continue;
            }
            
            // Créer les niveau 2 manquants
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1Id,
                name: l2,
                description: `Actualités ${l2.toLowerCase()}`,
                created_at: now,
                updated_at: now
            }));
            
            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (level2Error) {
                console.error(`  ⚠️  Erreur niveau 2: ${level2Error.message}`);
                // Essayer une par une
                for (const l2 of toCreate) {
                    const { error } = await supabase
                        .from('subcategories_level2')
                        .insert({
                            subcategory_id: level1Id,
                            name: l2,
                            description: `Actualités ${l2.toLowerCase()}`,
                            created_at: now,
                            updated_at: now
                        });
                    if (!error) level2Count++;
                }
            } else {
                level2Count += level2Data.length;
            }
            
            console.log(`  ✅ ${toCreate.length} niveau 2 créé(s) (${level2List.length} au total)\n`);
        }
        
        console.log(`📊 Résumé:`);
        console.log(`   - Niveau 1 créé: ${level1Count}`);
        console.log(`   - Niveau 2 créé: ${level2Count}`);
        
        // 3. Vérification finale
        const { data: finalLevel1 } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        const level1Ids = finalLevel1?.map(s => s.id) || [];
        const { data: finalLevel2, count: countLevel2 } = await supabase
            .from('subcategories_level2')
            .select('id', { count: 'exact' })
            .in('subcategory_id', level1Ids);
        
        console.log(`\n📊 Vérification finale:`);
        console.log(`   - Niveau 1: ${finalLevel1?.length || 0} sous-catégorie(s)`);
        console.log(`   - Niveau 2: ${countLevel2 || finalLevel2?.length || 0} sous-catégorie(s)`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

