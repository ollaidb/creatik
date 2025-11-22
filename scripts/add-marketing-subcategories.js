#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Types de marketing qui seront en niveau 2 pour chaque business
const marketingTypes = [
    'Marketing digital',
    'Marketing de contenu',
    'Marketing réseaux sociaux',
    'Email marketing',
    'SEO',
    'Publicité',
    'Influence marketing',
    'Branding',
    'Stratégie marketing',
    'Analyse marketing',
    'Marketing automation',
    'CRM',
    'Mobile marketing',
    'Marketing viral',
    'Marketing événementiel',
    'Partenariats',
    'Sponsoring',
    'Fidélisation',
    'Acquisition',
    'Conversion'
];

// Structure : niveau 1 (types de business) -> niveau 2 (types de marketing)
const structure = {
    'Restaurant': marketingTypes,
    'Vêtements': marketingTypes,
    'Prestations': marketingTypes,
    'E-commerce': marketingTypes,
    'Beauté': marketingTypes,
    'Santé': marketingTypes,
    'Immobilier': marketingTypes,
    'Automobile': marketingTypes,
    'Voyage': marketingTypes,
    'Éducation': marketingTypes,
    'Technologie': marketingTypes,
    'Finance': marketingTypes,
    'Sport': marketingTypes,
    'Culture': marketingTypes,
    'Alimentation': marketingTypes,
    'Services': marketingTypes,
    'Consulting': marketingTypes,
    'Coaching': marketingTypes,
    'Formation': marketingTypes,
    'Événementiel': marketingTypes,
    'Hôtellerie': marketingTypes,
    'Mode': marketingTypes,
    'Luxe': marketingTypes,
    'Startup': marketingTypes,
    'PME': marketingTypes,
    'Grande entreprise': marketingTypes,
    'Associations': marketingTypes,
    'ONG': marketingTypes,
    'Artisanat': marketingTypes,
    'Agriculture': marketingTypes
};

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Marketing (niveau 1 et 2)\n');
        
        // 1. Récupérer la catégorie Marketing
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%marketing%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Marketing introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        const now = new Date().toISOString();
        let level1Count = 0;
        let level2Count = 0;
        
        // 2. Créer les sous-catégories niveau 1 et niveau 2
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
                        description: `Marketing pour ${level1Name.toLowerCase()}`,
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
                console.log(`  ✅ Niveau 2 déjà complet (${level2List.length} éléments)\n`);
                continue;
            }
            
            // Créer les niveau 2
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1Id,
                name: l2,
                description: `${l2} pour ${level1Name.toLowerCase()}`,
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
                            description: `${l2} pour ${level1Name.toLowerCase()}`,
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

