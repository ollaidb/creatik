import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function diagnosticComplet() {
  console.log('🔍 === DIAGNOSTIC COMPLET ===\n');
  
  const tests = [
    { name: 'Catégories', table: 'categories', query: () => supabase.from('categories').select('*').order('name') },
    { name: 'Thèmes', table: 'themes', query: () => supabase.from('themes').select('*').order('display_order') },
    { name: 'Challenges', table: 'challenges', query: () => supabase.from('challenges').select('*').eq('is_active', true) },
    { name: 'User Publications', table: 'user_publications', query: () => supabase.from('user_publications').select('*').limit(10) },
    { name: 'User Challenges', table: 'user_challenges', query: () => supabase.from('user_challenges').select('*').limit(10) },
    { name: 'Social Networks', table: 'social_networks', query: () => supabase.from('social_networks').select('*') },
    { name: 'Network Configurations', table: 'network_configurations', query: () => supabase.from('network_configurations').select('*').limit(5) },
    { name: 'Profiles', table: 'profiles', query: () => supabase.from('profiles').select('*').limit(5) },
  ];

  const results = [];

  for (const test of tests) {
    console.log(`🧪 Test: ${test.name}...`);
    const startTime = Date.now();
    
    try {
      const { data, error } = await test.query();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (error) {
        console.log(`❌ ${test.name}: Erreur - ${error.message}`);
        results.push({
          name: test.name,
          table: test.table,
          success: false,
          error: error.message,
          duration
        });
      } else {
        console.log(`✅ ${test.name}: ${data?.length || 0} éléments en ${duration}ms`);
        results.push({
          name: test.name,
          table: test.table,
          success: true,
          count: data?.length || 0,
          duration
        });
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Exception - ${error.message}`);
      results.push({
        name: test.name,
        table: test.table,
        success: false,
        error: error.message,
        duration: 0
      });
    }
  }

  console.log('\n📊 === RÉSUMÉ DU DIAGNOSTIC ===');
  console.log('✅ Tables fonctionnelles:');
  results.filter(r => r.success).forEach(r => {
    console.log(`   - ${r.name}: ${r.count} éléments (${r.duration}ms)`);
  });

  console.log('\n❌ Tables problématiques:');
  results.filter(r => !r.success).forEach(r => {
    console.log(`   - ${r.name}: ${r.error}`);
  });

  // Analyse des problèmes
  const problemTables = results.filter(r => !r.success).map(r => r.table);
  
  if (problemTables.includes('challenges')) {
    console.log('\n⚠️ PROBLÈME: Table "challenges" inaccessible');
    console.log('   → Page "Défis publics" ne peut pas charger');
  }
  
  if (problemTables.includes('user_publications')) {
    console.log('\n⚠️ PROBLÈME: Table "user_publications" inaccessible');
    console.log('   → Page "Publications" ne peut pas charger');
  }
  
  if (problemTables.includes('social_networks')) {
    console.log('\n⚠️ PROBLÈME: Table "social_networks" inaccessible');
    console.log('   → Filtres de réseaux sociaux ne fonctionnent pas');
  }

  console.log('\n🎯 === RECOMMANDATIONS ===');
  
  if (problemTables.length === 0) {
    console.log('✅ Toutes les tables sont accessibles');
    console.log('→ Le problème vient probablement du code côté client');
  } else {
    console.log('🔧 Actions à effectuer:');
    problemTables.forEach(table => {
      console.log(`   - Vérifier la table "${table}" dans Supabase`);
      console.log(`   - Créer la table si elle n'existe pas`);
      console.log(`   - Vérifier les permissions RLS`);
    });
  }

  return results;
}

// Test de performance des requêtes problématiques
async function testPerformance() {
  console.log('\n⚡ === TEST DE PERFORMANCE ===');
  
  const queries = [
    { name: 'Catégories complètes', query: () => supabase.from('categories').select('*').order('name') },
    { name: 'Challenges actifs', query: () => supabase.from('challenges').select('*').eq('is_active', true) },
    { name: 'Publications utilisateur', query: () => supabase.from('user_publications').select('*').limit(50) },
  ];

  for (const query of queries) {
    console.log(`\n🧪 ${query.name}...`);
    const times = [];
    
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      try {
        const { data, error } = await query.query();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (error) {
          console.log(`   Test ${i + 1}: ❌ Erreur - ${error.message}`);
        } else {
          console.log(`   Test ${i + 1}: ✅ ${data?.length || 0} éléments en ${duration}ms`);
          times.push(duration);
        }
      } catch (error) {
        console.log(`   Test ${i + 1}: ❌ Exception - ${error.message}`);
      }
    }
    
    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`   📊 Moyenne: ${avgTime.toFixed(2)}ms`);
    }
  }
}

// Exécuter le diagnostic
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic complet...\n');
  
  try {
    await diagnosticComplet();
    await testPerformance();
    
    console.log('\n✅ Diagnostic terminé');
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

runDiagnostic().catch(console.error); 