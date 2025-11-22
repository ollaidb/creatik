#!/usr/bin/env node

/**
 * 🚀 Script de démarrage rapide pour l'intégration d'APIs
 * Ce script permet de tester rapidement les APIs et d'enrichir votre base de données
 */

const axios = require('axios');

// Configuration simple pour les tests
const config = {
  // APIs gratuites pour commencer
  apis: {
    wikipedia: 'https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all/01/01',
    holidays: 'https://date.nager.at/api/v3/PublicHolidays/2024/FR',
    onThisDay: 'https://history.muffinlabs.com/date/1/1'
  }
};

// Fonction pour tester une API
async function testAPI(name, url) {
  try {
    console.log(`🔄 Test de l'API ${name}...`);
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Creatik-Events-Bot/1.0'
      }
    });
    
    console.log(`✅ ${name} : ${response.status} - Données reçues`);
    
    // Afficher un exemple de données
    if (response.data) {
      const dataType = Array.isArray(response.data) ? 'array' : typeof response.data;
      const dataLength = Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length;
      console.log(`   📊 Type: ${dataType}, Taille: ${dataLength}`);
      
      // Afficher un exemple
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`   📝 Exemple: ${JSON.stringify(response.data[0]).substring(0, 100)}...`);
      } else if (typeof response.data === 'object') {
        const firstKey = Object.keys(response.data)[0];
        console.log(`   📝 Exemple: ${firstKey}: ${JSON.stringify(response.data[firstKey]).substring(0, 100)}...`);
      }
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ ${name} : Erreur - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Fonction pour transformer les données Wikipedia
function transformWikipediaData(data) {
  if (!data || !data.events) return [];
  
  return data.events.slice(0, 5).map(event => ({
    event_type: 'historical_event',
    title: event.text,
    description: `Événement historique du 1er janvier`,
    date: '2024-01-01',
    year: event.year,
    category: 'Événements historiques',
    tags: ['#Histoire', '#Événement', '#Historique'],
    is_active: true
  }));
}

// Fonction pour transformer les données Holiday
function transformHolidayData(data) {
  if (!Array.isArray(data)) return [];
  
  return data.slice(0, 5).map(holiday => ({
    event_type: 'holiday',
    title: holiday.localName,
    description: `Jour férié en ${holiday.countryCode}`,
    date: holiday.date,
    category: 'Fériés',
    tags: ['#Férié', '#Célébration', `#${holiday.countryCode}`],
    country_code: holiday.countryCode,
    is_active: true
  }));
}

// Fonction pour transformer les données On This Day
function transformOnThisDayData(data) {
  if (!data || !data.data) return [];
  
  const events = [];
  
  // Événements historiques
  if (data.data.Events) {
    data.data.Events.slice(0, 3).forEach(event => {
      events.push({
        event_type: 'historical_event',
        title: event.text,
        description: `Événement historique du 1er janvier`,
        date: '2024-01-01',
        year: event.year,
        category: 'Événements historiques',
        tags: ['#Histoire', '#Événement'],
        is_active: true
      });
    });
  }
  
  // Anniversaires
  if (data.data.Births) {
    data.data.Births.slice(0, 2).forEach(birth => {
      events.push({
        event_type: 'birthday',
        title: `Anniversaire de ${birth.text}`,
        description: `Anniversaire de naissance`,
        date: '2024-01-01',
        year: birth.year,
        person_name: birth.text,
        category: 'Personnalités',
        tags: ['#Anniversaire', '#Personnalité'],
        is_active: true
      });
    });
  }
  
  return events;
}

// Fonction principale
async function quickStart() {
  console.log('🚀 Démarrage rapide de l\'intégration d\'APIs...\n');
  
  const results = {};
  
  // Tester toutes les APIs
  for (const [name, url] of Object.entries(config.apis)) {
    results[name] = await testAPI(name, url);
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  // Afficher le résumé
  console.log('📊 RÉSUMÉ DES TESTS :');
  console.log('====================');
  
  let successCount = 0;
  for (const [name, result] of Object.entries(results)) {
    if (result.success) {
      successCount++;
      console.log(`✅ ${name} : Fonctionne`);
    } else {
      console.log(`❌ ${name} : Échec`);
    }
  }
  
  console.log(`\n🎯 ${successCount}/${Object.keys(results).length} APIs fonctionnent`);
  
  // Transformer et afficher des exemples
  console.log('\n📝 EXEMPLES DE DONNÉES TRANSFORMÉES :');
  console.log('=====================================');
  
  if (results.wikipedia.success) {
    const wikiEvents = transformWikipediaData(results.wikipedia.data);
    console.log(`\n📚 Wikipedia (${wikiEvents.length} événements) :`);
    wikiEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.year})`);
    });
  }
  
  if (results.holidays.success) {
    const holidayEvents = transformHolidayData(results.holidays.data);
    console.log(`\n🎉 Jours fériés (${holidayEvents.length} événements) :`);
    holidayEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.date})`);
    });
  }
  
  if (results.onThisDay.success) {
    const onThisDayEvents = transformOnThisDayData(results.onThisDay.data);
    console.log(`\n📅 On This Day (${onThisDayEvents.length} événements) :`);
    onThisDayEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.year || 'N/A'})`);
    });
  }
  
  // Recommandations
  console.log('\n💡 RECOMMANDATIONS :');
  console.log('===================');
  
  if (successCount >= 2) {
    console.log('✅ Excellente connectivité ! Vous pouvez procéder à l\'enrichissement.');
    console.log('📋 Prochaines étapes :');
    console.log('   1. Configurez vos variables d\'environnement Supabase');
    console.log('   2. Exécutez : npm run enrich-events');
    console.log('   3. Vérifiez les résultats dans votre base de données');
  } else if (successCount >= 1) {
    console.log('⚠️  Connectivité partielle. Certaines APIs ne répondent pas.');
    console.log('🔧 Vérifiez votre connexion internet et réessayez.');
  } else {
    console.log('❌ Aucune API ne répond. Vérifiez votre connexion internet.');
  }
  
  console.log('\n📖 Pour plus d\'informations, consultez scripts/README-APIs.md');
}

// Exécution
if (require.main === module) {
  quickStart().catch(console.error);
}

module.exports = {
  quickStart,
  testAPI,
  transformWikipediaData,
  transformHolidayData,
  transformOnThisDayData
};
