#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://eiuhcgvvexoshuopvska.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  try {
    console.log('🚀 Début de l\'exécution du script SQL...');
    
    // Lire le fichier SQL
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-events-database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Script SQL chargé');
    
    // Diviser le script en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 ${commands.length} commandes SQL à exécuter`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      try {
        // Exécuter la commande SQL
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️  Commande ${i + 1}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Commande ${i + 1} exécutée avec succès`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Erreur commande ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Résumé:');
    console.log(`✅ Commandes réussies: ${successCount}`);
    console.log(`❌ Commandes échouées: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 Configuration terminée avec succès!');
    } else {
      console.log('⚠️  Certaines commandes ont échoué, mais la configuration peut être partielle');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error.message);
  }
}

// Exécution
executeSQL().catch(console.error); 