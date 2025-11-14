#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Structure : niveau 1 -> niveau 2
const structure = {
    // Nouvelles sous-catégories niveau 1
    'Féminisme': [
        'Égalité salariale', 'Violences faites aux femmes', 'Représentation politique', 'Parité',
        'Éducation des filles', 'Santé reproductive', 'Droits reproductifs', 'Harcèlement',
        'Stéréotypes de genre', 'Partage des tâches', 'Leadership féminin', 'Sororité'
    ],
    'LGBTQ+': [
        'Droits LGBTQ+', 'Visibilité', 'Inclusion', 'Mariage pour tous', 'Adoption', 'Transidentité',
        'Coming out', 'Discrimination', 'Santé LGBTQ+', 'Familles LGBTQ+', 'Jeunesse LGBTQ+', 'Aînés LGBTQ+'
    ],
    'Anti-racisme': [
        'Discrimination raciale', 'Diversité', 'Histoire coloniale', 'Réparations', 'Représentation',
        'Profilage racial', 'Racisme systémique', 'Intersectionnalité', 'Solidarité',
        'Éducation anti-raciste', 'Mémoire collective', 'Justice réparatrice'
    ],
    'Éducation': [
        'Accès à l\'éducation', 'Qualité de l\'éducation', 'Égalité des chances', 'Éducation gratuite',
        'Éducation inclusive', 'Éducation alternative', 'Formation professionnelle', 'Alphabétisation',
        'Éducation des adultes', 'Éducation à distance', 'Droits des étudiants', 'Conditions d\'apprentissage'
    ],
    'Santé': [
        'Accès aux soins', 'Santé mentale', 'Prévention', 'Soins de santé universels', 'Médicaments',
        'Recherche médicale', 'Maladies chroniques', 'Handicap', 'Santé reproductive', 'Santé publique',
        'Inégalités de santé', 'Droit à mourir dans la dignité'
    ],
    'Travail': [
        'Conditions de travail', 'Salaires équitables', 'Syndicalisme', 'Sécurité au travail',
        'Équilibre vie pro/perso', 'Télétravail', 'Précarité', 'Chômage', 'Formation professionnelle',
        'Égalité professionnelle', 'Droit de grève', 'Protection sociale'
    ],
    'Logement': [
        'Droit au logement', 'Précarité', 'Accessibilité', 'Logement social', 'Sans-abrisme',
        'Expulsions', 'Qualité du logement', 'Coût du logement', 'Énergie dans le logement',
        'Habitat durable', 'Communautés', 'Autonomie'
    ],
    'Alimentation': [
        'Sécurité alimentaire', 'Agriculture durable', 'Souveraineté alimentaire', 'Accès à l\'alimentation',
        'Malnutrition', 'Agriculture biologique', 'Circuits courts', 'Élevage éthique',
        'Gaspillage alimentaire', 'Alimentation saine', 'Traditions culinaires', 'Autonomie alimentaire'
    ],
    'Numérique': [
        'Neutralité du net', 'Vie privée numérique', 'Accessibilité numérique', 'Fracture numérique',
        'Données personnelles', 'Intelligence artificielle', 'Liberté d\'expression en ligne',
        'Cyberharcèlement', 'Éducation numérique', 'Open source', 'Droit à l\'oubli', 'Éthique numérique'
    ],
    'Culture': [
        'Diversité culturelle', 'Patrimoine', 'Arts engagés', 'Mémoire collective', 'Langues',
        'Traditions', 'Création artistique', 'Accès à la culture', 'Censure', 'Liberté artistique'
    ],
    'Médias': [
        'Liberté de la presse', 'Médias indépendants', 'Désinformation', 'Pluralisme médiatique',
        'Accès à l\'information', 'Éducation aux médias', 'Médias communautaires', 'Journalisme citoyen'
    ],
    'Justice sociale': [
        'Inégalités', 'Redistribution', 'Fiscalité équitable', 'Services publics', 'Protection sociale',
        'Droits sociaux', 'Solidarité', 'Entraide', 'Mouvements sociaux'
    ],
    'Paix & Non-violence': [
        'Pacifisme', 'Résolution de conflits', 'Désarmement', 'Diplomatie', 'Médiation',
        'Réconciliation', 'Mémoire des conflits', 'Prévention des conflits'
    ],
    'Handicap & Accessibilité': [
        'Droits des personnes handicapées', 'Accessibilité', 'Inclusion', 'Autonomie',
        'Éducation inclusive', 'Emploi', 'Accessibilité numérique', 'Mobilité', 'Santé'
    ],
    'Jeunesse': [
        'Droits des jeunes', 'Éducation', 'Emploi', 'Engagement', 'Représentation', 'Santé mentale',
        'Climat', 'Futur', 'Participation citoyenne'
    ],
    'Aînés': [
        'Droits des aînés', 'Retraite', 'Santé', 'Isolement', 'Autonomie', 'Respect', 'Logement',
        'Services', 'Participation'
    ],
    'Animaux': [
        'Bien-être animal', 'Droits des animaux', 'Protection', 'Élevage éthique', 'Expérimentation',
        'Espèces menacées', 'Habitat', 'Adoption', 'Veganisme'
    ],
    'Religions & Spiritualité': [
        'Liberté religieuse', 'Laïcité', 'Tolérance', 'Dialogue interreligieux', 'Discrimination religieuse',
        'Spiritualité', 'Croyances', 'Pratiques'
    ],
    'Mobilité & Transport': [
        'Mobilité durable', 'Transport public', 'Accessibilité', 'Pollution', 'Aménagement urbain',
        'Vélo', 'Marche', 'Mobilité douce', 'Inclusion'
    ],
    'Énergie': [
        'Transition énergétique', 'Énergies renouvelables', 'Accès à l\'énergie', 'Pauvreté énergétique',
        'Efficacité énergétique', 'Souveraineté énergétique', 'Justice énergétique'
    ]
};

