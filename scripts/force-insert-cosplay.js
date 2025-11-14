#!/usr/bin/env node

/**
 * Script pour forcer l'insertion des sous-catégories Cosplay
 * Utilise l'API REST directement pour contourner RLS si possible
 * 
 * IMPORTANT: Pour que ce script fonctionne automatiquement, vous devez:
 * 1. Créer un fichier .env à la racine avec: SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
 * 2. La clé service_role se trouve dans Supabase Dashboard > Settings > API > service_role key
 */

import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const subcategories = [
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
    { name: 'Marvel', description: 'Cosplay de personnages Marvel' },
    { name: 'DC Comics', description: 'Cosplay de personnages DC Comics' },
    { name: 'Star Wars', description: 'Cosplay de personnages de Star Wars' },
    { name: 'Disney', description: 'Cosplay de personnages Disney' },
    { name: 'Harry Potter', description: 'Cosplay de personnages de Harry Potter' },
    { name: 'Final Fantasy', description: 'Cosplay de personnages de Final Fantasy' },
    { name: 'Zelda', description: 'Cosplay de personnages de The Legend of Zelda' },
    { name: 'Pokémon', description: 'Cosplay de personnages de Pokémon' },
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

async function getCategoryId() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?name=eq.Cosplay&select=id`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    
    if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
            return data[0].id;
        }
    }
    
    // Créer la catégorie si elle n'existe pas
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            name: 'Cosplay',
            color: 'purple',
            description: 'Contenu sur le cosplay et les déguisements de personnages'
        })
    });
    
    if (createResponse.ok) {
        const data = await createResponse.json();
        return data[0]?.id || data.id;
    }
    
    throw new Error('Impossible de créer/récupérer la catégorie');
}

async function insertSubcategories(categoryId) {
    console.log(`💾 Insertion de ${subcategories.length} sous-catégories...\n`);
    
    const now = new Date().toISOString();
    const dataToInsert = subcategories.map(sub => ({
        name: sub.name,
        description: sub.description,
        category_id: categoryId,
        created_at: now,
        updated_at: now
    }));
    
    // Insérer par batch de 10
    const batchSize = 10;
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < dataToInsert.length; i += batchSize) {
        const batch = dataToInsert.slice(i, i + batchSize);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/subcategories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(batch)
        });
        
        if (response.ok) {
            success += batch.length;
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${batch.length} sous-catégorie(s) ajoutée(s)`);
        } else {
            const error = await response.text();
            console.log(`⚠️  Batch ${Math.floor(i/batchSize) + 1}: Erreur - ${error}`);
            failed += batch.length;
        }
    }
    
    return { success, failed };
}

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Cosplay\n');
        
        // 1. Récupérer/Créer la catégorie
        console.log('📋 Récupération de la catégorie Cosplay...');
        const categoryId = await getCategoryId();
        console.log(`✅ Catégorie ID: ${categoryId}\n`);
        
        // 2. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/subcategories?category_id=eq.${categoryId}&select=name`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        let existingNames = new Set();
        if (checkResponse.ok) {
            const existing = await checkResponse.json();
            existingNames = new Set(existing.map(s => s.name.toLowerCase()));
            console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        }
        
        // Filtrer celles à ajouter
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insérer
        const result = await insertSubcategories(categoryId);
        
        console.log(`\n✅ ${result.success} ajoutée(s), ⚠️  ${result.failed} échouée(s)`);
        
        // 4. Vérification finale
        const finalResponse = await fetch(`${SUPABASE_URL}/rest/v1/subcategories?category_id=eq.${categoryId}&select=id,name&order=name`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (finalResponse.ok) {
            const all = await finalResponse.json();
            console.log(`\n📊 Total final: ${all.length} sous-catégorie(s) Cosplay`);
        }
        
        console.log('\n🎉 Terminé !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        
        if (error.message.includes('row-level security') || error.message.includes('42501')) {
            console.log('\n🔒 RLS bloque l\'insertion. Solutions:');
            console.log('\n📝 Option 1 (Recommandée): Exécuter le SQL manuellement');
            console.log('   1. Ouvrez Supabase Dashboard > SQL Editor');
            console.log('   2. Copiez-collez le contenu de: add-cosplay-subcategories.sql');
            console.log('   3. Exécutez le SQL');
            console.log('\n🔑 Option 2: Utiliser la clé service_role pour automatisation');
            console.log('   1. Allez dans Supabase Dashboard > Settings > API');
            console.log('   2. Copiez la "service_role" key (⚠️  gardez-la secrète!)');
            console.log('   3. Créez un fichier .env à la racine avec:');
            console.log('      SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role');
            console.log('   4. Relancez ce script');
        }
        process.exit(1);
    }
}

main().catch(console.error);

