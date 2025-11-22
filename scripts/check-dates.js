#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eiuhcgvvexoshuopvska.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI');

async function checkDates() {
  const today = new Date().toISOString().split('T')[0];
  console.log('📅 Date d\'aujourd\'hui:', today);
  
  const { data: events, error } = await supabase
    .from('daily_events')
    .select('title, date, event_type')
    .eq('is_active', true)
    .order('date');
  
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  
  console.log('📊 Événements dans la base:');
  events.forEach(event => {
    console.log(`   - ${event.title} (${event.date}) [${event.event_type}]`);
  });
  
  const todayEvents = events.filter(e => e.date === today);
  console.log(`\n🎯 Événements pour aujourd'hui (${today}): ${todayEvents.length}`);
  todayEvents.forEach(event => {
    console.log(`   ✅ ${event.title}`);
  });
  
  if (todayEvents.length === 0) {
    console.log('\n⚠️  Aucun événement pour aujourd\'hui !');
    console.log('   Les événements existants ont des dates différentes.');
  }
}

checkDates().catch(console.error); 