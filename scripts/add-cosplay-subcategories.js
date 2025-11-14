#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
// Utiliser la clé service_role si disponible (contourne RLS), sinon utiliser la clé anonyme
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Liste des sous-catégories Cosplay
const subcategories = [
    // Par type de média
    { name: 'Manga', description: 'Cosplay de personnages de mangas' },
    { name: 'Anime', description: 'Cosplay de personnages d\'animés' },
    { name: 'Jeux vidéo', description: 'Cosplay de personnages de jeux vidéo' },
    { name: 'Films', description: 'Cosplay de personnages de films' },
    { name: 'Séries TV', description: 'Cosplay de personnages de séries télévisées' },
    { name: 'Comics', description: 'Cosplay de personnages de comics' },
    { name: 'BD', description: 'Cosplay de personnages de bandes dessinées' },
    { name: 'Livres', description: 'Cosplay de personnages de livres et romans' },
    { name: 'Webtoon', description: 'Cosplay de personnages de webtoons' },
    { name: 'Manhwa', description: 'Cosplay de personnages de manhwas coréens' },
    
    // Par franchise/univers populaire
    { name: 'Marvel', description: 'Cosplay de personnages Marvel' },
    { name: 'DC Comics', description: 'Cosplay de personnages DC Comics' },
    { name: 'Star Wars', description: 'Cosplay de personnages de Star Wars' },
    { name: 'Disney', description: 'Cosplay de personnages Disney' },
    { name: 'Harry Potter', description: 'Cosplay de personnages de Harry Potter' },
    { name: 'Final Fantasy', description: 'Cosplay de personnages de Final Fantasy' },
    { name: 'Zelda', description: 'Cosplay de personnages de The Legend of Zelda' },
    { name: 'Pokémon', description: 'Cosplay de personnages de Pokémon' },
    
    // Par genre/univers
    { name: 'Fantasy', description: 'Cosplay dans l\'univers fantasy' },
    { name: 'Sci-Fi', description: 'Cosplay dans l\'univers science-fiction' },
    { name: 'Horreur', description: 'Cosplay de personnages d\'horreur' },
    { name: 'Super-héros', description: 'Cosplay de super-héros' },
    { name: 'Super-vilains', description: 'Cosplay de super-vilains' },
    { name: 'Steampunk', description: 'Cosplay style steampunk' },
    { name: 'Cyberpunk', description: 'Cosplay style cyberpunk' },
    { name: 'Médiéval', description: 'Cosplay style médiéval' },
    { name: 'Historique', description: 'Cosplay de personnages historiques' },
    { name: 'Mythologie', description: 'Cosplay de personnages mythologiques' }
];

