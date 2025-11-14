#!/usr/bin/env node

/**
 * Script pour tester l'accessibilité de différentes APIs publiques
 * et récupérer des données de créateurs de contenu
 */

import fetch from 'node-fetch';

const APIs_TO_TEST = {
    // APIs publiques sans authentification
    github: {
        name: 'GitHub API',
        url: 'https://api.github.com/search/users?q=type:user&sort=followers&order=desc&per_page=10',
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Creatik-App'
        }
    },
    
    reddit: {
        name: 'Reddit API',
        url: 'https://www.reddit.com/r/youtube/top.json?limit=10',
        method: 'GET',
        headers: {
            'User-Agent': 'Creatik-App/1.0'
        }
    },
    
    // APIs qui nécessitent une clé (mais on peut tester la structure)
    youtube_search: {
        name: 'YouTube Data API (recherche publique)',
        url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=creators&type=channel&maxResults=10',
        method: 'GET',
        needsKey: true,
        note: 'Nécessite une clé API YouTube'
    },
    
    // APIs de données publiques
    jsonplaceholder: {
        name: 'JSONPlaceholder (test)',
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET'
    },
    
    // APIs de données ouvertes
    randomuser: {
        name: 'Random User API',
        url: 'https://randomuser.me/api/?results=10',
        method: 'GET'
    }
};

async function testAPI(apiConfig) {
    try {
        console.log(`\n🔍 Test de ${apiConfig.name}...`);
        
        if (apiConfig.needsKey) {
            console.log(`   ⚠️  Nécessite une clé API (non testé)`);
            return { success: false, reason: 'Nécessite une clé API' };
        }
        
        const response = await fetch(apiConfig.url, {
            method: apiConfig.method || 'GET',
            headers: apiConfig.headers || {}
        });
        
        if (!response.ok) {
            console.log(`   ❌ Erreur: ${response.status} ${response.statusText}`);
            return { success: false, status: response.status };
        }
        
        const data = await response.json();
        console.log(`   ✅ Succès! Données récupérées`);
        console.log(`   📊 Type de données: ${typeof data}`);
        
        if (Array.isArray(data)) {
            console.log(`   📈 Nombre d'éléments: ${data.length}`);
        } else if (data.items) {
            console.log(`   📈 Nombre d'éléments: ${data.items.length}`);
        } else if (data.data) {
            console.log(`   📈 Nombre d'éléments: ${Array.isArray(data.data) ? data.data.length : 'N/A'}`);
        }
        
        return { success: true, data };
        
    } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function fetchGitHubCreators() {
    try {
        console.log('\n📦 Récupération de créateurs GitHub...');
        
        // Rechercher les utilisateurs les plus suivis
        const response = await fetch('https://api.github.com/search/users?q=type:user&sort=followers&order=desc&per_page=20', {
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
        
        // Récupérer les détails de chaque utilisateur
        for (const user of data.items.slice(0, 10)) {
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
                    bio: userData.bio,
                    followers: userData.followers,
                    profile_url: userData.html_url,
                    network: 'GitHub'
                });
            }
            
            // Respecter les limites de taux
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`✅ ${creators.length} créateurs GitHub récupérés`);
        return creators;
        
    } catch (error) {
        console.error(`❌ Erreur GitHub: ${error.message}`);
        return [];
    }
}

async function fetchRedditCreators() {
    try {
        console.log('\n📦 Récupération de créateurs Reddit...');
        
        const subreddits = ['youtube', 'videos', 'contentcreation'];
        const creators = [];
        
        for (const subreddit of subreddits) {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5`, {
                headers: {
                    'User-Agent': 'Creatik-App/1.0'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.children) {
                    for (const post of data.data.children) {
                        const author = post.data.author;
                        if (author && !creators.find(c => c.username === author)) {
                            creators.push({
                                name: author,
                                username: author,
                                profile_url: `https://reddit.com/user/${author}`,
                                network: 'Reddit',
                                karma: post.data.author_flair_text || 'N/A'
                            });
                        }
                    }
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`✅ ${creators.length} créateurs Reddit récupérés`);
        return creators;
        
    } catch (error) {
        console.error(`❌ Erreur Reddit: ${error.message}`);
        return [];
    }
}

async function main() {
    console.log('🚀 Test d\'accessibilité des APIs publiques\n');
    console.log('=' .repeat(60));
    
    // Tester chaque API
    const results = {};
    for (const [key, config] of Object.entries(APIs_TO_TEST)) {
        results[key] = await testAPI(config);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Résumé des tests:\n');
    
    let accessibleCount = 0;
    for (const [key, result] of Object.entries(results)) {
        if (result.success) {
            console.log(`✅ ${APIs_TO_TEST[key].name}: Accessible`);
            accessibleCount++;
        } else {
            console.log(`❌ ${APIs_TO_TEST[key].name}: ${result.reason || 'Non accessible'}`);
        }
    }
    
    console.log(`\n📈 ${accessibleCount}/${Object.keys(APIs_TO_TEST).length} APIs accessibles\n`);
    
    // Récupérer des données réelles
    console.log('='.repeat(60));
    console.log('\n📥 Récupération de données de créateurs...\n');
    
    const githubCreators = await fetchGitHubCreators();
    const redditCreators = await fetchRedditCreators();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Résultats:\n');
    console.log(`   - GitHub: ${githubCreators.length} créateurs`);
    console.log(`   - Reddit: ${redditCreators.length} créateurs`);
    
    // Afficher quelques exemples
    if (githubCreators.length > 0) {
        console.log('\n📋 Exemples de créateurs GitHub:');
        githubCreators.slice(0, 3).forEach(creator => {
            console.log(`   - ${creator.name} (@${creator.username}) - ${creator.followers} followers`);
        });
    }
    
    if (redditCreators.length > 0) {
        console.log('\n📋 Exemples de créateurs Reddit:');
        redditCreators.slice(0, 3).forEach(creator => {
            console.log(`   - u/${creator.username}`);
        });
    }
    
    console.log('\n');
}

main().catch(console.error);

