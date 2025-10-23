#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://eiuhcgvvexoshuopvska.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Configuration de la base de données...');
    
    // 1. Vérifier si les tables existent
    console.log('📋 Vérification des tables existantes...');
    
    const { data: eventsData, error: eventsError } = await supabase
      .from('daily_events')
      .select('count')
      .limit(1);
    
    if (eventsError) {
      console.log('❌ Table daily_events non trouvée, création nécessaire');
    } else {
      console.log('✅ Table daily_events existe déjà');
    }
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('event_categories')
      .select('count')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ Table event_categories non trouvée, création nécessaire');
    } else {
      console.log('✅ Table event_categories existe déjà');
    }
    
    // 2. Insérer des catégories d'exemple si elles n'existent pas
    console.log('📝 Insertion des catégories d\'événements...');
    
    const categories = [
      { name: 'Personnalités', color: '#3B82F6', icon: '👤' },
      { name: 'Événements historiques', color: '#EF4444', icon: '📜' },
      { name: 'Fériés', color: '#10B981', icon: '🎉' },
      { name: 'Journées internationales', color: '#8B5CF6', icon: '🌍' },
      { name: 'Musiciens', color: '#F59E0B', icon: '🎵' },
      { name: 'Acteurs', color: '#EC4899', icon: '🎬' },
      { name: 'Écrivains', color: '#06B6D4', icon: '📚' },
      { name: 'Scientifiques', color: '#84CC16', icon: '🔬' },
      { name: 'Sportifs', color: '#F97316', icon: '⚽' },
      { name: 'Politiciens', color: '#6366F1', icon: '🏛️' },
      { name: 'Artistes', color: '#A855F7', icon: '🎨' }
    ];
    
    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('event_categories')
          .insert(category);
        
        if (error && error.code !== '23505') { // Ignorer les erreurs de doublon
          console.log(`⚠️  Erreur insertion catégorie ${category.name}: ${error.message}`);
        } else {
          console.log(`✅ Catégorie ${category.name} ajoutée`);
        }
      } catch (err) {
        console.log(`❌ Erreur catégorie ${category.name}: ${err.message}`);
      }
    }
    
    // 3. Insérer des événements d'exemple
    console.log('📅 Insertion d\'événements d\'exemple...');
    
    const today = new Date().toISOString().split('T')[0];
    
    const sampleEvents = [
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
      }
    ];
    
    for (const event of sampleEvents) {
      try {
        const { error } = await supabase
          .from('daily_events')
          .insert(event);
        
        if (error && error.code !== '23505') { // Ignorer les erreurs de doublon
          console.log(`⚠️  Erreur insertion événement ${event.title}: ${error.message}`);
        } else {
          console.log(`✅ Événement ${event.title} ajouté`);
        }
      } catch (err) {
        console.log(`❌ Erreur événement ${event.title}: ${err.message}`);
      }
    }
    
    console.log('🎉 Configuration terminée!');
    
    // 4. Vérifier le résultat
    const { data: finalEvents, error: finalError } = await supabase
      .from('daily_events')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (!finalError && finalEvents) {
      console.log(`📊 ${finalEvents.length} événements actifs trouvés`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
  }
}

// Exécution
setupDatabase().catch(console.error); 