#!/usr/bin/env node

/**
 * Script pour récupérer des créateurs depuis différentes APIs publiques
 * et les ajouter à la base de données Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Mapping des réseaux sociaux
const NETWORK_MAPPING = {
    'github': 'GitHub',
    'reddit': 'Reddit',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'instagram': 'Instagram',
    'twitter': 'Twitter/X',
    'twitch': 'Twitch'
};

async function getNetworkId(networkName) {
    const { data } = await supabase
        .from('social_networks')
        .select('id, name')
        .ilike('name', `%${networkName.toLowerCase()}%`)
        .single();
    
    return data?.id || null;
}

async function fetchGitHubCreators(limit = 50) {
    try {
        console.log(`\n📦 Récupération de ${limit} créateurs GitHub...`);
        
        const response = await fetch(`https://api.github.com/search/users?q=type:user&sort=followers&order=desc&per_page=${limit}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Creatik-App'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const creators = [];
        
        for (const user of data.items) {
            try {
                const userResponse = await fetch(user.url, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Creatik-App'
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    creators.push({
                        name: userData.name || userData.login,
                        username: userData.login,
                        bio: userData.bio || null,
                        profile_url: userData.html_url,
                        network: 'github',
                        followers: userData.followers || 0
                    });
                }
                
                // Respecter les limites de taux (5000 requêtes/heure)
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`   ⚠️  Erreur pour ${user.login}: ${error.message}`);
            }
        }
        
        console.log(`✅ ${creators.length} créateurs GitHub récupérés`);
        return creators;
        
    } catch (error) {
        console.error(`❌ Erreur GitHub: ${error.message}`);
        return [];
    }
}

async function fetchRedditCreators(limit = 30) {
    try {
        console.log(`\n📦 Récupération de ${limit} créateurs Reddit...`);
        
        const subreddits = ['youtube', 'videos', 'contentcreation', 'YouTubers', 'TikTok', 'streaming'];
        const creators = [];
        const seenUsernames = new Set();
        
        for (const subreddit of subreddits) {
            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`, {
                    headers: {
                        'User-Agent': 'Creatik-App/1.0'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.children) {
                        for (const post of data.data.children) {
                            const author = post.data.author;
                            if (author && !seenUsernames.has(author) && author !== '[deleted]') {
                                seenUsernames.add(author);
                                creators.push({
                                    name: author,
                                    username: author,
                                    profile_url: `https://reddit.com/user/${author}`,
                                    network: 'reddit',
                                    bio: null
                                });
                                
                                if (creators.length >= limit) break;
                            }
                        }
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`   ⚠️  Erreur pour r/${subreddit}: ${error.message}`);
            }
        }
        
        console.log(`✅ ${creators.length} créateurs Reddit récupérés`);
        return creators;
        
    } catch (error) {
        console.error(`❌ Erreur Reddit: ${error.message}`);
        return [];
    }
}

async function addCreatorsToDatabase(creators) {
    console.log(`\n💾 Ajout de ${creators.length} créateurs à la base de données...\n`);
    
    // Récupérer les créateurs existants
    const { data: existingCreators } = await supabase
        .from('creators')
        .select('id, name');
    
    const creatorMap = new Map();
    existingCreators?.forEach(c => {
        creatorMap.set(c.name.toLowerCase(), c.id);
    });
    
    // Récupérer les IDs des réseaux sociaux
    const networkIds = {};
    for (const network of Object.keys(NETWORK_MAPPING)) {
        const id = await getNetworkId(network);
        if (id) {
            networkIds[network] = id;
        }
    }
    
    let added = 0;
    let networksAdded = 0;
    let skipped = 0;
    
    for (const creatorData of creators) {
        try {
            let creatorId;
            const creatorNameLower = creatorData.name.toLowerCase();
            
            // Vérifier si le créateur existe déjà
            if (creatorMap.has(creatorNameLower)) {
                creatorId = creatorMap.get(creatorNameLower);
            } else {
                // Créer le créateur
                const { data: creator, error: creatorError } = await supabase
                    .from('creators')
                    .insert({
                        name: creatorData.name,
                        display_name: creatorData.name,
                        bio: creatorData.bio,
                        is_verified: false
                    })
                    .select('id')
                    .single();
                
                if (creatorError) {
                    if (creatorError.code === '23505') {
                        skipped++;
                        continue;
                    }
                    throw creatorError;
                }
                
                creatorId = creator.id;
                creatorMap.set(creatorNameLower, creatorId);
                added++;
            }
            
            // Ajouter le réseau social si disponible
            const networkId = networkIds[creatorData.network];
            if (networkId) {
                // Vérifier si le réseau existe déjà
                const { data: existingNetwork } = await supabase
                    .from('creator_social_networks')
                    .select('id')
                    .eq('creator_id', creatorId)
                    .eq('social_network_id', networkId)
                    .single();
                
                if (!existingNetwork) {
                    const { error: networkError } = await supabase
                        .from('creator_social_networks')
                        .insert({
                            creator_id: creatorId,
                            social_network_id: networkId,
                            username: creatorData.username,
                            profile_url: creatorData.profile_url,
                            followers_count: creatorData.followers || 0,
                            is_primary: false
                        });
                    
                    if (!networkError) {
                        networksAdded++;
                    }
                }
            }
            
        } catch (error) {
            console.error(`   ❌ Erreur pour ${creatorData.name}: ${error.message}`);
            skipped++;
        }
    }
    
    console.log(`\n✅ Résumé:`);
    console.log(`   - ${added} nouveau(x) créateur(s) ajouté(s)`);
    console.log(`   - ${networksAdded} réseau(x) social(aux) ajouté(s)`);
    if (skipped > 0) {
        console.log(`   ⚠️  ${skipped} créateur(s) ignoré(s)`);
    }
    
    return { added, networksAdded, skipped };
}

async function main() {
    console.log('🚀 Récupération de créateurs depuis les APIs publiques\n');
    console.log('='.repeat(60));
    
    const allCreators = [];
    
    // Récupérer depuis GitHub
    const githubCreators = await fetchGitHubCreators(30);
    allCreators.push(...githubCreators);
    
    // Récupérer depuis Reddit
    const redditCreators = await fetchRedditCreators(20);
    allCreators.push(...redditCreators);
    
    console.log(`\n📊 Total de créateurs récupérés: ${allCreators.length}`);
    
    // Ajouter à la base de données
    if (allCreators.length > 0) {
        await addCreatorsToDatabase(allCreators);
    }
    
    // Vérification finale
    const { data: finalCreators, count } = await supabase
        .from('creators')
        .select('id', { count: 'exact' });
    
    console.log(`\n📊 Total de créateurs dans la base: ${count}\n`);
}

main().catch(console.error);

