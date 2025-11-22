#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Interface readline pour l'interactivité
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// Génération intelligente de sous-catégories basée sur le nom de la catégorie
function generateSubcategories(categoryName) {
    const name = categoryName.toLowerCase();
    const suggestions = [];

    // Suggestions basées sur des patterns communs
    const patterns = {
        'art': [
            'Peinture', 'Dessin', 'Sculpture', 'Photographie', 'Digital Art', 
            'Street Art', 'Graffiti', 'Calligraphie', 'Tatouage', 'Body Art',
            'Art abstrait', 'Art figuratif', 'Portrait', 'Paysage', 'Nature morte',
            'Art conceptuel', 'Installation', 'Performance', 'Vidéo art', 'Art numérique'
        ],
        'cuisine': [
            'Recettes', 'Pâtisserie', 'Boulangerie', 'Cuisine du monde', 'Végétarien',
            'Végan', 'Sans gluten', 'Rapide', 'Gourmet', 'Traditionnel',
            'Fusion', 'Asiatique', 'Italienne', 'Française', 'Méditerranéenne',
            'Desserts', 'Entrées', 'Plats principaux', 'Boissons', 'Apéritifs'
        ],
        'sport': [
            'Football', 'Basketball', 'Tennis', 'Natation', 'Course à pied',
            'Musculation', 'Yoga', 'Fitness', 'Cyclisme', 'Randonnée',
            'Escalade', 'Surf', 'Ski', 'Boxe', 'Arts martiaux',
            'Danse', 'Gymnastique', 'Athlétisme', 'Volleyball', 'Handball'
        ],
        'musique': [
            'Pop', 'Rock', 'Rap', 'Hip-Hop', 'Jazz', 'Classique', 'Électronique',
            'R&B', 'Reggae', 'Country', 'Metal', 'Punk', 'Folk', 'Blues',
            'Instrumental', 'Acoustique', 'Live', 'Cover', 'Original', 'Remix'
        ],
        'mode': [
            'Féminin', 'Masculin', 'Unisexe', 'Accessoires', 'Chaussures',
            'Haute couture', 'Streetwear', 'Vintage', 'Éthique', 'Durable',
            'Sportswear', 'Formel', 'Décontracté', 'Mariage', 'Grossesse',
            'Enfant', 'Adolescent', 'Senior', 'Plus size', 'Petite taille'
        ],
        'voyage': [
            'Europe', 'Asie', 'Amérique', 'Afrique', 'Océanie', 'Antarctique',
            'Ville', 'Nature', 'Plage', 'Montagne', 'Désert', 'Forêt',
            'Culturel', 'Aventure', 'Relaxation', 'Gastronomie', 'Histoire',
            'Solo', 'Couple', 'Famille', 'Groupe', 'Luxe', 'Budget'
        ],
        'tech': [
            'Smartphone', 'Ordinateur', 'Tablette', 'Gaming', 'IA', 'Robotique',
            'Applications', 'Logiciels', 'Hardware', 'Software', 'Internet',
            'Sécurité', 'Cryptomonnaie', 'Blockchain', 'Réalité virtuelle',
            'Réalité augmentée', 'IoT', 'Cloud', 'Big Data', 'Cybersécurité'
        ],
        'beauté': [
            'Maquillage', 'Soin visage', 'Soin corps', 'Cheveux', 'Ongles',
            'Parfum', 'Homme', 'Femme', 'Bio', 'Naturel', 'Luxe',
            'Budget', 'Anti-âge', 'Acné', 'Sensible', 'Peau sèche',
            'Peau grasse', 'Tutoriels', 'Avis produits', 'Routine'
        ],
        'santé': [
            'Nutrition', 'Fitness', 'Méditation', 'Sommeil', 'Mental',
            'Physique', 'Prévention', 'Traitement', 'Bien-être', 'Thérapie',
            'Médecine alternative', 'Yoga', 'Pilates', 'Cardio', 'Renforcement',
            'Étirements', 'Récupération', 'Hydratation', 'Suppléments'
        ],
        'éducation': [
            'Mathématiques', 'Sciences', 'Langues', 'Histoire', 'Géographie',
            'Littérature', 'Philosophie', 'Économie', 'Droit', 'Médecine',
            'Ingénierie', 'Art', 'Musique', 'Sport', 'Informatique',
            'Primaire', 'Secondaire', 'Supérieur', 'Formation continue'
        ]
    };

    // Chercher des correspondances partielles
    for (const [key, values] of Object.entries(patterns)) {
        if (name.includes(key)) {
            suggestions.push(...values);
        }
    }

    // Suggestions génériques si aucune correspondance
    if (suggestions.length === 0) {
        suggestions.push(
            'Général', 'Débutant', 'Avancé', 'Expert', 'Tutoriel',
            'Conseils', 'Astuces', 'Avis', 'Test', 'Comparaison',
            'Tendances', 'Actualités', 'Histoire', 'Culture', 'Communauté'
        );
    }

    // Retirer les doublons et limiter à 30 suggestions
    return [...new Set(suggestions)].slice(0, 30);
}

