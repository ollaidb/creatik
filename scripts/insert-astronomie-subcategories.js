#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES ASTRONOMIE ===\n');

        // 1. Récupérer la catégorie Astronomie
        console.log('🔍 Recherche de la catégorie "Astronomie"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%astronomie%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Astronomie" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories astronomie
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const astronomieSubcategories = [
            // Corps célestes
            { name: 'Planètes', description: 'Contenu sur les planètes du système solaire' },
            { name: 'Soleil', description: 'Contenu sur le Soleil' },
            { name: 'Lune', description: 'Contenu sur la Lune' },
            { name: 'Étoiles', description: 'Contenu sur les étoiles' },
            { name: 'Galaxies', description: 'Contenu sur les galaxies' },
            { name: 'Nébuleuses', description: 'Contenu sur les nébuleuses' },
            { name: 'Astéroïdes', description: 'Contenu sur les astéroïdes' },
            { name: 'Comètes', description: 'Contenu sur les comètes' },
            { name: 'Météores', description: 'Contenu sur les météores et étoiles filantes' },
            { name: 'Trous noirs', description: 'Contenu sur les trous noirs' },
            { name: 'Exoplanètes', description: 'Contenu sur les exoplanètes' },
            { name: 'Naines blanches', description: 'Contenu sur les naines blanches' },
            { name: 'Supernovae', description: 'Contenu sur les supernovae' },
            { name: 'Pulsars', description: 'Contenu sur les pulsars' },
            { name: 'Quasars', description: 'Contenu sur les quasars' },
            
            // Système solaire
            { name: 'Système solaire', description: 'Contenu général sur le système solaire' },
            { name: 'Mercure', description: 'Contenu sur la planète Mercure' },
            { name: 'Vénus', description: 'Contenu sur la planète Vénus' },
            { name: 'Terre', description: 'Contenu sur la planète Terre' },
            { name: 'Mars', description: 'Contenu sur la planète Mars' },
            { name: 'Jupiter', description: 'Contenu sur la planète Jupiter' },
            { name: 'Saturne', description: 'Contenu sur la planète Saturne' },
            { name: 'Uranus', description: 'Contenu sur la planète Uranus' },
            { name: 'Neptune', description: 'Contenu sur la planète Neptune' },
            { name: 'Pluton', description: 'Contenu sur Pluton et les planètes naines' },
            { name: 'Satellites naturels', description: 'Contenu sur les lunes et satellites' },
            { name: 'Ceinture d\'astéroïdes', description: 'Contenu sur la ceinture d\'astéroïdes' },
            { name: 'Ceinture de Kuiper', description: 'Contenu sur la ceinture de Kuiper' },
            { name: 'Nuage d\'Oort', description: 'Contenu sur le nuage d\'Oort' },
            
            // Observations et phénomènes
            { name: 'Observation du ciel', description: 'Techniques d\'observation du ciel' },
            { name: 'Éclipses', description: 'Contenu sur les éclipses solaires et lunaires' },
            { name: 'Éclipse solaire', description: 'Contenu sur les éclipses solaires' },
            { name: 'Éclipse lunaire', description: 'Contenu sur les éclipses lunaires' },
            { name: 'Transits planétaires', description: 'Contenu sur les transits planétaires' },
            { name: 'Conjonctions', description: 'Contenu sur les conjonctions planétaires' },
            { name: 'Oppositions', description: 'Contenu sur les oppositions planétaires' },
            { name: 'Pluies de météores', description: 'Contenu sur les pluies de météores' },
            { name: 'Aurores', description: 'Contenu sur les aurores boréales et australes' },
            { name: 'Phases de la Lune', description: 'Contenu sur les phases lunaires' },
            { name: 'Marées', description: 'Contenu sur les marées et leur relation avec la Lune' },
            
            // Instruments et techniques
            { name: 'Télescopes', description: 'Contenu sur les télescopes' },
            { name: 'Lunettes astronomiques', description: 'Contenu sur les lunettes astronomiques' },
            { name: 'Astrophotographie', description: 'Photographie d\'objets célestes' },
            { name: 'Observation visuelle', description: 'Observation à l\'œil nu' },
            { name: 'Observation aux jumelles', description: 'Observation avec des jumelles' },
            { name: 'Télescopes amateurs', description: 'Télescopes pour amateurs' },
            { name: 'Télescopes professionnels', description: 'Télescopes professionnels et observatoires' },
            { name: 'Télescopes spatiaux', description: 'Télescopes en orbite (Hubble, James Webb, etc.)' },
            { name: 'Radioastronomie', description: 'Observation en ondes radio' },
            { name: 'Rayons X', description: 'Astronomie en rayons X' },
            { name: 'Infrarouge', description: 'Astronomie infrarouge' },
            { name: 'Ultraviolet', description: 'Astronomie ultraviolette' },
            { name: 'Rayons gamma', description: 'Astronomie gamma' },
            
            // Missions spatiales
            { name: 'Missions spatiales', description: 'Contenu sur les missions spatiales' },
            { name: 'Apollo', description: 'Contenu sur les missions Apollo' },
            { name: 'Mars missions', description: 'Contenu sur les missions vers Mars' },
            { name: 'Voyager', description: 'Contenu sur les missions Voyager' },
            { name: 'Cassini', description: 'Contenu sur la mission Cassini' },
            { name: 'James Webb', description: 'Contenu sur le télescope spatial James Webb' },
            { name: 'Hubble', description: 'Contenu sur le télescope spatial Hubble' },
            { name: 'ISS', description: 'Contenu sur la Station Spatiale Internationale' },
            { name: 'Exploration spatiale', description: 'Contenu général sur l\'exploration spatiale' },
            { name: 'Rover martien', description: 'Contenu sur les rovers martiens' },
            { name: 'Sondes spatiales', description: 'Contenu sur les sondes spatiales' },
            
            // Concepts et théories
            { name: 'Big Bang', description: 'Contenu sur la théorie du Big Bang' },
            { name: 'Expansion de l\'univers', description: 'Contenu sur l\'expansion de l\'univers' },
            { name: 'Matière noire', description: 'Contenu sur la matière noire' },
            { name: 'Énergie sombre', description: 'Contenu sur l\'énergie sombre' },
            { name: 'Relativité', description: 'Contenu sur la relativité générale et restreinte' },
            { name: 'Gravité', description: 'Contenu sur la gravité et la gravitation' },
            { name: 'Formation des étoiles', description: 'Contenu sur la formation des étoiles' },
            { name: 'Évolution stellaire', description: 'Contenu sur l\'évolution des étoiles' },
            { name: 'Formation planétaire', description: 'Contenu sur la formation des planètes' },
            { name: 'Origine de la vie', description: 'Contenu sur l\'origine de la vie dans l\'univers' },
            { name: 'Zone habitable', description: 'Contenu sur les zones habitables' },
            { name: 'Vie extraterrestre', description: 'Contenu sur la recherche de vie extraterrestre' },
            { name: 'SETI', description: 'Contenu sur la recherche d\'intelligence extraterrestre' },
            
            // Calendrier et temps
            { name: 'Calendrier astronomique', description: 'Événements astronomiques du calendrier' },
            { name: 'Équinoxes', description: 'Contenu sur les équinoxes' },
            { name: 'Solstices', description: 'Contenu sur les solstices' },
            { name: 'Saisons', description: 'Contenu sur les saisons et leur origine astronomique' },
            { name: 'Année lumière', description: 'Contenu sur l\'année lumière et les distances' },
            { name: 'Parallaxe', description: 'Contenu sur la parallaxe stellaire' },
            { name: 'Temps sidéral', description: 'Contenu sur le temps sidéral' },
            
            // Constellations et navigation
            { name: 'Constellations', description: 'Contenu sur les constellations' },
            { name: 'Zodiaque', description: 'Contenu sur les signes du zodiaque astronomique' },
            { name: 'Navigation céleste', description: 'Contenu sur la navigation par les étoiles' },
            { name: 'Cartes du ciel', description: 'Contenu sur les cartes du ciel' },
            { name: 'Astronomie ancienne', description: 'Contenu sur l\'astronomie des civilisations anciennes' },
            { name: 'Mythologie céleste', description: 'Contenu sur les mythes liés aux constellations' },
            
            // Éducation et vulgarisation
            { name: 'Astronomie pour débutants', description: 'Contenu pour débuter en astronomie' },
            { name: 'Astronomie amateur', description: 'Contenu pour les astronomes amateurs' },
            { name: 'Astronomie professionnelle', description: 'Contenu sur l\'astronomie professionnelle' },
            { name: 'Vulgarisation', description: 'Contenu de vulgarisation astronomique' },
            { name: 'Livres astronomie', description: 'Recommandations de livres d\'astronomie' },
            { name: 'Documentaires', description: 'Documentaires sur l\'astronomie' },
            { name: 'Podcasts astronomie', description: 'Podcasts sur l\'astronomie' },
            
            // Actualités et découvertes
            { name: 'Actualités astronomiques', description: 'Actualités du monde de l\'astronomie' },
            { name: 'Découvertes récentes', description: 'Découvertes astronomiques récentes' },
            { name: 'Images du jour', description: 'Images astronomiques du jour' },
            { name: 'Photos de l\'espace', description: 'Photographies de l\'espace' },
            
            // Spécialisé
            { name: 'Cosmologie', description: 'Contenu sur la cosmologie' },
            { name: 'Astrophysique', description: 'Contenu sur l\'astrophysique' },
            { name: 'Planétologie', description: 'Contenu sur la planétologie' },
            { name: 'Exobiologie', description: 'Contenu sur l\'exobiologie' },
            { name: 'Météorologie spatiale', description: 'Contenu sur la météorologie spatiale' },
            { name: 'Débris spatiaux', description: 'Contenu sur les débris spatiaux' },
            { name: 'Pollution lumineuse', description: 'Contenu sur la pollution lumineuse' },
            { name: 'Protection du ciel', description: 'Contenu sur la protection du ciel nocturne' }
        ];

        console.log(`📊 ${astronomieSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = astronomieSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

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

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Astronomie"`);
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

