#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function analyzeFanAccount() {
    console.log('\n🔍 Analyse de la catégorie "Fan account"...\n');

    // Récupérer la catégorie
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name, color, description')
        .ilike('name', '%fan account%')
        .maybeSingle();

    if (catError || !category) {
        console.log('❌ Catégorie "Fan account" introuvable');
        return null;
    }

    console.log(`✅ Catégorie trouvée:`);
    console.log(`   📌 Nom: ${category.name}`);
    console.log(`   🆔 ID: ${category.id}`);
    console.log(`   🎨 Couleur: ${category.color}`);
    console.log(`   📝 Description: ${category.description || 'Aucune'}\n`);

    // Vérifier la configuration niveau 2
    const { data: hierarchyConfig } = await supabase
        .from('category_hierarchy_config')
        .select('has_level2')
        .eq('category_id', category.id)
        .maybeSingle();

    const hasLevel2 = hierarchyConfig?.has_level2 || false;
    console.log(`⚙️  Niveau 2 activé: ${hasLevel2 ? '✅ Oui' : '❌ Non'}\n`);

    // Récupérer les sous-catégories niveau 1
    const { data: subcategories } = await supabase
        .from('subcategories')
        .select('id, name, description')
        .eq('category_id', category.id)
        .order('name');

    console.log(`📊 Sous-catégories niveau 1 existantes: ${subcategories?.length || 0}\n`);

    if (subcategories && subcategories.length > 0) {
        console.log(`📁 Liste actuelle:`);
        subcategories.forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name}${sub.description ? ` - ${sub.description}` : ''}`);
        });
        console.log('');
    }

    // Récupérer les sous-catégories niveau 2
    if (hasLevel2 && subcategories && subcategories.length > 0) {
        const subcategoryIds = subcategories.map(s => s.id);
        const { data: level2Subcategories } = await supabase
            .from('subcategories_level2')
            .select('id, name, description, subcategory_id')
            .in('subcategory_id', subcategoryIds)
            .order('name');

        const level2Count = level2Subcategories?.length || 0;
        console.log(`📊 Sous-catégories niveau 2 existantes: ${level2Count}\n`);

        if (level2Count > 0) {
            console.log(`📁 Liste niveau 2:`);
            const grouped = {};
            level2Subcategories.forEach(l2 => {
                const parentId = l2.subcategory_id;
                if (!grouped[parentId]) {
                    const parent = subcategories.find(s => s.id === parentId);
                    grouped[parentId] = { parent: parent?.name || 'N/A', items: [] };
                }
                grouped[parentId].items.push(l2.name);
            });

            Object.values(grouped).forEach(({ parent, items }) => {
                console.log(`   📂 ${parent}:`);
                items.forEach(item => console.log(`      • ${item}`));
            });
            console.log('');
        }
    }

    return {
        category,
        hasLevel2,
        subcategories: subcategories || [],
        hierarchyConfig
    };
}

async function activateLevel2(categoryId) {
    console.log('⚙️  Activation du niveau 2...\n');

    const { error } = await supabase
        .from('category_hierarchy_config')
        .upsert({
            category_id: categoryId,
            has_level2: true,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'category_id'
        });

    if (error) {
        console.log(`❌ Erreur lors de l'activation: ${error.message}\n`);
        return false;
    }

    console.log(`✅ Niveau 2 activé avec succès\n`);
    return true;
}