async function addCosplaySubcategories() {
    try {
        console.log('🚀 Début de l\'ajout des sous-catégories Cosplay...\n');
        
        // Utiliser la fonction RPC si disponible (contourne RLS)
        console.log('🔧 Utilisation de la fonction RPC insert_cosplay_subcategories...');
        const { data: result, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (rpcError) {
            // Si la fonction n'existe pas, essayer la méthode directe
            if (rpcError.message.includes('function') || rpcError.message.includes('does not exist')) {
                console.log('⚠️  La fonction RPC n\'existe pas encore.');
                console.log('📝 Veuillez d\'abord exécuter le fichier SQL: setup-cosplay-insert-function.sql');
                console.log('   dans l\'éditeur SQL de Supabase, puis réessayez.\n');
                
                // Essayer quand même la méthode directe
                console.log('🔄 Tentative avec la méthode directe...\n');
                return await addCosplaySubcategoriesDirect();
            } else {
                throw new Error(`Erreur RPC: ${rpcError.message}`);
            }
        }
        
        console.log(`✅ ${result[0]?.inserted_count || 0} sous-catégorie(s) ajoutée(s)`);
        console.log(`⏭️  ${result[0]?.skipped_count || 0} sous-catégorie(s) déjà existante(s)\n`);
        
        // Afficher le résumé
        const { data: allSubcategories } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', (await supabase.from('categories').select('id').eq('name', 'Cosplay').single()).data?.id);
        
        console.log('📊 Résumé final:');
        console.log(`   Total de sous-catégories Cosplay: ${allSubcategories?.length || 0}`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

async function addCosplaySubcategoriesDirect() {
    // 1. Vérifier/Créer la catégorie Cosplay
    console.log('📋 Vérification de la catégorie Cosplay...');
    let { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', 'Cosplay')
        .single();
    
    if (categoryError && categoryError.code === 'PGRST116') {
        // Catégorie n'existe pas, la créer
        console.log('➕ Création de la catégorie Cosplay...');
        
        // Récupérer un theme_id (par exemple 'Divertissement' ou 'Tout')
        const { data: theme } = await supabase
            .from('themes')
            .select('id')
            .in('name', ['Divertissement', 'Lifestyle', 'Tout'])
            .limit(1)
            .single();
        
        const { data: newCategory, error: createError } = await supabase
            .from('categories')
            .insert({
                name: 'Cosplay',
                color: 'purple',
                description: 'Contenu sur le cosplay et les déguisements de personnages',
                theme_id: theme?.id || null
            })
            .select()
            .single();
        
        if (createError) {
            throw new Error(`Erreur lors de la création de la catégorie: ${createError.message}`);
        }
        
        category = newCategory;
        console.log('✅ Catégorie Cosplay créée avec succès');
    } else if (categoryError) {
        throw new Error(`Erreur lors de la vérification de la catégorie: ${categoryError.message}`);
    } else {
        console.log('✅ Catégorie Cosplay existe déjà');
    }
    
    const categoryId = category.id;
    console.log(`📌 ID de la catégorie: ${categoryId}\n`);
    
    // 2. Vérifier les sous-catégories existantes
    console.log('🔍 Vérification des sous-catégories existantes...');
    const { data: existingSubcategories, error: checkError } = await supabase
        .from('subcategories')
        .select('name')
        .eq('category_id', categoryId);
    
    if (checkError) {
        throw new Error(`Erreur lors de la vérification: ${checkError.message}`);
    }
    
    const existingNames = new Set(existingSubcategories?.map(s => s.name.toLowerCase()) || []);
    console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
    
    // 3. Filtrer les sous-catégories à ajouter
    const subcategoriesToAdd = subcategories.filter(
        sub => !existingNames.has(sub.name.toLowerCase())
    );
    
    if (subcategoriesToAdd.length === 0) {
        console.log('✅ Toutes les sous-catégories existent déjà !');
        return;
    }
    
    console.log(`➕ ${subcategoriesToAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
    
    // 4. Insérer les sous-catégories une par une (pour éviter les erreurs RLS)
    console.log('💾 Insertion des sous-catégories...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const sub of subcategoriesToAdd) {
        const { error: insertError } = await supabase
            .from('subcategories')
            .insert({
                name: sub.name,
                description: sub.description,
                category_id: categoryId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        
        if (insertError) {
            console.log(`⚠️  Erreur pour "${sub.name}": ${insertError.message}`);
            errorCount++;
        } else {
            successCount++;
        }
    }
    
    console.log(`\n✅ ${successCount} sous-catégorie(s) ajoutée(s) avec succès !`);
    if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} sous-catégorie(s) n'ont pas pu être ajoutée(s) (probablement RLS)`);
        console.log('💡 Solution: Exécutez setup-cosplay-insert-function.sql dans Supabase SQL Editor\n');
    }
    
    // 5. Afficher le résumé
    const { data: allSubcategories } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', categoryId);
    
    console.log('📊 Résumé final:');
    console.log(`   Total de sous-catégories Cosplay: ${allSubcategories?.length || 0}`);
    console.log('\n🎉 Terminé !');
}

// Exécution
addCosplaySubcategories().catch(console.error);

