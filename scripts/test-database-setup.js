#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://eiuhcgvvexoshuopvska.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseSetup() {
  console.log('🔍 Test de la configuration de la base de données...\n');

  try {
    // 1. Tester la table event_categories
    console.log('📋 Test de la table event_categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('event_categories')
      .select('*')
      .limit(5);

    if (categoriesError) {
      console.error('❌ Erreur event_categories:', categoriesError.message);
    } else {
      console.log(`✅ ${categories.length} catégories trouvées`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.icon})`);
      });
    }

    // 2. Tester la table daily_events
    console.log('\n📅 Test de la table daily_events...');
    const { data: events, error: eventsError } = await supabase
      .from('daily_events')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    if (eventsError) {
      console.error('❌ Erreur daily_events:', eventsError.message);
    } else {
      console.log(`✅ ${events.length} événements actifs trouvés`);
      events.forEach(event => {
        console.log(`   - ${event.title} (${event.event_type})`);
      });
    }

    // 3. Tester les colonnes Wikipédia
    console.log('\n🌐 Test des colonnes Wikipédia...');
    const { data: wikiEvents, error: wikiError } = await supabase
      .from('daily_events')
      .select('wikipedia_title, wikipedia_url, is_from_wikipedia')
      .limit(1);

    if (wikiError) {
      console.error('❌ Erreur colonnes Wikipédia:', wikiError.message);
    } else {
      console.log('✅ Colonnes Wikipédia disponibles');
    }

    // 4. Tester la vue popular_wikipedia_events
    console.log('\n📊 Test de la vue popular_wikipedia_events...');
    try {
      const { data: popularEvents, error: popularError } = await supabase
        .from('popular_wikipedia_events')
        .select('*')
        .limit(3);

      if (popularError) {
        console.log('⚠️  Vue popular_wikipedia_events non accessible (normal si pas d\'événements Wikipédia)');
      } else {
        console.log(`✅ Vue popular_wikipedia_events accessible (${popularEvents.length} événements)`);
      }
    } catch (err) {
      console.log('⚠️  Vue popular_wikipedia_events non trouvée (sera créée lors de la synchronisation)');
    }

    // 5. Test de la fonction sync_events_with_wikipedia
    console.log('\n🔄 Test de la fonction sync_events_with_wikipedia...');
    try {
      const { data: syncResult, error: syncError } = await supabase
        .rpc('sync_events_with_wikipedia');

      if (syncError) {
        console.log('⚠️  Fonction sync_events_with_wikipedia non accessible');
      } else {
        console.log(`✅ Fonction sync_events_with_wikipedia accessible (${syncResult} événements actifs)`);
      }
    } catch (err) {
      console.log('⚠️  Fonction sync_events_with_wikipedia non trouvée (sera créée lors de la synchronisation)');
    }

    // 6. Résumé final
    console.log('\n📈 Résumé de la configuration:');
    console.log(`   - Catégories: ${categories?.length || 0}`);
    console.log(`   - Événements actifs: ${events?.length || 0}`);
    console.log(`   - Colonnes Wikipédia: ${wikiEvents ? '✅' : '❌'}`);
    
    if (categories?.length > 0 && events?.length > 0) {
      console.log('\n🎉 Configuration réussie ! Votre application est prête.');
      console.log('   Vous pouvez maintenant :');
      console.log('   1. Tester l\'application sur http://localhost:8081');
      console.log('   2. Lancer la synchronisation Wikipédia');
      console.log('   3. Voir les événements sur la page d\'accueil et /events');
    } else {
      console.log('\n⚠️  Configuration partielle. Vérifiez l\'exécution du script SQL.');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécution
testDatabaseSetup().catch(console.error); 