#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🗑️  Suppression des créateurs en double\n');
        
        // Récupérer tous les créateurs avec leur date de création
        const { data: creators } = await supabase
            .from('creators')
            .select('id, name, created_at')
            .order('created_at', { ascending: true });
        
        if (!creators || creators.length === 0) {
            console.log('ℹ️  Aucun créateur trouvé\n');
            return;
        }
        
        console.log(`📊 Total de créateurs: ${creators.length}\n`);
        
        // Trouver les doublons (même nom, insensible à la casse)
        const nameMap = new Map();
        const duplicatesToDelete = [];
        
        creators.forEach(creator => {
            const nameLower = creator.name.toLowerCase().trim();
            if (nameMap.has(nameLower)) {
                // Le créateur existant est plus ancien (créé en premier)
                const existing = nameMap.get(nameLower);
                duplicatesToDelete.push({
                    keep: existing,
                    delete: creator
                });
            } else {
                nameMap.set(nameLower, creator);
            }
        });
        
        console.log(`🔴 Créateurs en double à supprimer: ${duplicatesToDelete.length}\n`);
        
        if (duplicatesToDelete.length === 0) {
            console.log('✅ Aucun doublon à supprimer\n');
            return;
        }
        
        let networksTransferred = 0;
        let creatorsDeleted = 0;
        let errors = 0;
        
        // Traiter chaque doublon
        for (const dup of duplicatesToDelete) {
            try {
                console.log(`🔄 Traitement: "${dup.delete.name}" (ID: ${dup.delete.id})`);
                console.log(`   → Conservation: "${dup.keep.name}" (ID: ${dup.keep.id})\n`);
                
                // Récupérer tous les réseaux sociaux du créateur à supprimer
                const { data: networksToTransfer } = await supabase
                    .from('creator_social_networks')
                    .select('*')
                    .eq('creator_id', dup.delete.id);
                
                if (networksToTransfer && networksToTransfer.length > 0) {
                    console.log(`   📱 ${networksToTransfer.length} réseau(x) social(aux) à transférer`);
                    
                    // Transférer chaque réseau social vers le créateur conservé
                    for (const network of networksToTransfer) {
                        // Vérifier si le réseau existe déjà pour le créateur conservé
                        const { data: existingNetwork } = await supabase
                            .from('creator_social_networks')
                            .select('id')
                            .eq('creator_id', dup.keep.id)
                            .eq('social_network_id', network.social_network_id)
                            .single();
                        
                        if (!existingNetwork) {
                            // Transférer le réseau
                            const { error: transferError } = await supabase
                                .from('creator_social_networks')
                                .insert({
                                    creator_id: dup.keep.id,
                                    social_network_id: network.social_network_id,
                                    username: network.username,
                                    profile_url: network.profile_url,
                                    followers_count: network.followers_count,
                                    is_primary: network.is_primary
                                });
                            
                            if (transferError) {
                                console.error(`   ❌ Erreur transfert réseau: ${transferError.message}`);
                            } else {
                                networksTransferred++;
                            }
                        } else {
                            console.log(`   ⚠️  Réseau déjà présent pour le créateur conservé`);
                        }
                        
                        // Supprimer le réseau du créateur à supprimer
                        await supabase
                            .from('creator_social_networks')
                            .delete()
                            .eq('id', network.id);
                    }
                }
                
                // Supprimer le créateur en double
                // Note: Les réseaux sociaux seront supprimés automatiquement via CASCADE
                const { error: deleteError } = await supabase
                    .from('creators')
                    .delete()
                    .eq('id', dup.delete.id);
                
                if (deleteError) {
                    console.error(`   ❌ Erreur suppression: ${deleteError.message}`);
                    errors++;
                } else {
                    creatorsDeleted++;
                    console.log(`   ✅ Créateur supprimé avec succès\n`);
                }
                
            } catch (error) {
                console.error(`   ❌ Erreur pour "${dup.delete.name}": ${error.message}\n`);
                errors++;
            }
        }
        
        console.log(`\n✅ Résumé:`);
        console.log(`   - ${creatorsDeleted} créateur(s) supprimé(s)`);
        console.log(`   - ${networksTransferred} réseau(x) social(aux) transféré(s)`);
        if (errors > 0) {
            console.log(`   ⚠️  ${errors} erreur(s)`);
        }
        
        // Vérification finale
        const { data: finalCreators, count } = await supabase
            .from('creators')
            .select('id', { count: 'exact' });
        
        console.log(`\n📊 Total de créateurs après nettoyage: ${count}\n`);
        
        // Vérifier s'il reste des doublons
        const { data: remainingCreators } = await supabase
            .from('creators')
            .select('id, name');
        
        const remainingNameMap = new Map();
        let remainingDuplicates = 0;
        
        remainingCreators?.forEach(creator => {
            const nameLower = creator.name.toLowerCase().trim();
            if (remainingNameMap.has(nameLower)) {
                remainingDuplicates++;
            } else {
                remainingNameMap.set(nameLower, creator);
            }
        });
        
        if (remainingDuplicates > 0) {
            console.log(`⚠️  Il reste ${remainingDuplicates} doublon(s)\n`);
        } else {
            console.log(`✅ Aucun doublon restant\n`);
        }
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

