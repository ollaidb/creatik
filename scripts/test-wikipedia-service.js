#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Test simple du service Wikipédia sans Supabase
class WikipediaTestService {
  constructor() {
    this.searchUrl = 'https://fr.wikipedia.org/w/api.php';
  }

  async testWikipediaSearch() {
    console.log('🧪 Test de recherche Wikipédia...');
    
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const monthName = this.getMonthName(month);
      const searchQuery = `${day} ${monthName}`;
      
      console.log(`📅 Recherche pour: ${searchQuery}`);
      
      const response = await fetch(
        `${this.searchUrl}?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=5&origin=*`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.query?.search) {
        console.log('❌ Aucun résultat trouvé');
        return;
      }
      
      console.log(`✅ Trouvé ${data.query.search.length} résultats:`);
      
      data.query.search.forEach((result, index) => {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   ${result.snippet.substring(0, 100)}...`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error.message);
    }
  }

  getMonthName(month) {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return months[month - 1];
  }
}

// Test de connexion Supabase
async function testSupabaseConnection() {
  console.log('🔗 Test de connexion Supabase...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Variables d\'environnement Supabase non définies');
    console.log('   Créez un fichier .env avec SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test de connexion simple
    const { data, error } = await supabase
      .from('daily_events')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
    } else {
      console.log('✅ Connexion Supabase réussie');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  const testService = new WikipediaTestService();
  await testService.testWikipediaSearch();
  
  console.log('---');
  await testSupabaseConnection();
  
  console.log('\n✨ Tests terminés');
}

// Exécution
runTests().catch(console.error); 