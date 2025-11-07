// scripts/fetch-creator-stats-hybrid.js
// Système hybride: API + OpenGraph avec fallback automatique

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// =====================================================
// CONFIGURATION DES APIs (GRATUITES)
// =====================================================

const API_CONFIG = {
  // YouTube API (GRATUITE - Google Cloud Console)
  youtube: {
    enabled: !!process.env.YOUTUBE_API_KEY,
    key: process.env.YOUTUBE_API_KEY,
    free: true,
    quota: 10000, // unités par jour
    method: 'official'
  },

  // RapidAPI (GRATUITE - 500 requêtes/mois)
  rapidapi: {
    enabled: !!process.env.RAPIDAPI_KEY,
    key: process.env.RAPIDAPI_KEY,
    free: true,
    quota: 500, // requêtes par mois
    method: 'third_party'
  },

  // LinkPreview (GRATUITE - 10,000 requêtes/mois)
  linkpreview: {
    enabled: !!process.env.LINKPREVIEW_API_KEY,
    key: process.env.LINKPREVIEW_API_KEY,
    free: true,
    quota: 10000,
    method: 'opengraph'
  },

  // OpenGraph (GRATUITE - Aucune clé requise)
  opengraph: {
    enabled: true,
    key: null,
    free: true,
    quota: 'unlimited',
    method: 'scraping'
  }
};

// =====================================================
// MÉTHODE 1: YouTube API Officielle (GRATUITE)
// =====================================================

async function fetchYouTubeStatsOfficial(channelUrl) {
  if (!API_CONFIG.youtube.enabled) return null;

  try {
    // Extraire le channel ID
    const channelId = await extractYouTubeChannelId(channelUrl);
    if (!channelId) return null;

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'statistics,snippet',
          id: channelId,
          key: API_CONFIG.youtube.key
        }
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      return {
        followers: parseInt(channel.statistics.subscriberCount || 0),
        views: parseInt(channel.statistics.viewCount || 0),
        videos: parseInt(channel.statistics.videoCount || 0),
        verified: channel.snippet.verified || false,
        method: 'youtube_api'
      };
    }
    return null;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('⚠️  Quota YouTube API dépassé, utilisation du fallback');
    }
    return null;
  }
}

/**
 * Extraire le channel ID YouTube (supporte plusieurs formats)
 */
async function extractYouTubeChannelId(url) {
  if (!url) return null;

  // Format: youtube.com/@username
  const usernameMatch = url.match(/youtube\.com\/@([^/?]+)/);
  if (usernameMatch) {
    const username = usernameMatch[1];
    // Faire une requête pour obtenir le channel ID
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            q: username,
            type: 'channel',
            key: API_CONFIG.youtube.key,
            maxResults: 1
          }
        }
      );
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].snippet.channelId;
      }
    } catch (error) {
      return null;
    }
  }

  // Format: youtube.com/channel/CHANNEL_ID
  const channelMatch = url.match(/youtube\.com\/channel\/([^/?]+)/);
  if (channelMatch) return channelMatch[1];

  // Format: youtube.com/c/CHANNEL_NAME
  const cMatch = url.match(/youtube\.com\/c\/([^/?]+)/);
  if (cMatch) {
    // Nécessite une requête de recherche
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            q: cMatch[1],
            type: 'channel',
            key: API_CONFIG.youtube.key,
            maxResults: 1
          }
        }
      );
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].snippet.channelId;
      }
    } catch (error) {
      return null;
    }
  }

  return null;
}

// =====================================================
// MÉTHODE 2: RapidAPI (GRATUITE - 500 req/mois)
// =====================================================

async function fetchStatsRapidAPI(username, platform) {
  if (!API_CONFIG.rapidapi.enabled) return null;

  const rapidApiEndpoints = {
    instagram: {
      url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/info',
      params: { username_or_id_or_url: username },
      host: 'instagram-scraper-api2.p.rapidapi.com'
    },
    tiktok: {
      url: 'https://tiktok-scraper2.p.rapidapi.com/user/info',
      params: { username: username },
      host: 'tiktok-scraper2.p.rapidapi.com'
    }
  };

  const endpoint = rapidApiEndpoints[platform];
  if (!endpoint) return null;

  try {
    const response = await axios.get(endpoint.url, {
      params: endpoint.params,
      headers: {
        'X-RapidAPI-Key': API_CONFIG.rapidapi.key,
        'X-RapidAPI-Host': endpoint.host
      },
      timeout: 10000
    });

    if (platform === 'instagram') {
      return {
        followers: response.data?.result?.user?.edge_followed_by?.count || 0,
        verified: response.data?.result?.user?.is_verified || false,
        method: 'rapidapi_instagram'
      };
    } else if (platform === 'tiktok') {
      return {
        followers: response.data?.userInfo?.stats?.followerCount || 0,
        verified: response.data?.userInfo?.user?.verified || false,
        method: 'rapidapi_tiktok'
      };
    }

    return null;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('⚠️  Quota RapidAPI dépassé, utilisation du fallback');
    }
    return null;
  }
}

