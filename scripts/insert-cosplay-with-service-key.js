#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

async function createFunction() {
    console.log('🔧 Création de la fonction SQL...');
    
    const functionSqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
    if (!fs.existsSync(functionSqlPath)) {
        throw new Error('Fichier setup-cosplay-insert-function.sql non trouvé');
    }
    
    const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
    
    // Exécuter le SQL via l'API REST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ sql: functionSql })
    });
    
    if (!response.ok) {
        // Si exec_sql n'existe pas, créer la fonction directement via des requêtes SQL
        console.log('⚠️  exec_sql non disponible, création directe de la fonction...');
        
        // Extraire juste la partie CREATE FUNCTION
        const createFunctionMatch = functionSql.match(/CREATE OR REPLACE FUNCTION[\s\S]*?\$\$;/);
        if (createFunctionMatch) {
            const createFunctionSql = createFunctionMatch[0];
            
            // Utiliser l'API REST pour exécuter directement
            const directResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                },
                body: JSON.stringify({ query: createFunctionSql })
            });
            
            if (!directResponse.ok) {
                // Dernière option : utiliser l'insertion directe avec la clé service_role
                console.log('⚠️  Création de fonction impossible, insertion directe...');
                return false;
            }
        }
        return false;
    }
    
    return true;
}

async function insertDirectly(categoryId) {
    console.log('💾 Insertion directe des sous-catégories...\n');
    
    const now = new Date().toISOString();
    let success = 0;
    let failed = 0;
    
    for (const sub of subcategories) {
        const { error } = await supabase
            .from('subcategories')
            .insert({
                name: sub.name,
                description: sub.description,
                category_id: categoryId,
                created_at: now,
                updated_at: now
            });
        
        if (error) {
            // Si c'est une erreur de doublon, c'est OK
            if (error.message.includes('duplicate') || error.code === '23505') {
                success++;
            } else {
                console.log(`⚠️  "${sub.name}": ${error.message}`);
                failed++;
            }
        } else {
            success++;
        }
    }
    
    console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
    return { success, failed };
}

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Cosplay avec clé service_role\n');
        
        // 1. Vérifier/Créer la catégorie
        console.log('📋 Vérification de la catégorie Cosplay...');
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Cosplay')
            .single();
        
        if (catError && catError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Cosplay...');
            const { data: theme } = await supabase
                .from('themes')
                .select('id')
                .in('name', ['Divertissement', 'Lifestyle', 'Tout'])
                .limit(1)
                .single();
            
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert({
                    name: 'Cosplay',
                    color: 'purple',
                    description: 'Contenu sur le cosplay et les déguisements de personnages',
                    theme_id: theme?.id || null
                })
                .select()
                .single();
            
            if (createError) throw createError;
            category = newCat;
        }
        
        const categoryId = category.id;
        console.log(`✅ Catégorie ID: ${categoryId}\n`);
        
        // 2. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', categoryId);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Essayer d'utiliser la fonction RPC
        console.log('🔧 Tentative d\'utilisation de la fonction RPC...');
        const { data: rpcResult, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (!rpcError && rpcResult) {
            const inserted = rpcResult[0]?.inserted_count || 0;
            const skipped = rpcResult[0]?.skipped_count || 0;
            console.log(`✅ ${inserted} ajoutée(s) via RPC, ${skipped} déjà existante(s)\n`);
        } else {
            // La fonction n'existe pas, créer la fonction puis réessayer
            console.log('⚠️  Fonction RPC non disponible. Création...\n');
            const functionCreated = await createFunction();
            
            if (functionCreated) {
                // Réessayer la fonction RPC
                const { data: result, error: err } = await supabase
                    .rpc('insert_cosplay_subcategories');
                
                if (!err && result) {
                    const inserted = result[0]?.inserted_count || 0;
                    const skipped = result[0]?.skipped_count || 0;
                    console.log(`✅ ${inserted} ajoutée(s) via RPC, ${skipped} déjà existante(s)\n`);
                } else {
                    // Si la fonction RPC ne fonctionne toujours pas, insertion directe
                    await insertDirectly(categoryId);
                }
            } else {
                // Insertion directe avec la clé service_role (contourne RLS)
                await insertDirectly(categoryId);
            }
        }
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Cosplay`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

