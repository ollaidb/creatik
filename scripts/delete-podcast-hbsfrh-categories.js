#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🗑️  === SUPPRESSION DES CATÉGORIES ===\n');

        const categoriesToDelete = [
            { id: 'ff6437c5-e92b-464f-8ce2-0f745ed6e220', name: 'Podcast' },
            { id: '22f86938-e404-4e06-832a-736f094ae2b1', name: 'hbsfrh' }
        ];

        // Rechercher aussi "rf g" au cas où
        const { data: rfgCategory } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%rf%g%')
            .maybeSingle();

        if (rfgCategory) {
            categoriesToDelete.push({ id: rfgCategory.id, name: rfgCategory.name });
        }

        console.log(`📋 ${categoriesToDelete.length} catégorie(s) à supprimer:\n`);
        categoriesToDelete.forEach(cat => {
            console.log(`   - "${cat.name}" (ID: ${cat.id})`);
        });
        console.log('');

        // Vérifier les données liées pour chaque catégorie
        for (const category of categoriesToDelete) {
            console.log(`🔍 Vérification de "${category.name}"...`);
            
            // Vérifier les sous-catégories
            const { data: subcategories, error: subError } = await supabase
                .from('subcategories')
                .select('id, name')
                .eq('category_id', category.id);

            if (subError) {
                console.error(`   ❌ Erreur: ${subError.message}`);
            } else {
                const subCount = subcategories?.length || 0;
                console.log(`   📋 Sous-catégories: ${subCount}`);
                
                if (subCount > 0) {
                    subcategories?.slice(0, 5).forEach(sub => {
                        console.log(`      - ${sub.name}`);
                    });
                    if (subCount > 5) {
                        console.log(`      ... et ${subCount - 5} autre(s)`);
                    }
                }
            }

            // Vérifier les content_titles
            const { count: contentCount } = await supabase
                .from('content_titles')
                .select('id', { count: 'exact', head: true })
                .eq('category_id', category.id);

            if (contentCount && contentCount > 0) {
                console.log(`   📋 Titres de contenu: ${contentCount}`);
            }

            // Vérifier la configuration niveau 2
            const { data: config } = await supabase
                .from('category_hierarchy_config')
                .select('has_level2')
                .eq('category_id', category.id)
                .maybeSingle();

            if (config) {
                console.log(`   📋 Configuration niveau 2: présente`);
            }
            console.log('');
        }

        // Supprimer les catégories
        console.log('🗑️  Suppression des catégories...\n');

        let deleted = 0;
        let errors = 0;

        for (const category of categoriesToDelete) {
            console.log(`Suppression de "${category.name}"...`);
            
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

        // Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');
        console.log(`✅ ${deleted} catégorie(s) supprimée(s)`);
        if (errors > 0) {
            console.log(`❌ ${errors} erreur(s)`);
        }

        // Vérification finale
        console.log('\n🔍 Vérification finale...\n');
        for (const category of categoriesToDelete) {
            const { data: checkCategory } = await supabase
                .from('categories')
                .select('id, name')
                .eq('id', category.id)
                .maybeSingle();

            if (checkCategory) {
                console.log(`⚠️  "${category.name}" existe encore`);
            } else {
                console.log(`✅ "${category.name}" bien supprimée`);
            }
        }

        console.log('\n🎉 Opération terminée !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

