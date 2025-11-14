#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🔍 Vérification de la catégorie Analyse\n');
        
        // Chercher la catégorie (peut être "Analyse" ou "Analyses")
        const { data: categories } = await supabase
            .from('categories')
            .select('id, name, color, description')
            .or('name.ilike.analyse,name.ilike.analyses');
        
        if (!categories || categories.length === 0) {
            console.log('❌ Catégorie "Analyse" introuvable\n');
            console.log('💡 Vous pouvez la créer ou utiliser un nom différent.');
            return;
        }
        
        console.log(`✅ Catégorie trouvée:\n`);
        categories.forEach(cat => {
            console.log(`   - ${cat.name} (ID: ${cat.id})`);
            console.log(`     Couleur: ${cat.color}`);
            console.log(`     Description: ${cat.description || 'Aucune'}\n`);
        });
        
        // Vérifier les sous-catégories existantes
        for (const category of categories) {
            const { data: subcategories } = await supabase
                .from('subcategories')
                .select('id, name, description')
                .eq('category_id', category.id)
                .order('name');
            
            console.log(`📊 Sous-catégories pour "${category.name}": ${subcategories?.length || 0}\n`);
            
            if (subcategories && subcategories.length > 0) {
                console.log('   Liste des sous-catégories existantes:');
                subcategories.forEach(sub => {
                    console.log(`   - ${sub.name}`);
                });
                console.log('');
            }
            
            // Vérifier si la catégorie a le niveau 2 activé
            const { data: hierarchyConfig } = await supabase
                .from('category_hierarchy_config')
                .select('has_level2')
                .eq('category_id', category.id)
                .single();
            
            console.log(`⚙️  Configuration niveau 2: ${hierarchyConfig?.has_level2 ? 'Activé' : 'Désactivé'}\n`);
        }
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

