#!/usr/bin/env node

/**
 * Script qui crée automatiquement la fonction SQL dans Supabase
 * puis l'utilise pour insérer les sous-catégories Cosplay
 * 
 * Ce script utilise l'API REST de Supabase pour exécuter du SQL
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function executeRawSQL(sql) {
    // Utiliser l'API REST directement pour exécuter du SQL
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
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (err) {
        // Si exec_sql n'existe pas, essayer via l'API PostgREST avec une requête SQL directe
        // Note: Cela nécessite généralement la clé service_role
        console.log('⚠️  exec_sql non disponible, tentative alternative...');
        return { success: false, error: 'exec_sql function not available' };
    }
}

async function createFunctionAndInsert() {
    try {
        console.log('🚀 Création automatique de la fonction et insertion des sous-catégories Cosplay\n');
        
        // Étape 1: Vérifier si la fonction existe
        console.log('📋 Étape 1: Vérification de la fonction...');
        const { data: testResult, error: testError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (testError && (testError.message.includes('function') || testError.message.includes('does not exist'))) {
            console.log('⚠️  La fonction n\'existe pas. Création en cours...\n');
            
            // Lire le fichier SQL de la fonction
            const functionSqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
            if (!fs.existsSync(functionSqlPath)) {
                throw new Error('Fichier setup-cosplay-insert-function.sql non trouvé');
            }
            
            const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
            
            // Essayer d'exécuter le SQL pour créer la fonction
            console.log('🔧 Exécution du SQL pour créer la fonction...');
            const sqlResult = await executeRawSQL(functionSql);
            
            if (!sqlResult.success) {
                // Si on ne peut pas exécuter le SQL automatiquement, utiliser une approche alternative
                console.log('⚠️  Impossible d\'exécuter le SQL automatiquement.');
                console.log('📝 Utilisation de l\'approche alternative...\n');
                
                // Créer la fonction via des requêtes SQL individuelles via l'API
                // On va créer la fonction en utilisant l'endpoint REST avec une requête spéciale
                console.log('💡 Pour créer la fonction automatiquement, vous avez 2 options:');
                console.log('\n   1. Utiliser la clé service_role:');
                console.log('      - Allez dans Supabase Dashboard > Settings > API');
                console.log('      - Copiez la "service_role" key');
                console.log('      - Créez un fichier .env avec: SUPABASE_SERVICE_ROLE_KEY=votre-clé');
                console.log('      - Relancez ce script');
                console.log('\n   2. Exécuter le SQL manuellement (une seule fois):');
                console.log('      - Ouvrez Supabase Dashboard > SQL Editor');
                console.log('      - Copiez-collez le contenu de: setup-cosplay-insert-function.sql');
                console.log('      - Exécutez le SQL');
                console.log('      - Puis relancez ce script\n');
                
                return;
            } else {
                console.log('✅ Fonction créée avec succès !\n');
            }
        } else if (testError) {
            console.log('⚠️  Erreur lors de la vérification:', testError.message);
        } else {
            console.log('✅ La fonction existe déjà !\n');
        }
        
        // Étape 2: Utiliser la fonction pour insérer les sous-catégories
        console.log('🔧 Étape 2: Exécution de la fonction pour insérer les sous-catégories...');
        const { data: result, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (rpcError) {
            throw new Error(`Erreur lors de l'exécution de la fonction: ${rpcError.message}`);
        }
        
        const inserted = result[0]?.inserted_count || 0;
        const skipped = result[0]?.skipped_count || 0;
        
        console.log(`✅ ${inserted} sous-catégorie(s) ajoutée(s)`);
        console.log(`⏭️  ${skipped} sous-catégorie(s) déjà existante(s)\n`);
        
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
            if (all && all.length > 0 && all.length <= 10) {
                console.log('\n📋 Liste:');
                all.forEach((s, i) => console.log(`   ${i + 1}. ${s.name}`));
            }
        }
        
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        console.log('\n💡 Solution:');
        console.log('   1. Exécutez setup-cosplay-insert-function.sql dans Supabase SQL Editor');
        console.log('   2. Puis relancez ce script');
        process.exit(1);
    }
}

createFunctionAndInsert().catch(console.error);

