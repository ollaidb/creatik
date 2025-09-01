import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testCategories() {
  console.log('🔍 === TEST CATÉGORIES ===');
  
  try {
    // Test 1: Connexion de base
    console.log('1️⃣ Test de connexion...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur de connexion:', testError);
      return;
    }
    console.log('✅ Connexion OK');
    
    // Test 2: Récupération des catégories
    console.log('2️⃣ Récupération des catégories...');
    const startTime = Date.now();
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (categoriesError) {
      console.error('❌ Erreur catégories:', categoriesError);
      return;
    }
    
    console.log(`✅ Catégories récupérées en ${duration}ms:`, categories?.length || 0);
    
    if (categories && categories.length > 0) {
      console.log('📋 Premières catégories:');
      categories.slice(0, 5).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (ID: ${cat.id})`);
      });
    } else {
      console.log('⚠️ Aucune catégorie trouvée');
    }
    
    // Test 3: Vérifier les thèmes
    console.log('3️⃣ Test des thèmes...');
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*')
      .order('display_order');
    
    if (themesError) {
      console.error('❌ Erreur thèmes:', themesError);
    } else {
      console.log('✅ Thèmes récupérés:', themes?.length || 0);
    }
    
    // Test 4: Vérifier les réseaux sociaux
    console.log('4️⃣ Test des réseaux sociaux...');
    const { data: networks, error: networksError } = await supabase
      .from('social_networks')
      .select('*')
      .order('display_order');
    
    if (networksError) {
      console.error('❌ Erreur réseaux:', networksError);
    } else {
      console.log('✅ Réseaux sociaux récupérés:', networks?.length || 0);
    }
    
    console.log('🔍 === FIN TEST ===');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

async function testPerformance() {
  console.log('⚡ === TEST PERFORMANCE ===');
  
  const iterations = 5;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      times.push(duration);
      
      console.log(`Test ${i + 1}: ${duration}ms (${data?.length || 0} catégories)`);
      
      if (error) {
        console.error(`❌ Erreur test ${i + 1}:`, error);
      }
      
    } catch (error) {
      console.error(`❌ Exception test ${i + 1}:`, error);
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log('📊 Statistiques:');
    console.log(`   Moyenne: ${avgTime.toFixed(2)}ms`);
    console.log(`   Min: ${minTime}ms`);
    console.log(`   Max: ${maxTime}ms`);
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  await testCategories();
  console.log('\n');
  await testPerformance();
  
  console.log('\n✅ Tests terminés');
}

// Exécuter si appelé directement
runTests().catch(console.error); 