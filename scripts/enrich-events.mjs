#!/usr/bin/env node

/**
 * 🚀 Script d'enrichissement de la base de données d'événements
 * Utilise les APIs gratuites pour remplir automatiquement votre base de données
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes !');
  console.log('📋 Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration des APIs fonctionnelles
const APIs = {
  // Holiday API - Jours fériés (fonctionne)
  holidays: {
    url: 'https://date.nager.at/api/v3/PublicHolidays',
    transform: (data) => {
      return data.map(holiday => ({
        event_type: 'holiday',
        title: holiday.localName,
        description: `Jour férié en ${holiday.countryCode}`,
        date: holiday.date,
        category_id: '550e8400-e29b-41d4-a716-446655440221', // ID de la catégorie "Fériés français"
        tags: ['#Férié', '#Célébration', `#${holiday.countryCode}`],
        country_code: holiday.countryCode,
        is_active: true
      }));
    }
  },

  // On This Day API - Événements divers (fonctionne)
  onThisDay: {
    url: 'https://history.muffinlabs.com/date',
    transform: (data, date) => {
      const events = [];
      
      // Événements historiques
      if (data.data?.Events) {
        data.data.Events.forEach(event => {
          events.push({
            event_type: 'historical_event',
            title: event.text,
            description: `Événement historique du ${date}`,
            date: date,
            year: event.year,
            category_id: '550e8400-e29b-41d4-a716-446655440211', // ID de la catégorie "Histoire"
            tags: ['#Histoire', '#Événement'],
            is_active: true
          });
        });
      }

      // Anniversaires
      if (data.data?.Births) {
        data.data.Births.forEach(birth => {
          events.push({
            event_type: 'birthday',
            title: `Anniversaire de ${birth.text}`,
            description: `Anniversaire de naissance`,
            date: date,
            year: birth.year,
            person_name: birth.text,
            category_id: '550e8400-e29b-41d4-a716-446655440201', // ID de la catégorie "Célébrités"
            tags: ['#Anniversaire', '#Personnalité'],
            is_active: true
          });
        });
      }

      // Décès
      if (data.data?.Deaths) {
        data.data.Deaths.forEach(death => {
          events.push({
            event_type: 'death',
            title: `Décès de ${death.text}`,
            description: `Date de décès`,
            date: date,
            year: death.year,
            person_name: death.text,
            category_id: '550e8400-e29b-41d4-a716-446655440201', // ID de la catégorie "Célébrités"
            tags: ['#Décès', '#Personnalité'],
            is_active: true
          });
        });
      }
      
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

// Fonction pour enrichir la base de données
async function enrichDatabase() {
  console.log('🚀 Début de l\'enrichissement de la base de données...\n');

  try {
    let totalEvents = 0;

    // 1. Récupérer les jours fériés pour l'année en cours
    console.log('📅 Récupération des jours fériés...');
    const currentYear = new Date().getFullYear();
    const holidays = await fetchFromAPI('holidays', { year: currentYear });
    await insertEvents(holidays);
    totalEvents += holidays.length;

    // 2. Récupérer les événements historiques pour les prochains jours
    console.log('\n📚 Récupération des événements historiques...');
    const today = new Date();
    const events = [];
    
    // Récupérer pour les 30 prochains jours
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Événements divers (historiques, anniversaires, décès)
      const onThisDayEvents = await fetchFromAPI('onThisDay', { date: dateStr });
      events.push(...onThisDayEvents);
      
      // Pause pour éviter de surcharger les APIs
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await insertEvents(events);
    totalEvents += events.length;

    console.log(`\n🎉 Enrichissement terminé avec succès !`);
    console.log(`📊 Total d'événements traités : ${totalEvents}`);
    
    // Afficher des statistiques
    const { data: stats } = await supabase
      .from('daily_events')
      .select('event_type, category_id')
      .eq('is_active', true);

    if (stats) {
      const eventTypeStats = {};
      const categoryStats = {};
      
      stats.forEach(event => {
        eventTypeStats[event.event_type] = (eventTypeStats[event.event_type] || 0) + 1;
        categoryStats[event.category_id] = (categoryStats[event.category_id] || 0) + 1;
      });

      console.log('\n📈 Statistiques de la base de données :');
      console.log('=====================================');
      console.log('Par type d\'événement :');
      Object.entries(eventTypeStats).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      
      console.log('\nPar catégorie (IDs) :');
      Object.entries(categoryStats).forEach(([categoryId, count]) => {
        console.log(`   ${categoryId}: ${count}`);
      });
    }

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

// Fonction pour afficher les événements récents
async function showRecentEvents() {
  try {
    const { data, error } = await supabase
      .from('daily_events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true })
      .limit(10);

    if (error) throw error;

    console.log('\n📅 Événements récents dans la base de données :');
    console.log('==============================================');
    
    data.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.date}) - ${event.category}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage:', error.message);
  }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'enrich':
  case undefined:
    await enrichDatabase();
    break;
  case 'cleanup':
    await cleanupOldEvents();
    break;
  case 'show':
    await showRecentEvents();
    break;
  case 'all':
    await enrichDatabase();
    await cleanupOldEvents();
    await showRecentEvents();
    break;
  default:
    console.log('📋 Utilisation :');
    console.log('  node scripts/enrich-events.mjs [commande]');
    console.log('');
    console.log('Commandes disponibles :');
    console.log('  enrich  - Enrichir la base de données (par défaut)');
    console.log('  cleanup - Nettoyer les anciens événements');
    console.log('  show    - Afficher les événements récents');
    console.log('  all     - Exécuter toutes les opérations');
    break;
}
