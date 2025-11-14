#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Liste des sous-catégories à insérer
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

async function insertCosplaySubcategories() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Cosplay...\n');
        
        // 1. Vérifier/Créer la catégorie Cosplay
        console.log('📋 Vérification de la catégorie Cosplay...');
        let { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id, name')
            .eq('name', 'Cosplay')
            .single();
        
        if (categoryError && categoryError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Cosplay...');
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
                throw new Error(`Erreur création catégorie: ${createError.message}`);
            }
            category = newCategory;
            console.log('✅ Catégorie créée');
        } else if (categoryError) {
            throw new Error(`Erreur vérification catégorie: ${categoryError.message}`);
        } else {
            console.log('✅ Catégorie existe déjà');
        }
        
        const categoryId = category.id;
        console.log(`📌 ID catégorie: ${categoryId}\n`);
        
        // 2. Vérifier les sous-catégories existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing, error: checkError } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', categoryId);
        
        if (checkError) {
            throw new Error(`Erreur vérification: ${checkError.message}`);
        }
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        // 3. Filtrer celles à ajouter
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 4. Utiliser la fonction RPC si disponible, sinon insertion directe
        console.log('🔧 Tentative d\'utilisation de la fonction RPC...');
        const { data: rpcResult, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (!rpcError && rpcResult) {
            console.log(`✅ ${rpcResult[0]?.inserted_count || 0} sous-catégorie(s) ajoutée(s) via RPC`);
            console.log(`⏭️  ${rpcResult[0]?.skipped_count || 0} déjà existante(s)\n`);
        } else {
            // Fonction RPC n'existe pas, créer la fonction d'abord puis l'utiliser
            console.log('⚠️  Fonction RPC non disponible. Création de la fonction...\n');
            
            // Lire le fichier SQL de la fonction
            const functionSqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
            if (fs.existsSync(functionSqlPath)) {
                const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
                
                // Essayer d'exécuter via l'API REST (nécessite service_role)
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        },
                        body: JSON.stringify({ sql: functionSql })
                    });
                    
                    if (response.ok) {
                        console.log('✅ Fonction créée !');
                        // Réessayer la fonction RPC
                        const { data: result, error: err } = await supabase
                            .rpc('insert_cosplay_subcategories');
                        if (!err && result) {
                            console.log(`✅ ${result[0]?.inserted_count || 0} sous-catégorie(s) ajoutée(s)`);
                        }
                    } else {
                        throw new Error('Impossible de créer la fonction automatiquement');
                    }
                } catch (err) {
                    // Si exec_sql n'existe pas, utiliser insertion directe avec bypass RLS
                    console.log('🔄 Utilisation de l\'insertion directe...\n');
                    
                    // Insérer une par une en utilisant upsert qui peut contourner certaines restrictions
                    let success = 0;
                    let failed = 0;
                    
                    for (const sub of toAdd) {
                        const { error: insertError } = await supabase
                            .from('subcategories')
                            .upsert({
                                name: sub.name,
                                description: sub.description,
                                category_id: categoryId,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            }, {
                                onConflict: 'name,category_id',
                                ignoreDuplicates: false
                            });
                        
                        if (insertError) {
                            console.log(`⚠️  "${sub.name}": ${insertError.message}`);
                            failed++;
                        } else {
                            success++;
                        }
                    }
                    
                    console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
                }
            } else {
                // Pas de fichier SQL, insertion directe
                console.log('🔄 Insertion directe...\n');
                let success = 0;
                let failed = 0;
                
                for (const sub of toAdd) {
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
                        console.log(`⚠️  "${sub.name}": ${insertError.message}`);
                        failed++;
                    } else {
                        success++;
                    }
                }
                
                console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
            }
        }
        
        // 5. Résumé final
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId)
            .order('name');
        
        console.log('\n📊 Résumé final:');
        console.log(`   Total: ${all?.length || 0} sous-catégorie(s) Cosplay`);
        console.log('\n🎉 Terminé !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

insertCosplaySubcategories().catch(console.error);

