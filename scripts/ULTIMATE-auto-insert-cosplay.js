#!/usr/bin/env node

/**
 * SCRIPT ULTIME - Insertion automatique des sous-catégories Cosplay
 * 
 * Ce script fait TOUT automatiquement si vous avez la clé service_role
 * Sinon, il vous guide pour l'obtenir ou exécuter le SQL manuellement
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Charger les variables d'environnement si un fichier .env existe
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                const value = values.join('=').trim().replace(/^["']|["']$/g, '');
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value;
                }
            }
        });
    }
} catch (e) {
    // Ignorer les erreurs de lecture .env
}

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

// Utiliser la clé service_role si disponible, sinon la clé anonyme
const SUPABASE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

async function createFunctionViaREST() {
    const functionSqlPath = path.join(process.cwd(), 'setup-cosplay-insert-function.sql');
    if (!fs.existsSync(functionSqlPath)) {
        return { success: false, error: 'Fichier SQL non trouvé' };
    }
    
    const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
    
    // Utiliser l'API REST pour exécuter le SQL
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
            return { success: true };
        } else {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Cosplay\n');
        
        if (!SUPABASE_SERVICE_KEY) {
            console.log('⚠️  Clé service_role non trouvée.');
            console.log('📝 Pour une exécution 100% automatique:\n');
            console.log('   1. Allez dans Supabase Dashboard > Settings > API');
            console.log('   2. Copiez la "service_role" key (⚠️  gardez-la secrète!)');
            console.log('   3. Créez un fichier .env à la racine avec:');
            console.log('      SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role');
            console.log('   4. Relancez ce script\n');
            console.log('🔄 Tentative avec la clé anonyme (peut échouer à cause de RLS)...\n');
        } else {
            console.log('✅ Clé service_role détectée ! Exécution automatique...\n');
        }
        
        // Étape 1: Vérifier/Créer la fonction RPC
        console.log('📋 Étape 1: Vérification de la fonction insert_cosplay_subcategories...');
        const { data: testResult, error: testError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (testError && (testError.message.includes('function') || testError.message.includes('does not exist'))) {
            console.log('⚠️  La fonction n\'existe pas. Création...\n');
            
            if (SUPABASE_SERVICE_KEY) {
                const createResult = await createFunctionViaREST();
                if (createResult.success) {
                    console.log('✅ Fonction créée avec succès !\n');
                } else {
                    console.log('⚠️  Impossible de créer la fonction automatiquement.');
                    console.log('📝 Veuillez exécuter setup-cosplay-insert-function.sql dans Supabase SQL Editor\n');
                    return;
                }
            } else {
                console.log('📝 Pour créer la fonction, exécutez setup-cosplay-insert-function.sql dans Supabase SQL Editor\n');
                return;
            }
        } else if (testError) {
            console.log('⚠️  Erreur:', testError.message);
        } else {
            console.log('✅ La fonction existe déjà !\n');
        }
        
        // Étape 2: Utiliser la fonction pour insérer
        console.log('🔧 Étape 2: Exécution de la fonction pour insérer les sous-catégories...');
        const { data: result, error: rpcError } = await supabase
            .rpc('insert_cosplay_subcategories');
        
        if (rpcError) {
            throw new Error(`Erreur RPC: ${rpcError.message}`);
        }
        
        const inserted = result[0]?.inserted_count || 0;
        const skipped = result[0]?.skipped_count || 0;
        
        console.log(`✅ ${inserted} sous-catégorie(s) ajoutée(s)`);
        console.log(`⏭️  ${skipped} sous-catégorie(s) déjà existante(s)\n`);
        
        // Étape 3: Vérification
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
            
            console.log(`📊 Total final: ${all?.length || 0} sous-catégorie(s) Cosplay`);
        }
        
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        console.log('\n💡 Solutions:');
        console.log('   1. Utilisez SUPABASE_SERVICE_ROLE_KEY dans .env');
        console.log('   2. Ou exécutez setup-cosplay-insert-function.sql dans Supabase SQL Editor');
        process.exit(1);
    }
}

main().catch(console.error);

