#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES HAUL ===\n');

        // 1. Récupérer la catégorie Haul
        console.log('🔍 Recherche de la catégorie "Haul"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%haul%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Haul" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories haul
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const haulSubcategories = [
            // Par type de produit
            { name: 'Haul vêtements', description: 'Haul de vêtements et mode' },
            { name: 'Haul beauté', description: 'Haul de produits de beauté et cosmétiques' },
            { name: 'Haul maquillage', description: 'Haul de maquillage' },
            { name: 'Haul soins', description: 'Haul de produits de soin' },
            { name: 'Haul cheveux', description: 'Haul de produits pour cheveux' },
            { name: 'Haul parfums', description: 'Haul de parfums' },
            { name: 'Haul accessoires', description: 'Haul d\'accessoires de mode' },
            { name: 'Haul chaussures', description: 'Haul de chaussures' },
            { name: 'Haul sacs', description: 'Haul de sacs à main' },
            { name: 'Haul bijoux', description: 'Haul de bijoux' },
            { name: 'Haul décoration', description: 'Haul de décoration intérieure' },
            { name: 'Haul maison', description: 'Haul d\'objets pour la maison' },
            { name: 'Haul cuisine', description: 'Haul d\'ustensiles et produits de cuisine' },
            { name: 'Haul livres', description: 'Haul de livres' },
            { name: 'Haul technologie', description: 'Haul de produits technologiques' },
            { name: 'Haul gadgets', description: 'Haul de gadgets' },
            { name: 'Haul jouets', description: 'Haul de jouets' },
            { name: 'Haul jeux vidéo', description: 'Haul de jeux vidéo' },
            { name: 'Haul sport', description: 'Haul d\'équipements sportifs' },
            { name: 'Haul voyage', description: 'Haul d\'accessoires de voyage' },
            
            // Par magasin
            { name: 'Haul Zara', description: 'Haul de produits Zara' },
            { name: 'Haul H&M', description: 'Haul de produits H&M' },
            { name: 'Haul Primark', description: 'Haul de produits Primark' },
            { name: 'Haul Shein', description: 'Haul de produits Shein' },
            { name: 'Haul Amazon', description: 'Haul de produits Amazon' },
            { name: 'Haul AliExpress', description: 'Haul de produits AliExpress' },
            { name: 'Haul Sephora', description: 'Haul de produits Sephora' },
            { name: 'Haul Ulta', description: 'Haul de produits Ulta' },
            { name: 'Haul Target', description: 'Haul de produits Target' },
            { name: 'Haul Walmart', description: 'Haul de produits Walmart' },
            { name: 'Haul Ikea', description: 'Haul de produits Ikea' },
            { name: 'Haul décathlon', description: 'Haul de produits Decathlon' },
            { name: 'Haul Fnac', description: 'Haul de produits Fnac' },
            { name: 'Haul Cultura', description: 'Haul de produits Cultura' },
            { name: 'Haul magasins discount', description: 'Haul de magasins discount' },
            { name: 'Haul friperies', description: 'Haul de friperies' },
            { name: 'Haul vinted', description: 'Haul de produits Vinted' },
            { name: 'Haul leboncoin', description: 'Haul de produits LeBonCoin' },
            { name: 'Haul vide-greniers', description: 'Haul de vide-greniers' },
            
            // Par budget
            { name: 'Haul pas cher', description: 'Haul de produits à petit budget' },
            { name: 'Haul budget', description: 'Haul avec un budget limité' },
            { name: 'Haul moyen de gamme', description: 'Haul de produits moyen de gamme' },
            { name: 'Haul luxe', description: 'Haul de produits de luxe' },
            { name: 'Haul designer', description: 'Haul de produits de marques de luxe' },
            { name: 'Haul soldes', description: 'Haul de produits en soldes' },
            { name: 'Haul promotions', description: 'Haul de produits en promotion' },
            { name: 'Haul Black Friday', description: 'Haul Black Friday' },
            { name: 'Haul Cyber Monday', description: 'Haul Cyber Monday' },
            { name: 'Haul Noël', description: 'Haul de Noël' },
            { name: 'Haul anniversaire', description: 'Haul d\'anniversaire' },
            
            // Par occasion
            { name: 'Haul rentrée', description: 'Haul de rentrée scolaire' },
            { name: 'Haul été', description: 'Haul d\'été' },
            { name: 'Haul hiver', description: 'Haul d\'hiver' },
            { name: 'Haul printemps', description: 'Haul de printemps' },
            { name: 'Haul automne', description: 'Haul d\'automne' },
            { name: 'Haul vacances', description: 'Haul de vacances' },
            { name: 'Haul déménagement', description: 'Haul de déménagement' },
            { name: 'Haul nouveau départ', description: 'Haul pour un nouveau départ' },
            
            // Par type de haul
            { name: 'Haul shopping', description: 'Haul de shopping général' },
            { name: 'Haul en ligne', description: 'Haul de shopping en ligne' },
            { name: 'Haul magasin', description: 'Haul de shopping en magasin' },
            { name: 'Haul surprise', description: 'Haul surprise' },
            { name: 'Haul test', description: 'Haul avec tests des produits' },
            { name: 'Haul avis', description: 'Haul avec avis détaillés' },
            { name: 'Haul unboxing', description: 'Haul avec déballage' },
            { name: 'Haul try-on', description: 'Haul avec essayage' },
            { name: 'Haul review', description: 'Haul avec revue des produits' },
            
            // Par personne
            { name: 'Haul pour moi', description: 'Haul personnel' },
            { name: 'Haul cadeaux', description: 'Haul de cadeaux pour autres' },
            { name: 'Haul famille', description: 'Haul pour la famille' },
            { name: 'Haul enfants', description: 'Haul pour enfants' },
            { name: 'Haul bébé', description: 'Haul pour bébé' },
            { name: 'Haul homme', description: 'Haul pour homme' },
            { name: 'Haul femme', description: 'Haul pour femme' },
            { name: 'Haul ado', description: 'Haul pour adolescents' },
            
            // Par style
            { name: 'Haul minimaliste', description: 'Haul minimaliste' },
            { name: 'Haul tendance', description: 'Haul de produits tendance' },
            { name: 'Haul vintage', description: 'Haul de produits vintage' },
            { name: 'Haul streetwear', description: 'Haul streetwear' },
            { name: 'Haul casual', description: 'Haul casual' },
            { name: 'Haul élégant', description: 'Haul élégant' },
            { name: 'Haul bohème', description: 'Haul style bohème' },
            { name: 'Haul sportswear', description: 'Haul sportswear' },
            
            // Par catégorie spécifique
            { name: 'Haul lingerie', description: 'Haul de lingerie' },
            { name: 'Haul pyjamas', description: 'Haul de pyjamas' },
            { name: 'Haul sous-vêtements', description: 'Haul de sous-vêtements' },
            { name: 'Haul maillots de bain', description: 'Haul de maillots de bain' },
            { name: 'Haul chapeaux', description: 'Haul de chapeaux' },
            { name: 'Haul lunettes', description: 'Haul de lunettes' },
            { name: 'Haul montres', description: 'Haul de montres' },
            { name: 'Haul ceintures', description: 'Haul de ceintures' },
            { name: 'Haul écharpes', description: 'Haul d\'écharpes' },
            { name: 'Haul gants', description: 'Haul de gants' },
            
            // Par taille
            { name: 'Haul plus size', description: 'Haul pour grandes tailles' },
            { name: 'Haul petite taille', description: 'Haul pour petites tailles' },
            { name: 'Haul grande taille', description: 'Haul pour grandes tailles' },
            
            // Par fréquence
            { name: 'Haul mensuel', description: 'Haul mensuel' },
            { name: 'Haul hebdomadaire', description: 'Haul hebdomadaire' },
            { name: 'Haul annuel', description: 'Haul annuel' },
            { name: 'Haul premier achat', description: 'Haul premier achat' },
            
            // Spécialisé
            { name: 'Haul duplis', description: 'Haul de produits dupliqués' },
            { name: 'Haul wishlist', description: 'Haul de produits de la wishlist' },
            { name: 'Haul regrets', description: 'Haul de produits regrettés' },
            { name: 'Haul favoris', description: 'Haul de produits favoris' },
            { name: 'Haul retour', description: 'Haul avec retours de produits' },
            { name: 'Haul échange', description: 'Haul avec échanges' },
            { name: 'Haul cadeaux reçus', description: 'Haul de cadeaux reçus' },
            { name: 'Haul collaboration', description: 'Haul en collaboration' }
        ];

        console.log(`📊 ${haulSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = haulSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

        console.log(`📊 ${existing?.length || 0} sous-catégorie(s) existante(s)`);
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);

        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !\n');
            return;
        }

        // 4. Ajouter les sous-catégories
        console.log('💾 Ajout des sous-catégories...\n');

        const now = new Date().toISOString();
        const dataToInsert = toAdd.map(sub => ({
            name: sub.name,
            description: sub.description,
            category_id: category.id,
            created_at: now,
            updated_at: now
        }));

        // Insérer par batch de 50
        const batchSize = 50;
        let success = 0;
        let failed = 0;

        for (let i = 0; i < dataToInsert.length; i += batchSize) {
            const batch = dataToInsert.slice(i, i + batchSize);

            const { error } = await supabase
                .from('subcategories')
                .insert(batch);

            if (error) {
                // Essayer une par une
                for (const item of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert(item);

                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            console.log(`   ⚠️  "${item.name}" existe déjà, ignoré`);
                            success++;
                        } else {
                            console.log(`   ❌ "${item.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        console.log(`   ✅ "${item.name}" ajoutée`);
                        success++;
                    }
                }
            } else {
                batch.forEach(item => {
                    console.log(`   ✅ "${item.name}" ajoutée`);
                });
                success += batch.length;
            }
        }

        // 5. Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');

        const { data: finalSubcategories } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Haul"`);
        console.log(`✅ ${success} nouvelle(s) sous-catégorie(s) ajoutée(s)`);
        if (failed > 0) {
            console.log(`❌ ${failed} échec(s)`);
        }
        console.log('\n🎉 Configuration terminée avec succès !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

