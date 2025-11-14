#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🔍 Vérification de la catégorie Prank\n');
        
        // Chercher la catégorie
        const { data: category } = await supabase
            .from('categories')
            .select('id, name, color, description')
            .ilike('name', '%prank%')
            .single();
        
        if (!category) {
            console.log('❌ Catégorie "Prank" introuvable\n');
            console.log('💡 Vous pouvez la créer.');
            return;
        }
        
        console.log(`✅ Catégorie trouvée:`);
        console.log(`   - ${category.name} (ID: ${category.id})`);
        console.log(`   - Couleur: ${category.color}`);
        console.log(`   - Description: ${category.description || 'Aucune'}\n`);
        
        // Vérifier les sous-catégories existantes
        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('id, name, description')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`📊 Sous-catégories existantes: ${subcategories?.length || 0}\n`);
        
        if (subcategories && subcategories.length > 0) {
            subcategories.forEach(sub => {
                console.log(`   - ${sub.name}`);
            });
        }
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

