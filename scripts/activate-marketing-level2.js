#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('⚙️  Activation du niveau 2 pour la catégorie Marketing\n');
        
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
        
        // 2. Activer le niveau 2
        console.log('📝 Activation du niveau 2...');
        const { error: configError } = await supabase
            .from('category_hierarchy_config')
            .upsert({
                category_id: category.id,
                has_level2: true
            }, {
                onConflict: 'category_id'
            });
        
        if (configError) {
            throw configError;
        }
        
        console.log('✅ Niveau 2 activé pour la catégorie Marketing\n');
        
        // 3. Vérification
        const { data: config } = await supabase
            .from('category_hierarchy_config')
            .select('has_level2')
            .eq('category_id', category.id)
            .single();
        
        console.log(`📊 Configuration:`);
        console.log(`   - Niveau 2 activé: ${config?.has_level2 ? 'Oui ✅' : 'Non ❌'}`);
        console.log('\n🎉 Configuration terminée !');
        console.log('   Vous pouvez maintenant créer les sous-catégories niveau 1 (types de business),');
        console.log('   puis les sous-catégories niveau 2 (types de marketing).\n');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

