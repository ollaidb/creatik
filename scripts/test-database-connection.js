#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const tables = [
  'categories',
  'subcategories',
  'subcategories_level2',
  'content_titles',
  'challenges',
  'user_challenges',
  'user_publications',
  'user_favorites',
  'social_networks',
  'themes',
  'profiles',
  'hooks',
  'daily_events',
  'event_categories',
];

async function testTable(tableName) {
  const startTime = Date.now();
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      console.log(`❌ ${tableName}: ${error.message} (${duration}ms)`);
      return { name: tableName, success: false, error: error.message, duration };
    }

    console.log(`✅ ${tableName}: ${count ?? data?.length ?? 0} ligne(s) (${duration}ms)`);
    return { name: tableName, success: true, count: count ?? data?.length ?? 0, duration };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${tableName}: ${err.message} (${duration}ms)`);
    return { name: tableName, success: false, error: err.message, duration };
  }
}

async function runTests() {
  console.log('🔍 Test de connexion à la base de données Supabase...\n');
  console.log(`URL: ${SUPABASE_URL}\n`);

  const results = [];
  
  for (const table of tables) {
    const result = await testTable(table);
    results.push(result);
    // Petit délai pour éviter de surcharger
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 === RÉSUMÉ ===');
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;
  
  console.log(`✅ ${successCount} table(s) accessible(s)`);
  console.log(`❌ ${errorCount} erreur(s)\n`);

  if (errorCount > 0) {
    console.log('🔴 Tables avec erreurs:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
    console.log('\n💡 Solutions possibles:');
    console.log('   1. Vérifier que les tables existent dans Supabase');
    console.log('   2. Vérifier les permissions RLS (Row Level Security)');
    console.log('   3. Vérifier que la clé API a les bonnes permissions');
    console.log('   4. Vérifier la connexion réseau');
  }
}

runTests().catch(console.error);