async function addLevel1Subcategories(categoryId, subcategories) {
    console.log('💾 Ajout des sous-catégories niveau 1...\n');

    const now = new Date().toISOString();
    let success = 0;
    let failed = 0;

    // Vérifier les existantes
    const { data: existing } = await supabase
        .from('subcategories')
        .select('name')
        .eq('category_id', categoryId);

    const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);

    const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

    if (toAdd.length === 0) {
        console.log('✅ Toutes les sous-catégories niveau 1 existent déjà\n');
        return { success: 0, failed: 0, added: [] };
    }

    const dataToInsert = toAdd.map(sub => ({
        name: sub.name,
        description: sub.description || `Sous-catégorie ${sub.name} pour Fan account`,
        category_id: categoryId,
        created_at: now,
        updated_at: now
    }));

    // Insérer par batch
    const batchSize = 50;
    const added = [];

    for (let i = 0; i < dataToInsert.length; i += batchSize) {
        const batch = dataToInsert.slice(i, i + batchSize);

        const { data, error } = await supabase
            .from('subcategories')
            .insert(batch)
            .select('id, name');

        if (error) {
            // Essayer une par une
            for (const item of batch) {
                const { data: singleData, error: singleError } = await supabase
                    .from('subcategories')
                    .insert(item)
                    .select('id, name')
                    .single();

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
                    added.push(singleData);
                }
            }
        } else {
            batch.forEach(item => {
                console.log(`   ✅ "${item.name}" ajoutée`);
            });
            success += batch.length;
            added.push(...(data || []));
        }
    }

    console.log(`\n📊 Résultat: ${success} ajoutée(s), ${failed} échouée(s)\n`);
    return { success, failed, added };
}