// =====================================================
// MÉTHODE 3: LinkPreview API (GRATUITE - 10K req/mois)
// =====================================================

async function fetchStatsLinkPreview(profileUrl) {
  if (!API_CONFIG.linkpreview.enabled) return null;

  try {
    const response = await axios.get('https://api.linkpreview.net', {
      params: {
        q: profileUrl,
        key: API_CONFIG.linkpreview.key
      }
    });

    // Extraire les followers depuis la description
    const description = response.data?.description || '';
    const followers = parseFollowersFromText(description);

    if (followers) {
      return {
        followers: followers,
        title: response.data?.title,
        image: response.data?.image,
        method: 'linkpreview'
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// =====================================================
// MÉTHODE 4: OpenGraph Scraping (GRATUITE - Illimité)
// =====================================================

async function fetchStatsOpenGraph(profileUrl, platform) {
  try {
    const response = await axios.get(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000,
      validateStatus: (status) => status < 500 // Accepter les erreurs 4xx
    });

    const $ = cheerio.load(response.data);

    let followers = null;

    // Extraire selon le réseau social
    switch (platform) {
      case 'instagram':
        // Méthode 1: Meta tags Open Graph
        const ogDescription = $('meta[property="og:description"]').attr('content') || '';
        followers = parseFollowersFromText(ogDescription);

        // Méthode 2: Données JSON dans le HTML
        if (!followers) {
          const scriptTags = $('script[type="application/ld+json"]');
          scriptTags.each((_, elem) => {
            try {
              const jsonData = JSON.parse($(elem).html());
              if (jsonData.mainEntity?.interactionStatistic) {
                const stats = jsonData.mainEntity.interactionStatistic;
                if (stats.userInteractionCount) {
                  followers = parseInt(stats.userInteractionCount);
                }
              }
            } catch (e) {
              // Ignorer les erreurs de parsing
            }
          });
        }
        break;

      case 'tiktok':
        // TikTok utilise des données dans le HTML
        const followersText = $('[data-e2e="followers-count"]').text() || 
                             $('strong[title*="followers"]').text() ||
                             $('span:contains("followers")').first().text();
        followers = parseFollowersFromText(followersText);
        break;

      case 'youtube':
        // YouTube dans les meta tags
        const ytSubscribers = $('meta[itemprop="subscriberCount"]').attr('content');
        if (ytSubscribers) {
          followers = parseInt(ytSubscribers);
        }
        break;

      default:
        // Pour les autres, chercher dans les meta tags Open Graph
        const description = $('meta[property="og:description"]').attr('content') || '';
        followers = parseFollowersFromText(description);
    }

    return followers ? {
      followers: followers,
      method: 'opengraph_scraping'
    } : null;

  } catch (error) {
    return null;
  }
}

/**
 * Parser le nombre de followers depuis un texte
 */
function parseFollowersFromText(text) {
  if (!text) return null;

  // Patterns: "12.5K followers", "1.2M abonnés", "1,234 followers", etc.
  const patterns = [
    /(\d+[.,]?\d*)\s*([KMB])?\s*(followers|abonnés|abonnées|subscribers|membres)/i,
    /(\d+[.,]?\d*)\s*([KMB])\b/i,
    /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\s*(followers|abonnés)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let num = parseFloat(match[1].replace(/,/g, ''));
      const unit = (match[2] || '').toUpperCase();

      if (unit === 'K') num = num * 1000;
      else if (unit === 'M') num = num * 1000000;
      else if (unit === 'B') num = num * 1000000000;

      return Math.floor(num);
    }
  }

  return null;
}

// =====================================================
// FONCTION PRINCIPALE: Système hybride avec fallback
// =====================================================

async function fetchStatsHybrid(profileUrl, username, platform) {
  console.log(`  🔍 Récupération pour ${platform}...`);

  // ESSAI 1: API Officielle (si disponible)
  if (platform === 'youtube' && API_CONFIG.youtube.enabled) {
    const stats = await fetchYouTubeStatsOfficial(profileUrl);
    if (stats) {
      console.log(`    ✅ Méthode: YouTube API Officielle`);
      return stats;
    }
  }

  // ESSAI 2: RapidAPI (Instagram, TikTok)
  if ((platform === 'instagram' || platform === 'tiktok') && API_CONFIG.rapidapi.enabled) {
    const stats = await fetchStatsRapidAPI(username, platform);
    if (stats) {
      console.log(`    ✅ Méthode: RapidAPI`);
      return stats;
    }
  }

  // ESSAI 3: LinkPreview API
  if (API_CONFIG.linkpreview.enabled) {
    const stats = await fetchStatsLinkPreview(profileUrl);
    if (stats) {
      console.log(`    ✅ Méthode: LinkPreview API`);
      return stats;
    }
  }

  // ESSAI 4: OpenGraph Scraping (toujours disponible)
  const stats = await fetchStatsOpenGraph(profileUrl, platform);
  if (stats) {
    console.log(`    ✅ Méthode: OpenGraph Scraping`);
    return stats;
  }

  console.log(`    ❌ Aucune méthode n'a fonctionné`);
  return null;
}

// =====================================================
// MISE À JOUR DE TOUS LES CRÉATEURS
// =====================================================

async function updateAllCreatorsStats() {
  console.log('🚀 Démarrage de la récupération automatique (système hybride)...\n');
  console.log('📊 Configuration des APIs:');
  console.log(`  YouTube API: ${API_CONFIG.youtube.enabled ? '✅ Activé' : '❌ Désactivé'}`);
  console.log(`  RapidAPI: ${API_CONFIG.rapidapi.enabled ? '✅ Activé' : '❌ Désactivé'}`);
  console.log(`  LinkPreview: ${API_CONFIG.linkpreview.enabled ? '✅ Activé' : '❌ Désactivé'}`);
  console.log(`  OpenGraph: ✅ Toujours activé (fallback)\n`);

  // Vérifier la connexion Supabase
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
    console.error('   Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env');
    return;
  }

  // Récupérer tous les créateurs
  const { data: creatorNetworks, error } = await supabase
    .from('creator_social_networks')
    .select(`
      *,
      creator:creators(id, name),
      network:social_networks(name, display_name)
    `);

  if (error) {
    console.error('❌ Erreur lors de la récupération des créateurs:', error.message);
    return;
  }

  if (!creatorNetworks || creatorNetworks.length === 0) {
    console.log('ℹ️  Aucun réseau social trouvé pour les créateurs');
    console.log('   Le script fonctionnera une fois que vous aurez ajouté des créateurs dans la base de données.');
    return;
  }

  console.log(`📱 ${creatorNetworks.length} réseaux sociaux à mettre à jour\n`);

  let successCount = 0;
  let errorCount = 0;
  const methodsUsed = {};

  for (const network of creatorNetworks) {
    const platform = network.network?.name;
    const username = network.username;
    const profileUrl = network.profile_url;
    const creatorName = network.creator?.name || 'Inconnu';

    console.log(`\n👤 ${creatorName} - ${network.network?.display_name || platform}`);

    if (!profileUrl) {
      console.log('  ⚠️  Pas d\'URL de profil, ignoré');
      continue;
    }

    if (!platform) {
      console.log('  ⚠️  Plateforme non définie, ignoré');
      continue;
    }

    try {
      const stats = await fetchStatsHybrid(profileUrl, username, platform);

      if (stats && stats.followers > 0) {
        // Enregistrer la méthode utilisée
        const method = stats.method || 'unknown';
        methodsUsed[method] = (methodsUsed[method] || 0) + 1;

        // Mettre à jour dans la base de données
        const { error: updateError } = await supabase
          .from('creator_social_networks')
          .update({
            followers_count: stats.followers,
            is_primary: stats.verified !== undefined ? stats.verified : network.is_primary
          })
          .eq('id', network.id);

        if (updateError) {
          console.error(`  ❌ Erreur DB:`, updateError.message);
          errorCount++;
        } else {
          console.log(`  ✅ ${stats.followers.toLocaleString()} followers`);
          successCount++;
        }
      } else {
        console.log(`  ⚠️  Données non récupérées (conservation de l'ancienne valeur)`);
      }

      // Délai entre les requêtes pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`  ❌ Erreur:`, error.message);
      errorCount++;
    }
  }

  // Résumé
  console.log(`\n\n📊 Résumé:`);
  console.log(`  ✅ ${successCount} réseaux mis à jour`);
  console.log(`  ❌ ${errorCount} erreurs`);
  if (Object.keys(methodsUsed).length > 0) {
    console.log(`\n📈 Méthodes utilisées:`);
    Object.entries(methodsUsed).forEach(([method, count]) => {
      console.log(`  ${method}: ${count} fois`);
    });
  }

  // Mettre à jour les scores d'activité si la fonction existe
  if (successCount > 0) {
    console.log(`\n🔄 Mise à jour des scores d'activité...`);
    try {
      const { error: scoreError } = await supabase.rpc('update_all_creator_network_scores');
      if (scoreError) {
        console.warn('⚠️  Erreur lors de la mise à jour des scores:', scoreError.message);
        console.warn('   (Ceci est normal si la fonction SQL n\'a pas encore été créée)');
      } else {
        console.log('✅ Scores d\'activité mis à jour');
      }
    } catch (error) {
      console.warn('⚠️  La fonction update_all_creator_network_scores n\'existe pas encore');
      console.warn('   Exécutez d\'abord la migration SQL pour créer cette fonction');
    }
  }

  console.log('\n✨ Terminé!');
}

// Exécuter
updateAllCreatorsStats().catch(console.error);

