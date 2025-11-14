#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🧹 === NETTOYAGE DES CATÉGORIES DOUBLONS ===\n');

        // 1. Identifier les catégories à supprimer
        console.log('🔍 Recherche des catégories similaires...\n');

        // Catégories à garder et à supprimer
        const duplicates = {
            // Garder "Anime", supprimer "animé"
            keep: { name: 'Anime', id: '6186b08a-6ca2-4a53-b774-3d8a177b9d16' },
            remove: [
                { name: 'animé', id: '567642e5-2ee1-4dbb-b158-d97dcf9315f5' }
            ]
        };

        const animationDuplicates = {
            // Garder "Animation", supprimer "Animation / dessin animé"
            keep: { name: 'Animation', id: '7160505c-52c5-40d3-91c2-8658a64ef223' },
            remove: [
                { name: 'Animation / dessin animé', id: 'a1382a95-c995-4b20-b22b-7ab6b3763073' }
            ]
        };

        // 2. Vérifier les sous-catégories liées
        console.log('📊 Vérification des sous-catégories liées...\n');

        const allCategoriesToRemove = [
            ...duplicates.remove,
            ...animationDuplicates.remove
        ];

        for (const category of allCategoriesToRemove) {
            console.log(`\n🔍 Catégorie à supprimer: "${category.name}" (ID: ${category.id})`);
            
            // Vérifier les sous-catégories
            const { data: subcategories, error: subError } = await supabase
                .from('subcategories')
                .select('id, name')
                .eq('category_id', category.id);

            if (subError) {
                console.error(`   ❌ Erreur: ${subError.message}`);
            } else {
                const count = subcategories?.length || 0;
                console.log(`   📋 ${count} sous-catégorie(s) trouvée(s)`);
                
                if (count > 0) {
                    console.log(`   ⚠️  Attention: ${count} sous-catégorie(s) sera(ont) supprimée(s) avec cette catégorie`);
                    subcategories?.slice(0, 5).forEach(sub => {
                        console.log(`      - ${sub.name}`);
                    });
                    if (count > 5) {
                        console.log(`      ... et ${count - 5} autre(s)`);
                    }
                }
            }

            // Vérifier les sous-catégories niveau 2
            if (subcategories && subcategories.length > 0) {
                const subcategoryIds = subcategories.map(s => s.id);
                const { count: level2Count } = await supabase
                    .from('subcategories_level2')
                    .select('id', { count: 'exact', head: true })
                    .in('subcategory_id', subcategoryIds);

                if (level2Count && level2Count > 0) {
                    console.log(`   ⚠️  Attention: ${level2Count} sous-catégorie(s) niveau 2 sera(ont) supprimée(s)`);
                }
            }

            // Vérifier les content_titles
            const { count: contentCount } = await supabase
                .from('content_titles')
                .select('id', { count: 'exact', head: true })
                .eq('category_id', category.id);

            if (contentCount && contentCount > 0) {
                console.log(`   ⚠️  Attention: ${contentCount} titre(s) de contenu sera(ont) supprimé(s)`);
            }
        }

        // 3. Demander confirmation
        console.log('\n\n⚠️  RÉSUMÉ DES SUPPRESSIONS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ À GARDER:');
        console.log(`   - "Anime" (ID: ${duplicates.keep.id})`);
        console.log(`   - "Animation" (ID: ${animationDuplicates.keep.id})`);
        console.log('\n❌ À SUPPRIMER:');
        allCategoriesToRemove.forEach(cat => {
            console.log(`   - "${cat.name}" (ID: ${cat.id})`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // 4. Supprimer les catégories
        console.log('🗑️  Suppression des catégories en double...\n');

        let deleted = 0;
        let errors = 0;

        for (const category of allCategoriesToRemove) {
            console.log(`Suppression de "${category.name}"...`);
            
            // Supprimer la catégorie (les sous-catégories seront supprimées en cascade)
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', category.id);

            if (deleteError) {
                console.error(`   ❌ Erreur: ${deleteError.message}`);
                errors++;
            } else {
                console.log(`   ✅ "${category.name}" supprimée avec succès`);
                deleted++;
            }
        }

        // 5. Vérifier la configuration niveau 2
        console.log('\n🔍 Vérification de la configuration niveau 2...\n');
        
        const { data: configToCheck } = await supabase
            .from('category_hierarchy_config')
            .select('category_id')
            .in('category_id', allCategoriesToRemove.map(c => c.id));

        if (configToCheck && configToCheck.length > 0) {
            console.log(`⚠️  ${configToCheck.length} configuration(s) niveau 2 trouvée(s) (seront supprimées automatiquement)`);
        }

        // 6. Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');
        console.log(`✅ ${deleted} catégorie(s) supprimée(s)`);
        if (errors > 0) {
            console.log(`❌ ${errors} erreur(s)`);
        }

        // Vérifier les catégories restantes
        console.log('\n📋 Catégories restantes:');
        const { data: remainingCategories } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', [duplicates.keep.id, animationDuplicates.keep.id])
            .order('name');

        if (remainingCategories) {
            remainingCategories.forEach(cat => {
                console.log(`   ✅ "${cat.name}" (ID: ${cat.id})`);
            });
        }

        console.log('\n🎉 Nettoyage terminé avec succès !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

