#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupAndRun() {
    try {
        console.log('🚀 Configuration automatique des sous-catégories Cosplay...\n');
        
        // 1. Vérifier si la fonction existe
        console.log('🔍 Vérification de la fonction insert_cosplay_subcategories...');
        const { data: functionCheck, error: checkError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (checkError && (checkError.message.includes('function') || checkError.message.includes('does not exist'))) {
            console.log('⚠️  La fonction n\'existe pas encore.');
            console.log('📝 Création de la fonction...\n');
            
            // Lire le fichier SQL
            const sqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
            if (!fs.existsSync(sqlPath)) {
                throw new Error(`Fichier SQL non trouvé: ${sqlPath}`);
            }
            
            const sqlContent = fs.readFileSync(sqlPath, 'utf8');
            
            // Essayer d'exécuter le SQL via l'API REST
            // Note: Cela nécessite la clé service_role
            if (SUPABASE_KEY.includes('service_role') || process.env.SUPABASE_SERVICE_ROLE_KEY) {
                console.log('🔧 Exécution du SQL via l\'API...');
                
                // Utiliser l'endpoint REST pour exécuter du SQL
                const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    },
                    body: JSON.stringify({ sql: sqlContent })
                });
                
                if (!response.ok) {
                    // Si exec_sql n'existe pas, on ne peut pas exécuter automatiquement
                    console.log('⚠️  Impossible d\'exécuter le SQL automatiquement.');
                    console.log('📋 Veuillez exécuter manuellement le fichier:');
                    console.log(`   ${sqlPath}`);
                    console.log('   dans l\'éditeur SQL de Supabase, puis réessayez.\n');
                    return;
                }
                
                console.log('✅ Fonction créée avec succès !\n');
            } else {
                console.log('⚠️  Clé service_role non disponible.');
                console.log('📋 Veuillez exécuter manuellement le fichier:');
                console.log(`   ${sqlPath}`);
                console.log('   dans l\'éditeur SQL de Supabase, puis réessayez.\n');
                console.log('💡 Ou définissez SUPABASE_SERVICE_ROLE_KEY dans votre .env\n');
                return;
            }
        } else if (checkError) {
            // Autre erreur, peut-être que la fonction existe mais il y a un problème
            console.log('⚠️  Erreur lors de la vérification:', checkError.message);
        } else {
            console.log('✅ La fonction existe déjà !\n');
        }
        
        // 2. Exécuter la fonction pour insérer les sous-catégories
        console.log('🔧 Exécution de la fonction insert_cosplay_subcategories...');
        const { data: result, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (rpcError) {
            throw new Error(`Erreur lors de l'exécution: ${rpcError.message}`);
        }
        
        console.log(`✅ ${result[0]?.inserted_count || 0} sous-catégorie(s) ajoutée(s)`);
        console.log(`⏭️  ${result[0]?.skipped_count || 0} sous-catégorie(s) déjà existante(s)\n`);
        
        // 3. Afficher le résumé
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Cosplay')
            .single();
        
        if (category) {
            const { data: allSubcategories } = await supabase
                .from('subcategories')
                .select('id, name')
                .eq('category_id', category.id);
            
            console.log('📊 Résumé final:');
            console.log(`   Total de sous-catégories Cosplay: ${allSubcategories?.length || 0}`);
        }
        
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.log('\n💡 Solution alternative:');
        console.log('   1. Exécutez setup-cosplay-insert-function.sql dans Supabase SQL Editor');
        console.log('   2. Puis exécutez: node scripts/add-cosplay-subcategories.js\n');
        process.exit(1);
    }
}

// Exécution
setupAndRun().catch(console.error);

