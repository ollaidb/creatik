const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration des APIs
const APIs = {
  // Wikipedia - Événements historiques
  wikipedia: {
    url: 'https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all',
    transform: (data, date) => {
      return data.events?.map(event => ({
        event_type: 'historical_event',
        title: event.text,
        description: `Événement historique du ${date}`,
        date: date,
        year: event.year,
        category: 'Événements historiques',
        tags: ['#Histoire', '#Événement', '#Historique'],
        is_active: true
      })) || [];
    }
  },

  // Holiday API - Jours fériés
  holidays: {
    url: 'https://date.nager.at/api/v3/PublicHolidays',
    transform: (data) => {
      return data.map(holiday => ({
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
  },

  // On This Day API - Événements divers
  onThisDay: {
    url: 'https://history.muffinlabs.com/date',
    transform: (data, date) => {
      const events = [];
      
      // Événements historiques
      data.data?.Events?.forEach(event => {
        events.push({
          event_type: 'historical_event',
          title: event.text,
          description: `Événement historique du ${date}`,
          date: date,
          year: event.year,
          category: 'Événements historiques',
          tags: ['#Histoire', '#Événement'],
          is_active: true
        });
      });

      // Anniversaires
      data.data?.Births?.forEach(birth => {
        events.push({
          event_type: 'birthday',
          title: `Anniversaire de ${birth.text}`,
          description: `Anniversaire de naissance`,
          date: date,
          year: birth.year,
          person_name: birth.text,
          category: 'Personnalités',
          tags: ['#Anniversaire', '#Personnalité'],
          is_active: true
        });
      });

      return events;
    }
  }
};

// Fonction pour récupérer les données d'une API
async function fetchFromAPI(apiName, params = {}) {
  try {
    const api = APIs[apiName];
    if (!api) {
      throw new Error(`API ${apiName} non configurée`);
    }

    let url = api.url;
    if (params.date) {
      const [month, day] = params.date.split('-').slice(1);
      url = `${api.url}/${month}/${day}`;
    }
    if (params.year) {
      url = `${api.url}/${params.year}/${params.country || 'FR'}`;
    }

    console.log(`🔄 Récupération depuis ${apiName}: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Creatik-Events-Bot/1.0'
      }
    });

    const transformedData = api.transform(response.data, params.date);
    console.log(`✅ ${transformedData.length} événements récupérés depuis ${apiName}`);
    
    return transformedData;
  } catch (error) {
    console.error(`❌ Erreur avec l'API ${apiName}:`, error.message);
    return [];
  }
}

// Fonction pour insérer les événements dans Supabase
async function insertEvents(events) {
  if (events.length === 0) return;

  try {
    // Vérifier les doublons
    const existingEvents = await supabase
      .from('daily_events')
      .select('title, date')
      .in('date', [...new Set(events.map(e => e.date))]);

    const existingTitles = new Set(
      existingEvents.data?.map(e => `${e.title}-${e.date}`) || []
    );

    // Filtrer les doublons
    const newEvents = events.filter(event => 
      !existingTitles.has(`${event.title}-${event.date}`)
    );

    if (newEvents.length === 0) {
      console.log('ℹ️ Aucun nouvel événement à ajouter');
      return;
    }

    // Insérer les nouveaux événements
    const { data, error } = await supabase
      .from('daily_events')
      .insert(newEvents)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ ${data.length} nouveaux événements ajoutés à la base de données`);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error.message);
    throw error;
  }
}

// Fonction principale pour enrichir la base de données
async function enrichDatabase() {
  console.log('🚀 Début de l\'enrichissement de la base de données...');

  try {
    // 1. Récupérer les jours fériés pour l'année en cours
    const currentYear = new Date().getFullYear();
    const holidays = await fetchFromAPI('holidays', { year: currentYear });
    await insertEvents(holidays);

    // 2. Récupérer les événements historiques pour les prochains jours
    const today = new Date();
    const events = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Événements historiques
      const historicalEvents = await fetchFromAPI('wikipedia', { date: dateStr });
      events.push(...historicalEvents);
      
      // Événements divers
      const onThisDayEvents = await fetchFromAPI('onThisDay', { date: dateStr });
      events.push(...onThisDayEvents);
      
      // Pause pour éviter de surcharger les APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await insertEvents(events);

    console.log('🎉 Enrichissement terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enrichissement:', error.message);
  }
}

// Fonction pour nettoyer les anciens événements
async function cleanupOldEvents() {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const { error } = await supabase
      .from('daily_events')
      .delete()
      .lt('date', oneYearAgo.toISOString().split('T')[0]);

    if (error) throw error;
    
    console.log('🧹 Nettoyage des anciens événements terminé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  }
}

// Exécution du script
if (require.main === module) {
  (async () => {
    await enrichDatabase();
    await cleanupOldEvents();
    process.exit(0);
  })();
}

module.exports = {
  enrichDatabase,
  cleanupOldEvents,
  fetchFromAPI
};
