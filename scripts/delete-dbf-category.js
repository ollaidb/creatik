#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🗑️  === SUPPRESSION DE LA CATÉGORIE "dbf" ===\n');

        const categoryId = 'bd0bc7d8-0d5a-4924-8821-d95a0f276852';
        const categoryName = 'dbf';

        // 1. Vérifier les sous-catégories
        console.log('🔍 Vérification des données liées...\n');
        
        const { data: subcategories, error: subError } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId);

        if (subError) {
            console.error(`❌ Erreur: ${subError.message}`);
            return;
        }

        const subcategoriesCount = subcategories?.length || 0;
        console.log(`📋 Sous-catégories: ${subcategoriesCount}`);
        
        if (subcategoriesCount > 0) {
            console.log('   Sous-catégories trouvées:');
            subcategories?.forEach(sub => {
                console.log(`      - ${sub.name}`);
            });
            console.log('');
        }

        // 2. Vérifier les sous-catégories niveau 2
        if (subcategoriesCount > 0) {
            const subcategoryIds = subcategories.map(s => s.id);
            const { count: level2Count } = await supabase
                .from('subcategories_level2')
                .select('id', { count: 'exact', head: true })
                .in('subcategory_id', subcategoryIds);

            if (level2Count && level2Count > 0) {
                console.log(`📋 Sous-catégories niveau 2: ${level2Count}\n`);
            }
        }

        // 3. Vérifier les content_titles
        const { count: contentCount } = await supabase
            .from('content_titles')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', categoryId);

        if (contentCount && contentCount > 0) {
            console.log(`📋 Titres de contenu: ${contentCount}\n`);
        }

        // 4. Vérifier la configuration niveau 2
        const { data: config } = await supabase
            .from('category_hierarchy_config')
            .select('has_level2')
            .eq('category_id', categoryId)
            .maybeSingle();

        if (config) {
            console.log('📋 Configuration niveau 2: présente\n');
        }

        // 5. Supprimer la catégorie
        console.log(`🗑️  Suppression de la catégorie "${categoryName}"...\n`);
        
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId);

        if (deleteError) {
            console.error(`❌ Erreur lors de la suppression: ${deleteError.message}`);
            console.log('\n💡 La catégorie ne peut pas être supprimée car elle est encore référencée.');
            console.log('   Les sous-catégories et données liées seront supprimées en cascade.');
        } else {
            console.log(`✅ Catégorie "${categoryName}" supprimée avec succès`);
            console.log(`   ${subcategoriesCount} sous-catégorie(s) supprimée(s) en cascade\n`);
        }

        // 6. Vérification finale
        const { data: checkCategory } = await supabase
            .from('categories')
            .select('id, name')
            .eq('id', categoryId)
            .maybeSingle();

        if (checkCategory) {
            console.log('⚠️  La catégorie existe encore (peut-être à cause de contraintes de clé étrangère)');
        } else {
            console.log('✅ Vérification: La catégorie a bien été supprimée\n');
        }

        console.log('🎉 Opération terminée !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

