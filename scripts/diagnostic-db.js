import { createClient } from '@supabase/supabase-js';

// Configuration de votre projet Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function diagnosticDatabase() {
  console.log('🔍 Diagnostic de votre base de données Creatik...\n');

  try {
    // 1. Vérifier la connexion
    console.log('1️⃣ Test de connexion...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur de connexion:', testError.message);
      return;
    }
    console.log('✅ Connexion réussie à Supabase\n');

    // 2. Vérifier les catégories principales
    console.log('2️⃣ Vérification des catégories principales...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, color')
      .order('name');

    if (categoriesError) {
      console.error('❌ Erreur catégories:', categoriesError.message);
    } else {
      console.log(`📊 Nombre de catégories: ${categories.length}`);
      console.log('📋 Catégories disponibles:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (ID: ${cat.id})`);
      });
    }
    console.log('');

    // 3. Vérifier les sous-catégories niveau 1
    console.log('3️⃣ Vérification des sous-catégories niveau 1...');
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('id, name, category_id')
      .order('name');

    if (subcategoriesError) {
      console.error('❌ Erreur sous-catégories:', subcategoriesError.message);
    } else {
      console.log(`📊 Nombre de sous-catégories: ${subcategories.length}`);
      if (subcategories.length > 0) {
        console.log('📋 Exemples de sous-catégories:');
        subcategories.slice(0, 5).forEach(sub => {
          console.log(`   - ${sub.name} (ID: ${sub.id})`);
        });
      }
    }
    console.log('');

    // 4. Vérifier si la table subcategories_level2 existe
    console.log('4️⃣ Vérification de la table subcategories_level2...');
    const { data: level2Data, error: level2Error } = await supabase
      .from('subcategories_level2')
      .select('count')
      .limit(1);

    if (level2Error) {
      if (level2Error.code === 'PGRST116') {
        console.log('❌ Table subcategories_level2 N\'EXISTE PAS');
        console.log('💡 Il faut exécuter la migration');
      } else {
        console.error('❌ Erreur inattendue:', level2Error.message);
      }
    } else {
      // Si la table existe, compter les enregistrements
      const { count, error: countError } = await supabase
        .from('subcategories_level2')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ Erreur lors du comptage:', countError.message);
      } else {
        console.log(`✅ Table subcategories_level2 existe avec ${count} enregistrements`);
        
        if (count > 0) {
          const { data: examples, error: examplesError } = await supabase
            .from('subcategories_level2')
            .select('*')
            .limit(3);

          if (!examplesError && examples) {
            console.log('📝 Exemples:');
            examples.forEach(ex => {
              console.log(`   - ${ex.name} (ID: ${ex.id})`);
            });
          }
        }
      }
    }
    console.log('');

    // 5. Vérifier les publications
    console.log('5️⃣ Vérification des publications...');
    const { data: publications, error: publicationsError } = await supabase
      .from('publications')
      .select('count')
      .limit(1);

    if (publicationsError) {
      console.log('❌ Erreur publications:', publicationsError.message);
    } else {
      const { count: pubCount, error: pubCountError } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true });

      if (!pubCountError) {
        console.log(`📊 Nombre de publications: ${pubCount}`);
      }
    }
    console.log('');

    // 6. Résumé et recommandations
    console.log('6️⃣ Résumé et recommandations...');
    console.log('📋 État de votre base de données:');
    
    if (categories && categories.length > 0) {
      console.log('   ✅ Catégories: Fonctionnel');
    } else {
      console.log('   ❌ Catégories: Problème détecté');
    }

    if (subcategories && subcategories.length > 0) {
      console.log('   ✅ Sous-catégories: Fonctionnel');
    } else {
      console.log('   ❌ Sous-catégories: Problème détecté');
    }

    if (level2Data !== undefined) {
      console.log('   ✅ Sous-catégories niveau 2: Fonctionnel');
    } else {
      console.log('   ❌ Sous-catégories niveau 2: Table manquante');
      console.log('💡 Solution: Exécuter le script de migration dans Supabase');
    }

    console.log('\n🎯 Prochaines étapes:');
    console.log('1. Si la table subcategories_level2 n\'existe pas, exécutez le script de migration');
    console.log('2. Vérifiez les politiques RLS dans votre dashboard Supabase');
    console.log('3. Testez la page des sous-catégories niveau 2');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

diagnosticDatabase();
