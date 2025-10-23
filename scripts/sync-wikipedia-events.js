#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class WikipediaSyncService {
  constructor() {
    this.baseUrl = 'https://fr.wikipedia.org/api/rest_v1';
    this.searchUrl = 'https://fr.wikipedia.org/w/api.php';
  }

  /**
   * Recherche des événements sur Wikipédia pour une date donnée
   */
  async searchWikipediaEvents(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const monthName = this.getMonthName(month);
    const searchQuery = `${day} ${monthName}`;

    try {
      const response = await fetch(
        `${this.searchUrl}?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=20&origin=*`
      );
      const data = await response.json();

      if (!data.query?.search) {
        return [];
      }

      return data.query.search.map(result => this.parseWikipediaEvent(result.title, result.snippet));
    } catch (error) {
      console.error('Erreur lors de la recherche Wikipédia:', error);
      return [];
    }
  }

  /**
   * Parse un événement Wikipédia
   */
  parseWikipediaEvent(title, snippet) {
    const birthdayPattern = /(naissance|né|née|birthday|anniversaire)/i;
    const deathPattern = /(décès|mort|mort\(e\)|death)/i;
    const historicalPattern = /(événement|événement historique|historical event)/i;
    const holidayPattern = /(fête|férié|holiday|jour férié)/i;
    const internationalPattern = /(journée internationale|international day)/i;

    let eventType = 'historical_event';
    
    if (birthdayPattern.test(title) || birthdayPattern.test(snippet)) {
      eventType = 'birthday';
    } else if (deathPattern.test(title) || deathPattern.test(snippet)) {
      eventType = 'death';
    } else if (holidayPattern.test(title) || holidayPattern.test(snippet)) {
      eventType = 'holiday';
    } else if (internationalPattern.test(title) || internationalPattern.test(snippet)) {
      eventType = 'international_day';
    }

    const yearMatch = title.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;

    let personName = null;
    let profession = null;

    if (eventType === 'birthday' || eventType === 'death') {
      const nameMatch = title.match(/^(.+?)(?:\s*\(|$)/);
      if (nameMatch) {
        personName = nameMatch[1].trim();
      }

      const professionMatch = snippet.match(/(?:est un|était un|est une|était une)\s+([^,.]+)/i);
      if (professionMatch) {
        profession = professionMatch[1].trim();
      }
    }

    return {
      title,
      description: snippet.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      event_type: eventType,
      year,
      person_name: personName,
      profession
    };
  }

  /**
   * Synchronise les événements avec Wikipédia
   */
  async syncEventsWithWikipedia() {
    console.log('🔄 Début de la synchronisation avec Wikipédia...');

    try {
      // Récupérer les événements du jour depuis Wikipédia
      const today = new Date();
      const wikipediaEvents = await this.searchWikipediaEvents(today);

      console.log(`📅 Trouvé ${wikipediaEvents.length} événements sur Wikipédia`);

      for (const wikiEvent of wikipediaEvents) {
        try {
          // Vérifier si l'événement existe déjà
          const { data: existingEvent } = await supabase
            .from('daily_events')
            .select('id')
            .eq('title', wikiEvent.title)
            .eq('date', today.toISOString().split('T')[0])
            .single();

          if (existingEvent) {
            console.log(`✅ Événement existant: ${wikiEvent.title}`);
            continue;
          }

          // Insérer le nouvel événement avec seulement les colonnes de base
          const { data, error } = await supabase
            .from('daily_events')
            .insert({
              event_type: wikiEvent.event_type,
              title: wikiEvent.title,
              description: wikiEvent.description,
              date: today.toISOString().split('T')[0],
              year: wikiEvent.year,
              person_name: wikiEvent.person_name,
              profession: wikiEvent.profession,
              is_active: true
            });

          if (error) {
            console.error(`❌ Erreur lors de l'insertion de ${wikiEvent.title}:`, error);
          } else {
            console.log(`✅ Ajouté: ${wikiEvent.title}`);
          }

          // Pause pour éviter de surcharger l'API Wikipédia
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`❌ Erreur pour ${wikiEvent.title}:`, error);
        }
      }

      console.log('✅ Synchronisation terminée');

    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
    }
  }

  /**
   * Convertit le numéro du mois en nom français
   */
  getMonthName(month) {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return months[month - 1];
  }
}

// Exécution du script
async function main() {
  const syncService = new WikipediaSyncService();
  
  console.log('🚀 Démarrage de la synchronisation Wikipédia...');
  console.log(`📅 Date: ${new Date().toLocaleDateString('fr-FR')}`);
  
  await syncService.syncEventsWithWikipedia();
  
  console.log('✨ Synchronisation terminée avec succès !');
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

// Exécution
main().catch(console.error);

export default WikipediaSyncService; 