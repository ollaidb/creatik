#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES DONNÉES FAN ACCOUNT ===\n');

        // 1. Récupérer la catégorie Fan account
        console.log('🔍 Recherche de la catégorie "Fan account"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%fan account%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Fan account" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Activer le niveau 2
        console.log('⚙️  Activation du niveau 2...');
        const { error: level2Error } = await supabase
            .from('category_hierarchy_config')
            .upsert({
                category_id: category.id,
                has_level2: true,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'category_id'
            });

        if (level2Error) {
            console.error('❌ Erreur activation niveau 2:', level2Error.message);
        } else {
            console.log('✅ Niveau 2 activé\n');
        }

        // 3. Ajouter les sous-catégories niveau 1
        console.log('💾 Ajout des sous-catégories niveau 1...');
        
        const level1Subcategories = [
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

        // Vérifier les existantes
        const { data: existingLevel1 } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existingLevel1?.map(s => s.name.toLowerCase()) || []);
        const toAddLevel1 = level1Subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

        if (toAddLevel1.length > 0) {
            const now = new Date().toISOString();
            const level1Data = toAddLevel1.map(sub => ({
                name: sub.name,
                description: sub.description,
                category_id: category.id,
                created_at: now,
                updated_at: now
            }));

            const { data: insertedLevel1, error: insertError } = await supabase
                .from('subcategories')
                .insert(level1Data)
                .select('id, name');

            if (insertError) {
                console.error('❌ Erreur insertion niveau 1:', insertError.message);
            } else {
                console.log(`✅ ${insertedLevel1?.length || 0} sous-catégorie(s) niveau 1 ajoutée(s)\n`);
            }
        } else {
            console.log('✅ Toutes les sous-catégories niveau 1 existent déjà\n');
        }

        // 4. Récupérer toutes les sous-catégories niveau 1 (existantes + nouvelles)
        const { data: allLevel1 } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        if (!allLevel1 || allLevel1.length === 0) {
            console.error('❌ Aucune sous-catégorie niveau 1 disponible');
            return;
        }

        // 5. Ajouter les sous-catégories niveau 2
        console.log('💾 Ajout des sous-catégories niveau 2...\n');

        const level2Data = {
            'Célébrités': [
                'Beyoncé', 'Taylor Swift', 'Ariana Grande', 'Justin Bieber', 'Selena Gomez',
                'Drake', 'The Weeknd', 'Billie Eilish', 'Dua Lipa', 'Ed Sheeran',
                'Rihanna', 'Bruno Mars', 'Adele', 'Harry Styles', 'Shawn Mendes'
            ],
            'Divertissement': [
                'Netflix', 'Disney+', 'Amazon Prime', 'HBO', 'Disney',
                'Marvel', 'DC Comics', 'Star Wars', 'Harry Potter', 'Game of Thrones'
            ],
            'Musique': [
                'Pop', 'Rock', 'Rap', 'Hip-Hop', 'R&B', 'Jazz', 'Classique',
                'Électronique', 'Country', 'Reggae', 'Metal', 'Punk'
            ],
            'Cinéma': [
                'Marvel Cinematic Universe', 'DC Extended Universe', 'Star Wars',
                'Harry Potter', 'James Bond', 'Fast & Furious', 'Mission Impossible',
                'Pirates des Caraïbes', 'Transformers', 'Jurassic Park'
            ],
            'Séries TV': [
                'Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Crown',
                'The Office', 'Friends', 'The Walking Dead', 'Grey\'s Anatomy',
                'House of Cards', 'The Witcher', 'Squid Game'
            ],
            'Sports': [
                'Football', 'Basketball', 'Tennis', 'Football américain',
                'Baseball', 'Hockey', 'Golf', 'Formule 1', 'UFC', 'Boxe'
            ],
            'Gaming': [
                'Fortnite', 'Minecraft', 'Call of Duty', 'FIFA', 'GTA',
                'Among Us', 'Valorant', 'League of Legends', 'Apex Legends',
                'Pokémon', 'Zelda', 'Mario', 'Sonic'
            ],
            'Influenceurs': [
                'Beauté', 'Mode', 'Lifestyle', 'Tech', 'Gaming',
                'Food', 'Travel', 'Fitness', 'Comedy', 'Education'
            ],
            'Livres': [
                'Fantasy', 'Science-Fiction', 'Romance', 'Thriller', 'Mystère',
                'Horreur', 'Biographie', 'Histoire', 'Philosophie', 'Poésie'
            ],
            'Manga/Anime': [
                'Naruto', 'One Piece', 'Dragon Ball', 'Attack on Titan',
                'Demon Slayer', 'My Hero Academia', 'Death Note', 'Fullmetal Alchemist',
                'Tokyo Ghoul', 'Jujutsu Kaisen'
            ]
        };

        let totalAdded = 0;
        let totalFailed = 0;

        for (const level1 of allLevel1) {
            const level2Items = level2Data[level1.name] || [];
            
            if (level2Items.length === 0) {
                console.log(`⏭️  "${level1.name}": Aucune donnée niveau 2 définie`);
                continue;
            }

            // Vérifier les existantes
            const { data: existingLevel2 } = await supabase
                .from('subcategories_level2')
                .select('name')
                .eq('subcategory_id', level1.id);

            const existingLevel2Names = new Set(existingLevel2?.map(s => s.name.toLowerCase()) || []);
            const toAddLevel2 = level2Items.filter(item => !existingLevel2Names.has(item.toLowerCase()));

            if (toAddLevel2.length === 0) {
                console.log(`✅ "${level1.name}": Toutes les sous-catégories niveau 2 existent déjà`);
                continue;
            }

            const now = new Date().toISOString();
            const level2DataToInsert = toAddLevel2.map(name => ({
                name: name,
                description: `${name} - ${level1.name}`,
                subcategory_id: level1.id,
                created_at: now,
                updated_at: now
            }));

            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2DataToInsert);

            if (level2Error) {
                console.error(`❌ "${level1.name}": ${level2Error.message}`);
                totalFailed += toAddLevel2.length;
            } else {
                console.log(`✅ "${level1.name}": ${toAddLevel2.length} sous-catégorie(s) niveau 2 ajoutée(s)`);
                totalAdded += toAddLevel2.length;
            }
        }

        // 6. Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');

        const { data: finalLevel1 } = await supabase
            .from('subcategories')
            .select('id')
            .eq('category_id', category.id);

        const level1Ids = finalLevel1?.map(s => s.id) || [];
        const { count: level2Count } = await supabase
            .from('subcategories_level2')
            .select('id', { count: 'exact', head: true })
            .in('subcategory_id', level1Ids);

        console.log(`📋 Niveau 1: ${finalLevel1?.length || 0} sous-catégorie(s)`);
        console.log(`📋 Niveau 2: ${level2Count || 0} sous-catégorie(s)`);
        console.log(`\n✅ ${totalAdded} nouvelle(s) sous-catégorie(s) niveau 2 ajoutée(s)`);
        if (totalFailed > 0) {
            console.log(`❌ ${totalFailed} échec(s)`);
        }
        console.log('\n🎉 Configuration terminée avec succès !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

