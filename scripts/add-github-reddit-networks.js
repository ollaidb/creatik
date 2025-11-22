#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('➕ Ajout des réseaux GitHub et Reddit\n');
    
    // Vérifier si GitHub existe déjà
    const { data: existingGithub } = await supabase
        .from('social_networks')
        .select('id')
        .eq('name', 'github')
        .single();
    
    let githubId = existingGithub?.id;
    
    if (!githubId) {
        const { data: github, error } = await supabase
            .from('social_networks')
            .insert({
                name: 'github',
                display_name: 'GitHub',
                is_active: true
            })
            .select('id')
            .single();
        
        if (error) {
            console.error(`❌ Erreur ajout GitHub: ${error.message}`);
        } else {
            githubId = github.id;
            console.log('✅ Réseau GitHub ajouté');
        }
    } else {
        console.log('ℹ️  Réseau GitHub existe déjà');
    }
    
    // Vérifier si Reddit existe déjà
    const { data: existingReddit } = await supabase
        .from('social_networks')
        .select('id')
        .eq('name', 'reddit')
        .single();
    
    let redditId = existingReddit?.id;
    
    if (!redditId) {
        const { data: reddit, error } = await supabase
            .from('social_networks')
            .insert({
                name: 'reddit',
                display_name: 'Reddit',
                is_active: true
            })
            .select('id')
            .single();
        
        if (error) {
            console.error(`❌ Erreur ajout Reddit: ${error.message}`);
        } else {
            redditId = reddit.id;
            console.log('✅ Réseau Reddit ajouté');
        }
    } else {
        console.log('ℹ️  Réseau Reddit existe déjà');
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   - GitHub ID: ${githubId || 'Non disponible'}`);
    console.log(`   - Reddit ID: ${redditId || 'Non disponible'}\n`);
    
    // Maintenant, associer les créateurs récents à ces réseaux
    if (githubId || redditId) {
        console.log('🔗 Association des créateurs aux réseaux...\n');
        
        // Récupérer les créateurs récents sans réseaux
        const { data: recentCreators } = await supabase
            .from('creators')
            .select(`
                id,
                name,
                created_at,
                creator_social_networks (id)
            `)
            .order('created_at', { ascending: false })
            .limit(60);
        
        let networksAdded = 0;
        
        for (const creator of recentCreators || []) {
            const hasNetworks = creator.creator_social_networks && creator.creator_social_networks.length > 0;
            
            if (!hasNetworks) {
                const nameLower = creator.name.toLowerCase();
                
                // Détecter GitHub (noms techniques, pas d'espaces, souvent avec tirets)
                if (githubId && nameLower.match(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/i) && !nameLower.includes(' ')) {
                    const { error } = await supabase
                        .from('creator_social_networks')
                        .insert({
                            creator_id: creator.id,
                            social_network_id: githubId,
                            username: creator.name,
                            profile_url: `https://github.com/${creator.name}`,
                            is_primary: false,
                            followers_count: 0
                        });
                    
                    if (!error) {
                        networksAdded++;
                        console.log(`   ✅ ${creator.name} → GitHub`);
                    }
                }
                // Détecter Reddit (noms simples, souvent avec "u/" ou noms courts)
                else if (redditId && nameLower.length < 20 && nameLower.match(/^[a-z0-9_]+$/i)) {
                    const { error } = await supabase
                        .from('creator_social_networks')
                        .insert({
                            creator_id: creator.id,
                            social_network_id: redditId,
                            username: creator.name,
                            profile_url: `https://reddit.com/user/${creator.name}`,
                            is_primary: false,
                            followers_count: 0
                        });
                    
                    if (!error) {
                        networksAdded++;
                        console.log(`   ✅ ${creator.name} → Reddit`);
                    }
                }
            }
        }
        
        console.log(`\n✅ ${networksAdded} réseau(x) social(aux) associé(s)\n`);
    }
}

main().catch(console.error);

