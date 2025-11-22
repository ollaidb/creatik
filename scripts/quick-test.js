import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function quickTest() {
  console.log('🚀 Test rapide de l\'application...\n');
  
  try {
    // Test 1: Catégories
    console.log('1️⃣ Test des catégories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
      .limit(5);
    
    if (catError) {
      console.error('❌ Erreur catégories:', catError);
    } else {
      console.log('✅ Catégories OK:', categories?.length || 0, 'trouvées');
    }
    
    // Test 2: Thèmes
    console.log('2️⃣ Test des thèmes...');
    const { data: themes, error: themeError } = await supabase
      .from('themes')
      .select('*');
    
    if (themeError) {
      console.error('❌ Erreur thèmes:', themeError);
    } else {
      console.log('✅ Thèmes OK:', themes?.length || 0, 'trouvés');
    }
    
    // Test 3: Test de performance
    console.log('3️⃣ Test de performance...');
    const startTime = Date.now();
    const { data: allCategories, error: perfError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    const endTime = Date.now();
    
    if (perfError) {
      console.error('❌ Erreur performance:', perfError);
    } else {
      console.log(`✅ Performance OK: ${allCategories?.length || 0} catégories en ${endTime - startTime}ms`);
    }
    
    console.log('\n🎉 Test terminé avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - Catégories: ${allCategories?.length || 0}`);
    console.log(`   - Thèmes: ${themes?.length || 0}`);
    console.log(`   - Temps de réponse: ${endTime - startTime}ms`);
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

quickTest().catch(console.error); 