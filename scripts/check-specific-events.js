#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eiuhcgvvexoshuopvska.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI');

async function checkSpecificEvents() {
  const today = new Date().toISOString().split('T')[0];
  console.log('📅 Vérification des événements spécifiques pour:', today);
  
  const specificTitles = [
    'Anniversaire de J.D. Salinger',
    'Anniversaire de Kate Bosworth', 
    'Anniversaire de J.R.R. Tolkien',
    'Anniversaire d\'Isaac Newton',
    'Anniversaire de Bradley Cooper'
  ];
  
  for (const title of specificTitles) {
    const { data: events, error } = await supabase
      .from('daily_events')
      .select('title, date, event_type')
      .eq('title', title)
      .eq('is_active', true);
    
    if (error) {
      console.log(`❌ Erreur pour ${title}: ${error.message}`);
    } else if (events && events.length > 0) {
      const event = events[0];
      console.log(`📊 ${event.title}: ${event.date} [${event.event_type}]`);
    } else {
      console.log(`❌ ${title}: Non trouvé`);
    }
  }
  
  // Vérifier les événements pour aujourd'hui
  const { data: todayEvents, error: todayError } = await supabase
    .from('daily_events')
    .select('title, date, event_type')
    .eq('date', today)
    .eq('is_active', true);
  
  if (todayError) {
    console.error('❌ Erreur lors de la vérification des événements d\'aujourd\'hui:', todayError);
  } else {
    console.log(`\n🎯 Événements pour aujourd'hui (${today}): ${todayEvents?.length || 0}`);
    todayEvents?.forEach(event => {
      console.log(`   ✅ ${event.title} [${event.event_type}]`);
    });
  }
}

checkSpecificEvents().catch(console.error); 