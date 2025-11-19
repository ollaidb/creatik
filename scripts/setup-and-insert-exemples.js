import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger .env.local en priorité, puis .env
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://eiuhcgvvexoshuopvska.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAndInsert() {
  try {
    console.log('🚀 Début de la configuration...\n');

    // 1. Lire et exécuter le script de création de table
    console.log('📋 Étape 1: Création de la table content_exemples_media...');
    const sqlPath = path.join(__dirname, '..', 'create-exemples-media-table.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Fichier SQL non trouvé: ${sqlPath}`);
      console.log('💡 Veuillez exécuter manuellement le script create-exemples-media-table.sql dans Supabase SQL Editor');
      console.log('   Puis relancez ce script pour insérer les données.\n');
      
      // Continuer quand même avec l'insertion
      console.log('⏭️  Passage à l\'insertion des données...\n');
    } else {
      console.log('⚠️  Le script SQL doit être exécuté manuellement dans Supabase SQL Editor');
      console.log('   Fichier: create-exemples-media-table.sql\n');
    }

    // 2. Insérer les exemples d'images
    console.log('📸 Étape 2: Insertion des exemples d\'images...\n');

    // Trouver la première catégorie avec sous-catégorie
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    if (catError) throw catError;
    if (!categories || categories.length === 0) {
      console.error('❌ Aucune catégorie trouvée dans la base de données');
      return;
    }

    let firstCategory = null;
    let firstSubcategory = null;

    for (const category of categories) {
      const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', category.id)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true })
        .limit(1);

      if (subError) throw subError;
      
      if (subcategories && subcategories.length > 0) {
        firstCategory = category;
        firstSubcategory = subcategories[0];
        break;
      }
    }

    if (!firstCategory || !firstSubcategory) {
      console.error('❌ Aucune catégorie avec sous-catégorie trouvée dans la base de données');
      return;
    }

    console.log(`✅ Catégorie: ${firstCategory.name}`);
    console.log(`✅ Sous-catégorie: ${firstSubcategory.name}\n`);

    // Vérifier si des exemples existent déjà
    const { data: existing, error: existError } = await supabase
      .from('content_exemples_media')
      .select('id, title')
      .eq('subcategory_id', firstSubcategory.id)
      .eq('media_type', 'image');

    if (existError) {
      if (existError.code === '42P01') {
        console.error('❌ La table content_exemples_media n\'existe pas encore.');
        console.error('💡 Exécutez d\'abord le script create-exemples-media-table.sql dans Supabase SQL Editor');
        return;
      }
      throw existError;
    }
    
    if (existing && existing.length > 0) {
      console.log(`⚠️  ${existing.length} exemple(s) d'image existent déjà pour cette sous-catégorie`);
      console.log('   Exemples existants:');
      existing.forEach(ex => console.log(`   - ${ex.title}`));
      console.log('\n   Pour réinsérer, supprimez d\'abord les exemples existants.\n');
      return;
    }

    // Insérer 5 exemples d'images
    const images = [
      {
        title: `Exemple d'image 1 - ${firstSubcategory.name}`,
        description: `Premier exemple d'image pour la sous-catégorie ${firstSubcategory.name}`,
        media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
        creator_name: 'Créateur Exemple 1',
        platform: 'instagram',
        order_index: 0
      },
      {
        title: `Exemple d'image 2 - ${firstSubcategory.name}`,
        description: `Deuxième exemple d'image pour la sous-catégorie ${firstSubcategory.name}`,
        media_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop',
        creator_name: 'Créateur Exemple 2',
        platform: 'instagram',
        order_index: 1
      },
      {
        title: `Exemple d'image 3 - ${firstSubcategory.name}`,
        description: `Troisième exemple d'image pour la sous-catégorie ${firstSubcategory.name}`,
        media_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=800&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop',
        creator_name: 'Créateur Exemple 3',
        platform: 'instagram',
        order_index: 2
      },
      {
        title: `Exemple d'image 4 - ${firstSubcategory.name}`,
        description: `Quatrième exemple d'image pour la sous-catégorie ${firstSubcategory.name}`,
        media_url: 'https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?w=800&h=800&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?w=400&h=400&fit=crop',
        creator_name: 'Créateur Exemple 4',
        platform: 'instagram',
        order_index: 3
      },
      {
        title: `Exemple d'image 5 - ${firstSubcategory.name}`,
        description: `Cinquième exemple d'image pour la sous-catégorie ${firstSubcategory.name}`,
        media_url: 'https://images.unsplash.com/photo-1557682258-b6c63c94df83?w=800&h=800&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1557682258-b6c63c94df83?w=400&h=400&fit=crop',
        creator_name: 'Créateur Exemple 5',
        platform: 'instagram',
        order_index: 4
      }
    ];

    console.log('📸 Insertion de 5 exemples d\'images...\n');

    const inserts = images.map(img => ({
      subcategory_id: firstSubcategory.id,
      title: img.title,
      description: img.description,
      media_type: 'image',
      media_url: img.media_url,
      thumbnail_url: img.thumbnail_url,
      creator_name: img.creator_name,
      platform: img.platform,
      order_index: img.order_index
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('content_exemples_media')
      .insert(inserts)
      .select();

    if (insertError) {
      if (insertError.code === '42P01') {
        console.error('❌ La table content_exemples_media n\'existe pas encore.');
        console.error('💡 Exécutez d\'abord le script create-exemples-media-table.sql dans Supabase SQL Editor');
        return;
      }
      throw insertError;
    }

    console.log('✅ Exemples d\'images insérés avec succès!\n');
    console.log('📋 Résumé:');
    inserted.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title}`);
      console.log(`      URL: ${item.media_url}`);
    });

    console.log(`\n✨ ${inserted.length} exemple(s) d'image inséré(s) pour la sous-catégorie "${firstSubcategory.name}"`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === '42P01') {
      console.error('\n💡 La table content_exemples_media n\'existe pas encore.');
      console.error('   Exécutez d\'abord le script create-exemples-media-table.sql dans Supabase SQL Editor.');
    }
    process.exit(1);
  }
}

setupAndInsert();

