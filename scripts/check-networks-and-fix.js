#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('🔍 Vérification des réseaux sociaux et association aux créateurs\n');
    
    // Récupérer tous les réseaux sociaux
    const { data: networks } = await supabase
        .from('social_networks')
        .select('id, name, display_name')
        .order('name');
    
    console.log('📱 Réseaux sociaux disponibles:');
    networks?.forEach(network => {
        console.log(`   - ${network.display_name} (${network.name}) - ID: ${network.id}`);
    });
    console.log('');
    
    // Récupérer les créateurs récemment ajoutés (sans réseaux sociaux)
    const { data: creatorsWithoutNetworks } = await supabase
        .from('creators')
        .select(`
            id,
            name,
            creator_social_networks (id)
        `)
        .order('created_at', { ascending: false })
        .limit(60);
    
    console.log(`📊 Vérification des ${creatorsWithoutNetworks?.length || 0} créateurs récents...\n`);
    
    // Identifier les créateurs GitHub et Reddit
    const githubNetwork = networks?.find(n => n.name.toLowerCase().includes('github'));
    const redditNetwork = networks?.find(n => n.name.toLowerCase().includes('reddit'));
    
    if (!githubNetwork && !redditNetwork) {
        console.log('⚠️  Réseaux GitHub et Reddit non trouvés dans la base');
        console.log('💡 Vous devrez peut-être les ajouter manuellement\n');
        return;
    }
    
    let networksAdded = 0;
    
    // Parcourir les créateurs et ajouter les réseaux manquants
    for (const creator of creatorsWithoutNetworks || []) {
        const hasNetworks = creator.creator_social_networks && creator.creator_social_networks.length > 0;
        
        if (!hasNetworks) {
            // Essayer de déterminer le réseau basé sur le nom ou l'URL
            const nameLower = creator.name.toLowerCase();
            let networkId = null;
            let username = null;
            let profileUrl = null;
            
            // Vérifier si c'est un créateur GitHub (souvent des noms techniques)
            if (githubNetwork && (nameLower.includes('github') || nameLower.match(/^[a-z0-9-]+$/))) {
                // Récupérer les infos depuis GitHub
                try {
                    const response = await fetch(`https://api.github.com/users/${creator.name}`, {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'Creatik-App'
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        networkId = githubNetwork.id;
                        username = userData.login;
                        profileUrl = userData.html_url;
                    }
                } catch (error) {
                    // Ignorer les erreurs
                }
            }
            
            // Si pas GitHub, essayer Reddit
            if (!networkId && redditNetwork) {
                // Les créateurs Reddit commencent souvent par "u/" ou sont des noms simples
                if (nameLower.length < 20 && !nameLower.includes(' ')) {
                    networkId = redditNetwork.id;
                    username = creator.name;
                    profileUrl = `https://reddit.com/user/${creator.name}`;
                }
            }
            
            if (networkId && username) {
                const { error } = await supabase
                    .from('creator_social_networks')
                    .insert({
                        creator_id: creator.id,
                        social_network_id: networkId,
                        username: username,
                        profile_url: profileUrl,
                        is_primary: false,
                        followers_count: 0
                    });
                
                if (!error) {
                    networksAdded++;
                    console.log(`   ✅ ${creator.name} → ${networks?.find(n => n.id === networkId)?.display_name}`);
                }
            }
            
            // Respecter les limites de taux
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    
    console.log(`\n✅ ${networksAdded} réseau(x) social(aux) ajouté(s)\n`);
}

main().catch(console.error);

