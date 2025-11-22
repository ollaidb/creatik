#!/usr/bin/env node

/**
 * Script automatique pour configurer les sous-catégories Cosplay
 * 
 * Ce script :
 * 1. Vérifie si la fonction RPC existe
 * 2. Si non, vous demande d'exécuter le SQL une fois
 * 3. Puis insère automatiquement toutes les sous-catégories
 * 
 * Pour une exécution 100% automatique, définissez SUPABASE_SERVICE_ROLE_KEY dans .env
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function autoSetup() {
    console.log('🚀 Configuration automatique des sous-catégories Cosplay\n');
    
    // Étape 1: Vérifier si la fonction existe
    console.log('📋 Étape 1: Vérification de la fonction RPC...');
    const { data: result, error: rpcError } = await supabase
        .rpc('insert_cosplay_subcategories');
    
    if (rpcError && (rpcError.message.includes('function') || rpcError.message.includes('does not exist'))) {
        console.log('❌ La fonction RPC n\'existe pas encore.\n');
        console.log('📝 Pour continuer automatiquement, vous devez d\'abord :');
        console.log('   1. Ouvrir Supabase Dashboard > SQL Editor');
        console.log('   2. Copier-coller le contenu de: setup-cosplay-insert-function.sql');
        console.log('   3. Exécuter le SQL');
        console.log('   4. Puis relancer ce script\n');
        console.log('💡 Alternative: Définissez SUPABASE_SERVICE_ROLE_KEY dans .env pour une exécution 100% automatique\n');
        process.exit(1);
    } else if (rpcError) {
        throw new Error(`Erreur RPC: ${rpcError.message}`);
    }
    
    // Étape 2: La fonction existe, l'utiliser pour insérer les sous-catégories
    console.log('✅ La fonction existe !');
    console.log('🔧 Exécution de la fonction pour insérer les sous-catégories...\n');
    
    const { data: insertResult, error: insertError } = await supabase
        .rpc('insert_cosplay_subcategories');
    
    if (insertError) {
        throw new Error(`Erreur lors de l'insertion: ${insertError.message}`);
    }
    
    const inserted = insertResult[0]?.inserted_count || 0;
    const skipped = insertResult[0]?.skipped_count || 0;
    
    console.log(`✅ ${inserted} sous-catégorie(s) ajoutée(s)`);
    console.log(`⏭️  ${skipped} sous-catégorie(s) déjà existante(s)\n`);
    
    // Étape 3: Afficher le résumé
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Cosplay')
        .single();
    
    if (category) {
        const { data: allSubcategories } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        console.log('📊 Résumé final:');
        console.log(`   Total de sous-catégories Cosplay: ${allSubcategories?.length || 0}`);
        
        if (allSubcategories && allSubcategories.length > 0) {
            console.log('\n📋 Liste des sous-catégories:');
            allSubcategories.forEach((sub, index) => {
                console.log(`   ${index + 1}. ${sub.name}`);
            });
        }
    }
    
    console.log('\n🎉 Configuration terminée avec succès !');
}

autoSetup().catch(error => {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
});

