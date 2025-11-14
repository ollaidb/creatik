#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES COMPLOTISTE ===\n');

        // 1. Récupérer la catégorie Complotiste
        console.log('🔍 Recherche de la catégorie "Complotiste"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%complotiste%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Complotiste" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories complotiste
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const complotisteSubcategories = [
            // Théories du complot générales
            { name: 'Théories du complot', description: 'Théories du complot générales' },
            { name: 'Complots gouvernementaux', description: 'Complots impliquant les gouvernements' },
            { name: 'Complots internationaux', description: 'Complots à l\'échelle internationale' },
            { name: 'Sociétés secrètes', description: 'Contenu sur les sociétés secrètes' },
            { name: 'Illuminati', description: 'Contenu sur les Illuminati' },
            { name: 'Franc-maçonnerie', description: 'Contenu sur la franc-maçonnerie' },
            { name: 'Bilderberg', description: 'Contenu sur le groupe Bilderberg' },
            { name: 'Skull and Bones', description: 'Contenu sur Skull and Bones' },
            
            // Santé et médecine
            { name: 'Complots pharmaceutiques', description: 'Théories sur l\'industrie pharmaceutique' },
            { name: 'Vaccins', description: 'Théories du complot sur les vaccins' },
            { name: 'Big Pharma', description: 'Théories sur Big Pharma' },
            { name: 'Médecine alternative', description: 'Théories sur la médecine alternative' },
            { name: 'Pandémies', description: 'Théories du complot sur les pandémies' },
            { name: 'Virus créés', description: 'Théories sur les virus créés en laboratoire' },
            
            // Politique
            { name: 'Complots politiques', description: 'Théories du complot politiques' },
            { name: 'Élections truquées', description: 'Théories sur les élections' },
            { name: 'Assassinats politiques', description: 'Théories sur les assassinats politiques' },
            { name: 'Coups d\'État', description: 'Théories sur les coups d\'État' },
            { name: 'Gouvernement mondial', description: 'Théories sur un gouvernement mondial' },
            { name: 'Nouvel Ordre Mondial', description: 'Théories sur le Nouvel Ordre Mondial' },
            { name: 'Deep State', description: 'Théories sur l\'État profond' },
            
            // Économie et finance
            { name: 'Complots financiers', description: 'Théories du complot financières' },
            { name: 'Banques centrales', description: 'Théories sur les banques centrales' },
            { name: 'Rothschild', description: 'Théories sur la famille Rothschild' },
            { name: 'Réserve fédérale', description: 'Théories sur la Réserve fédérale' },
            { name: 'Crise économique', description: 'Théories sur les crises économiques' },
            { name: 'Dette mondiale', description: 'Théories sur la dette mondiale' },
            
            // Médias et communication
            { name: 'Complots médiatiques', description: 'Théories sur les médias' },
            { name: 'Mensonges des médias', description: 'Théories sur la désinformation médiatique' },
            { name: 'Propagande', description: 'Théories sur la propagande' },
            { name: 'Censure', description: 'Théories sur la censure' },
            { name: 'Manipulation de l\'information', description: 'Théories sur la manipulation' },
            { name: 'Fake news', description: 'Théories sur les fake news' },
            
            // Technologie
            { name: 'Complots technologiques', description: 'Théories du complot technologiques' },
            { name: '5G', description: 'Théories du complot sur la 5G' },
            { name: 'Puce électronique', description: 'Théories sur les puces électroniques' },
            { name: 'Surveillance', description: 'Théories sur la surveillance de masse' },
            { name: 'Big Tech', description: 'Théories sur les grandes entreprises tech' },
            { name: 'IA et contrôle', description: 'Théories sur l\'IA et le contrôle' },
            { name: 'Internet contrôlé', description: 'Théories sur le contrôle d\'Internet' },
            
            // Environnement
            { name: 'Complots environnementaux', description: 'Théories du complot environnementales' },
            { name: 'Changement climatique', description: 'Théories sur le changement climatique' },
            { name: 'Géo-ingénierie', description: 'Théories sur la géo-ingénierie' },
            { name: 'Chemtrails', description: 'Théories sur les chemtrails' },
            { name: 'HAARP', description: 'Théories sur HAARP' },
            { name: 'Modification du temps', description: 'Théories sur la modification du temps' },
            
            // Espace et extraterrestres
            { name: 'Complots spatiaux', description: 'Théories du complot sur l\'espace' },
            { name: 'NASA', description: 'Théories sur la NASA' },
            { name: 'Atterrissage sur la Lune', description: 'Théories sur l\'atterrissage sur la Lune' },
            { name: 'Extraterrestres cachés', description: 'Théories sur les extraterrestres cachés' },
            { name: 'Zone 51', description: 'Théories sur la Zone 51' },
            { name: 'OVNI secrets', description: 'Théories sur les OVNI secrets' },
            
            // Histoire
            { name: 'Complots historiques', description: 'Théories du complot historiques' },
            { name: '11 septembre', description: 'Théories sur le 11 septembre' },
            { name: 'Kennedy', description: 'Théories sur l\'assassinat de Kennedy' },
            { name: 'Guerres', description: 'Théories sur les guerres' },
            { name: 'Holocauste', description: 'Théories sur l\'Holocauste' },
            { name: 'Histoire réécrite', description: 'Théories sur l\'histoire réécrite' },
            
            // Religion et spiritualité
            { name: 'Complots religieux', description: 'Théories du complot religieuses' },
            { name: 'Vatican', description: 'Théories sur le Vatican' },
            { name: 'Jésuites', description: 'Théories sur les Jésuites' },
            { name: 'Religion contrôlée', description: 'Théories sur le contrôle religieux' },
            { name: 'Spiritualité cachée', description: 'Théories sur la spiritualité cachée' },
            
            // Alimentation
            { name: 'Complots alimentaires', description: 'Théories du complot alimentaires' },
            { name: 'OGM', description: 'Théories sur les OGM' },
            { name: 'Pesticides', description: 'Théories sur les pesticides' },
            { name: 'Alimentation contrôlée', description: 'Théories sur le contrôle alimentaire' },
            { name: 'Codex Alimentarius', description: 'Théories sur le Codex Alimentarius' },
            
            // Éducation
            { name: 'Complots éducatifs', description: 'Théories du complot sur l\'éducation' },
            { name: 'Système éducatif', description: 'Théories sur le système éducatif' },
            { name: 'Endoctrinement', description: 'Théories sur l\'endoctrinement' },
            { name: 'Histoire falsifiée', description: 'Théories sur l\'histoire falsifiée' },
            
            // Énergie
            { name: 'Complots énergétiques', description: 'Théories du complot énergétiques' },
            { name: 'Pétrole', description: 'Théories sur le pétrole' },
            { name: 'Énergie libre', description: 'Théories sur l\'énergie libre cachée' },
            { name: 'Tesla', description: 'Théories sur Tesla et l\'énergie' },
            
            // Population
            { name: 'Complots démographiques', description: 'Théories du complot démographiques' },
            { name: 'Dépopulation', description: 'Théories sur la dépopulation' },
            { name: 'Contrôle démographique', description: 'Théories sur le contrôle démographique' },
            { name: 'Eugénisme', description: 'Théories sur l\'eugénisme' },
            
            // Symbolisme et codes
            { name: 'Symbolisme occulte', description: 'Théories sur le symbolisme occulte' },
            { name: 'Codes cachés', description: 'Théories sur les codes cachés' },
            { name: 'Signes et symboles', description: 'Théories sur les signes et symboles' },
            { name: 'Numérologie occulte', description: 'Théories sur la numérologie occulte' },
            
            // Personnalités
            { name: 'Complots de personnalités', description: 'Théories sur des personnalités' },
            { name: 'Élites', description: 'Théories sur les élites' },
            { name: 'Familles puissantes', description: 'Théories sur les familles puissantes' },
            { name: 'Célébrités contrôlées', description: 'Théories sur les célébrités' },
            
            // Actualités et événements
            { name: 'Complots actuels', description: 'Théories du complot actuelles' },
            { name: 'Événements récents', description: 'Théories sur les événements récents' },
            { name: 'Crises planifiées', description: 'Théories sur les crises planifiées' },
            
            // Analyse et critique
            { name: 'Analyse de complots', description: 'Analyse des théories du complot' },
            { name: 'Débunking', description: 'Démystification des théories' },
            { name: 'Vérification des faits', description: 'Vérification des faits' },
            { name: 'Sources', description: 'Sources et preuves' },
            
            // Communautés
            { name: 'Communautés complotistes', description: 'Communautés autour des théories' },
            { name: 'Forums', description: 'Forums complotistes' },
            { name: 'Réseaux sociaux', description: 'Théories partagées sur les réseaux' }
        ];

        console.log(`📊 ${complotisteSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = complotisteSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

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

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Complotiste"`);
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