async function analyzeCategory(categoryName) {
    try {
        console.log(`\n🔍 Analyse de la catégorie "${categoryName}"...\n`);

        // 1. Chercher la catégorie
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name, color, description, theme_id')
            .ilike('name', `%${categoryName}%`)
            .maybeSingle();

        if (catError || !category) {
            console.log(`❌ Catégorie "${categoryName}" introuvable`);
            console.log(`💡 Vérifiez que le nom est correct ou créez la catégorie d'abord.\n`);
            return null;
        }

        console.log(`✅ Catégorie trouvée:`);
        console.log(`   📌 Nom: ${category.name}`);
        console.log(`   🆔 ID: ${category.id}`);
        console.log(`   🎨 Couleur: ${category.color || 'Non définie'}`);
        console.log(`   📝 Description: ${category.description || 'Aucune'}\n`);

        // 2. Vérifier la configuration niveau 2
        const { data: hierarchyConfig } = await supabase
            .from('category_hierarchy_config')
            .select('has_level2')
            .eq('category_id', category.id)
            .maybeSingle();

        const hasLevel2 = hierarchyConfig?.has_level2 || false;
        console.log(`⚙️  Niveau 2 activé: ${hasLevel2 ? '✅ Oui' : '❌ Non'}\n`);

        // 3. Récupérer les sous-catégories niveau 1
        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('id, name, description')
            .eq('category_id', category.id)
            .order('name');

        const existingSubcategories = subcategories || [];
        console.log(`📊 Sous-catégories niveau 1 existantes: ${existingSubcategories.length}\n`);

        if (existingSubcategories.length > 0) {
            console.log(`📁 Liste actuelle:`);
            existingSubcategories.slice(0, 10).forEach((sub, index) => {
                console.log(`   ${index + 1}. ${sub.name}${sub.description ? ` - ${sub.description}` : ''}`);
            });
            if (existingSubcategories.length > 10) {
                console.log(`   ... et ${existingSubcategories.length - 10} autres`);
            }
            console.log('');
        }

        // 4. Récupérer les sous-catégories niveau 2
        if (hasLevel2 && existingSubcategories.length > 0) {
            const subcategoryIds = existingSubcategories.map(s => s.id);
            const { data: level2Subcategories } = await supabase
                .from('subcategories_level2')
                .select('id, name, description, subcategory_id')
                .in('subcategory_id', subcategoryIds)
                .order('name');

            const level2Count = level2Subcategories?.length || 0;
            console.log(`📊 Sous-catégories niveau 2 existantes: ${level2Count}\n`);

            if (level2Count > 0 && level2Count <= 20) {
                console.log(`📁 Liste niveau 2:`);
                level2Subcategories.forEach((l2, index) => {
                    const parent = existingSubcategories.find(s => s.id === l2.subcategory_id);
                    console.log(`   ${index + 1}. ${l2.name} (sous "${parent?.name || 'N/A'}")`);
                });
                console.log('');
            }
        }

        return {
            category,
            hasLevel2,
            existingSubcategories,
            hierarchyConfig
        };
    } catch (error) {
        console.error(`\n❌ Erreur lors de l'analyse:`, error.message);
        return null;
    }
}

async function proposeSubcategories(categoryName, existingSubcategories) {
    console.log(`\n💡 Génération de suggestions de sous-catégories...\n`);

    const suggestions = generateSubcategories(categoryName);
    const existingNames = new Set(existingSubcategories.map(s => s.name.toLowerCase()));

    // Filtrer les suggestions qui n'existent pas déjà
    const newSuggestions = suggestions.filter(s => !existingNames.has(s.toLowerCase()));

    if (newSuggestions.length === 0) {
        console.log(`⚠️  Aucune nouvelle suggestion (toutes existent déjà ou catégorie non reconnue)`);
        console.log(`💡 Vous pouvez proposer vos propres sous-catégories manuellement.\n`);
        return [];
    }

    console.log(`✨ ${newSuggestions.length} suggestion(s) générée(s):\n`);
    newSuggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
    });
    console.log('');

    return newSuggestions;
}

