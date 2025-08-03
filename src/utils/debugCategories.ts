import { supabase } from '@/integrations/supabase/client';

export const debugCategories = async () => {
  console.log('🔍 === DÉBUT DIAGNOSTIC CATÉGORIES ===');
  
  try {
    // Test 1: Vérifier la connexion Supabase
    console.log('1️⃣ Test de connexion Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur de connexion Supabase:', testError);
      return { success: false, error: 'Connexion Supabase échouée' };
    }
    console.log('✅ Connexion Supabase OK');
    
    // Test 2: Récupérer toutes les catégories
    console.log('2️⃣ Récupération des catégories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (categoriesError) {
      console.error('❌ Erreur lors de la récupération des catégories:', categoriesError);
      return { success: false, error: 'Erreur récupération catégories' };
    }
    
    console.log('✅ Catégories récupérées:', categories?.length || 0);
    console.log('📋 Premières catégories:', categories?.slice(0, 5));
    
    // Test 3: Vérifier les thèmes
    console.log('3️⃣ Test des thèmes...');
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*')
      .order('display_order');
    
    if (themesError) {
      console.error('❌ Erreur lors de la récupération des thèmes:', themesError);
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
      console.error('❌ Erreur lors de la récupération des réseaux:', networksError);
    } else {
      console.log('✅ Réseaux sociaux récupérés:', networks?.length || 0);
    }
    
    console.log('🔍 === FIN DIAGNOSTIC CATÉGORIES ===');
    return { 
      success: true, 
      categories: categories?.length || 0,
      themes: themes?.length || 0,
      networks: networks?.length || 0
    };
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return { success: false, error: 'Erreur générale' };
  }
};

export const testCategoryQuery = async () => {
  console.log('🧪 Test de requête catégories...');
  
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Durée de la requête: ${duration.toFixed(2)}ms`);
    console.log(`📊 Nombre de catégories: ${data?.length || 0}`);
    
    if (error) {
      console.error('❌ Erreur:', error);
      return { success: false, error, duration };
    }
    
    return { success: true, data, duration };
  } catch (error) {
    console.error('❌ Exception:', error);
    return { success: false, error, duration: 0 };
  }
}; 