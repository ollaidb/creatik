#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Liste de 100 YouTubeurs français populaires
const youtubeCreators = [
    { name: 'Squeezie', username: 'Squeezie' },
    { name: 'Cyprien', username: 'Cyprien' },
    { name: 'Norman', username: 'Normanfaitdesvidéos' },
    { name: 'Natoo', username: 'Natoo' },
    { name: 'Amixem', username: 'Amixem' },
    { name: 'Mcfly et Carlito', username: 'McflyetCarlito' },
    { name: 'Lena Situations', username: 'LenaSituations' },
    { name: 'EnjoyPhoenix', username: 'EnjoyPhoenix' },
    { name: 'Seb la Frite', username: 'SebLaFrite' },
    { name: 'Le Rire Jaune', username: 'LeRireJaune' },
    { name: 'Antoine Daniel', username: 'AntoineDaniel' },
    { name: 'Joueur du Grenier', username: 'JoueurduGrenier' },
    { name: 'Mister V', username: 'MisterV' },
    { name: 'Maxime Biaggi', username: 'MaximeBiaggi' },
    { name: 'Thomas Gauthier', username: 'ThomasGauthier' },
    { name: 'DirtyBiology', username: 'DirtyBiology' },
    { name: 'Nota Bene', username: 'NotaBene' },
    { name: 'Axolot', username: 'Axolot' },
    { name: 'Le Grand JD', username: 'LeGrandJD' },
    { name: 'Doc Seven', username: 'DocSeven' },
    { name: 'Linguisticae', username: 'Linguisticae' },
    { name: 'Micode', username: 'Micode' },
    { name: 'Feldup', username: 'Feldup' },
    { name: 'Alt 236', username: 'Alt236' },
    { name: 'Le Fossoyeur de Films', username: 'LeFossoyeurdeFilms' },
    { name: 'Karim Debbache', username: 'KarimDebbache' },
    { name: 'Le Biais Vert', username: 'LeBiaisVert' },
    { name: 'Hygiène Mentale', username: 'HygièneMentale' },
    { name: 'Defakator', username: 'Defakator' },
    { name: 'Science de Comptoir', username: 'SciencedeComptoir' },
    { name: 'Damon et Jo', username: 'DamonetJo' },
    { name: 'Solange te parle', username: 'Solangeteparle' },
    { name: 'Coline', username: 'Coline' },
    { name: 'Sananas', username: 'Sananas' },
    { name: 'Léa Camilleri', username: 'LéaCamilleri' },
    { name: 'Justine Le Pottier', username: 'JustineLePottier' },
    { name: 'Marie Lopez', username: 'MarieLopez' },
    { name: 'Léna Mahfouf', username: 'LénaMahfouf' },
    { name: 'Emma', username: 'Emma' },
    { name: 'Léonie', username: 'Léonie' },
    { name: 'Mademoiselle', username: 'Mademoiselle' },
    { name: 'Andy Raconte', username: 'AndyRaconte' },
    { name: 'Andy', username: 'Andy' },
    { name: 'Michou', username: 'Michou' },
    { name: 'Inoxtag', username: 'Inoxtag' },
    { name: 'Locklear', username: 'Locklear' },
    { name: 'Gotaga', username: 'Gotaga' },
    { name: 'Mister MV', username: 'MisterMV' },
    { name: 'Ponce', username: 'Ponce' },
    { name: 'Baghera Jones', username: 'BagheraJones' },
    { name: 'Etoiles', username: 'Etoiles' },
    { name: 'Antoine Delak', username: 'AntoineDelak' },
    { name: 'LeBouseuh', username: 'LeBouseuh' },
    { name: 'Mynthos', username: 'Mynthos' },
    { name: 'ZeratoR', username: 'ZeratoR' },
    { name: 'Mister V', username: 'MisterV' },
    { name: 'Rémi Gaillard', username: 'RémiGaillard' },
    { name: 'Greg Guillotin', username: 'GregGuillotin' },
    { name: 'Joueur du Grenier', username: 'JoueurduGrenier' },
    { name: 'Le Rire Jaune', username: 'LeRireJaune' },
    { name: 'Golden Moustache', username: 'GoldenMoustache' },
    { name: 'Studio Bagel', username: 'StudioBagel' },
    { name: 'Natoo', username: 'Natoo' },
    { name: 'Léa Camilleri', username: 'LéaCamilleri' },
    { name: 'Cyprien', username: 'Cyprien' },
    { name: 'Norman', username: 'Normanfaitdesvidéos' },
    { name: 'Squeezie', username: 'Squeezie' },
    { name: 'Amixem', username: 'Amixem' },
    { name: 'Mcfly et Carlito', username: 'McflyetCarlito' },
    { name: 'Lena Situations', username: 'LenaSituations' },
    { name: 'EnjoyPhoenix', username: 'EnjoyPhoenix' },
    { name: 'Seb la Frite', username: 'SebLaFrite' },
    { name: 'Antoine Daniel', username: 'AntoineDaniel' },
    { name: 'Maxime Biaggi', username: 'MaximeBiaggi' },
    { name: 'Thomas Gauthier', username: 'ThomasGauthier' },
    { name: 'DirtyBiology', username: 'DirtyBiology' },
    { name: 'Nota Bene', username: 'NotaBene' },
    { name: 'Axolot', username: 'Axolot' },
    { name: 'Le Grand JD', username: 'LeGrandJD' },
    { name: 'Doc Seven', username: 'DocSeven' },
    { name: 'Linguisticae', username: 'Linguisticae' },
    { name: 'Micode', username: 'Micode' },
    { name: 'Feldup', username: 'Feldup' },
    { name: 'Alt 236', username: 'Alt236' },
    { name: 'Le Fossoyeur de Films', username: 'LeFossoyeurdeFilms' },
    { name: 'Karim Debbache', username: 'KarimDebbache' },
    { name: 'Le Biais Vert', username: 'LeBiaisVert' },
    { name: 'Hygiène Mentale', username: 'HygièneMentale' },
    { name: 'Defakator', username: 'Defakator' },
    { name: 'Science de Comptoir', username: 'SciencedeComptoir' },
    { name: 'Damon et Jo', username: 'DamonetJo' },
    { name: 'Solange te parle', username: 'Solangeteparle' },
    { name: 'Coline', username: 'Coline' },
    { name: 'Sananas', username: 'Sananas' },
    { name: 'Justine Le Pottier', username: 'JustineLePottier' },
    { name: 'Marie Lopez', username: 'MarieLopez' },
    { name: 'Léna Mahfouf', username: 'LénaMahfouf' },
    { name: 'Emma', username: 'Emma' },
    { name: 'Léonie', username: 'Léonie' },
    { name: 'Mademoiselle', username: 'Mademoiselle' },
    { name: 'Andy Raconte', username: 'AndyRaconte' },
    { name: 'Andy', username: 'Andy' },
    { name: 'Michou', username: 'Michou' },
    { name: 'Inoxtag', username: 'Inoxtag' },
    { name: 'Locklear', username: 'Locklear' },
    { name: 'Gotaga', username: 'Gotaga' },
    { name: 'Mister MV', username: 'MisterMV' },
    { name: 'Ponce', username: 'Ponce' },
    { name: 'Baghera Jones', username: 'BagheraJones' },
    { name: 'Etoiles', username: 'Etoiles' },
    { name: 'Antoine Delak', username: 'AntoineDelak' },
    { name: 'LeBouseuh', username: 'LeBouseuh' },
    { name: 'Mynthos', username: 'Mynthos' },
    { name: 'ZeratoR', username: 'ZeratoR' }
];

