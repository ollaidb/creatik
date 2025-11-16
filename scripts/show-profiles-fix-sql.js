#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function showSQL() {
  try {
    console.log('📋 Script SQL pour corriger les permissions profiles\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const projectRoot = path.resolve(__dirname, '..');
    const sqlFile = path.join(projectRoot, 'fix-profiles-rls-simple.sql');
    
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`Fichier SQL introuvable: ${sqlFile}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log(sqlContent);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Instructions:');
    console.log('   1. Copiez le script SQL ci-dessus');
    console.log('   2. Ouvrez Supabase Dashboard (https://supabase.com/dashboard)');
    console.log('   3. Sélectionnez votre projet');
    console.log('   4. Allez dans SQL Editor');
    console.log('   5. Collez le script SQL');
    console.log('   6. Cliquez sur "Run" pour exécuter');
    console.log('\n✅ Après exécution, les erreurs 403 sur la table profiles seront corrigées.\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

showSQL().catch(console.error);

