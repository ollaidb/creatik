import { createClient } from '@supabase/supabase-js';

// Configuration de votre projet Supabase
const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugSubcategoriesLevel2() {
  console.log('🔍 Debug approfondi des sous-catégories niveau 2...\n');

  try {
    // 1. Vérifier la structure de la table
    console.log('1️⃣ Structure de la table subcategories_level2...');
    const { data: structure, error: structureError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', 'subcategories_level2')
      .order('ordinal_position');

    if (structureError) {
      console.error('❌ Erreur structure:', structureError.message);
    } else {
      console.log('📋 Structure de la table:');
      structure.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)'}`);
      });
    }
    console.log('');

    // 2. Vérifier les politiques RLS
    console.log('2️⃣ Vérification des politiques RLS...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual, with_check')
      .eq('tablename', 'subcategories_level2');

    if (policiesError) {
      console.error('❌ Erreur politiques RLS:', policiesError.message);
    } else {
      console.log(`📊 Nombre de politiques RLS: ${policies.length}`);
      if (policies.length === 0) {
        console.log('⚠️  Aucune politique RLS trouvée - cela peut bloquer l\'accès');
      } else {
        policies.forEach(policy => {
          console.log(`   - ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
        });
      }
    }
    console.log('');

    // 3. Vérifier si RLS est activé
    console.log('3️⃣ Vérification de l\'activation RLS...');
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('pg_tables')
      .select('rowsecurity')
      .eq('tablename', 'subcategories_level2');

    if (rlsError) {
      console.error('❌ Erreur statut RLS:', rlsError.message);
    } else {
      console.log(`🔒 RLS activé: ${rlsStatus[0]?.rowsecurity ? 'Oui' : 'Non'}`);
    }
    console.log('');

    // 4. Essayer de récupérer des données avec différentes approches
    console.log('4️⃣ Tentatives de récupération de données...');
    
    // Approche 1: Récupération simple
    console.log('   📥 Approche 1: Récupération simple...');
    const { data: data1, error: error1 } = await supabase
      .from('subcategories_level2')
      .select('*')
      .limit(5);

    if (error1) {
      console.log(`      ❌ Erreur: ${error1.message} (Code: ${error1.code})`);
    } else {
      console.log(`      ✅ Succès: ${data1.length} enregistrements récupérés`);
      if (data1.length > 0) {
        data1.forEach((item, index) => {
          console.log(`         ${index + 1}. ${item.name} (ID: ${item.id})`);
        });
      }
    }

    // Approche 2: Avec count
    console.log('   📊 Approche 2: Avec count...');
    const { count, error: error2 } = await supabase
      .from('subcategories_level2')
      .select('*', { count: 'exact', head: true });

    if (error2) {
      console.log(`      ❌ Erreur: ${error2.message} (Code: ${error2.code})`);
    } else {
      console.log(`      ✅ Succès: ${count} enregistrements au total`);
    }

    // Approche 3: Vérifier une sous-catégorie spécifique
    console.log('   🔍 Approche 3: Vérifier une sous-catégorie spécifique...');
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('id, name')
      .eq('name', 'Apparence')
      .limit(1);

    if (subError) {
      console.log(`      ❌ Erreur sous-catégories: ${subError.message}`);
    } else if (subcategories && subcategories.length > 0) {
      const subId = subcategories[0].id;
      console.log(`      📋 Sous-catégorie "Apparence" trouvée (ID: ${subId})`);
      
      const { data: level2Data, error: level2Error } = await supabase
        .from('subcategories_level2')
        .select('*')
        .eq('subcategory_id', subId);

      if (level2Error) {
        console.log(`      ❌ Erreur récupération niveau 2: ${level2Error.message}`);
      } else {
        console.log(`      ✅ Niveau 2 pour "Apparence": ${level2Data.length} enregistrements`);
        level2Data.forEach(item => {
          console.log(`         - ${item.name}`);
        });
      }
    }
    console.log('');

    // 5. Vérifier les permissions de l'utilisateur anonyme
    console.log('5️⃣ Vérification des permissions utilisateur...');
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log(`   👤 Utilisateur: Anonyme (erreur: ${userError.message})`);
    } else {
      console.log(`   👤 Utilisateur: ${user.user ? user.user.email || user.user.id : 'Anonyme'}`);
    }

    // 6. Résumé et recommandations
    console.log('6️⃣ Résumé et recommandations...');
    console.log('📋 Diagnostic:');
    
    if (data1 && data1.length > 0) {
      console.log('   ✅ Données accessibles - Le problème est ailleurs');
    } else {
      console.log('   ❌ Données non accessibles - Problème de permissions ou RLS');
    }

    if (policies && policies.length === 0) {
      console.log('   ⚠️  Aucune politique RLS - Accès bloqué');
    }

    console.log('\n🎯 Solutions possibles:');
    console.log('1. Vérifier les politiques RLS dans le dashboard Supabase');
    console.log('2. Désactiver temporairement RLS pour tester');
    console.log('3. Créer une politique RLS permettant l\'accès anonyme');
    console.log('4. Vérifier le cache de l\'application');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

debugSubcategoriesLevel2();