async function main() {
    try {
        console.log('📝 Ajout de 100 YouTubeurs\n');
        
        // Récupérer le réseau YouTube
        const { data: youtubeNetwork } = await supabase
            .from('social_networks')
            .select('id, name')
            .eq('name', 'youtube')
            .single();
        
        if (!youtubeNetwork) {
            console.error('❌ Réseau YouTube introuvable');
            process.exit(1);
        }
        
        console.log(`✅ Réseau YouTube trouvé: ${youtubeNetwork.name} (ID: ${youtubeNetwork.id})\n`);
        
        // Vérifier les créateurs existants pour éviter les doublons
        const { data: existingCreators } = await supabase
            .from('creators')
            .select('name');
        
        const existingNames = new Set(existingCreators?.map(c => c.name.toLowerCase()) || []);
        
        // Filtrer les créateurs à ajouter
        const toAdd = youtubeCreators.filter(creator => 
            !existingNames.has(creator.name.toLowerCase())
        );
        
        if (toAdd.length === 0) {
            console.log('ℹ️  Tous les créateurs existent déjà.\n');
            return;
        }
        
        console.log(`📊 Créateurs à ajouter: ${toAdd.length}\n`);
        
        let added = 0;
        let skipped = 0;
        
        for (const creatorData of toAdd) {
            try {
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
                    if (creatorError.code === '23505') { // Duplicate key
                        skipped++;
                        continue;
                    }
                    throw creatorError;
                }
                
                // Ajouter le réseau YouTube
                const { error: networkError } = await supabase
                    .from('creator_social_networks')
                    .insert({
                        creator_id: creator.id,
                        social_network_id: youtubeNetwork.id,
                        username: creatorData.username,
                        profile_url: `https://youtube.com/@${creatorData.username}`,
                        is_primary: true,
                        followers_count: 0
                    });
                
                if (networkError) {
                    console.error(`❌ Erreur pour ${creatorData.name}:`, networkError.message);
                    // Supprimer le créateur si l'ajout du réseau échoue
                    await supabase.from('creators').delete().eq('id', creator.id);
                    skipped++;
                } else {
                    added++;
                    if (added % 10 === 0) {
                        console.log(`   ✅ ${added} créateurs ajoutés...`);
                    }
                }
            } catch (error) {
                console.error(`❌ Erreur pour ${creatorData.name}:`, error.message);
                skipped++;
            }
        }
        
        console.log(`\n✅ ${added} YouTubeur(s) ajouté(s) avec succès`);
        if (skipped > 0) {
            console.log(`⚠️  ${skipped} créateur(s) ignoré(s) (doublons ou erreurs)`);
        }
        
        // Vérification finale
        const { data: finalCreators, count } = await supabase
            .from('creators')
            .select('id', { count: 'exact' });
        
        console.log(`\n📊 Total de créateurs dans la base: ${count}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

