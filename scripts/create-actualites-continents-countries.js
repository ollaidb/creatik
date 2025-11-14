#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Structure : continent -> liste des pays
const continents = {
    'Afrique': [
        'Algérie', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroun', 'Cap-Vert',
        'République centrafricaine', 'Tchad', 'Comores', 'Congo', 'République démocratique du Congo',
        'Côte d\'Ivoire', 'Djibouti', 'Égypte', 'Guinée équatoriale', 'Érythrée', 'Eswatini', 'Éthiopie',
        'Gabon', 'Gambie', 'Ghana', 'Guinée', 'Guinée-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libye',
        'Madagascar', 'Malawi', 'Mali', 'Maroc', 'Mauritanie', 'Maurice', 'Mozambique', 'Namibie',
        'Niger', 'Nigeria', 'Ouganda', 'Rwanda', 'São Tomé-et-Príncipe', 'Sénégal', 'Seychelles',
        'Sierra Leone', 'Somalie', 'Afrique du Sud', 'Soudan du Sud', 'Soudan', 'Tanzanie', 'Togo',
        'Tunisie', 'Ouganda', 'Zambie', 'Zimbabwe'
    ],
    'Amérique': [
        'Antigua-et-Barbuda', 'Argentine', 'Bahamas', 'Barbade', 'Belize', 'Bolivie', 'Brésil',
        'Canada', 'Chili', 'Colombie', 'Costa Rica', 'Cuba', 'Dominique', 'République dominicaine',
        'Équateur', 'El Salvador', 'Grenade', 'Guatemala', 'Guyana', 'Haïti', 'Honduras', 'Jamaïque',
        'Mexique', 'Nicaragua', 'Panama', 'Paraguay', 'Pérou', 'Saint-Kitts-et-Nevis', 'Sainte-Lucie',
        'Saint-Vincent-et-les-Grenadines', 'Suriname', 'Trinité-et-Tobago', 'États-Unis', 'Uruguay',
        'Venezuela'
    ],
    'Asie': [
        'Afghanistan', 'Arabie saoudite', 'Arménie', 'Azerbaïdjan', 'Bahreïn', 'Bangladesh', 'Bhoutan',
        'Birmanie', 'Brunei', 'Cambodge', 'Chine', 'Corée du Nord', 'Corée du Sud', 'Émirats arabes unis',
        'Géorgie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Israël', 'Japon', 'Jordanie', 'Kazakhstan',
        'Kirghizistan', 'Koweït', 'Laos', 'Liban', 'Malaisie', 'Maldives', 'Mongolie', 'Népal', 'Oman',
        'Ouzbékistan', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Singapour', 'Sri Lanka',
        'Syrie', 'Tadjikistan', 'Taïwan', 'Thaïlande', 'Timor oriental', 'Turquie', 'Turkménistan',
        'Viêt Nam', 'Yémen'
    ],
    'Europe': [
        'Albanie', 'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Biélorussie', 'Bosnie-Herzégovine',
        'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 'Espagne', 'Estonie', 'Finlande', 'France',
        'Grèce', 'Hongrie', 'Irlande', 'Islande', 'Italie', 'Lettonie', 'Liechtenstein', 'Lituanie',
        'Luxembourg', 'Macédoine du Nord', 'Malte', 'Moldavie', 'Monaco', 'Monténégro', 'Norvège',
        'Pays-Bas', 'Pologne', 'Portugal', 'Roumanie', 'Royaume-Uni', 'Russie', 'Saint-Marin',
        'Serbie', 'Slovaquie', 'Slovénie', 'Suède', 'Suisse', 'Tchéquie', 'Ukraine', 'Vatican'
    ],
    'Océanie': [
        'Australie', 'Fidji', 'Kiribati', 'Îles Marshall', 'Micronésie', 'Nauru', 'Nouvelle-Zélande',
        'Palaos', 'Papouasie-Nouvelle-Guinée', 'Samoa', 'Îles Salomon', 'Tonga', 'Tuvalu', 'Vanuatu'
    ]
};

async function main() {
    try {
        console.log('🚀 Création des sous-catégories Actualités (Continents et Pays)\n');
        
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
        
        // 2. Créer les sous-catégories niveau 1 (continents) et niveau 2 (pays)
        for (const [continent, countries] of Object.entries(continents)) {
            console.log(`📋 Création de "${continent}"...`);
            
            // Créer le niveau 1 (continent)
            const { data: level1, error: level1Error } = await supabase
                .from('subcategories')
                .insert({
                    name: continent,
                    description: `Actualités pour le continent ${continent}`,
                    category_id: category.id,
                    created_at: now,
                    updated_at: now
                })
                .select()
                .single();
            
            if (level1Error) {
                console.error(`❌ Erreur pour "${continent}":`, level1Error.message);
                continue;
            }
            
            level1Count++;
            console.log(`  ✅ Niveau 1 créé`);
            
            // Créer les niveau 2 (pays)
            const level2Data = countries.map(country => ({
                subcategory_id: level1.id,
                name: country,
                description: `Actualités pour ${country}`,
                created_at: now,
                updated_at: now
            }));
            
            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (level2Error) {
                console.error(`  ⚠️  Erreur niveau 2: ${level2Error.message}`);
                // Essayer une par une
                for (const country of countries) {
                    const { error } = await supabase
                        .from('subcategories_level2')
                        .insert({
                            subcategory_id: level1.id,
                            name: country,
                            description: `Actualités pour ${country}`,
                            created_at: now,
                            updated_at: now
                        });
                    if (!error) level2Count++;
                }
            } else {
                level2Count += level2Data.length;
                console.log(`  ✅ ${level2Data.length} pays créés\n`);
            }
        }
        
        console.log(`📊 Résumé:`);
        console.log(`   - Niveau 1 (continents): ${level1Count}`);
        console.log(`   - Niveau 2 (pays): ${level2Count}`);
        
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