async function addSubcategories(categoryId, subcategories, descriptions = {}) {
    console.log(`\n💾 Ajout des sous-catégories...\n`);

    const now = new Date().toISOString();
    let success = 0;
    let failed = 0;

    // Préparer les données
    const dataToInsert = subcategories.map(name => ({
        name: name,
        description: descriptions[name] || `Sous-catégorie ${name} pour cette catégorie`,
        category_id: categoryId,
        created_at: now,
        updated_at: now
    }));

    // Insérer par batch de 50
    const batchSize = 50;
    for (let i = 0; i < dataToInsert.length; i += batchSize) {
        const batch = dataToInsert.slice(i, i + batchSize);

        const { error } = await supabase
            .from('subcategories')
            .insert(batch);

        if (error) {
            // Si erreur batch, essayer une par une
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

    console.log(`\n📊 Résultat: ${success} ajoutée(s), ${failed} échouée(s)\n`);
    return { success, failed };
}

async function activateLevel2(categoryId) {
    console.log(`\n⚙️  Activation du niveau 2...\n`);

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

async function main() {
    try {
        console.log('🚀 === ANALYSE ET AJOUT DE SOUS-CATÉGORIES ===\n');

        // 1. Demander le nom de la catégorie
        const categoryName = await question('📝 Entrez le nom de la catégorie à analyser: ');
        
        if (!categoryName || categoryName.trim() === '') {
            console.log('\n❌ Nom de catégorie requis');
            rl.close();
            return;
        }

        // 2. Analyser la catégorie
        const analysis = await analyzeCategory(categoryName.trim());
        
        if (!analysis) {
            rl.close();
            return;
        }

        // 3. Proposer des sous-catégories
        const suggestions = await proposeSubcategories(analysis.category.name, analysis.existingSubcategories);

        if (suggestions.length === 0) {
            const customInput = await question('💡 Voulez-vous ajouter des sous-catégories personnalisées ? (oui/non): ');
            if (customInput.toLowerCase() !== 'oui' && customInput.toLowerCase() !== 'o') {
                console.log('\n👋 Au revoir !');
                rl.close();
                return;
            }
            
            const customSubs = await question('📝 Entrez les sous-catégories séparées par des virgules: ');
            const customList = customSubs.split(',').map(s => s.trim()).filter(s => s.length > 0);
            
            if (customList.length === 0) {
                console.log('\n❌ Aucune sous-catégorie fournie');
                rl.close();
                return;
            }

            const confirm = await question(`\n❓ Ajouter ${customList.length} sous-catégorie(s) ? (oui/non): `);
            if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
                console.log('\n❌ Opération annulée');
                rl.close();
                return;
            }

            await addSubcategories(analysis.category.id, customList);
            rl.close();
            return;
        }

        // 4. Demander confirmation pour les suggestions
        console.log(`\n❓ Voulez-vous ajouter ces ${suggestions.length} sous-catégories ?`);
        const confirm = await question('   (oui/non/toutes/custom): ');

        if (confirm.toLowerCase() === 'non' || confirm.toLowerCase() === 'n') {
            console.log('\n❌ Opération annulée');
            rl.close();
            return;
        }

        let toAdd = [];
        if (confirm.toLowerCase() === 'toutes' || confirm.toLowerCase() === 't' || confirm.toLowerCase() === 'oui' || confirm.toLowerCase() === 'o') {
            toAdd = suggestions;
        } else if (confirm.toLowerCase() === 'custom' || confirm.toLowerCase() === 'c') {
            // Mode sélection personnalisée
            console.log('\n📝 Sélectionnez les sous-catégories à ajouter (numéros séparés par des virgules):');
            const selection = await question('   Exemple: 1,3,5-10,15: ');
            
            const selected = new Set();
            selection.split(',').forEach(part => {
                part = part.trim();
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= suggestions.length) {
                            selected.add(suggestions[i - 1]);
                        }
                    }
                } else {
                    const num = parseInt(part);
                    if (num >= 1 && num <= suggestions.length) {
                        selected.add(suggestions[num - 1]);
                    }
                }
            });
            
            toAdd = Array.from(selected);
            
            if (toAdd.length === 0) {
                console.log('\n❌ Aucune sélection valide');
                rl.close();
                return;
            }
        } else {
            console.log('\n❌ Réponse non reconnue');
            rl.close();
            return;
        }

        // 5. Ajouter les sous-catégories
        await addSubcategories(analysis.category.id, toAdd);

        // 6. Demander si on veut activer le niveau 2
        if (!analysis.hasLevel2) {
            const activateLevel2Confirm = await question('\n❓ Voulez-vous activer le niveau 2 (sous-catégories de sous-catégories) ? (oui/non): ');
            if (activateLevel2Confirm.toLowerCase() === 'oui' || activateLevel2Confirm.toLowerCase() === 'o') {
                await activateLevel2(analysis.category.id);
            }
        }

        // 7. Résumé final
        const finalAnalysis = await analyzeCategory(analysis.category.name);
        console.log('\n🎉 Opération terminée avec succès !\n');

    } catch (error) {
        console.error(`\n❌ Erreur:`, error.message);
    } finally {
        rl.close();
    }
}

main().catch(console.error);

