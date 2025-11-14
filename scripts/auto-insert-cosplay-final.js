#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function executeSQLViaREST(sql) {
    // Essayer d'exécuter via l'endpoint REST
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ sql })
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.text();
            return { success: false, error };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function autoInsertCosplay() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Cosplay...\n');
        
        // Étape 1: Créer la fonction SQL si elle n'existe pas
        console.log('📋 Étape 1: Vérification/Création de la fonction SQL...');
        const { data: testRpc, error: testError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (testError && (testError.message.includes('function') || testError.message.includes('does not exist'))) {
            console.log('⚠️  La fonction n\'existe pas. Création...');
            
            const functionSqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
            if (fs.existsSync(functionSqlPath)) {
                const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
                
                // Essayer d'exécuter via REST
                const result = await executeSQLViaREST(functionSql);
                
                if (!result.success) {
                    // Si exec_sql n'existe pas, utiliser une approche alternative
                    console.log('⚠️  Impossible d\'exécuter SQL automatiquement.');
                    console.log('📝 Exécution directe via l\'API Supabase...\n');
                    
                    // Utiliser directement le script SQL d'insertion
                    const insertSqlPath = path.join(process.cwd(), 'add-cosplay-subcategories.sql');
                    if (fs.existsSync(insertSqlPath)) {
                        const insertSql = fs.readFileSync(insertSqlPath, 'utf8');
                        
                        // Extraire juste la partie INSERT
                        const insertMatch = insertSql.match(/INSERT INTO.*?;/s);
                        if (insertMatch) {
                            // Essayer d'exécuter via REST
                            const insertResult = await executeSQLViaREST(insertMatch[0]);
                            if (insertResult.success) {
                                console.log('✅ Insertion réussie via SQL direct !\n');
                            } else {
                                throw new Error('Impossible d\'exécuter le SQL. Veuillez utiliser la méthode manuelle.');
                            }
                        }
                    }
                } else {
                    console.log('✅ Fonction créée !\n');
                }
            }
        } else if (testError) {
            console.log('⚠️  Erreur lors de la vérification:', testError.message);
        } else {
            console.log('✅ La fonction existe déjà !\n');
        }
        
        // Étape 2: Utiliser la fonction RPC pour insérer
        console.log('🔧 Étape 2: Exécution de la fonction pour insérer les sous-catégories...');
        const { data: result, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (rpcError) {
            // Si la fonction n'existe toujours pas, essayer l'insertion directe avec le SQL complet
            console.log('⚠️  La fonction RPC n\'est toujours pas disponible.');
            console.log('🔄 Tentative d\'insertion directe via SQL...\n');
            
            const insertSqlPath = path.join(process.cwd(), 'add-cosplay-subcategories.sql');
            if (fs.existsSync(insertSqlPath)) {
                const insertSql = fs.readFileSync(insertSqlPath, 'utf8');
                
                // Extraire la partie INSERT (sans les commentaires)
                const insertPart = insertSql.split('-- AJOUT DES SOUS-CATÉGORIES')[1];
                if (insertPart) {
                    const insertStatement = insertPart.split('-- VÉRIFICATION APRÈS')[0];
                    const sqlResult = await executeSQLViaREST(insertStatement);
                    
                    if (sqlResult.success) {
                        console.log('✅ Insertion réussie via SQL direct !\n');
                    } else {
                        throw new Error(`Impossible d'insérer: ${sqlResult.error}`);
                    }
                }
            } else {
                throw new Error('Fichier SQL non trouvé');
            }
        } else {
            const inserted = result[0]?.inserted_count || 0;
            const skipped = result[0]?.skipped_count || 0;
            console.log(`✅ ${inserted} sous-catégorie(s) ajoutée(s)`);
            console.log(`⏭️  ${skipped} déjà existante(s)\n`);
        }
        
        // Étape 3: Vérification finale
        console.log('📊 Étape 3: Vérification finale...');
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Cosplay')
            .single();
        
        if (category) {
            const { data: all } = await supabase
                .from('subcategories')
                .select('id, name')
                .eq('category_id', category.id)
                .order('name');
            
            console.log(`\n✅ Total: ${all?.length || 0} sous-catégorie(s) Cosplay`);
            if (all && all.length > 0) {
                console.log('\n📋 Liste:');
                all.forEach((s, i) => console.log(`   ${i + 1}. ${s.name}`));
            }
        }
        
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        console.log('\n💡 Solution: Exécutez manuellement add-cosplay-subcategories.sql dans Supabase SQL Editor');
        process.exit(1);
    }
}

autoInsertCosplay().catch(console.error);

