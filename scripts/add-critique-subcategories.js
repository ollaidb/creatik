#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    { name: 'Films', description: 'Critiques de films' },
    { name: 'Séries TV', description: 'Critiques de séries télévisées' },
    { name: 'Livres', description: 'Critiques de livres' },
    { name: 'Musique', description: 'Critiques musicales' },
    { name: 'Jeux vidéo', description: 'Critiques de jeux vidéo' },
    { name: 'Restaurants', description: 'Critiques de restaurants' },
    { name: 'Hôtels', description: 'Critiques d\'hôtels' },
    { name: 'Voyages', description: 'Critiques de voyages' },
    { name: 'Produits', description: 'Critiques de produits' },
    { name: 'Applications', description: 'Critiques d\'applications' },
    { name: 'Services', description: 'Critiques de services' },
    { name: 'Technologie', description: 'Critiques technologiques' },
    { name: 'Électronique', description: 'Critiques d\'électronique' },
    { name: 'Vêtements', description: 'Critiques de vêtements' },
    { name: 'Cosmétiques', description: 'Critiques de cosmétiques' },
    { name: 'Beauté', description: 'Critiques beauté' },
    { name: 'Voitures', description: 'Critiques automobiles' },
    { name: 'Spectacles', description: 'Critiques de spectacles' },
    { name: 'Théâtre', description: 'Critiques de théâtre' },
    { name: 'Expositions', description: 'Critiques d\'expositions' },
    { name: 'Musées', description: 'Critiques de musées' },
    { name: 'Événements', description: 'Critiques d\'événements' },
    { name: 'Formations', description: 'Critiques de formations' },
    { name: 'Cours', description: 'Critiques de cours' },
    { name: 'Écoles', description: 'Critiques d\'écoles' },
    { name: 'Universités', description: 'Critiques d\'universités' },
    { name: 'Logiciels', description: 'Critiques de logiciels' },
    { name: 'Sites web', description: 'Critiques de sites web' },
    { name: 'Plateformes', description: 'Critiques de plateformes' },
    { name: 'Streaming', description: 'Critiques de services de streaming' },
    { name: 'Podcasts', description: 'Critiques de podcasts' },
    { name: 'YouTube', description: 'Critiques de chaînes YouTube' },
    { name: 'Influenceurs', description: 'Critiques d\'influenceurs' },
    { name: 'Créateurs', description: 'Critiques de créateurs' },
    { name: 'Marques', description: 'Critiques de marques' },
    { name: 'Entreprises', description: 'Critiques d\'entreprises' },
    { name: 'Politique', description: 'Critiques politiques' },
    { name: 'Médias', description: 'Critiques de médias' },
    { name: 'Presse', description: 'Critiques de presse' },
    { name: 'Journalisme', description: 'Critiques de journalisme' },
    { name: 'Art', description: 'Critiques artistiques' },
    { name: 'Architecture', description: 'Critiques d\'architecture' },
    { name: 'Design', description: 'Critiques de design' },
    { name: 'Cuisine', description: 'Critiques de cuisine' },
    { name: 'Recettes', description: 'Critiques de recettes' },
    { name: 'Aliments', description: 'Critiques d\'aliments' },
    { name: 'Boissons', description: 'Critiques de boissons' },
    { name: 'Santé', description: 'Critiques santé' },
    { name: 'Médecine', description: 'Critiques de médecine' },
    { name: 'Éducation', description: 'Critiques d\'éducation' },
    { name: 'Sport', description: 'Critiques sport' },
    { name: 'Équipements', description: 'Critiques d\'équipements' },
    { name: 'Outils', description: 'Critiques d\'outils' },
    { name: 'Matériel', description: 'Critiques de matériel' },
    { name: 'Immobilier', description: 'Critiques d\'immobilier' },
    { name: 'Finance', description: 'Critiques finance' },
    { name: 'Assurance', description: 'Critiques d\'assurance' },
    { name: 'Banques', description: 'Critiques de banques' },
    { name: 'Transport', description: 'Critiques de transport' },
    { name: 'Airlines', description: 'Critiques de compagnies aériennes' },
    { name: 'Trains', description: 'Critiques de trains' },
    { name: 'Airbnb', description: 'Critiques Airbnb' },
    { name: 'Livres électroniques', description: 'Critiques d\'e-books' },
    { name: 'Audiobooks', description: 'Critiques de livres audio' },
    { name: 'Magazines', description: 'Critiques de magazines' },
    { name: 'Revues', description: 'Critiques de revues' },
    { name: 'Documentaires', description: 'Critiques de documentaires' },
    { name: 'Émissions', description: 'Critiques d\'émissions' },
    { name: 'Talk-shows', description: 'Critiques de talk-shows' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Critique\n');
        
        // 1. Récupérer la catégorie Critique
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%critique%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Critique introuvable');
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
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Critique`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

