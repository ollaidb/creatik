/**
 * Script pour insérer automatiquement 10 pseudos par réseau social
 * Usage: npx tsx scripts/insert-username-ideas.ts
 * 
 * Ce script nécessite:
 * - Les variables d'environnement Supabase configurées
 * - Être authentifié (ou utiliser un service role key)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous d\'avoir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Liste des pseudos par réseau social
const usernameIdeas: Record<string, string[]> = {
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

  // Récupérer l'utilisateur actuel (si authentifié)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('❌ Erreur: Vous devez être authentifié');
    console.error('Option 1: Connectez-vous via l\'application puis exécutez ce script');
    console.error('Option 2: Utilisez SUPABASE_SERVICE_ROLE_KEY dans .env.local');
    process.exit(1);
  }

  console.log(`✅ Utilisateur connecté: ${user.email} (${user.id})\n`);

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
          user_id: user.id
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

