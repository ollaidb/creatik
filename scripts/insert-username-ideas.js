/**
 * Script pour insérer automatiquement 10 pseudos par réseau social
 * Usage: npm run insert-usernames
 * 
 * Ce script nécessite:
 * - Les variables d'environnement Supabase configurées
 * - Un utilisateur existant dans la base de données
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Configuration Supabase - utiliser les valeurs hardcodées du client si pas dans .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://eiuhcgvvexoshuopvska.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI";

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous d\'avoir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Liste des pseudos par réseau social
const usernameIdeas = {
  tiktok: [
    'creativetok',
    'vibesonly',
    'trendsetter',
    'contentqueen',
    'viralvibes',
    'danceking',
    'lifetok',
    'funnyvids',
    'creativemind',
    'trendytok'
  ],
  youtube: [
    'creativetube',
    'videomaster',
    'contentcreator',
    'youtubepro',
    'videoking',
    'channelmaster',
    'contentqueen',
    'videowizard',
    'youtubestar',
    'creativechannel'
  ],
  instagram: [
    'instacreative',
    'visualvibes',
    'instastar',
    'photolife',
    'instaqueen',
    'visualstory',
    'instamagic',
    'creativegram',
    'instavibes',
    'visualdream'
  ],
  facebook: [
    'facebookpro',
    'socialcreator',
    'facebookstar',
    'socialvibes',
    'facebookqueen',
    'socialmaster',
    'facebooklife',
    'socialgenius',
    'facebookking',
    'socialwizard'
  ],
  twitter: [
    'tweetmaster',
    'twitterpro',
    'tweetstar',
    'twittervibes',
    'tweetqueen',
    'twitterlife',
    'tweetking',
    'twittergenius',
    'tweetwizard',
    'twittercreative'
  ],
  twitch: [
    'streamking',
    'twitchpro',
    'streamqueen',
    'twitchstar',
    'streammaster',
    'twitchvibes',
    'streamlife',
    'twitchgenius',
    'streamwizard',
    'twitchcreative'
  ],
  linkedin: [
    'linkedinpro',
    'professional',
    'linkedinstar',
    'careerking',
    'linkedinqueen',
    'businesspro',
    'linkedinlife',
    'networkmaster',
    'linkedingenius',
    'professionalvibes'
  ],
  blog: [
    'blogmaster',
    'blogpro',
    'blogstar',
    'blogqueen',
    'blogking',
    'bloglife',
    'bloggenius',
    'blogwizard',
    'blogcreative',
    'blogvibes'
  ],
  article: [
    'articlepro',
    'writermaster',
    'articlestar',
    'writerqueen',
    'articleking',
    'writerlife',
    'articlegenius',
    'writerwizard',
    'articlecreative',
    'writervibes'
  ],
  podcasts: [
    'podcastpro',
    'podcastmaster',
    'podcaststar',
    'podcastqueen',
    'podcastking',
    'podcastlife',
    'podcastgenius',
    'podcastwizard',
    'podcastcreative',
    'podcastvibes'
  ]
};

async function insertUsernameIdeas() {
  console.log('🚀 Début de l\'insertion des pseudos...\n');

  // Pour les données automatiques, on peut laisser user_id = NULL
  // Si un user_id est fourni en argument, on l'utilise, sinon on met NULL
  const userArg = process.argv[2];
  let userId = null;
  
  if (userArg && userArg.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    userId = userArg;
    console.log(`✅ Utilisation du user_id fourni: ${userId}\n`);
  } else {
    console.log('ℹ️  Insertion automatique sans utilisateur (user_id = NULL)\n');
  }

  // Récupérer tous les réseaux sociaux
  const { data: networks, error: networksError } = await supabase
    .from('social_networks')
    .select('id, name, display_name')
    .eq('is_active', true);

  if (networksError || !networks) {
    console.error('❌ Erreur lors de la récupération des réseaux sociaux:', networksError);
    process.exit(1);
  }

  console.log(`📡 ${networks.length} réseaux sociaux trouvés\n`);

  let totalInserted = 0;
  let totalSkipped = 0;

  // Insérer les pseudos pour chaque réseau
  for (const network of networks) {
    const networkName = network.name.toLowerCase();
    const pseudos = usernameIdeas[networkName];

    if (!pseudos) {
      console.log(`⚠️  Pas de pseudos définis pour ${network.display_name}`);
      continue;
    }

    console.log(`📝 Insertion pour ${network.display_name}...`);

    let inserted = 0;
    let skipped = 0;

    for (const pseudo of pseudos) {
      // Vérifier si le pseudo existe déjà
      const { data: existing } = await supabase
        .from('username_ideas')
        .select('id')
        .eq('pseudo', pseudo)
        .eq('social_network_id', network.id)
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      // Insérer le pseudo
      const { error: insertError } = await supabase
        .from('username_ideas')
        .insert({
          pseudo,
          social_network_id: network.id,
          user_id: userId
        });

      if (insertError) {
        console.error(`  ❌ Erreur pour "${pseudo}":`, insertError.message);
      } else {
        inserted++;
        console.log(`  ✅ ${pseudo}`);
      }
    }

    console.log(`  📊 ${inserted} insérés, ${skipped} déjà existants\n`);
    totalInserted += inserted;
    totalSkipped += skipped;
  }

  console.log('='.repeat(50));
  console.log(`✅ Terminé!`);
  console.log(`📊 Total: ${totalInserted} pseudos insérés, ${totalSkipped} déjà existants`);
  console.log('='.repeat(50));
}

// Exécuter le script
insertUsernameIdeas().catch(console.error);
