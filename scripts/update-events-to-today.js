#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eiuhcgvvexoshuopvska.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI');

async function updateEventsToToday() {
  const today = new Date().toISOString().split('T')[0];
  console.log('📅 Mise à jour des événements pour aujourd\'hui:', today);
  
  try {
    // Mettre à jour les 5 premiers événements pour qu'ils correspondent à aujourd'hui
    const { data: events, error: fetchError } = await supabase
      .from('daily_events')
      .select('id, title')
      .eq('is_active', true)
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des événements:', fetchError);
      return;
    }
    
    console.log(`📊 ${events.length} événements trouvés pour mise à jour`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const event of events) {
      try {
        const { error } = await supabase
          .from('daily_events')
          .update({ date: today })
          .eq('id', event.id);
        
        if (error) {
          console.log(`❌ Erreur pour ${event.title}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Mis à jour: ${event.title}`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Erreur pour ${event.title}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Résumé:`);
    console.log(`✅ Événements mis à jour: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Événements mis à jour avec succès !');
      console.log('Votre application devrait maintenant afficher des événements pour aujourd\'hui.');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

updateEventsToToday().catch(console.error); 