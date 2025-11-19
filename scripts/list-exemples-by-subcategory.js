import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger .env.local en priorité, puis .env
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://eiuhcgvvexoshuopvska.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listExemplesBySubcategory() {
  try {
    console.log('🔍 Recherche des sous-catégories avec des exemples...\n');

    // Récupérer tous les exemples avec leurs sous-catégories
    const { data: exemples, error: exemplesError } = await supabase
      .from('content_exemples_media')
      .select(`
        id,
        title,
        media_type,
        platform,
        subcategory_id,
        subcategory_level2_id,
        subcategories:subcategory_id (
          id,
          name,
          categories:category_id (
            id,
            name
          )
        ),
        subcategories_level2:subcategory_level2_id (
          id,
          name,
          subcategories:subcategory_id (
            id,
            name,
            categories:category_id (
              id,
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (exemplesError) {
      if (exemplesError.code === '42P01') {
        console.error('❌ La table content_exemples_media n\'existe pas encore.');
        console.error('💡 Exécutez d\'abord le script create-exemples-media-table.sql dans Supabase SQL Editor');
        return;
      }
      throw exemplesError;
    }

    if (!exemples || exemples.length === 0) {
      console.log('⚠️  Aucun exemple trouvé dans la base de données.');
      console.log('💡 Exécutez le script d\'insertion pour ajouter des exemples.');
      return;
    }

    // Grouper par sous-catégorie
    const groupedBySubcategory = {};

    exemples.forEach(exemple => {
      let subcategoryKey;
      let categoryName;
      let subcategoryName;
      let level = 'Niveau 1';

      if (exemple.subcategory_id && exemple.subcategories) {
        subcategoryKey = exemple.subcategory_id;
        categoryName = exemple.subcategories.categories?.name || 'Inconnue';
        subcategoryName = exemple.subcategories.name || 'Inconnue';
      } else if (exemple.subcategory_level2_id && exemple.subcategories_level2) {
        subcategoryKey = exemple.subcategory_level2_id;
        level = 'Niveau 2';
        categoryName = exemple.subcategories_level2.subcategories?.categories?.name || 'Inconnue';
        subcategoryName = `${exemple.subcategories_level2.subcategories?.name || 'Inconnue'} > ${exemple.subcategories_level2.name || 'Inconnue'}`;
      } else {
        return; // Skip si pas de sous-catégorie
      }

      if (!groupedBySubcategory[subcategoryKey]) {
        groupedBySubcategory[subcategoryKey] = {
          categoryName,
          subcategoryName,
          level,
          images: [],
          videos: []
        };
      }

      if (exemple.media_type === 'image') {
        groupedBySubcategory[subcategoryKey].images.push(exemple);
      } else if (exemple.media_type === 'video') {
        groupedBySubcategory[subcategoryKey].videos.push(exemple);
      }
    });

    // Afficher le résumé
    console.log(`📊 Résumé: ${Object.keys(groupedBySubcategory).length} sous-catégorie(s) avec des exemples\n`);
    console.log('═'.repeat(80));

    Object.entries(groupedBySubcategory).forEach(([subcategoryId, data], index) => {
      console.log(`\n${index + 1}. ${data.categoryName} > ${data.subcategoryName} (${data.level})`);
      console.log(`   📸 Images: ${data.images.length}`);
      console.log(`   🎥 Vidéos: ${data.videos.length}`);
      console.log(`   Total: ${data.images.length + data.videos.length} exemple(s)`);
      
      if (data.images.length > 0) {
        console.log(`   Images:`);
        data.images.forEach((img, i) => {
          console.log(`      ${i + 1}. ${img.title}`);
        });
      }
      
      if (data.videos.length > 0) {
        console.log(`   Vidéos:`);
        data.videos.forEach((vid, i) => {
          console.log(`      ${i + 1}. ${vid.title}`);
        });
      }
    });

    console.log('\n' + '═'.repeat(80));
    console.log(`\n✨ Total: ${exemples.length} exemple(s) dans ${Object.keys(groupedBySubcategory).length} sous-catégorie(s)`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === '42P01') {
      console.error('\n💡 La table content_exemples_media n\'existe pas encore.');
      console.error('   Exécutez d\'abord le script create-exemples-media-table.sql dans Supabase SQL Editor.');
    }
    process.exit(1);
  }
}

listExemplesBySubcategory();

