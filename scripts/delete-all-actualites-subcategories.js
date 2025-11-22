#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🗑️  Suppression de toutes les sous-catégories Actualités\n');
        
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
        
        // 2. Récupérer toutes les sous-catégories niveau 1
        const { data: allSubcategories, error: subError } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);
        
        if (subError) {
            throw subError;
        }
        
        if (!allSubcategories || allSubcategories.length === 0) {
            console.log('ℹ️  Aucune sous-catégorie à supprimer\n');
            return;
        }
        
        console.log(`📊 ${allSubcategories.length} sous-catégorie(s) niveau 1 trouvée(s)\n`);
        
        const subcategoryIds = allSubcategories.map(s => s.id);
        
        // 3. Supprimer d'abord toutes les sous-catégories niveau 2
        console.log('🗑️  Suppression des sous-catégories niveau 2...');
        
        const { error: delLevel2Error } = await supabase
            .from('subcategories_level2')
            .delete()
            .in('subcategory_id', subcategoryIds);
        
        if (delLevel2Error) {
            console.log(`⚠️  Erreur suppression niveau 2: ${delLevel2Error.message}`);
        } else {
            console.log('✅ Sous-catégories niveau 2 supprimées\n');
        }
        
        // 4. Supprimer les références dans word_blocks
        console.log('🗑️  Suppression des références dans word_blocks...');
        const { error: delWordBlocksError } = await supabase
            .from('word_blocks')
            .delete()
            .in('subcategory_id', subcategoryIds);
        
        if (delWordBlocksError) {
            console.log(`⚠️  Erreur suppression word_blocks: ${delWordBlocksError.message}`);
        } else {
            console.log('✅ Références word_blocks supprimées\n');
        }
        
        // 5. Vérifier et supprimer les références dans d'autres tables possibles
        const tablesToCheck = [
            'user_publications',
            'content_titles',
            'sources'
        ];
        
        for (const table of tablesToCheck) {
            try {
                const { error } = await supabase
                    .from(table)
                    .update({ subcategory_id: null })
                    .in('subcategory_id', subcategoryIds);
                
                if (!error) {
                    console.log(`✅ Références ${table} mises à null`);
                }
            } catch (e) {
                // Table peut ne pas avoir cette colonne, on ignore
            }
        }
        console.log('');
        
        // 6. Supprimer toutes les sous-catégories niveau 1
        console.log('🗑️  Suppression des sous-catégories niveau 1...');
        
        const { error: delLevel1Error } = await supabase
            .from('subcategories')
            .delete()
            .eq('category_id', category.id);
        
        if (delLevel1Error) {
            console.log(`❌ Erreur suppression niveau 1: ${delLevel1Error.message}`);
            throw delLevel1Error;
        } else {
            console.log('✅ Sous-catégories niveau 1 supprimées\n');
        }
        
        // 7. Vérification finale
        const { data: remaining, count } = await supabase
            .from('subcategories')
            .select('id', { count: 'exact' })
            .eq('category_id', category.id);
        
        console.log(`📊 Vérification finale:`);
        console.log(`   - Sous-catégories restantes: ${count || 0}`);
        console.log('\n🎉 Suppression terminée avec succès !');
        console.log('   Vous pouvez maintenant recréer la structure à deux niveaux.\n');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
