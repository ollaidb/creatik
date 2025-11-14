#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🗑️  === SUPPRESSION DES SOUS-CATÉGORIES ACCESSIBILITÉ ===\n');

        // 1. Trouver la catégorie Accessibilité
        console.log('🔍 Recherche de la catégorie "Accessibilité"...\n');
        
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%accessibilité%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Accessibilité" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: "${category.name}" (ID: ${category.id})\n`);

        // 2. Rechercher les sous-catégories à supprimer
        console.log('🔍 Recherche des sous-catégories "c hv" et "mobile"...\n');
        
        const { data: allSubcategories, error: subError } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        if (subError) {
            console.error(`❌ Erreur: ${subError.message}`);
            return;
        }

        // Filtrer les sous-catégories à supprimer
        const toDelete = allSubcategories?.filter(sub => {
            const nameLower = sub.name.toLowerCase();
            return nameLower.includes('c hv') || nameLower === 'mobile';
        }) || [];

        if (toDelete.length === 0) {
            console.log('⚠️  Aucune sous-catégorie trouvée correspondant à "c hv" ou "mobile"\n');
            console.log('📋 Sous-catégories existantes dans Accessibilité:');
            allSubcategories?.forEach(sub => {
                console.log(`   - ${sub.name}`);
            });
            return;
        }

        console.log(`📋 ${toDelete.length} sous-catégorie(s) à supprimer:`);
        toDelete.forEach(sub => {
            console.log(`   - "${sub.name}" (ID: ${sub.id})`);
        });
        console.log('');

        // 3. Vérifier les données liées
        for (const sub of toDelete) {
            console.log(`🔍 Vérification de "${sub.name}"...`);
            
            // Vérifier les sous-catégories niveau 2
            const { count: level2Count } = await supabase
                .from('subcategories_level2')
                .select('id', { count: 'exact', head: true })
                .eq('subcategory_id', sub.id);

            if (level2Count && level2Count > 0) {
                console.log(`   ⚠️  ${level2Count} sous-catégorie(s) niveau 2 sera(ont) supprimée(s)`);
            }

            // Vérifier les word_blocks
            const { count: wordBlocksCount } = await supabase
                .from('word_blocks')
                .select('id', { count: 'exact', head: true })
                .eq('subcategory_id', sub.id);

            if (wordBlocksCount && wordBlocksCount > 0) {
                console.log(`   ⚠️  ${wordBlocksCount} word block(s) sera(ont) supprimé(s)`);
            }

            // Vérifier les content_titles
            const { count: contentCount } = await supabase
                .from('content_titles')
                .select('id', { count: 'exact', head: true })
                .eq('subcategory_id', sub.id);

            if (contentCount && contentCount > 0) {
                console.log(`   ⚠️  ${contentCount} titre(s) de contenu sera(ont) supprimé(s)`);
            }
        }
        console.log('');

        // 4. Supprimer les sous-catégories
        console.log('🗑️  Suppression des sous-catégories...\n');

        let deleted = 0;
        let errors = 0;

        for (const sub of toDelete) {
            const { error: deleteError } = await supabase
                .from('subcategories')
                .delete()
                .eq('id', sub.id);

            if (deleteError) {
                console.error(`   ❌ "${sub.name}": ${deleteError.message}`);
                errors++;
            } else {
                console.log(`   ✅ "${sub.name}" supprimée avec succès`);
                deleted++;
            }
        }

        // 5. Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');
        console.log(`✅ ${deleted} sous-catégorie(s) supprimée(s)`);
        if (errors > 0) {
            console.log(`❌ ${errors} erreur(s)`);
        }

        // Vérification finale
        const { data: remainingSubs } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');

        console.log(`\n📋 Sous-catégories restantes dans "Accessibilité": ${remainingSubs?.length || 0}`);
        if (remainingSubs && remainingSubs.length > 0 && remainingSubs.length <= 20) {
            remainingSubs.forEach(sub => {
                console.log(`   - ${sub.name}`);
            });
        }

        console.log('\n🎉 Opération terminée !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