async function addLevel2Subcategories(subcategoryId, subcategoryName, level2Items) {
    console.log(`\n💾 Ajout des sous-catégories niveau 2 pour "${subcategoryName}"...\n`);

    // Vérifier les existantes
    const { data: existing } = await supabase
        .from('subcategories_level2')
        .select('name')
        .eq('subcategory_id', subcategoryId);

    const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);

    const toAdd = level2Items.filter(item => !existingNames.has(item.toLowerCase()));

    if (toAdd.length === 0) {
        console.log(`   ✅ Toutes les sous-catégories niveau 2 existent déjà pour "${subcategoryName}"\n`);
        return { success: 0, failed: 0 };
    }

    const now = new Date().toISOString();
    const dataToInsert = toAdd.map(name => ({
        name: name,
        description: `${name} - ${subcategoryName}`,
        subcategory_id: subcategoryId,
        created_at: now,
        updated_at: now
    }));

    let success = 0;
    let failed = 0;

    // Insérer par batch
    const batchSize = 50;
    for (let i = 0; i < dataToInsert.length; i += batchSize) {
        const batch = dataToInsert.slice(i, i + batchSize);

        const { error } = await supabase
            .from('subcategories_level2')
            .insert(batch);

        if (error) {
            // Essayer une par une
            for (const item of batch) {
                const { error: singleError } = await supabase
                    .from('subcategories_level2')
                    .insert(item);

                if (singleError) {
                    if (singleError.message.includes('duplicate') || singleError.code === '23505') {
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

    console.log(`\n📊 Résultat pour "${subcategoryName}": ${success} ajoutée(s), ${failed} échouée(s)\n`);
    return { success, failed };
}

async function main() {
    try {
        console.log('🚀 === CONFIGURATION FAN ACCOUNT ===\n');

        // 1. Analyser la catégorie
        const analysis = await analyzeFanAccount();

        if (!analysis) {
            rl.close();
            return;
        }

        // 2. Activer le niveau 2 si nécessaire
        if (!analysis.hasLevel2) {
            console.log('⚠️  Le niveau 2 n\'est pas activé. Activation nécessaire pour cette catégorie.\n');
            const activate = await question('❓ Activer le niveau 2 maintenant ? (oui/non): ');
            
            if (activate.toLowerCase() === 'oui' || activate.toLowerCase() === 'o') {
                await activateLevel2(analysis.category.id);
                analysis.hasLevel2 = true;
            } else {
                console.log('\n❌ Le niveau 2 doit être activé pour cette catégorie');
                rl.close();
                return;
            }
        }

        // 3. Proposer les sous-catégories niveau 1
        console.log('\n💡 Structure proposée pour les sous-catégories niveau 1:\n');
        
        const proposedLevel1 = [
            { name: 'Célébrités', description: 'Comptes de fans de célébrités' },
            { name: 'Divertissement', description: 'Comptes de fans de contenus de divertissement' },
            { name: 'Musique', description: 'Comptes de fans d\'artistes musicaux' },
            { name: 'Cinéma', description: 'Comptes de fans de films et acteurs' },
            { name: 'Séries TV', description: 'Comptes de fans de séries télévisées' },
            { name: 'Sports', description: 'Comptes de fans de sportifs et équipes' },
            { name: 'Gaming', description: 'Comptes de fans de jeux vidéo et streamers' },
            { name: 'Influenceurs', description: 'Comptes de fans d\'influenceurs' },
            { name: 'Livres', description: 'Comptes de fans d\'auteurs et livres' },
            { name: 'Manga/Anime', description: 'Comptes de fans de mangas et animés' }
        ];

        proposedLevel1.forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name} - ${sub.description}`);
        });
        console.log('');

        const confirmLevel1 = await question('❓ Voulez-vous ajouter ces sous-catégories niveau 1 ? (oui/non/custom): ');

        let level1ToAdd = [];
        if (confirmLevel1.toLowerCase() === 'oui' || confirmLevel1.toLowerCase() === 'o') {
            level1ToAdd = proposedLevel1;
        } else if (confirmLevel1.toLowerCase() === 'custom' || confirmLevel1.toLowerCase() === 'c') {
            const customInput = await question('📝 Entrez les sous-catégories niveau 1 (format: "Nom1:Description1, Nom2:Description2"): ');
            const customList = customInput.split(',').map(s => {
                const parts = s.trim().split(':');
                return {
                    name: parts[0].trim(),
                    description: parts[1] ? parts[1].trim() : `Sous-catégorie ${parts[0].trim()}`
                };
            }).filter(s => s.name.length > 0);
            level1ToAdd = customList;
        } else {
            console.log('\n❌ Opération annulée');
            rl.close();
            return;
        }

        // 4. Ajouter les sous-catégories niveau 1
        const { added } = await addLevel1Subcategories(analysis.category.id, level1ToAdd);

        // 5. Récupérer toutes les sous-catégories niveau 1 (existantes + nouvelles)
        const { data: allLevel1 } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', analysis.category.id)
            .order('name');

        if (!allLevel1 || allLevel1.length === 0) {
            console.log('❌ Aucune sous-catégorie niveau 1 disponible');
            rl.close();
            return;
        }

        // 6. Proposer et ajouter les sous-catégories niveau 2
        console.log('\n💡 Maintenant, ajoutons les sous-catégories niveau 2 pour chaque niveau 1\n');

        for (const level1 of allLevel1) {
            console.log(`\n📂 Sous-catégorie niveau 1: "${level1.name}"`);
            
            let suggestions = [];
            
            // Suggestions basées sur le type
            if (level1.name.toLowerCase().includes('célébrit') || level1.name.toLowerCase().includes('celebrity')) {
                suggestions = [
                    'Beyoncé', 'Taylor Swift', 'Ariana Grande', 'Justin Bieber', 'Selena Gomez',
                    'Drake', 'The Weeknd', 'Billie Eilish', 'Dua Lipa', 'Ed Sheeran',
                    'Rihanna', 'Bruno Mars', 'Adele', 'Harry Styles', 'Shawn Mendes'
                ];
            } else if (level1.name.toLowerCase().includes('divertissement')) {
                suggestions = [
                    'Netflix', 'Disney+', 'Amazon Prime', 'HBO', 'Disney',
                    'Marvel', 'DC Comics', 'Star Wars', 'Harry Potter', 'Game of Thrones'
                ];
            } else if (level1.name.toLowerCase().includes('musique')) {
                suggestions = [
                    'Pop', 'Rock', 'Rap', 'Hip-Hop', 'R&B', 'Jazz', 'Classique',
                    'Électronique', 'Country', 'Reggae', 'Metal', 'Punk'
                ];
            } else if (level1.name.toLowerCase().includes('cinéma')) {
                suggestions = [
                    'Marvel Cinematic Universe', 'DC Extended Universe', 'Star Wars',
                    'Harry Potter', 'James Bond', 'Fast & Furious', 'Mission Impossible',
                    'Pirates des Caraïbes', 'Transformers', 'Jurassic Park'
                ];
            } else if (level1.name.toLowerCase().includes('série') || level1.name.toLowerCase().includes('tv')) {
                suggestions = [
                    'Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Crown',
                    'The Office', 'Friends', 'The Walking Dead', 'Grey\'s Anatomy',
                    'House of Cards', 'The Witcher', 'Squid Game'
                ];
            } else if (level1.name.toLowerCase().includes('sport')) {
                suggestions = [
                    'Football', 'Basketball', 'Tennis', 'Football américain',
                    'Baseball', 'Hockey', 'Golf', 'Formule 1', 'UFC', 'Boxe'
                ];
            } else if (level1.name.toLowerCase().includes('gaming')) {
                suggestions = [
                    'Fortnite', 'Minecraft', 'Call of Duty', 'FIFA', 'GTA',
                    'Among Us', 'Valorant', 'League of Legends', 'Apex Legends',
                    'Pokémon', 'Zelda', 'Mario', 'Sonic'
                ];
            } else if (level1.name.toLowerCase().includes('influenceur')) {
                suggestions = [
                    'Beauté', 'Mode', 'Lifestyle', 'Tech', 'Gaming',
                    'Food', 'Travel', 'Fitness', 'Comedy', 'Education'
                ];
            } else if (level1.name.toLowerCase().includes('livre')) {
                suggestions = [
                    'Fantasy', 'Science-Fiction', 'Romance', 'Thriller', 'Mystère',
                    'Horreur', 'Biographie', 'Histoire', 'Philosophie', 'Poésie'
                ];
            } else if (level1.name.toLowerCase().includes('manga') || level1.name.toLowerCase().includes('anime')) {
                suggestions = [
                    'Naruto', 'One Piece', 'Dragon Ball', 'Attack on Titan',
                    'Demon Slayer', 'My Hero Academia', 'Death Note', 'Fullmetal Alchemist',
                    'Tokyo Ghoul', 'Jujutsu Kaisen'
                ];
            } else {
                suggestions = [
                    'Général', 'Tendances', 'Populaire', 'Classique', 'Moderne'
                ];
            }

            console.log(`\n✨ Suggestions pour "${level1.name}":`);
            suggestions.slice(0, 15).forEach((sug, index) => {
                console.log(`   ${index + 1}. ${sug}`);
            });
            console.log('');

            const addLevel2 = await question(`❓ Ajouter des sous-catégories niveau 2 pour "${level1.name}" ? (oui/non/custom): `);

            if (addLevel2.toLowerCase() === 'oui' || addLevel2.toLowerCase() === 'o') {
                await addLevel2Subcategories(level1.id, level1.name, suggestions);
            } else if (addLevel2.toLowerCase() === 'custom' || addLevel2.toLowerCase() === 'c') {
                const customInput = await question(`📝 Entrez les sous-catégories niveau 2 pour "${level1.name}" (séparées par des virgules): `);
                const customList = customInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
                if (customList.length > 0) {
                    await addLevel2Subcategories(level1.id, level1.name, customList);
                }
            } else {
                console.log(`   ⏭️  Ignoré "${level1.name}"\n`);
            }
        }

        // 7. Résumé final
        console.log('\n\n🎉 === RÉSUMÉ FINAL ===\n');
        await analyzeFanAccount();
        console.log('✅ Configuration terminée avec succès !\n');

    } catch (error) {
        console.error(`\n❌ Erreur:`, error.message);
    } finally {
        rl.close();
    }
}

main().catch(console.error);

