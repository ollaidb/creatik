import { createClient } from '@supabase/supabase-js';

// Configuration de votre projet Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertTestData() {
  console.log('🚀 Insertion de données de test dans subcategories_level2...\n');

  try {
    // 1. Vérifier d'abord l'état actuel
    console.log('1️⃣ Vérification de l\'état actuel...');
    const { count: beforeCount, error: countError } = await supabase
      .from('subcategories_level2')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError.message);
      return;
    }

    console.log(`📊 Nombre d'enregistrements avant insertion: ${beforeCount}`);

    // 2. Trouver la sous-catégorie "Apparence" de "Vie personnelle"
    console.log('\n2️⃣ Recherche de la sous-catégorie "Apparence"...');
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('id, name, category_id')
      .eq('name', 'Apparence')
      .limit(1);

    if (subError) {
      console.error('❌ Erreur recherche sous-catégorie:', subError.message);
      return;
    }

    if (!subcategories || subcategories.length === 0) {
      console.log('❌ Sous-catégorie "Apparence" non trouvée');
      return;
    }

    const apparenceSubcategory = subcategories[0];
    console.log(`✅ Sous-catégorie trouvée: ${apparenceSubcategory.name} (ID: ${apparenceSubcategory.id})`);

    // 3. Insérer des données de test
    console.log('\n3️⃣ Insertion de données de test...');
    
    const testData = [
      {
        name: 'Soins du visage',
        description: 'Routines et produits pour le visage',
        subcategory_id: apparenceSubcategory.id
      },
      {
        name: 'Soins du corps',
        description: 'Routines et produits pour le corps',
        subcategory_id: apparenceSubcategory.id
      },
      {
        name: 'Cheveux',
        description: 'Soins et coiffures',
        subcategory_id: apparenceSubcategory.id
      },
      {
        name: 'Maquillage',
        description: 'Tutoriels et conseils de maquillage',
        subcategory_id: apparenceSubcategory.id
      },
      {
        name: 'Style vestimentaire',
        description: 'Mode et conseils vestimentaires',
        subcategory_id: apparenceSubcategory.id
      }
    ];

    const { data: insertedData, error: insertError } = await supabase
      .from('subcategories_level2')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion:', insertError.message);
      return;
    }

    console.log(`✅ ${insertedData.length} enregistrements insérés avec succès!`);

    // 4. Vérifier le résultat
    console.log('\n4️⃣ Vérification du résultat...');
    const { count: afterCount, error: afterCountError } = await supabase
      .from('subcategories_level2')
      .select('*', { count: 'exact', head: true });

    if (afterCountError) {
      console.error('❌ Erreur lors de la vérification finale:', afterCountError.message);
    } else {
      console.log(`📊 Nombre d'enregistrements après insertion: ${afterCount}`);
    }

    // 5. Récupérer et afficher les données insérées
    console.log('\n5️⃣ Données insérées:');
    const { data: finalData, error: finalError } = await supabase
      .from('subcategories_level2')
      .select('*')
      .eq('subcategory_id', apparenceSubcategory.id)
      .order('name');

    if (finalError) {
      console.error('❌ Erreur lors de la récupération finale:', finalError.message);
    } else {
      console.log('📝 Liste des sous-catégories niveau 2:');
      finalData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
        console.log(`      Description: ${item.description}`);
        console.log(`      Créé le: ${item.created_at}`);
        console.log('');
      });
    }

    console.log('🎉 Insertion de données de test terminée avec succès!');
    console.log('💡 Maintenant, testez votre page des sous-catégories niveau 2');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

insertTestData();
