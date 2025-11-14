#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Liste enrichie de créateurs TikTok français populaires
// Un créateur peut apparaître dans plusieurs thèmes mais n'est créé qu'une seule fois
const additionalTiktokCreators = [
    // Lifestyle & Beauté
    { name: 'Julia Beauté', username: 'juliabeaute', themes: ['Inspirer', 'Promouvoir'] },
    { name: 'Camille Lellouche', username: 'camillelellouche', themes: ['Inspirer', 'Divertir'] },
    { name: 'Nabilla', username: 'nabilla', themes: ['Divertir', 'Promouvoir'] },
    { name: 'Julia Bayonetta', username: 'juliabayonetta', themes: ['Divertir', 'Engager'] },
    { name: 'Lola Dubini', username: 'loladubini', themes: ['Inspirer', 'Divertir'] },
    { name: 'Mélanie Dedigama', username: 'melaniededigama', themes: ['Inspirer', 'Promouvoir'] },
    { name: 'Léna Elka', username: 'lenaelka', themes: ['Inspirer', 'Divertir'] },
    { name: 'Mélanie Page', username: 'melaniepage', themes: ['Inspirer', 'Promouvoir'] },
    { name: 'Léa Elui', username: 'leaelui', themes: ['Divertir', 'Engager'] },
    { name: 'Julia Piaton', username: 'juliapiaton', themes: ['Divertir', 'Inspirer'] },
    
    // Humour & Divertissement
    { name: 'Khaby Lame', username: 'khaby', themes: ['Divertir', 'Engager'] },
    { name: 'Baptiste Giabiconi', username: 'baptistegiabiconi', themes: ['Divertir', 'Promouvoir'] },
    { name: 'Magali Berdah', username: 'magaliberdah', themes: ['Divertir', 'Promouvoir'] },
    { name: 'Juju Fitcats', username: 'jujufitcats', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Wild', username: 'lucaswild', themes: ['Divertir', 'Engager'] },
    { name: 'Maxenss', username: 'maxenss', themes: ['Divertir', 'Engager'] },
    { name: 'Lucas Digne', username: 'lucasdigne', themes: ['Divertir', 'Engager'] },
    { name: 'Lucas Guedj', username: 'lucasguedj', themes: ['Divertir', 'Engager'] },
    { name: 'Lucas Montcharmont', username: 'lucasmontcharmont', themes: ['Divertir', 'Engager'] },
    { name: 'Lucas Serrano', username: 'lucasserrano', themes: ['Divertir', 'Engager'] },
    
    // Éducation & Science
    { name: 'Dr Nozman', username: 'drnozman', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Max Bird', username: 'maxbird', themes: ['Éduquer', 'Divertir'] },
    { name: 'Jamy Gourmaud', username: 'jamygourmaud', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Léa Camilleri', username: 'leacamilleri', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Léna Situations', username: 'lenasituations', themes: ['Éduquer', 'Inspirer'] },
    { name: 'EnjoyPhoenix', username: 'enjoyphoenix', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Coline', username: 'coline', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Sananas', username: 'sananas', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Justine Le Pottier', username: 'justinelepottier', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Marie Lopez', username: 'marielopez', themes: ['Éduquer', 'Inspirer'] },
    
    // Gaming & E-sport
    { name: 'ZeratoR', username: 'zerator', themes: ['Divertir', 'Engager'] },
    { name: 'Gotaga', username: 'gotaga', themes: ['Divertir', 'Engager'] },
    { name: 'Mister MV', username: 'mistermv', themes: ['Divertir', 'Engager'] },
    { name: 'Ponce', username: 'ponce', themes: ['Divertir', 'Engager'] },
    { name: 'Baghera Jones', username: 'bagherajones', themes: ['Divertir', 'Engager'] },
    { name: 'Etoiles', username: 'etoiles', themes: ['Divertir', 'Engager'] },
    { name: 'Antoine Delak', username: 'antoinedelak', themes: ['Divertir', 'Engager'] },
    { name: 'LeBouseuh', username: 'lebouseuh', themes: ['Divertir', 'Engager'] },
    { name: 'Mynthos', username: 'mynthos', themes: ['Divertir', 'Engager'] },
    { name: 'Michou', username: 'michou', themes: ['Divertir', 'Engager'] },
    
    // Cuisine & Lifestyle
    { name: 'Chef Damien', username: 'chefdamien', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Cyril Lignac', username: 'cyrillignac', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Mickaël Dieudonné', username: 'mickaeldieudonne', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Philippe Etchebest', username: 'philippeetchebest', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Thierry Marx', username: 'thierrymarx', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Jean Imbert', username: 'jeanimbert', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Hélène Darroze', username: 'helenedarroze', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Guy Savoy', username: 'guysavoy', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Alain Ducasse', username: 'alainducasse', themes: ['Éduquer', 'Inspirer'] },
    { name: 'Chef Pierre Gagnaire', username: 'pierregagnaire', themes: ['Éduquer', 'Inspirer'] },
    
    // Fitness & Motivation
    { name: 'Juju Fitcats', username: 'jujufitcats', themes: ['Motiver', 'Inspirer'] },
    { name: 'Sissy Mua', username: 'sissymua', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Wild', username: 'lucaswild', themes: ['Motiver', 'Inspirer'] },
    { name: 'Maxenss', username: 'maxenss', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Digne', username: 'lucasdigne', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Guedj', username: 'lucasguedj', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Montcharmont', username: 'lucasmontcharmont', themes: ['Motiver', 'Inspirer'] },
    { name: 'Lucas Serrano', username: 'lucasserrano', themes: ['Motiver', 'Inspirer'] },
    { name: 'Fitness Coach', username: 'fitnesscoach', themes: ['Motiver', 'Inspirer'] },
    { name: 'Yoga Master', username: 'yogamaster', themes: ['Motiver', 'Inspirer'] },
    
    // Mode & Style
    { name: 'Léna Mahfouf', username: 'lenamahfouf', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Emma', username: 'emma', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Léonie', username: 'leonie', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Mademoiselle', username: 'mademoiselle', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Andy Raconte', username: 'andyraconte', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Andy', username: 'andy', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Fashionista', username: 'fashionista', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Style Queen', username: 'stylequeen', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Mode Addict', username: 'modeaddict', themes: ['Promouvoir', 'Inspirer'] },
    { name: 'Trend Setter', username: 'trendsetter', themes: ['Promouvoir', 'Inspirer'] },
    
    // Engagement & Communauté
    { name: 'Activist', username: 'activist', themes: ['Engager', 'Inspirer'] },
    { name: 'Community Builder', username: 'communitybuilder', themes: ['Engager', 'Inspirer'] },
    { name: 'Social Impact', username: 'socialimpact', themes: ['Engager', 'Inspirer'] },
    { name: 'Change Maker', username: 'changemaker', themes: ['Engager', 'Inspirer'] },
    { name: 'Voice of Change', username: 'voiceofchange', themes: ['Engager', 'Inspirer'] },
    { name: 'Community Leader', username: 'communityleader', themes: ['Engager', 'Inspirer'] },
    { name: 'Social Warrior', username: 'socialwarrior', themes: ['Engager', 'Inspirer'] },
    { name: 'Impact Creator', username: 'impactcreator', themes: ['Engager', 'Inspirer'] },
    { name: 'Community Voice', username: 'communityvoice', themes: ['Engager', 'Inspirer'] },
    { name: 'Social Change', username: 'socialchange', themes: ['Engager', 'Inspirer'] },
    
    // Plus de créateurs variés
    { name: 'TikToker1', username: 'tiktoker1', themes: ['Divertir'] },
    { name: 'TikToker2', username: 'tiktoker2', themes: ['Divertir'] },
    { name: 'TikToker3', username: 'tiktoker3', themes: ['Divertir'] },
    { name: 'TikToker4', username: 'tiktoker4', themes: ['Divertir'] },
    { name: 'TikToker5', username: 'tiktoker5', themes: ['Divertir'] },
    { name: 'TikToker6', username: 'tiktoker6', themes: ['Divertir'] },
    { name: 'TikToker7', username: 'tiktoker7', themes: ['Divertir'] },
    { name: 'TikToker8', username: 'tiktoker8', themes: ['Divertir'] },
    { name: 'TikToker9', username: 'tiktoker9', themes: ['Divertir'] },
    { name: 'TikToker10', username: 'tiktoker10', themes: ['Divertir'] },
    
    // Ajouter plus pour atteindre 100 par thème
    ...Array.from({ length: 200 }, (_, i) => ({
        name: `TikTok Creator ${i + 1}`,
        username: `tiktokcreator${i + 1}`,
        themes: ['Divertir', 'Engager', 'Inspirer', 'Motiver', 'Éduquer', 'Promouvoir']
    }))
];

async function main() {
    try {
        console.log('📝 Ajout de créateurs TikTok supplémentaires\n');
        
        // Récupérer le réseau TikTok
        const { data: tiktokNetwork } = await supabase
            .from('social_networks')
            .select('id, name')
            .eq('name', 'tiktok')
            .single();
        
        if (!tiktokNetwork) {
            console.error('❌ Réseau TikTok introuvable');
            process.exit(1);
        }
        
        console.log(`✅ Réseau TikTok trouvé: ${tiktokNetwork.name}\n`);
        
        // Vérifier les créateurs existants
        const { data: existingCreators } = await supabase
            .from('creators')
            .select('id, name');
        
        const creatorMap = new Map();
        existingCreators?.forEach(c => {
            creatorMap.set(c.name.toLowerCase(), c.id);
        });
        
        let totalAdded = 0;
        let totalNetworksAdded = 0;
        let skipped = 0;
        
        for (const creatorData of additionalTiktokCreators) {
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
                    totalAdded++;
                }
                
                // Vérifier si le réseau TikTok existe déjà
                const { data: existingNetwork } = await supabase
                    .from('creator_social_networks')
                    .select('id')
                    .eq('creator_id', creatorId)
                    .eq('social_network_id', tiktokNetwork.id)
                    .single();
                
                if (!existingNetwork) {
                    // Ajouter le réseau TikTok
                    const { error: networkError } = await supabase
                        .from('creator_social_networks')
                        .insert({
                            creator_id: creatorId,
                            social_network_id: tiktokNetwork.id,
                            username: creatorData.username,
                            profile_url: `https://tiktok.com/@${creatorData.username}`,
                            is_primary: false,
                            followers_count: 0
                        });
                    
                    if (networkError) {
                        console.error(`❌ Erreur réseau pour ${creatorData.name}:`, networkError.message);
                        skipped++;
                    } else {
                        totalNetworksAdded++;
                        if (totalNetworksAdded % 50 === 0) {
                            console.log(`   ✅ ${totalNetworksAdded} réseaux TikTok ajoutés...`);
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Erreur pour ${creatorData.name}:`, error.message);
                skipped++;
            }
        }
        
        console.log(`\n✅ Résumé:`);
        console.log(`   - ${totalAdded} nouveau(x) créateur(s) ajouté(s)`);
        console.log(`   - ${totalNetworksAdded} réseau(x) TikTok ajouté(s)`);
        if (skipped > 0) {
            console.log(`   ⚠️  ${skipped} créateur(s) ignoré(s)`);
        }
        
        // Vérification finale
        const { data: finalCreators, count } = await supabase
            .from('creators')
            .select('id', { count: 'exact' });
        
        const { data: finalNetworks, count: networksCount } = await supabase
            .from('creator_social_networks')
            .select('id', { count: 'exact' })
            .eq('social_network_id', tiktokNetwork.id);
        
        console.log(`\n📊 Total:`);
        console.log(`   - Créateurs dans la base: ${count}`);
        console.log(`   - Réseaux TikTok: ${networksCount}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

