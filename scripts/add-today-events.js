#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eiuhcgvvexoshuopvska.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI');

async function addTodayEvents() {
  const today = new Date().toISOString().split('T')[0];
  console.log('📅 Ajout d\'événements pour aujourd\'hui:', today);
  
  const todayEvents = [
    {
      event_type: 'birthday',
      title: 'Anniversaire de Mick Jagger',
      description: 'Chanteur et musicien britannique, membre des Rolling Stones',
      date: today,
      year: 1943,
      person_name: 'Mick Jagger',
      profession: 'Musicien',
      is_active: true
    },
    {
      event_type: 'birthday',
      title: 'Anniversaire de Kate Beckinsale',
      description: 'Actrice britannique célèbre pour ses rôles dans Underworld',
      date: today,
      year: 1973,
      person_name: 'Kate Beckinsale',
      profession: 'Actrice',
      is_active: true
    },
    {
      event_type: 'death',
      title: 'Décès de Jimi Hendrix',
      description: 'Guitariste et chanteur américain, légende du rock',
      date: today,
      year: 1970,
      person_name: 'Jimi Hendrix',
      profession: 'Guitariste',
      is_active: true
    },
    {
      event_type: 'international_day',
      title: 'Journée internationale de la paix',
      description: 'Journée dédiée à la promotion de la paix dans le monde',
      date: today,
      is_active: true
    },
    {
      event_type: 'historical_event',
      title: 'Indépendance du Libéria',
      description: 'Le Libéria déclare son indépendance en 1847',
      date: today,
      year: 1847,
      is_active: true
    }
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const event of todayEvents) {
    try {
      const { error } = await supabase
        .from('daily_events')
        .insert(event);
      
      if (error) {
        console.log(`❌ Erreur pour ${event.title}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Ajouté: ${event.title}`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Erreur pour ${event.title}: ${err.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`✅ Événements ajoutés: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Événements ajoutés avec succès !');
    console.log('Votre application devrait maintenant afficher des événements.');
  }
}

addTodayEvents().catch(console.error); 