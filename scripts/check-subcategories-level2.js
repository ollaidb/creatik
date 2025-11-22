import { createClient } from '@supabase/supabase-js';

// Utiliser les variables d'environnement du projet principal
const supabaseUrl = 'https://your-project.supabase.co'; // À remplacer par votre URL
const supabaseKey = 'your-anon-key'; // À remplacer par votre clé

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubcategoriesLevel2() {
  console.log('🔍 Vérification de la table subcategories_level2...\n');

  try {
    // 1. Vérifier si la table existe
    console.log('1️⃣ Vérification de l\'existence de la table...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'subcategories_level2');

    if (tablesError) {
      console.error('❌ Erreur lors de la vérification des tables:', tablesError);
      return;
    }

    if (tables.length === 0) {
      console.log('❌ Table subcategories_level2 N\'EXISTE PAS');
      console.log('💡 Il faut exécuter la migration: 20250127000001_create_subcategories_level2.sql');
      return;
    }

    console.log('✅ Table subcategories_level2 existe');

    // 2. Vérifier la structure de la table
    console.log('\n2️⃣ Vérification de la structure de la table...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'subcategories_level2')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Erreur lors de la vérification des colonnes:', columnsError);
      return;
    }

    console.log('📋 Structure de la table:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)'}`);
    });

    // 3. Compter le nombre d'enregistrements
    console.log('\n3️⃣ Vérification du nombre d\'enregistrements...');
    const { count, error: countError } = await supabase
      .from('subcategories_level2')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError);
      return;
    }

    console.log(`📊 Nombre total d'enregistrements: ${count}`);

    if (count === 0) {
      console.log('⚠️  La table est vide - il faut insérer des données');
      return;
    }

    // 4. Afficher quelques exemples
    console.log('\n4️⃣ Exemples d\'enregistrements...');
    const { data: examples, error: examplesError } = await supabase
      .from('subcategories_level2')
      .select('*')
      .limit(5);

    if (examplesError) {
      console.error('❌ Erreur lors de la récupération des exemples:', examplesError);
      return;
    }

    console.log('📝 Exemples:');
    examples.forEach((example, index) => {
      console.log(`   ${index + 1}. ${example.name} (ID: ${example.id})`);
      console.log(`      Subcategory ID: ${example.subcategory_id}`);
      console.log(`      Description: ${example.description || 'Aucune'}`);
      console.log(`      Créé le: ${example.created_at}`);
      console.log('');
    });

    // 5. Vérifier les sous-catégories niveau 1
    console.log('5️⃣ Vérification des sous-catégories niveau 1...');
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('id, name, category_id')
      .limit(10);

    if (subcategoriesError) {
      console.error('❌ Erreur lors de la vérification des sous-catégories:', subcategoriesError);
      return;
    }

    console.log('📋 Sous-catégories niveau 1 disponibles:');
    subcategories.forEach(sub => {
      console.log(`   - ${sub.name} (ID: ${sub.id})`);
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

checkSubcategoriesLevel2();
