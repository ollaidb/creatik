#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🧹 === NETTOYAGE DES CATÉGORIES DOUBLONS (CORRIGÉ) ===\n');

        const animationToDelete = {
            id: 'a1382a95-c995-4b20-b22b-7ab6b3763073',
            name: 'Animation / dessin animé'
        };

        const animationToKeep = {
            id: '7160505c-52c5-40d3-91c2-8658a64ef223',
            name: 'Animation'
        };

        // 1. Récupérer les sous-catégories de "Animation / dessin animé"
        console.log(`🔍 Récupération des sous-catégories de "${animationToDelete.name}"...\n`);
        
        const { data: subcategories, error: subError } = await supabase
            .from('subcategories')
            .select('id, name, description')
            .eq('category_id', animationToDelete.id);

        if (subError) {
            console.error(`❌ Erreur: ${subError.message}`);
            return;
        }

        const subcategoriesToMove = subcategories || [];
        console.log(`📋 ${subcategoriesToMove.length} sous-catégorie(s) trouvée(s)`);

        if (subcategoriesToMove.length > 0) {
            subcategoriesToMove.forEach(sub => {
                console.log(`   - ${sub.name}`);
            });
            console.log('');

            // 2. Vérifier si ces sous-catégories existent déjà dans "Animation"
            console.log(`🔍 Vérification des doublons dans "${animationToKeep.name}"...\n`);
            
            const { data: existingSubs } = await supabase
                .from('subcategories')
                .select('name')
                .eq('category_id', animationToKeep.id);

            const existingNames = new Set(existingSubs?.map(s => s.name.toLowerCase()) || []);

            // 3. Déplacer les sous-catégories vers "Animation"
            console.log('🔄 Déplacement des sous-catégories...\n');

            let moved = 0;
            let skipped = 0;

            for (const sub of subcategoriesToMove) {
                const exists = existingNames.has(sub.name.toLowerCase());
                
                if (exists) {
                    console.log(`   ⏭️  "${sub.name}" existe déjà dans "${animationToKeep.name}", suppression de l'ancienne...`);
                    
                    // Supprimer l'ancienne sous-catégorie (et ses word_blocks seront supprimés en cascade)
                    const { error: deleteError } = await supabase
                        .from('subcategories')
                        .delete()
                        .eq('id', sub.id);

                    if (deleteError) {
                        console.error(`      ❌ Erreur: ${deleteError.message}`);
                    } else {
                        console.log(`      ✅ Ancienne sous-catégorie supprimée`);
                        skipped++;
                    }
                } else {
                    // Déplacer vers la nouvelle catégorie
                    const { error: updateError } = await supabase
                        .from('subcategories')
                        .update({ 
                            category_id: animationToKeep.id,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', sub.id);

                    if (updateError) {
                        console.error(`   ❌ "${sub.name}": ${updateError.message}`);
                    } else {
                        console.log(`   ✅ "${sub.name}" déplacée vers "${animationToKeep.name}"`);
                        moved++;
                    }
                }
            }

            console.log(`\n📊 ${moved} déplacée(s), ${skipped} doublon(s) supprimé(s)\n`);
        }

        // 4. Vérifier les sous-catégories niveau 2
        if (subcategoriesToMove.length > 0) {
            const subcategoryIds = subcategoriesToMove.map(s => s.id);
            const { data: level2Subs } = await supabase
                .from('subcategories_level2')
                .select('id, subcategory_id')
                .in('subcategory_id', subcategoryIds);

            if (level2Subs && level2Subs.length > 0) {
                console.log(`📋 ${level2Subs.length} sous-catégorie(s) niveau 2 trouvée(s) (déjà liées aux sous-catégories déplacées)\n`);
            }
        }

        // 5. Vérifier et supprimer la configuration niveau 2 si elle existe
        console.log('🔍 Vérification de la configuration niveau 2...\n');
        
        const { data: config } = await supabase
            .from('category_hierarchy_config')
            .select('has_level2')
            .eq('category_id', animationToDelete.id)
            .maybeSingle();

        if (config) {
            console.log('🗑️  Suppression de la configuration niveau 2...');
            const { error: configError } = await supabase
                .from('category_hierarchy_config')
                .delete()
                .eq('category_id', animationToDelete.id);

            if (configError) {
                console.error(`   ❌ Erreur: ${configError.message}`);
            } else {
                console.log('   ✅ Configuration supprimée\n');
            }
        }

        // 6. Supprimer la catégorie "Animation / dessin animé"
        console.log(`🗑️  Suppression de la catégorie "${animationToDelete.name}"...\n`);
        
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', animationToDelete.id);

        if (deleteError) {
            console.error(`❌ Erreur: ${deleteError.message}`);
            console.log('\n💡 La catégorie ne peut pas être supprimée car elle est encore référencée.');
            console.log('   Les sous-catégories ont été déplacées, mais la catégorie reste.');
        } else {
            console.log(`✅ "${animationToDelete.name}" supprimée avec succès\n`);
        }

        // 7. Résumé final
        console.log('📊 === RÉSUMÉ FINAL ===\n');
        console.log('✅ Catégories conservées:');
        console.log(`   - "Anime" (ID: 6186b08a-6ca2-4a53-b774-3d8a177b9d16)`);
        console.log(`   - "Animation" (ID: ${animationToKeep.id})`);
        console.log('\n✅ Nettoyage terminé avec succès !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

