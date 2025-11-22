#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Les 3 existantes (on ne les ajoutera pas)
    // 'Critiques films', 'Histoire cinéma', 'Making of films',
    
    // Nouvelles sous-catégories à ajouter
    { name: 'Genres cinématographiques', description: 'Différents genres de films' },
    { name: 'Réalisateurs', description: 'Réalisateurs de cinéma' },
    { name: 'Acteurs', description: 'Acteurs de cinéma' },
    { name: 'Actrices', description: 'Actrices de cinéma' },
    { name: 'Festivals', description: 'Festivals de cinéma' },
    { name: 'Prix & Récompenses', description: 'Prix et récompenses cinématographiques' },
    { name: 'Box-office', description: 'Box-office et succès commerciaux' },
    { name: 'Séries TV', description: 'Séries télévisées' },
    { name: 'Documentaires', description: 'Films documentaires' },
    { name: 'Animations', description: 'Films d\'animation' },
    { name: 'Court-métrages', description: 'Court-métrages' },
    { name: 'Longs-métrages', description: 'Longs-métrages' },
    { name: 'Films indépendants', description: 'Films indépendants' },
    { name: 'Blockbusters', description: 'Blockbusters et films à gros budget' },
    { name: 'Films d\'horreur', description: 'Films d\'horreur' },
    { name: 'Comédies', description: 'Films comiques' },
    { name: 'Drames', description: 'Films dramatiques' },
    { name: 'Action', description: 'Films d\'action' },
    { name: 'Science-fiction', description: 'Films de science-fiction' },
    { name: 'Fantasy', description: 'Films fantastiques' },
    { name: 'Thriller', description: 'Films thriller' },
    { name: 'Policier', description: 'Films policiers' },
    { name: 'Romance', description: 'Films romantiques' },
    { name: 'Western', description: 'Westerns' },
    { name: 'Guerre', description: 'Films de guerre' },
    { name: 'Historique', description: 'Films historiques' },
    { name: 'Biographique', description: 'Films biographiques' },
    { name: 'Musical', description: 'Comédies musicales' },
    { name: 'Scénarios', description: 'Scénarios de films' },
    { name: 'Musique de film', description: 'Musiques de films et bandes originales' },
    { name: 'Effets spéciaux', description: 'Effets spéciaux au cinéma' },
    { name: 'Costumes', description: 'Costumes de cinéma' },
    { name: 'Décors', description: 'Décors de cinéma' },
    { name: 'Cinématographie', description: 'Cinématographie et image' },
    { name: 'Montage', description: 'Montage cinématographique' },
    { name: 'Distribution', description: 'Distribution de films' },
    { name: 'Marketing cinéma', description: 'Marketing et promotion de films' },
    { name: 'Streaming', description: 'Films en streaming' },
    { name: 'Salles de cinéma', description: 'Salles de cinéma' },
    { name: 'Écoles de cinéma', description: 'Formation et écoles de cinéma' },
    { name: 'Technologie cinéma', description: 'Technologies du cinéma' },
    { name: 'Caméras', description: 'Caméras et équipements' },
    { name: 'Éclairage', description: 'Éclairage cinématographique' },
    { name: 'Son', description: 'Son et audio au cinéma' },
    { name: 'Doublage', description: 'Doublage de films' },
    { name: 'Sous-titres', description: 'Sous-titres de films' },
    { name: 'Remakes', description: 'Remakes de films' },
    { name: 'Adaptations', description: 'Adaptations cinématographiques' },
    { name: 'Franchises', description: 'Franchises cinématographiques' },
    { name: 'Univers cinématographiques', description: 'Univers cinématographiques' },
    { name: 'Cameos', description: 'Apparitions caméo' },
    { name: 'Blagues de fin de générique', description: 'Scènes post-générique' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Cinéma\n');
        
        // 1. Récupérer la catégorie Cinéma
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%cinéma%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Cinéma introuvable');
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
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Cinéma`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

