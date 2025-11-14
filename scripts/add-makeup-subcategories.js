#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    { name: 'Test de produits', description: 'Tests de produits de maquillage' },
    { name: 'Débutants', description: 'Maquillage pour débutants' },
    { name: 'Tutoriels', description: 'Tutoriels de maquillage' },
    { name: 'Transformation', description: 'Transformations maquillage' },
    { name: 'Reviews', description: 'Avis et critiques de produits maquillage' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Makeup\n');
        
        // 1. Récupérer la catégorie Makeup
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%makeup%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Makeup introuvable');
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
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Makeup`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

