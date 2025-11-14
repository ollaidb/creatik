#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Les 3 existantes (on ne les ajoutera pas)
    // 'Eating sounds', 'Relaxation', 'Tapping',
    
    // Nouvelles sous-catégories à ajouter
    { name: 'Whispering', description: 'Chuchotements ASMR' },
    { name: 'Soft speaking', description: 'Parole douce ASMR' },
    { name: 'Brushing', description: 'Brossage ASMR' },
    { name: 'Scratching', description: 'Grattage ASMR' },
    { name: 'Crinkling', description: 'Froissement ASMR' },
    { name: 'Water sounds', description: 'Sons d\'eau ASMR' },
    { name: 'Rain sounds', description: 'Sons de pluie ASMR' },
    { name: 'Nature sounds', description: 'Sons de la nature ASMR' },
    { name: 'Fire sounds', description: 'Sons de feu ASMR' },
    { name: 'Wind sounds', description: 'Sons de vent ASMR' },
    { name: 'Ocean sounds', description: 'Sons d\'océan ASMR' },
    { name: 'Forest sounds', description: 'Sons de forêt ASMR' },
    { name: 'Animal sounds', description: 'Sons d\'animaux ASMR' },
    { name: 'Paper sounds', description: 'Sons de papier ASMR' },
    { name: 'Plastic sounds', description: 'Sons de plastique ASMR' },
    { name: 'Metal sounds', description: 'Sons de métal ASMR' },
    { name: 'Glass sounds', description: 'Sons de verre ASMR' },
    { name: 'Wood sounds', description: 'Sons de bois ASMR' },
    { name: 'Fabric sounds', description: 'Sons de tissu ASMR' },
    { name: 'Hair brushing', description: 'Brossage de cheveux ASMR' },
    { name: 'Hair cutting', description: 'Coupe de cheveux ASMR' },
    { name: 'Makeup', description: 'Maquillage ASMR' },
    { name: 'Skincare', description: 'Soins de la peau ASMR' },
    { name: 'Nail tapping', description: 'Tapotement d\'ongles ASMR' },
    { name: 'Hand movements', description: 'Mouvements de mains ASMR' },
    { name: 'Roleplay', description: 'Jeu de rôle ASMR' },
    { name: 'Personal attention', description: 'Attention personnelle ASMR' },
    { name: 'Medical roleplay', description: 'Jeu de rôle médical ASMR' },
    { name: 'Hair salon', description: 'Salon de coiffure ASMR' },
    { name: 'Spa', description: 'Spa ASMR' },
    { name: 'Massage', description: 'Massage ASMR' },
    { name: 'Cooking', description: 'Cuisine ASMR' },
    { name: 'Pouring', description: 'Versement ASMR' },
    { name: 'Stirring', description: 'Remuement ASMR' },
    { name: 'Cutting', description: 'Découpage ASMR' },
    { name: 'Pouring liquids', description: 'Versement de liquides ASMR' },
    { name: 'Unboxing', description: 'Déballage ASMR' },
    { name: 'Packing', description: 'Emballage ASMR' },
    { name: 'Folding', description: 'Pliage ASMR' },
    { name: 'Typing', description: 'Frappe au clavier ASMR' },
    { name: 'Writing', description: 'Écriture ASMR' },
    { name: 'Page turning', description: 'Tourner les pages ASMR' },
    { name: 'Book sounds', description: 'Sons de livres ASMR' },
    { name: 'Keyboard sounds', description: 'Sons de clavier ASMR' },
    { name: 'Mouse clicks', description: 'Clics de souris ASMR' },
    { name: 'Button sounds', description: 'Sons de boutons ASMR' },
    { name: 'Zipper sounds', description: 'Sons de fermeture éclair ASMR' },
    { name: 'Velcro sounds', description: 'Sons de velcro ASMR' },
    { name: 'Bubble wrap', description: 'Papier bulle ASMR' },
    { name: 'Slime', description: 'Slime ASMR' },
    { name: 'Foam', description: 'Mousse ASMR' },
    { name: 'Spray sounds', description: 'Sons de spray ASMR' },
    { name: 'Spraying', description: 'Pulvérisation ASMR' },
    { name: 'Cleaning', description: 'Nettoyage ASMR' },
    { name: 'Washing', description: 'Lavage ASMR' },
    { name: 'Drying', description: 'Séchage ASMR' },
    { name: 'Brushing teeth', description: 'Brossage de dents ASMR' },
    { name: 'Shaving', description: 'Rasage ASMR' },
    { name: 'Hair dryer', description: 'Sèche-cheveux ASMR' },
    { name: 'Electric razor', description: 'Rasoir électrique ASMR' },
    { name: 'Scissors', description: 'Ciseaux ASMR' },
    { name: 'Comb', description: 'Peigne ASMR' },
    { name: 'Brush', description: 'Brosse ASMR' },
    { name: 'Sponge', description: 'Éponge ASMR' },
    { name: 'Cloth', description: 'Tissu ASMR' },
    { name: 'Leather', description: 'Cuir ASMR' },
    { name: 'Fur', description: 'Fourrure ASMR' },
    { name: 'Feathers', description: 'Plumes ASMR' },
    { name: 'Beads', description: 'Perles ASMR' },
    { name: 'Keys', description: 'Clés ASMR' },
    { name: 'Coins', description: 'Pièces ASMR' },
    { name: 'Jewelry', description: 'Bijoux ASMR' },
    { name: 'Watch sounds', description: 'Sons de montre ASMR' },
    { name: 'Clock ticking', description: 'Tic-tac d\'horloge ASMR' },
    { name: 'Mechanical sounds', description: 'Sons mécaniques ASMR' },
    { name: 'Electronic sounds', description: 'Sons électroniques ASMR' },
    { name: 'Ambient sounds', description: 'Sons ambiants ASMR' },
    { name: 'White noise', description: 'Bruit blanc ASMR' },
    { name: 'Pink noise', description: 'Bruit rose ASMR' },
    { name: 'Brown noise', description: 'Bruit brun ASMR' },
    { name: 'Binaural beats', description: 'Battements binauraux ASMR' },
    { name: 'Triggers', description: 'Déclencheurs ASMR' },
    { name: 'Fast & aggressive', description: 'ASMR rapide et agressif' },
    { name: 'Slow & gentle', description: 'ASMR lent et doux' },
    { name: 'No talking', description: 'ASMR sans parole' },
    { name: 'With talking', description: 'ASMR avec parole' },
    { name: 'Visual triggers', description: 'Déclencheurs visuels ASMR' },
    { name: 'Audio triggers', description: 'Déclencheurs audio ASMR' },
    { name: '3D sounds', description: 'Sons 3D ASMR' },
    { name: 'Binaural', description: 'ASMR binaural' },
    { name: 'Stereo', description: 'ASMR stéréo' },
    { name: 'Mono', description: 'ASMR mono' },
    { name: 'Sleep', description: 'ASMR pour le sommeil' },
    { name: 'Study', description: 'ASMR pour l\'étude' },
    { name: 'Focus', description: 'ASMR pour la concentration' },
    { name: 'Meditation', description: 'ASMR méditation' },
    { name: 'Anxiety relief', description: 'ASMR soulagement de l\'anxiété' },
    { name: 'Stress relief', description: 'ASMR soulagement du stress' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories ASMR\n');
        
        // 1. Récupérer la catégorie ASMR
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%asmr%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie ASMR introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        // 2. Vérifier les sous-catégories existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', category.id);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion
        console.log('💾 Insertion des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        // Insérer par batch de 50
        const batchSize = 50;
        for (let i = 0; i < toAdd.length; i += batchSize) {
            const batch = toAdd.slice(i, i + batchSize);
            const batchData = batch.map(sub => ({
                name: sub.name,
                description: sub.description,
                category_id: category.id,
                created_at: now,
                updated_at: now
            }));
            
            const { error } = await supabase
                .from('subcategories')
                .insert(batchData);
            
            if (error) {
                // Si erreur batch, essayer une par une
                for (const sub of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert({
                            name: sub.name,
                            description: sub.description,
                            category_id: category.id,
                            created_at: now,
                            updated_at: now
                        });
                    
                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            success++;
                        } else {
                            console.log(`⚠️  "${sub.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        success++;
                    }
                }
            } else {
                success += batch.length;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) ASMR`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

