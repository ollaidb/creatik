#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Les 3 existantes (on ne les ajoutera pas)
    // 'Expériences', 'Histoires personnelles', 'Mémoires',
    
    // Nouvelles sous-catégories à ajouter
    { name: 'Voyages', description: 'Anecdotes de voyages' },
    { name: 'Rencontres', description: 'Anecdotes de rencontres' },
    { name: 'Famille', description: 'Anecdotes familiales' },
    { name: 'Amis', description: 'Anecdotes avec les amis' },
    { name: 'Travail', description: 'Anecdotes professionnelles' },
    { name: 'École / Études', description: 'Anecdotes scolaires et universitaires' },
    { name: 'Enfance', description: 'Anecdotes d\'enfance' },
    { name: 'Adolescence', description: 'Anecdotes d\'adolescence' },
    { name: 'Vie adulte', description: 'Anecdotes de la vie adulte' },
    { name: 'Premières fois', description: 'Anecdotes de premières fois' },
    { name: 'Malentendus', description: 'Anecdotes de malentendus' },
    { name: 'Coïncidences', description: 'Anecdotes de coïncidences' },
    { name: 'Moment drôle', description: 'Anecdotes drôles' },
    { name: 'Moment embarrassant', description: 'Anecdotes embarrassantes' },
    { name: 'Moment touchant', description: 'Anecdotes touchantes' },
    { name: 'Moment surprenant', description: 'Anecdotes surprenantes' },
    { name: 'Moment inoubliable', description: 'Anecdotes inoubliables' },
    { name: 'Traditions', description: 'Anecdotes sur les traditions' },
    { name: 'Fêtes', description: 'Anecdotes de fêtes' },
    { name: 'Célébrations', description: 'Anecdotes de célébrations' },
    { name: 'Événements marquants', description: 'Anecdotes d\'événements marquants' },
    { name: 'Leçons de vie', description: 'Anecdotes avec des leçons de vie' },
    { name: 'Erreurs', description: 'Anecdotes d\'erreurs' },
    { name: 'Réussites', description: 'Anecdotes de réussites' },
    { name: 'Échecs', description: 'Anecdotes d\'échecs' },
    { name: 'Changements', description: 'Anecdotes de changements' },
    { name: 'Découvertes', description: 'Anecdotes de découvertes' },
    { name: 'Aventures', description: 'Anecdotes d\'aventures' },
    { name: 'Mésaventures', description: 'Anecdotes de mésaventures' },
    { name: 'Rêves', description: 'Anecdotes de rêves' },
    { name: 'Souvenirs', description: 'Anecdotes de souvenirs' },
    { name: 'Confessions', description: 'Anecdotes-confessions' },
    { name: 'Secrets', description: 'Anecdotes de secrets' },
    { name: 'Révélations', description: 'Anecdotes de révélations' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Anecdote\n');
        
        // 1. Récupérer la catégorie Anecdote
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%anecdote%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Anecdote introuvable');
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
        
        for (const sub of toAdd) {
            const { error } = await supabase
                .from('subcategories')
                .insert({
                    name: sub.name,
                    description: sub.description,
                    category_id: category.id,
                    created_at: now,
                    updated_at: now
                });
            
            if (error) {
                if (error.message.includes('duplicate') || error.code === '23505') {
                    success++;
                } else {
                    console.log(`⚠️  "${sub.name}": ${error.message}`);
                    failed++;
                }
            } else {
                success++;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Anecdote`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

