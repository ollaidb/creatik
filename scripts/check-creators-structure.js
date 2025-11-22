#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🔍 Vérification de la structure des créateurs\n');
        
        // Vérifier les réseaux sociaux
        const { data: socialNetworks } = await supabase
            .from('social_networks')
            .select('id, name, display_name')
            .order('name');
        
        console.log(`📱 Réseaux sociaux disponibles (${socialNetworks?.length || 0}):`);
        socialNetworks?.forEach(network => {
            console.log(`   - ${network.display_name} (${network.name})`);
        });
        console.log('');
        
        // Vérifier les thèmes
        const { data: themes } = await supabase
            .from('themes')
            .select('id, name, description')
            .neq('name', 'Tout')
            .order('display_order');
        
        console.log(`🎨 Thèmes disponibles (${themes?.length || 0}):`);
        themes?.forEach(theme => {
            console.log(`   - ${theme.name}${theme.description ? `: ${theme.description}` : ''}`);
        });
        console.log('');
        
        // Vérifier les créateurs existants
        const { data: creators, count: creatorsCount } = await supabase
            .from('creators')
            .select('id, name', { count: 'exact' });
        
        console.log(`👥 Créateurs existants: ${creatorsCount || 0}\n`);
        
        // Vérifier les créateurs avec réseaux sociaux
        const { data: creatorNetworks } = await supabase
            .from('creator_social_networks')
            .select('creator_id, social_network_id')
            .limit(10);
        
        console.log(`🔗 Relations créateurs-réseaux: ${creatorNetworks?.length || 0} (premiers résultats)\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