// Ajouts pour les sous-catégories existantes
const additionsToExisting = {
    'Droits humains': [
        'Liberté d\'expression', 'Droit à l\'information', 'Droit à la vie privée', 'Droit à l\'éducation',
        'Droit à la santé', 'Droit au logement', 'Droit au travail', 'Droit à l\'alimentation',
        'Droit à l\'eau', 'Droit à un environnement sain', 'Droit à la paix', 'Droit à l\'asile',
        'Droit à la non-discrimination', 'Droit à la participation'
    ],
    'Environnement': [
        'Déforestation', 'Océans', 'Eau', 'Air', 'Sol', 'Espèces menacées', 'Agriculture durable',
        'Zéro déchet', 'Mobilité durable', 'Urbanisme durable', 'Transition écologique',
        'Justice climatique', 'Économie circulaire', 'Protection des animaux'
    ],
    'Politique': [
        'Transparence', 'Responsabilité', 'Réforme électorale', 'Démocratie participative',
        'Budget participatif', 'Lobbying', 'Financement politique', 'Réforme constitutionnelle',
        'Décentralisation', 'Citoyenneté', 'Engagement civique', 'Contrôle citoyen'
    ]
};

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Activisme\n');
        
        // 1. Récupérer la catégorie Activisme
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%activisme%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Activisme introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        const now = new Date().toISOString();
        let level1Count = 0;
        let level2Count = 0;
        
        // 2. Ajouter les nouvelles sous-catégories niveau 1 avec leur niveau 2
        console.log('➕ Ajout des nouvelles sous-catégories niveau 1...\n');
        
        for (const [level1Name, level2List] of Object.entries(structure)) {
            console.log(`📋 Création de "${level1Name}"...`);
            
            // Vérifier si existe déjà
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
                const { data: level1, error: level1Error } = await supabase
                    .from('subcategories')
                    .insert({
                        name: level1Name,
                        description: `Activisme ${level1Name.toLowerCase()}`,
                        category_id: category.id,
                        created_at: now,
                        updated_at: now
                    })
                    .select()
                    .single();
                
                if (level1Error) {
                    console.error(`  ❌ Erreur: ${level1Error.message}`);
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
                console.log(`  ✅ Niveau 2 déjà complet\n`);
                continue;
            }
            
            // Créer les niveau 2
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1Id,
                name: l2,
                description: `Activisme ${l2.toLowerCase()}`,
                created_at: now,
                updated_at: now
            }));
            
            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (level2Error) {
                console.error(`  ⚠️  Erreur niveau 2: ${level2Error.message}`);
            } else {
                level2Count += level2Data.length;
                console.log(`  ✅ ${toCreate.length} niveau 2 créé(s)\n`);
            }
        }
        
        // 3. Ajouter les niveau 2 pour les sous-catégories existantes
        console.log('➕ Ajout des niveau 2 pour les sous-catégories existantes...\n');
        
        for (const [level1Name, level2List] of Object.entries(additionsToExisting)) {
            console.log(`📋 Ajout niveau 2 pour "${level1Name}"...`);
            
            const { data: level1 } = await supabase
                .from('subcategories')
                .select('id')
                .eq('category_id', category.id)
                .eq('name', level1Name)
                .single();
            
            if (!level1) {
                console.log(`  ⚠️  Sous-catégorie "${level1Name}" introuvable\n`);
                continue;
            }
            
            // Vérifier les existants
            const { data: existingLevel2 } = await supabase
                .from('subcategories_level2')
                .select('name')
                .eq('subcategory_id', level1.id);
            
            const existingNames = new Set(existingLevel2?.map(e => e.name.toLowerCase()) || []);
            const toCreate = level2List.filter(l2 => !existingNames.has(l2.toLowerCase()));
            
            if (toCreate.length === 0) {
                console.log(`  ✅ Déjà complet\n`);
                continue;
            }
            
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1.id,
                name: l2,
                description: `Activisme ${l2.toLowerCase()}`,
                created_at: now,
                updated_at: now
            }));
            
            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (level2Error) {
                console.error(`  ⚠️  Erreur: ${level2Error.message}\n`);
            } else {
                level2Count += level2Data.length;
                console.log(`  ✅ ${toCreate.length} niveau 2 ajouté(s)\n`);
            }
        }
        
        console.log(`📊 Résumé:`);
        console.log(`   - Niveau 1 créé: ${level1Count}`);
        console.log(`   - Niveau 2 créé: ${level2Count}`);
        
        // 4. Vérification finale
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

