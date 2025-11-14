#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🔍 Vérification de la catégorie Fun fact\n');
        
        // Chercher la catégorie
        const { data: category } = await supabase
            .from('categories')
            .select('id, name, color, description')
            .or('name.ilike.%fun fact%,name.ilike.%funfact%')
            .single();
        
        if (!category) {
            console.log('❌ Catégorie "Fun fact" introuvable\n');
            console.log('💡 Vous pouvez la créer ou utiliser un nom différent.');
            return;
        }
        
        console.log(`✅ Catégorie trouvée:`);
        console.log(`   - ${category.name} (ID: ${category.id})`);
        console.log(`   - Couleur: ${category.color}`);
        console.log(`   - Description: ${category.description || 'Aucune'}\n`);
        
        // Vérifier si le niveau 2 est activé
        const { data: hierarchyConfig } = await supabase
            .from('category_hierarchy_config')
            .select('has_level2')
            .eq('category_id', category.id)
            .single();
        
        console.log(`⚙️  Configuration niveau 2: ${hierarchyConfig?.has_level2 ? '✅ Activé' : '❌ Désactivé'}\n`);
        
        // Récupérer les sous-catégories niveau 1
        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('id, name, description')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`📊 Sous-catégories niveau 1: ${subcategories?.length || 0}\n`);
        
        if (subcategories && subcategories.length > 0) {
            console.log('   Liste des sous-catégories existantes:');
            for (const sub of subcategories) {
                console.log(`   - ${sub.name}`);
                if (sub.description) {
                    console.log(`     ${sub.description}`);
                }
                
                // Vérifier les niveau 2
                const { data: level2 } = await supabase
                    .from('subcategories_level2')
                    .select('id, name')
                    .eq('subcategory_id', sub.id);
                
                if (level2 && level2.length > 0) {
                    console.log(`     └─ Niveau 2 (${level2.length})`);
                    level2.slice(0, 5).forEach(l2 => {
                        console.log(`        • ${l2.name}`);
                    });
                    if (level2.length > 5) {
                        console.log(`        ... et ${level2.length - 5} autres`);
                    }
                } else {
                    console.log(`     └─ Aucun niveau 2`);
                }
                console.log('');
            }
        } else {
            console.log('   Aucune sous-catégorie niveau 1\n');
        }
        
        // Statistiques
        const subcategoryIds = subcategories?.map(s => s.id) || [];
        const { data: allLevel2, count: countLevel2 } = await supabase
            .from('subcategories_level2')
            .select('id', { count: 'exact' })
            .in('subcategory_id', subcategoryIds);
        
        console.log(`📊 Statistiques:`);
        console.log(`   - Niveau 1: ${subcategories?.length || 0} sous-catégorie(s)`);
        console.log(`   - Niveau 2: ${countLevel2 || allLevel2?.length || 0} sous-catégorie(s)\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

